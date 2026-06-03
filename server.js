const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 调试日志中间件
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Body:', JSON.stringify(req.body));
    }
    next();
});

// 测试端点 - 用于验证服务器是否正常运行
app.get('/api/test', (req, res) => {
    res.json({ 
        success: true, 
        message: '服务器运行正常',
        timestamp: new Date().toISOString(),
        env: {
            difyApiUrl: process.env.DIFY_API_URL ? '已配置' : '未配置',
            difyApiKey: process.env.DIFY_API_KEY ? '已配置' : '未配置',
            port: PORT
        }
    });
});

// API代理端点
app.post('/api/analyze', async (req, res) => {
    try {
        console.log('=== /api/analyze 收到请求 ===');
        const { text, country } = req.body;
        console.log('text:', text);
        console.log('country:', country);
        console.log('DIFY_API_URL:', process.env.DIFY_API_URL);
        console.log('DIFY_API_KEY exists:', !!process.env.DIFY_API_KEY);
        
        if (!text || !country) {
            return res.status(400).json({ 
                success: false, 
                error: '缺少必要参数：text 或 country' 
            });
        }

        const countryNames = {
            'thailand': '泰国',
            'indonesia': '印度尼西亚',
            'vietnam': '越南',
            'malaysia': '马来西亚',
            'singapore': '新加坡'
        };
        
        const countryName = countryNames[country] || country;
        
        const systemPrompt = `你是跨境电商合规审查专家，专门审查出口到东南亚市场的农产品和纺织品文案。

请从以下维度审查文案：
1. 宗教禁忌（如佛教、伊斯兰教等）
2. 文化禁忌（颜色、动物、符号等）
3. 政治敏感内容
4. 颜色禁忌（不同国家对颜色有不同偏好）
5. 王室相关内容（泰国特别敏感）
6. 语言规范和准确性
7. 产品认证要求
8. 广告法规定

请用JSON格式返回审查结果：
{
  "success": true,
  "originalText": "原始文案",
  "optimizedText": "优化后的文案",
  "issues": [
    {
      "type": "问题类型",
      "matchedWord": "匹配到的词",
      "riskLevel": "high/medium/low",
      "description": "问题描述",
      "suggestion": "修改建议",
      "position": 在原文中开始位置
    }
  ]
}

请直接返回JSON，不要有其他内容。`;

        const response = await fetch(`${process.env.DIFY_API_URL}/chat-messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.DIFY_API_KEY}`
            },
            body: JSON.stringify({
                query: `请审查以下出口到${countryName}市场的文案：\n\n${text}\n\n只需返回JSON格式的审查结果。`,
                user: 'web-user',
                response_mode: 'blocking',
                conversation_id: '',
                inputs: {},
                files: []
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error('Dify API error response:', errText);
            throw new Error(`Dify API error: ${response.status} - ${errText}`);
        }

        const data = await response.json();
        console.log('=== Dify响应 ===');
        console.log('完整数据:', JSON.stringify(data).substring(0, 2000));
        console.log('answer字段长度:', data.answer ? data.answer.length : 0);
        console.log('answer内容预览:', data.answer ? data.answer.substring(0, 500) : '空');
        console.log('conversation_id:', data.conversation_id);
        console.log('message_id:', data.message_id);

        // 解析AI返回的内容
        let result;
        try {
            // 尝试从返回内容中提取JSON
            let content = data.answer || '';
            console.log('清理前内容长度:', content.length);
            
            // 清理markdown代码块
            content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            console.log('清理后内容长度:', content.length);
            console.log('清理后内容预览:', content.substring(0, 500));
            
            // 尝试解析JSON
            let parsed = JSON.parse(content);
            console.log('JSON解析成功，原始字段:', Object.keys(parsed));
            
            // 适配Dify实际返回的格式，转换为前端期望的格式
            result = convertDifyResponse(parsed, text);
            console.log('转换后字段:', Object.keys(result));
            console.log('issues数量:', result.issues ? result.issues.length : 0);
        } catch (parseError) {
            console.error('JSON解析失败:', parseError.message);
            // 如果解析失败，尝试其他方式
            const match = data.answer?.match(/\{[\s\S]*\}/);
            if (match) {
                try {
                    let parsed = JSON.parse(match[0]);
                    result = convertDifyResponse(parsed, text);
                    console.log('正则提取后JSON解析成功');
                } catch (e) {
                    console.error('正则提取后仍解析失败:', e.message);
                    result = {
                        success: true,
                        originalText: text,
                        optimizedText: data.answer || text,
                        issues: [],
                        warning: 'AI返回格式解析失败，已返回原始内容'
                    };
                }
            } else {
                console.log('未找到JSON格式，直接返回AI回答');
                result = {
                    success: true,
                    originalText: text,
                    optimizedText: data.answer || text,
                    issues: []
                };
            }
        }

        console.log('=== 最终返回结果 ===');
        console.log('success:', result.success);
        console.log('issues数量:', result.issues ? result.issues.length : 0);
        res.json(result);
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({
            success: false,
            error: '服务器内部错误',
            message: error.message
        });
    }
});

// 将Dify返回的JSON转换为前端期望的格式
function convertDifyResponse(parsed, originalText) {
    // 如果已经是前端期望的格式（有issues数组且是数组）
    if (parsed.issues && Array.isArray(parsed.issues)) {
        return {
            success: true,
            originalText: parsed.originalText || originalText,
            optimizedText: parsed.optimizedText || parsed.corrected_text || originalText,
            issues: parsed.issues,
            isCompliant: parsed.is_compliant,
            inputLanguage: parsed.input_language
        };
    }
    
    // Dify实际返回的格式适配
    const issues = [];
    if (parsed.issues_in_chinese && !parsed.is_compliant) {
        // 将issues_in_chinese字符串拆分为问题数组
        const issueText = parsed.issues_in_chinese;
        const issueMatches = issueText.match(/\d+\.\s*[^0-9]+?(?=\d+\.|$)/g);
        
        if (issueMatches) {
            issueMatches.forEach((issueStr) => {
                const cleanStr = issueStr.trim().replace(/^\d+\.\s*/, '');
                issues.push({
                    type: '文化合规',
                    matchedWord: extractMatchedWord(cleanStr),
                    riskLevel: 'high',
                    description: cleanStr,
                    suggestion: '请根据描述修改相关文案',
                    position: -1
                });
            });
        } else {
            issues.push({
                type: '文化合规',
                matchedWord: '',
                riskLevel: 'high',
                description: issueText,
                suggestion: '请根据描述修改相关文案',
                position: -1
            });
        }
    }
    
    return {
        success: true,
        originalText: originalText,
        optimizedText: parsed.corrected_text || originalText,
        issues: issues,
        isCompliant: parsed.is_compliant,
        inputLanguage: parsed.input_language
    };
}

// 从问题描述中提取匹配词（引号或括号内的内容）
function extractMatchedWord(description) {
    const match = description.match(/['"""]([^'""""]+)['""""]/);
    if (match) return match[1];
    const parenMatch = description.match(/[（(]([^）)]+)[）)]/);
    if (parenMatch) return parenMatch[1];
    return '';
}

// 提供静态文件
app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => {
    console.log(`🚀 服务器已启动: http://localhost:${PORT}`);
    console.log(`📋 API代理端点: POST /api/analyze`);
});
