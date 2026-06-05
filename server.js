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

// 从Dify获取历史消息（用于还原历史审查报告）
app.get('/api/message', async (req, res) => {
    const { conversation_id, message_id } = req.query;
    
    if (!conversation_id) {
        return res.status(400).json({
            success: false,
            error: '缺少 conversation_id 参数'
        });
    }
    
    try {
        // 调用 Dify GET /v1/messages API
        const difyUrl = `${process.env.DIFY_API_URL}/messages?conversation_id=${encodeURIComponent(conversation_id)}&user=web-user&limit=20`;
        console.log('[Dify消息API] 请求:', difyUrl);
        
        const response = await fetch(difyUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.DIFY_API_KEY}`
            }
        });
        
        if (!response.ok) {
            const errText = await response.text();
            console.error('[Dify消息API] 错误:', response.status, errText.substring(0, 500));
            return res.status(response.status).json({
                success: false,
                error: `Dify API错误: ${response.status}`,
                message: errText.substring(0, 200)
            });
        }
        
        const data = await response.json();
        console.log('[Dify消息API] 收到数据:', data.data ? data.data.length : 0, '条消息');
        
        // 找到对应的消息
        let message = null;
        if (data.data && data.data.length > 0) {
            if (message_id) {
                message = data.data.find(m => m.id === message_id);
            }
            if (!message) {
                // 找最新的AI回复消息
                const aiMessages = data.data.filter(m => m.answer && m.answer.length > 0);
                message = aiMessages[aiMessages.length - 1] || data.data[data.data.length - 1];
            }
        }
        
        if (!message) {
            return res.status(404).json({
                success: false,
                error: '未找到对应的消息',
                conversation_id
            });
        }
        
        // 解析AI返回的内容（使用多策略解析器）
        const parseResult = parseDifyAnswer(message.answer);
        if (!parseResult.success) {
            return res.status(500).json({
                success: false,
                error: '无法解析Dify返回的JSON',
                detail: parseResult.error,
                rawAnswer: parseResult.rawContent
            });
        }
        
        // 转换为前端期望的格式
        const originalText = message.query ? message.query.replace(/^请审查以下出口到.*?市场.*?文案：\n\n/, '').replace(/\n\n请按要求返回JSON格式的审查结果。$/, '') : '';
        const result = convertDifyResponse(parseResult.parsed, originalText);
        result.conversation_id = conversation_id;
        result.message_id = message.id;
        
        res.json(result);
        
    } catch (error) {
        console.error('[Dify消息API] 异常:', error);
        res.status(500).json({
            success: false,
            error: '服务器内部错误',
            message: error.message
        });
    }
});

// 提取第一个完整的JSON对象（基于平衡括号匹配）
function extractFirstJsonObject(text) {
    if (!text) return null;
    
    // 找到第一个 {
    const firstBrace = text.indexOf('{');
    if (firstBrace === -1) return null;
    
    let depth = 0;
    let inString = false;
    let escape = false;
    let start = firstBrace;
    
    for (let i = firstBrace; i < text.length; i++) {
        const c = text[i];
        
        if (escape) {
            escape = false;
            continue;
        }
        
        if (c === '\\') {
            escape = true;
            continue;
        }
        
        if (c === '"' && !escape) {
            inString = !inString;
            continue;
        }
        
        if (inString) continue;
        
        if (c === '{') {
            depth++;
        } else if (c === '}') {
            depth--;
            if (depth === 0) {
                return text.substring(start, i + 1);
            }
        }
    }
    
    return null;
}

// 尝试修复常见的JSON错误
function tryRepairJson(text) {
    if (!text) return text;
    
    let repaired = text;
    
    // 移除尾部逗号 (在 } 或 ] 前的逗号)
    repaired = repaired.replace(/,(\s*[}\]])/g, '$1');
    
    // 单引号替换为双引号（仅在键名/字符串值位置）
    // 这是一个有风险的修改，谨慎处理：仅在看起来是键的情况下
    
    // 移除Markdown代码块标记（如果还有残留）
    repaired = repaired.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    return repaired.trim();
}

// 多策略JSON解析
function parseDifyAnswer(answer) {
    if (!answer) {
        return { success: false, error: 'AI返回内容为空' };
    }
    
    console.log('[JSON解析] answer长度:', answer.length);
    
    // 清理markdown代码块
    let content = answer.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // 策略1: 直接解析
    try {
        let parsed = JSON.parse(content);
        console.log('[JSON解析] 策略1成功（直接解析）');
        return { success: true, parsed, content };
    } catch (e1) {
        console.log('[JSON解析] 策略1失败:', e1.message);
    }
    
    // 策略2: 提取并移除 <think> 块后再解析
    const thinkStart = content.indexOf('<think>');
    const thinkEnd = content.indexOf('</think>');
    if (thinkStart !== -1 && thinkEnd !== -1 && thinkEnd > thinkStart) {
        content = content.substring(0, thinkStart) + content.substring(thinkEnd + 8);
        content = content.trim();
        try {
            let parsed = JSON.parse(content);
            console.log('[JSON解析] 策略2成功（移除think块）');
            return { success: true, parsed, content };
        } catch (e2) {
            console.log('[JSON解析] 策略2失败:', e2.message);
        }
    }
    
    // 策略3: 平衡括号匹配提取第一个完整JSON对象
    let jsonStr = extractFirstJsonObject(content);
    if (jsonStr) {
        try {
            let parsed = JSON.parse(jsonStr);
            console.log('[JSON解析] 策略3成功（平衡括号）');
            return { success: true, parsed, content };
        } catch (e3) {
            console.log('[JSON解析] 策略3失败:', e3.message);
            
            // 策略3.5: 修复JSON后再试
            const repaired = tryRepairJson(jsonStr);
            try {
                let parsed = JSON.parse(repaired);
                console.log('[JSON解析] 策略3.5成功（修复JSON）');
                return { success: true, parsed, content };
            } catch (e35) {
                console.log('[JSON解析] 策略3.5失败:', e35.message);
            }
        }
    }
    
    // 策略4: 修复整体内容后重试
    const repairedContent = tryRepairJson(content);
    if (repairedContent !== content) {
        try {
            let parsed = JSON.parse(repairedContent);
            console.log('[JSON解析] 策略4成功（整体修复）');
            return { success: true, parsed, content };
        } catch (e4) {
            console.log('[JSON解析] 策略4失败:', e4.message);
        }
        
        // 再次尝试平衡括号
        jsonStr = extractFirstJsonObject(repairedContent);
        if (jsonStr) {
            try {
                let parsed = JSON.parse(jsonStr);
                console.log('[JSON解析] 策略4.5成功');
                return { success: true, parsed, content };
            } catch (e45) {
                console.log('[JSON解析] 策略4.5失败:', e45.message);
            }
        }
    }
    
    // 全部失败：返回原始内容供前端显示
    return {
        success: false,
        error: '所有JSON解析策略均失败',
        rawContent: content.substring(0, 1000)
    };
}

// API代理端点
app.post('/api/analyze', async (req, res) => {
    try {
        console.log('=== /api/analyze 收到请求 ===');
        const { text, country, productType } = req.body;
        console.log('text:', text);
        console.log('country:', country);
        console.log('productType:', productType);
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
            'singapore': '新加坡',
            'philippines': '菲律宾',
            'myanmar': '缅甸',
            'cambodia': '柬埔寨',
            'laos': '老挝',
            'brunei': '文莱'
        };
        
        const countryName = countryNames[country] || country;
        const textileType = productType || '未指定';
        
        const systemPrompt = `你是跨境电商合规审查专家，专门审查出口到东南亚市场的纺织品文案。

请从以下维度审查文案：
1. 宗教禁忌（如佛教、伊斯兰教等）
2. 文化禁忌（颜色、动物、符号等）
3. 政治敏感内容
4. 颜色禁忌（不同国家对颜色有不同偏好）
5. 王室相关内容（泰国、柬埔寨特别敏感）
6. 语言规范和准确性
7. 产品认证要求
8. 广告法规定
9. 不同纺织品种类的特殊禁忌

请严格按照以下JSON格式返回审查结果：
{
  "target_country": "目标国家中文名",
  "product_type": "纺织品种类",
  "input_language": "输入文案的语言（如：泰语、中文、英语等）",
  "rewrite_language": "改写文案的目标语言（一般与输入语言一致）",
  "overall_risk_level": "高风险/中风险/低风险/无风险",
  "is_recommended_for_listing": true/false,
  "summary": "对整体审查结果的简要总结（1-2句话）",
  "source_units": [
    {
      "source_unit_id": "S1",
      "original_text": "原文片段1",
      "meaning_zh": "原文片段1的中文含义"
    }
  ],
  "issues": [
    {
      "issue_id": 1,
      "source_unit_id": "S1",
      "exact_quote": "问题原文片段",
      "quote_meaning_zh": "问题原文的中文翻译",
      "problem_position": "问题在文案中的具体位置描述",
      "risk_level": "高风险/中风险/低风险",
      "risk_type": "风险类型（如：宗教文化风险、政治敏感风险、颜色禁忌风险等）",
      "cultural_background": "该问题背后的文化背景和禁忌解释",
      "reason": "为什么这是一个问题（具体原因）",
      "rag_evidence": "RAG参考证据（如果无可填'无特定RAG证据'）",
      "modification_suggestion": "具体的修改建议",
      "suggested_rewrite": "建议的改写文案"
    }
  ],
  "optimized_full_text": "完整优化后的文案（保留原语言）",
  "notes": "补充说明（如果有）"
}

注意：
- source_units需要将原文按语义片段拆分，每个片段要有独立ID（S1, S2, S3...）
- issues数组中每个问题必须通过source_unit_id关联到source_units
- exact_quote必须是原文中的真实片段
- optimized_full_text必须是与原语言一致的完整优化文案
- 如无问题，issues设为空数组，overall_risk_level为"无风险"，is_recommended_for_listing为true

请直接返回JSON，不要有其他内容。`;

        // 调用Dify API，使用流式模式避免Cloudflare 60秒超时切断
        const difyResponse = await callDifyWithRetry({
            url: `${process.env.DIFY_API_URL}/chat-messages`,
            apiKey: process.env.DIFY_API_KEY,
            body: {
                query: `请审查以下出口到${countryName}市场的【${textileType}】类纺织品文案：\n\n${text}\n\n请按要求返回JSON格式的审查结果。`,
                user: 'web-user',
                response_mode: 'streaming',
                conversation_id: '',
                inputs: {
                    country: countryName,
                    types: textileType,
                    input_text: text
                },
                files: []
            }
        }, 2); // 流式模式只需2次重试

        const data = difyResponse.data;
        console.log('=== Dify响应 ===');
        console.log('完整数据:', JSON.stringify(data).substring(0, 2000));
        console.log('answer字段长度:', data.answer ? data.answer.length : 0);
        console.log('answer内容预览:', data.answer ? data.answer.substring(0, 500) : '空');
        console.log('conversation_id:', data.conversation_id);
        console.log('message_id:', data.message_id);
        console.log('重试次数:', difyResponse.attempts);

        // 解析AI返回的内容
        let result;
        const parseResult = parseDifyAnswer(data.answer);
        
        if (parseResult.success) {
            try {
                result = convertDifyResponse(parseResult.parsed, text);
                console.log('转换后字段:', Object.keys(result));
                console.log('issues数量:', result.issues ? result.issues.length : 0);
            } catch (convertError) {
                console.error('转换Dify响应失败:', convertError.message);
                console.error('已解析的JSON keys:', Object.keys(parseResult.parsed || {}));
                result = {
                    success: true,
                    originalText: text,
                    optimizedText: data.answer || text,
                    issues: [],
                    warning: 'AI返回数据格式不匹配，已返回原始内容'
                };
            }
        } else {
            console.error('所有JSON解析策略均失败');
            console.error('原始内容预览:', parseResult.rawContent);
            result = {
                success: true,
                originalText: text,
                optimizedText: data.answer || text,
                issues: [],
                warning: 'AI返回格式解析失败，已返回原始内容'
            };
        }

        console.log('=== 最终返回结果 ===');
        console.log('success:', result.success);
        console.log('issues数量:', result.issues ? result.issues.length : 0);
        // 关键：附加 Dify 的 conversation_id 和 message_id，用于历史报告还原
        result.conversation_id = data.conversation_id || '';
        result.message_id = data.message_id || '';
        console.log('返回 conversation_id:', result.conversation_id);
        console.log('返回 message_id:', result.message_id);
        res.json(result);
    } catch (error) {
        console.error('API Error:', error);
        
        // 判断是否是Dify服务不可用
        const isDifyDown = error.message && (
            error.message.includes('Dify服务') ||
            error.message.includes('Gateway') ||
            error.message.includes('Cloudflare') ||
            error.message.includes('504') ||
            error.message.includes('不可用')
        );
        
        const statusCode = isDifyDown ? 503 : 500;
        const userMessage = isDifyDown 
            ? 'AI审查服务暂时不可用（Dify官方服务异常），请稍后重试或联系管理员' 
            : '服务器内部错误';
        
        res.status(statusCode).json({
            success: false,
            error: userMessage,
            message: error.message,
            retryable: isDifyDown
        });
    }
});

// 将Dify返回的JSON转换为前端期望的格式
function convertDifyResponse(parsed, originalText) {
    // 新的Dify格式：包含issues数组和详细字段
    if (parsed.issues && Array.isArray(parsed.issues)) {
        // 转换issues为前端友好格式，同时保留原始字段
        const formattedIssues = parsed.issues.map(issue => {
            // 统一风险等级（高/中/低 -> high/medium/low）
            let riskLevel = issue.riskLevel;
            if (!riskLevel && issue.risk_level) {
                if (issue.risk_level.includes('高') || issue.risk_level.toLowerCase().includes('high')) {
                    riskLevel = 'high';
                } else if (issue.risk_level.includes('中') || issue.risk_level.toLowerCase().includes('medium')) {
                    riskLevel = 'medium';
                } else if (issue.risk_level.includes('低') || issue.risk_level.toLowerCase().includes('low')) {
                    riskLevel = 'low';
                } else {
                    riskLevel = 'medium';
                }
            }
            
            return {
                // 兼容旧字段（供前端兼容显示）
                type: issue.risk_type || '文化合规',
                matchedWord: issue.exact_quote || '',
                riskLevel: riskLevel || 'medium',
                description: issue.cultural_background || issue.reason || '',
                suggestion: issue.modification_suggestion || '请根据描述修改相关文案',
                position: -1,
                // 新字段
                issue_id: issue.issue_id,
                source_unit_id: issue.source_unit_id,
                exact_quote: issue.exact_quote,
                quote_meaning_zh: issue.quote_meaning_zh,
                problem_position: issue.problem_position,
                risk_level: issue.risk_level,
                risk_type: issue.risk_type,
                cultural_background: issue.cultural_background,
                reason: issue.reason,
                rag_evidence: issue.rag_evidence,
                modification_suggestion: issue.modification_suggestion,
                suggested_rewrite: issue.suggested_rewrite
            };
        });
        
        return {
            success: true,
            originalText: originalText,
            optimizedText: parsed.optimized_full_text || parsed.corrected_text || originalText,
            issues: formattedIssues,
            // 新格式字段直通
            target_country: parsed.target_country,
            product_type: parsed.product_type,
            input_language: parsed.input_language,
            rewrite_language: parsed.rewrite_language,
            overall_risk_level: parsed.overall_risk_level,
            is_recommended_for_listing: parsed.is_recommended_for_listing,
            summary: parsed.summary,
            source_units: parsed.source_units || [],
            optimized_full_text: parsed.optimized_full_text,
            notes: parsed.notes
        };
    }
    
    // 旧Dify格式兼容（input_language, is_compliant, issues_in_chinese, corrected_text）
    const issues = [];
    if (parsed.issues_in_chinese && !parsed.is_compliant) {
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
                    position: -1,
                    cultural_background: cleanStr
                });
            });
        } else {
            issues.push({
                type: '文化合规',
                matchedWord: '',
                riskLevel: 'high',
                description: issueText,
                suggestion: '请根据描述修改相关文案',
                position: -1,
                cultural_background: issueText
            });
        }
    }
    
    return {
        success: true,
        originalText: originalText,
        optimizedText: parsed.corrected_text || originalText,
        issues: issues,
        isCompliant: parsed.is_compliant,
        inputLanguage: parsed.input_language,
        target_country: parsed.target_country || '',
        product_type: parsed.product_type || '',
        input_language: parsed.input_language,
        overall_risk_level: parsed.is_compliant ? '无风险' : '高风险',
        is_recommended_for_listing: parsed.is_compliant !== false,
        summary: parsed.issues_in_chinese || '审查完成',
        source_units: [],
        notes: ''
    };
}

// 从问题描述中提取匹配词（优先提取括号内的原文，其次是引号内容）
function extractMatchedWord(description) {
    // 优先提取括号内的原文（如中文描述中的"可爱的猪图案(ลวดลายหมูน่ารัก)"应提取泰文部分）
    const parenMatch = description.match(/[（(]([^）)]+)[）)]/);
    if (parenMatch) {
        const parenContent = parenMatch[1].trim();
        // 如果括号内是非中文（即原文），优先返回
        if (/[^\u4e00-\u9fa5]/.test(parenContent) && parenContent.length > 1) {
            return parenContent;
        }
        // 如果括号内是中文，尝试引号
        const quoteMatch = description.match(/['"""]([^'""""]+)['""""]/);
        if (quoteMatch) return quoteMatch[1];
        return parenContent;
    }
    // 退而求其次提取引号内容
    const quoteMatch = description.match(/['"""]([^'""""]+)['""""]/);
    if (quoteMatch) return quoteMatch[1];
    return '';
}

// 提供静态文件
app.use(express.static(path.join(__dirname)));

// 带重试机制的Dify API调用（支持流式响应）
async function callDifyWithRetry({ url, apiKey, body }, maxRetries = 3) {
    const RETRY_DELAYS = [2000, 5000, 10000]; // 重试间隔（毫秒）
    let lastError = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`[Dify] 第 ${attempt}/${maxRetries} 次尝试（流式模式）...`);
            
            const controller = new AbortController();
            // 流式模式禁用超时，依赖Cloudflare的流连接保持
            const timeoutId = null;
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    'Accept': 'text/event-stream'
                },
                body: JSON.stringify(body),
                signal: controller.signal
            });
            
            if (timeoutId) clearTimeout(timeoutId);
            
            if (!response.ok) {
                // 尝试读取错误内容
                let errText = '';
                try {
                    errText = await response.text();
                } catch (e) {}
                
                // 检查是否是HTML错误页（如Cloudflare 504）
                if (errText.trim().startsWith('<') || errText.includes('Gateway time-out') || errText.includes('504')) {
                    throw new Error(`Dify服务暂时不可用（HTTP ${response.status}，Cloudflare网关错误）`);
                }
                throw new Error(`Dify API error: ${response.status} - ${errText.substring(0, 200)}`);
            }
            
            // 处理流式响应（SSE格式）
            console.log(`[Dify] 接收到流式响应，开始读取...`);
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullAnswer = '';
            let conversationId = '';
            let messageId = '';
            let lastEvent = null;
            
            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    
                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n');
                    
                    for (const line of lines) {
                        if (line.startsWith('data:')) {
                            const dataStr = line.substring(5).trim();
                            if (!dataStr || dataStr === '[DONE]') continue;
                            
                            try {
                                const event = JSON.parse(dataStr);
                                lastEvent = event;
                                
                                if (event.event === 'message' || event.event === 'agent_message') {
                                    if (event.answer) fullAnswer += event.answer;
                                } else if (event.event === 'message_end') {
                                    if (event.conversation_id) conversationId = event.conversation_id;
                                    if (event.message_id) messageId = event.message_id;
                                } else if (event.event === 'error') {
                                    throw new Error(`Dify返回错误: ${event.message || '未知错误'}`);
                                }
                            } catch (e) {
                                if (e.message.includes('Dify返回错误')) throw e;
                                // 忽略JSON解析错误（可能是不完整的事件）
                            }
                        }
                    }
                }
            } finally {
                reader.releaseLock();
            }
            
            console.log(`[Dify] 流式响应接收完成，answer长度: ${fullAnswer.length}`);
            
            // 构造与blocking模式相同的返回结构
            const data = {
                answer: fullAnswer,
                conversation_id: conversationId,
                message_id: messageId,
                ...(lastEvent || {}) // 包含其他可能的字段
            };
            
            return { data, attempts: attempt };
            
        } catch (error) {
            lastError = error;
            console.error(`[Dify] 第 ${attempt} 次尝试失败:`, error.message);
            
            if (attempt < maxRetries) {
                const delay = RETRY_DELAYS[attempt - 1] || 10000;
                console.log(`[Dify] 等待 ${delay/1000} 秒后重试...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    
    // 所有重试都失败
    throw new Error(`Dify服务在 ${maxRetries} 次尝试后仍不可用: ${lastError?.message || '未知错误'}`);
}

app.listen(PORT, () => {
    console.log(`🚀 服务器已启动: http://localhost:${PORT}`);
    console.log(`📋 API代理端点: POST /api/analyze`);
});
