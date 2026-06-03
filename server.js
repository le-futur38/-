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

        // 添加超时控制（30秒）
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);

        let response;
        try {
            console.log('正在调用Dify API:', `${process.env.DIFY_API_URL}/chat-messages`);
            response = await fetch(`${process.env.DIFY_API_URL}/chat-messages`, {
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
                }),
                signal: controller.signal
            });
            clearTimeout(timeout);
            console.log('Dify响应状态:', response.status);
        } catch (fetchError) {
            clearTimeout(timeout);
            if (fetchError.name === 'AbortError') {
                console.error('Dify API请求超时（30秒）');
                return res.status(504).json({
                    success: false,
                    error: 'AI审查服务响应超时，请稍后重试'
                });
            }
            console.error('Dify API请求失败:', fetchError.message);
            throw fetchError;
        }

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Dify API错误响应:', response.status, errorText);
            throw new Error(`Dify API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Dify返回数据 keys:', Object.keys(data));
        
        // 解析AI返回的内容
        let result;
        try {
            // 尝试从返回内容中提取JSON
            let content = data.answer || '';
            
            // 清理markdown代码块
            content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            
            // 尝试解析JSON
            result = JSON.parse(content);
            result.success = true;
        } catch (parseError) {
            // 如果解析失败，尝试其他方式
            const match = data.answer?.match(/\{[\s\S]*\}/);
            if (match) {
                try {
                    result = JSON.parse(match[0]);
                    result.success = true;
                } catch (e) {
                    result = {
                        success: false,
                        originalText: text,
                        optimizedText: text,
                        issues: [],
                        error: 'AI返回格式解析失败'
                    };
                }
            } else {
                result = {
                    success: false,
                    originalText: text,
                    optimizedText: text,
                    issues: [],
                    error: '无法解析AI返回内容'
                };
            }
        }

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

// 提供静态文件
app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => {
    console.log(`🚀 服务器已启动: http://localhost:${PORT}`);
    console.log(`📋 API代理端点: POST /api/analyze`);
});
