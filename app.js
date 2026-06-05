// 全局状态
let currentState = {
    selectedCountry: '',
    originalText: '',
    optimizedText: '',
    issues: [],
    currentView: 'main',
    lastView: 'main'  // 记录上一个页面，用于返回
};

// DOM元素缓存
const elements = {
    textInput: document.getElementById('text-input'),
    charCount: document.getElementById('char-count'),
    countrySelect: document.getElementById('country-select'),
    textileSelect: document.getElementById('textile-select'),
    analyzeBtn: document.getElementById('analyze-btn'),
    clearBtn: document.getElementById('clear-btn'),
    originalText: document.getElementById('original-text'),
    optimizedText: document.getElementById('optimized-text'),
    issuesList: document.getElementById('issues-list'),
    riskSummary: document.getElementById('risk-summary'),
    copyBtn: document.getElementById('copy-btn'),
    backBtn: document.getElementById('back-btn'),
    toast: document.getElementById('toast'),
    navLinks: document.querySelectorAll('.nav-link'),
    views: document.querySelectorAll('.view')
};

// ===================================
// 工具函数
// ===================================

function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.classList.add('show');
    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 3000);
}

function updateCharCount() {
    const count = elements.textInput.value.length;
    elements.charCount.textContent = count;
}

// 清空文案审查表单
function clearReviewForm() {
    // 清空输入框
    if (elements.textInput) {
        elements.textInput.value = '';
        updateCharCount();
    }
    
    // 重置目标市场选择
    if (elements.countrySelect) {
        elements.countrySelect.value = '';
    }
    
    // 重置纺织品种类选择
    if (elements.textileSelect) {
        elements.textileSelect.value = '';
    }
    
    console.log('文案输入表单已清空');
}

function switchView(viewName) {
    // 记录当前页面为上一个页面（在切换之前）
    currentState.lastView = currentState.currentView;
    
    // 如果从文案输入页面退出，清空输入框和重置选择
    if (currentState.currentView === 'review' && viewName !== 'review') {
        clearReviewForm();
    }
    
    elements.navLinks.forEach(link => {
        if (link.dataset.view === viewName) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    elements.views.forEach(view => {
        if (view.id === `${viewName}-view`) {
            view.classList.add('active');
        } else {
            view.classList.remove('active');
        }
    });
    
    currentState.currentView = viewName;
    
    // 如果切换到统计视图，更新图表
    if (viewName === 'stats') {
        updateStats();
    }
    
    // 如果切换到个人中心视图，刷新历史记录
    if (viewName === 'profile') {
        renderHistoryRecords();
    }
    
    // 更新返回按钮的文本和功能
    updateBackButton();
    
    // 控制导航栏的显示和隐藏
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.style.display = viewName === 'review' ? 'none' : 'block';
    }
    
    // 如果切换到首页，重新触发滚动动画
    if (viewName === 'main') {
        resetScrollAnimations();
        // 滚动到页面顶部
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // 延迟触发动画
        setTimeout(updateScrollAnimations, 300);
    }
}

// 重置滚动动画（移除所有动画状态）
function resetScrollAnimations() {
    const animateElements = document.querySelectorAll('.scroll-animate, .fade-in, .slide-in-left, .slide-in-right, .scale-in');
    
    animateElements.forEach(element => {
        element.classList.remove('active');
        // 对于需要hidden类的元素，添加hidden类
        if (element.classList.contains('scroll-animate') || 
            element.classList.contains('fade-in') || 
            element.classList.contains('slide-in-left') || 
            element.classList.contains('slide-in-right') || 
            element.classList.contains('scale-in')) {
            element.classList.add('hidden');
        }
    });
}

// 更新返回按钮的文本和功能
function updateBackButton() {
    const backBtn = elements.backBtn;
    if (!backBtn) return;
    
    // 根据当前页面和上一个页面决定返回按钮的显示
    if (currentState.currentView === 'result') {
        // 在审查报告页面
        backBtn.style.display = 'inline-flex';
        
        // 根据来源页面设置不同的返回文本
        if (currentState.lastView === 'review') {
            // 从文案输入页面来的
            backBtn.innerHTML = '<i class="fas fa-arrow-left"></i> 返回审查';
        } else if (currentState.lastView === 'profile') {
            // 从个人中心的历史记录来的
            backBtn.innerHTML = '<i class="fas fa-arrow-left"></i> 返回个人中心';
        } else {
            // 默认返回审查页面
            backBtn.innerHTML = '<i class="fas fa-arrow-left"></i> 返回审查';
        }
    } else {
        // 不在审查报告页面时隐藏返回按钮
        backBtn.style.display = 'none';
    }
}

// ===================================
// AI审查核心逻辑
// ===================================

// 拼写和语法检查
function checkSpelling(text) {
    const issues = [];
    let correctedText = text;
    
    COMMON_SPELLING_ERRORS.forEach(({ wrong, correct, type }) => {
        const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
        if (regex.test(text)) {
            issues.push({
                type: '拼写错误',
                subtype: 'spelling',
                wrongWord: wrong,
                correctWord: correct,
                riskLevel: 'low',
                description: `单词 "${wrong}" 拼写错误`,
                suggestion: `建议更正为 "${correct}"`,
                position: text.search(regex)
            });
            correctedText = correctedText.replace(regex, correct);
        }
    });
    
    return { issues, correctedText };
}

// 敏感词检查
function checkSensitiveWords(text, country) {
    const issues = [];
    
    // 检查通用敏感词
    Object.keys(SENSITIVE_WORDS).forEach(category => {
        SENSITIVE_WORDS[category].forEach(({ word, risk, type, description }) => {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            const matches = [...text.matchAll(regex)];
            
            matches.forEach(match => {
                // 对于穆斯林国家，宗教敏感词升级为高风险
                let adjustedRisk = risk;
                if (type === 'religious' && ['indonesia', 'malaysia'].includes(country)) {
                    adjustedRisk = 'high';
                }
                
                issues.push({
                    type: getIssueTypeLabel(type),
                    subtype: type,
                    matchedWord: word,
                    riskLevel: adjustedRisk,
                    description: description,
                    suggestion: getSensitiveWordSuggestion(word, type),
                    position: match.index
                });
            });
        });
    });
    
    // 根据特定国家检查文化禁忌
    if (country && KNOWLEDGE_BASE[country]) {
        // 检查颜色禁忌
        if (KNOWLEDGE_BASE[country].color) {
            KNOWLEDGE_BASE[country].color.forEach(item => {
                const colorName = item.item.toLowerCase();
                const regex = new RegExp(`\\b${colorName}\\b`, 'gi');
                const matches = [...text.matchAll(regex)];
                matches.forEach(match => {
                    issues.push({
                        type: '文化禁忌',
                        subtype: 'color',
                        matchedWord: colorName,
                        riskLevel: 'medium',
                        description: item.description,
                        suggestion: `建议替换为其他颜色词汇`,
                        position: match.index
                    });
                });
            });
        }
    }
    
    return issues;
}

function getIssueTypeLabel(type) {
    const labels = {
        spelling: '拼写错误',
        grammar: '语法错误',
        platform_policy: '平台规则',
        ip: '知识产权',
        certification: '认证问题',
        claim: '宣称规范',
        religious: '宗教禁忌',
        political: '政治敏感',
        cultural: '文化禁忌'
    };
    return labels[type] || type;
}

function getSensitiveWordSuggestion(word, type) {
    const suggestions = {
        pig: '移除该词汇或使用替代词汇，如"Genuine Leather"',
        pork: '移除该词汇，穆斯林国家禁食猪肉',
        original: '如果并非原创，请改为"High Quality"',
        organic: '如果没有认证，请移除该宣称',
        allah: '移除该词汇，非宗教产品不适合使用',
        buddha: '移除该词汇，避免冒犯佛教信仰'
    };
    return suggestions[word.toLowerCase()] || '建议移除或替换该词汇';
}

// 应用修改得到最终文本
function applyCorrections(text, issues) {
    let result = text;
    
    // 按位置从后往前修改，避免位置偏移
    const sortedIssues = [...issues].sort((a, b) => (b.position || 0) - (a.position || 0));
    
    sortedIssues.forEach(issue => {
        if (issue.wrongWord && issue.correctWord && issue.position !== undefined) {
            const start = issue.position;
            const end = start + issue.wrongWord.length;
            result = result.substring(0, start) + issue.correctWord + result.substring(end);
        } else if (issue.matchedWord && issue.position !== undefined) {
            // 敏感词暂时保持原样，只标记
        }
    });
    
    return result;
}

// 为文本添加高亮标记
function highlightText(text, issues) {
    if (!issues || issues.length === 0) {
        return text;
    }
    
    // 创建一个数组来存储所有高亮片段
    const highlights = [];
    
    // 遍历每个问题，找到匹配词在文本中的实际位置
    issues.forEach(issue => {
        // 优先使用wrongWord，如果没有则使用matchedWord
        const wordToMatch = issue.wrongWord || issue.matchedWord;
        if (!wordToMatch) return;
        
        // 使用正则表达式查找所有匹配项（不区分大小写，匹配整个单词）
        const regex = new RegExp(wordToMatch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        let match;
        
        while ((match = regex.exec(text)) !== null) {
            highlights.push({
                start: match.index,
                end: match.index + match[0].length,
                issue: issue
            });
            break; // 只取第一个匹配
        }
    });
    
    // 按起始位置排序
    highlights.sort((a, b) => a.start - b.start);
    
    let result = '';
    let lastIndex = 0;
    
    highlights.forEach(({ start, end, issue }) => {
        // 跳过重叠匹配
        if (start < lastIndex) return;
        
        result += text.substring(lastIndex, start);
        const highlighted = `<span class="highlight ${issue.riskLevel}-risk" data-issue-id="${issue.id}">${text.substring(start, end)}</span>`;
        result += highlighted;
        lastIndex = end;
    });
    
    result += text.substring(lastIndex);
    return result;
}

// 演示案例预定义数据（固定结果）
const FIXED_DEMO_RESULT = {
    inputText: "ผ้ากันหนาวไหมราชวงศ์สีเหลืองสวยงาม พร้อมลายหมูน่ารัก เหมาะสำหรับสวมใส่ในฤดูร้อน ออกแบบโดยเป็นแรงบันดาลใจจากสไตล์ราชวงศ์ จะทำให้คุณดูเหมือนราชินี",
    optimizedText: "ผ้ากันหนาวไหมสีทองพร้อมลายช้างชั้นเยี่ยม เหมาะสำหรับต่างๆ ในฤดูร้อน ออกแบบที่มีสไตล์สง่างาม จะทำให้คุณดูสง่างามและประณีต",
    issues: [
        {
            id: 0,
            type: '颜色禁忌',
            matchedWord: 'ราชวงศ์สีเหลือง',
            wrongWord: 'ราชวงศ์สีเหลือง',
            riskLevel: 'high',
            description: '在泰国，黄色是王室的象征色，与国王和王室家族紧密关联。普通民众在非特定场合（如国王生日）穿着黄色服装可能被视为不敬，尤其是在商业产品中随意使用。',
            suggestion: '将"ราชวงศ์สีเหลือง"改为中性或更安全的颜色，如：<br><br>"สีทอง"（金色）<br>"สีขาว"（米色）<br>"สีส้มอ่อน"（浅橙色）',
            position: 12
        },
        {
            id: 1,
            type: '宗教禁忌',
            matchedWord: 'ลายหมู',
            wrongWord: 'ลายหมู',
            riskLevel: 'high',
            description: '泰国人口中约94%信仰佛教，同时有相当数量的穆斯林人口。猪在伊斯兰教中被视为不洁之物，猪图案的服装在穆斯林市场会引起严重不适。',
            suggestion: '完全移除猪图案<br><br>替换为东南亚文化中受欢迎的动物图案，如：<br><br>"ลายช้าง"（大象图案）<br>"ลายปลา"（鱼图案）<br>"ลายดอกไม้"（花卉图案）',
            position: 30
        },
        {
            id: 2,
            type: '王室相关表述风险',
            matchedWord: 'สไตล์ราชวงศ์',
            wrongWord: 'สไตล์ราชวงศ์',
            riskLevel: 'high',
            description: '泰国实行君主立宪制，对王室有严格的法律保护。任何涉及王室的商业表述都需要极其谨慎。',
            suggestion: '"สไตล์ราชวงศ์" → "สไตล์สง่างาม"（优雅风格）',
            position: 76
        },
        {
            id: 3,
            type: '王室相关表述风险',
            matchedWord: 'เหมือนราชินี',
            wrongWord: 'เหมือนราชินี',
            riskLevel: 'high',
            description: '泰国实行君主立宪制，对王室有严格的法律保护。暗示消费者可以"像女王一样"可能触犯《冒犯君主法》。',
            suggestion: '"เหมือนราชินี" → "ดูสง่างามและประณีต"（看起来优雅端庄）',
            position: 97
        }
    ]
};

// 检查输入文本是否匹配固定演示案例
function isMatchFixedDemo(text) {
    const normalizedInput = text.toLowerCase().replace(/\s+/g, ' ').trim();
    const normalizedDemo = FIXED_DEMO_RESULT.inputText.toLowerCase().replace(/\s+/g, ' ').trim();
    
    // 容错匹配：包含泰文关键词即可识别
    return normalizedInput.includes('สีเหลือง') && 
           normalizedInput.includes('หมู') && 
           normalizedInput.includes('ราชวงศ์') && 
           normalizedInput.includes('ราชินี');
}

// 主审查函数（接入Dify AI大模型）
function analyzeText() {
    const text = elements.textInput.value.trim();
    const selectedCountry = elements.countrySelect.value;
    const selectedTextile = elements.textileSelect ? elements.textileSelect.value : '';
    
    if (!selectedCountry) {
        showToast('请先选择目标市场');
        return;
    }
    
    if (!selectedTextile) {
        showToast('请先选择纺织品种类');
        return;
    }
    
    if (!text) {
        showToast('请先输入待审查的文案');
        return;
    }
    
    // 显示加载状态
    elements.analyzeBtn.innerHTML = '<span class="loading"></span> AI分析中...';
    elements.analyzeBtn.disabled = true;
    
    // 显示处理中提示
    showToast('正在分析文案... AI正在检查语法、文化禁忌和合规性问题...');
    
    // 启动进度提示（让用户知道仍在等待）
    let progressTimer = null;
    let progressSeconds = 0;
    progressTimer = setInterval(() => {
        progressSeconds += 10;
        if (progressSeconds === 30) {
            showToast('AI分析中... 复杂合规审查可能需要1-2分钟，请耐心等待');
        } else if (progressSeconds === 60) {
            showToast('AI分析中... 仍在处理中');
        } else if (progressSeconds === 90) {
            showToast('AI分析中... 快完成了');
        } else if (progressSeconds % 30 === 0) {
            showToast(`AI分析中... 已等待${progressSeconds}秒`);
        }
    }, 10000);
    
    // 调用Railway后端API（带超时控制）
    const fetchController = new AbortController();
    const fetchTimeoutId = setTimeout(() => {
        fetchController.abort();
        console.error('前端fetch超时（3分钟）');
    }, 180000); // 3分钟超时
    
    fetch('https://airy-respect-production.up.railway.app/api/analyze', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: text,
            country: selectedCountry,
            productType: selectedTextile
        }),
        signal: fetchController.signal
    })
    .then(response => {
        clearTimeout(fetchTimeoutId);
        clearInterval(progressTimer);
        console.log('收到响应，状态:', response.status);
        
        if (!response.ok) {
            throw new Error(`服务器返回 ${response.status} 错误`);
        }
        return response.json();
    })
    .then(result => {
        console.log('解析结果成功:', result);
        // 保存到全局状态
        currentState.originalText = result.originalText || text;
        currentState.optimizedText = result.optimizedText || result.corrected_text || text;
        currentState.issues = result.issues || [];
        // 保留Dify返回的额外字段
        currentState.extra = {
            target_country: result.target_country,
            product_type: result.product_type,
            input_language: result.input_language,
            rewrite_language: result.rewrite_language,
            overall_risk_level: result.overall_risk_level,
            is_recommended_for_listing: result.is_recommended_for_listing,
            summary: result.summary,
            source_units: result.source_units,
            optimized_full_text: result.optimized_full_text || result.corrected_text,
            notes: result.notes
        };
        
        // 保存到历史记录
        saveToHistory(text, selectedCountry, currentState.issues, selectedTextile);
        
        // 显示结果
        displayResult(currentState.originalText, currentState.optimizedText, currentState.issues, currentState.extra);
        
        // 恢复按钮
        elements.analyzeBtn.innerHTML = '<i class="fas fa-magic"></i><span>一键智能审查</span>';
        elements.analyzeBtn.disabled = false;
        
        // 跳转到审查报告页面
        switchView('result');
        
        if (currentState.issues.length > 0) {
            const highCount = currentState.issues.filter(i => i.riskLevel === 'high').length;
            const mediumCount = currentState.issues.filter(i => i.riskLevel === 'medium').length;
            showToast(`审查完成！发现${highCount}个高风险问题，${mediumCount}个中风险问题`);
        } else {
            showToast('审查完成，未发现明显风险问题');
        }
    })
    .catch(error => {
        clearTimeout(fetchTimeoutId);
        clearInterval(progressTimer);
        console.error('API调用失败:', error);
        
        // 区分不同的错误类型
        let errorMsg = 'AI审查服务暂时不可用，请稍后重试';
        
        if (error.name === 'AbortError') {
            errorMsg = '请求超时（3分钟），AI分析时间过长，请重试';
        } else if (error.message && error.message.includes('Failed to fetch')) {
            errorMsg = '网络连接失败，请检查网络后重试';
        } else if (error.message) {
            errorMsg = `审查失败：${error.message}`;
        }
        
        showToast(errorMsg);
        elements.analyzeBtn.innerHTML = '<i class="fas fa-magic"></i><span>一键智能审查</span>';
        elements.analyzeBtn.disabled = false;
    });
}

// 获取国家名称
function getCountryName(countryCode) {
    const countryNames = {
        indonesia: '印度尼西亚',
        thailand: '泰国',
        vietnam: '越南',
        malaysia: '马来西亚',
        philippines: '菲律宾',
        singapore: '新加坡',
        myanmar: '缅甸',
        cambodia: '柬埔寨',
        laos: '老挝',
        brunei: '文莱'
    };
    return countryNames[countryCode] || countryCode;
}

// 从历史记录加载审查报告
function loadReviewReport(recordId) {
    // 首先尝试从动态保存的历史记录中查找
    const record = HISTORY_RECORDS.find(r => r.id === recordId);
    
    let originalText, optimizedText, issues;
    
    if (record && record.originalText) {
        // 使用动态保存的数据
        originalText = record.originalText;
        optimizedText = record.optimizedText || record.originalText;
        issues = record.issues || [];
    } else {
        // 回退到预定义的演示数据
        switch(recordId) {
            case 'thailand-demo':
            case 'thailand-1':
                originalText = "ผ้ากันหนาวไหมราชวงศ์สีเหลืองสวยงาม พร้อมลายหมูน่ารัก เหมาะสำหรับสวมใส่ในฤดูร้อน ออกแบบโดยเป็นแรงบันดาลใจจากสไตล์ราชวงศ์ จะทำให้คุณดูเหมือนราชินี";
                optimizedText = "ผ้ากันหนาวไหมสีทองพร้อมลายช้างชั้นเยี่ยม เหมาะสำหรับต่างๆ ในฤดูร้อน ออกแบบที่มีสไตล์สง่างาม จะทำให้คุณดูสง่างามและประณีต";
                issues = FIXED_DEMO_RESULT.issues;
                break;
            case 'malaysia-demo':
            case 'malaysia-1':
                originalText = "Baju Kain Kapas Organik - Kualiti Premium Buatan Tangan dengan Corak Tradisional";
                optimizedText = "Baju Kain Kapas Buatan Tangan Kualiti Premium dengan Corak Tradisional Elegan";
                issues = [
                    {
                        id: 0,
                        type: '文化建议',
                        matchedWord: 'Corak Tradisional',
                        riskLevel: 'low',
                        description: '马来传统图案在商业使用中应确保不涉及宗教元素',
                        suggestion: '建议使用更通用的装饰图案描述',
                        position: 45
                    }
                ];
                break;
            case 'singapore-demo':
            case 'singapore-1':
                originalText = "Silk Scarf Traditional Pattern Luxury Collection - Premium Quality Silk";
                optimizedText = "Silk Scarf Traditional Pattern Luxury Collection - Premium Quality Silk";
                issues = [];
                break;
            case 'indonesia-1':
                originalText = "Kaos Batik Motif Naga - Bahan Katun Berkualitas Tinggi";
                optimizedText = "Kaos Batik Motif Naga - Bahan Katun Berkualitas Tinggi";
                issues = [
                    {
                        id: 0,
                        type: '文化建议',
                        matchedWord: 'Naga',
                        riskLevel: 'medium',
                        description: '龙图案在印尼文化中有特殊含义，需确保不冒犯当地信仰',
                        suggestion: '建议使用更中性的传统图案',
                        position: 15
                    },
                    {
                        id: 1,
                        type: '认证要求',
                        matchedWord: 'Bahan Katun',
                        riskLevel: 'low',
                        description: '棉制品进入印尼市场需符合SNI认证要求',
                        suggestion: '确保产品已获得相关认证',
                        position: 28
                    }
                ];
                break;
            case 'vietnam-1':
                originalText = "Áo Khoác Len Nông Thôn Việt Nam - Chất Lượng Cao, May Chặt Chẽ";
                optimizedText = "Áo Khoác Len Nông Thôn Việt Nam - Chất Lượng Cao, May Chặt Chẽ";
                issues = [];
                break;
            case 'thailand-2':
                originalText = "กระโปรงผ้าฝ้ายสีแดง - สไตล์โมเดิร์นสำหรับสตรี";
                optimizedText = "กระโปรงผ้าฝ้ายสีแดง - สไตล์โมเดิร์นสำหรับสตรี";
                issues = [
                    {
                        id: 0,
                        type: '颜色建议',
                        matchedWord: 'สีแดง',
                        riskLevel: 'low',
                        description: '红色在泰国文化中与吉祥喜庆相关，适合产品使用',
                        suggestion: '文案符合要求，可正常使用',
                        position: 14
                    }
                ];
                break;
            default:
                originalText = "No data available";
                optimizedText = "No data available";
                issues = [];
        }
    }
    
    // 保存到全局状态
    currentState.originalText = originalText;
    currentState.optimizedText = optimizedText;
    currentState.issues = issues;
    currentState.extra = (record && record.extra) ? record.extra : {};
    // 设置上一个视图为个人中心，以便返回按钮正确显示
    currentState.lastView = 'profile';
    
    // 显示结果
    displayResult(originalText, optimizedText, issues, currentState.extra);
    
    // 跳转到审查报告页面
    switchView('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // 显示提示
    if (issues.length > 0) {
        const highCount = issues.filter(i => i.riskLevel === 'high').length;
        const mediumCount = issues.filter(i => i.riskLevel === 'medium').length;
        showToast(`已加载历史审查报告，发现${highCount}个高风险问题，${mediumCount}个中风险问题`);
    } else {
        showToast('已加载历史审查报告，未发现问题');
    }
}

// 显示审查结果
function displayResult(original, optimized, issues, extra) {
    extra = extra || {};
    
    // 添加高亮
    const highlightedOriginal = highlightText(original, issues);
    elements.originalText.innerHTML = highlightedOriginal;
    
    // 优化后的文本
    const finalOptimized = extra.optimized_full_text || optimized;
    elements.optimizedText.innerHTML = escapeHtml(finalOptimized);
    
    // 显示审查摘要
    displayReviewSummary(extra);
    
    // 显示风险摘要
    displayRiskSummary(issues, extra);
    
    // 显示源文解析（如果有）
    displaySourceUnits(extra.source_units);
    
    // 显示问题列表
    displayIssuesList(issues, extra);
    
    // 显示备注
    if (extra.notes) {
        displayNotes(extra.notes);
    }
}

// 显示审查摘要
function displayReviewSummary(extra) {
    let summaryEl = document.getElementById('review-summary');
    if (!summaryEl) {
        summaryEl = document.createElement('div');
        summaryEl.id = 'review-summary';
        summaryEl.className = 'review-summary-box';
        const riskSummaryEl = elements.riskSummary;
        if (riskSummaryEl && riskSummaryEl.parentNode) {
            riskSummaryEl.parentNode.insertBefore(summaryEl, riskSummaryEl.nextSibling);
        }
    }
    
    if (!extra.summary && !extra.target_country && !extra.product_type) {
        summaryEl.style.display = 'none';
        return;
    }
    
    summaryEl.style.display = 'block';
    const isRecommended = extra.is_recommended_for_listing;
    const overallRisk = extra.overall_risk_level || '';
    
    summaryEl.innerHTML = `
        <div class="summary-header">
            <i class="fas fa-info-circle"></i>
            <span>审查摘要</span>
        </div>
        <div class="summary-meta">
            ${extra.target_country ? `<span><strong>目标国家：</strong>${extra.target_country}</span>` : ''}
            ${extra.product_type ? `<span><strong>纺织品种类：</strong>${extra.product_type}</span>` : ''}
            ${extra.input_language ? `<span><strong>输入语言：</strong>${extra.input_language}</span>` : ''}
            ${extra.rewrite_language ? `<span><strong>改写语言：</strong>${extra.rewrite_language}</span>` : ''}
        </div>
        ${overallRisk ? `<p class="summary-risk-level"><strong>综合风险：</strong><span class="risk-badge ${getOverallRiskClass(overallRisk)}">${overallRisk}</span> ${isRecommended === false ? '<span class="risk-badge high">不建议上架</span>' : isRecommended === true ? '<span class="risk-badge safe">建议上架</span>' : ''}</p>` : ''}
        ${extra.summary ? `<p class="summary-text">${escapeHtml(extra.summary)}</p>` : ''}
    `;
}

function getOverallRiskClass(risk) {
    if (!risk) return 'safe';
    if (risk.includes('高') || risk.toLowerCase().includes('high')) return 'high';
    if (risk.includes('中') || risk.toLowerCase().includes('medium')) return 'medium';
    if (risk.includes('低') || risk.toLowerCase().includes('low')) return 'low';
    return 'safe';
}

// 显示源文解析
function displaySourceUnits(sourceUnits) {
    let el = document.getElementById('source-units');
    if (!el) {
        el = document.createElement('div');
        el.id = 'source-units';
        el.className = 'source-units-box';
        const summaryEl = document.getElementById('review-summary');
        if (summaryEl && summaryEl.parentNode) {
            summaryEl.parentNode.insertBefore(el, summaryEl.nextSibling);
        }
    }
    
    if (!sourceUnits || sourceUnits.length === 0) {
        el.style.display = 'none';
        return;
    }
    
    el.style.display = 'block';
    el.innerHTML = `
        <div class="source-units-header">
            <i class="fas fa-language"></i>
            <span>原文解析（${sourceUnits.length}个片段）</span>
        </div>
        <div class="source-units-list">
            ${sourceUnits.map(u => `
                <div class="source-unit-item">
                    <span class="source-unit-id">${u.source_unit_id || ''}</span>
                    <span class="source-unit-text">${escapeHtml(u.original_text || '')}</span>
                    <span class="source-unit-meaning">${escapeHtml(u.meaning_zh || '')}</span>
                </div>
            `).join('')}
        </div>
    `;
}

// 显示备注
function displayNotes(notes) {
    let el = document.getElementById('review-notes');
    if (!el) {
        el = document.createElement('div');
        el.id = 'review-notes';
        el.className = 'review-notes-box';
        const issuesEl = elements.issuesList;
        if (issuesEl && issuesEl.parentNode) {
            issuesEl.parentNode.insertBefore(el, issuesEl.nextSibling);
        }
    }
    
    el.innerHTML = `
        <div class="notes-header">
            <i class="fas fa-comment-dots"></i>
            <span>审查备注</span>
        </div>
        <p>${escapeHtml(notes)}</p>
    `;
}

// HTML转义
function escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function displayRiskSummary(issues, extra) {
    elements.riskSummary.innerHTML = '';
    
    const counts = {
        high: issues.filter(i => i.riskLevel === 'high' || (i.risk_level && (i.risk_level.includes('高') || i.risk_level.toLowerCase().includes('high')))).length,
        medium: issues.filter(i => i.riskLevel === 'medium' || (i.risk_level && (i.risk_level.includes('中') || i.risk_level.toLowerCase().includes('medium')))).length,
        low: issues.filter(i => i.riskLevel === 'low' || (i.risk_level && (i.risk_level.includes('低') || i.risk_level.toLowerCase().includes('low')))).length
    };
    
    if (issues.length === 0) {
        elements.riskSummary.innerHTML = '<span class="risk-badge safe"><i class="fas fa-check-circle"></i> 未发现问题，文案合规</span>';
        return;
    }
    
    if (counts.high > 0) {
        elements.riskSummary.innerHTML += `<span class="risk-badge high">高危 ${counts.high}</span>`;
    }
    if (counts.medium > 0) {
        elements.riskSummary.innerHTML += `<span class="risk-badge medium">中危 ${counts.medium}</span>`;
    }
    if (counts.low > 0) {
        elements.riskSummary.innerHTML += `<span class="risk-badge low">提示 ${counts.low}</span>`;
    }
}

function displayIssuesList(issues, extra) {
    elements.issuesList.innerHTML = '';
    
    if (issues.length === 0) {
        elements.issuesList.innerHTML = '<p style="color: var(--text-secondary); padding: 2rem; text-align: center;">未发现任何问题，您的文案符合合规要求 ✓</p>';
        return;
    }
    
    // 兼容新旧两种格式的风险等级
    const getRisk = (issue) => {
        if (issue.riskLevel) return issue.riskLevel;
        if (issue.risk_level) {
            if (issue.risk_level.includes('高') || issue.risk_level.toLowerCase().includes('high')) return 'high';
            if (issue.risk_level.includes('中') || issue.risk_level.toLowerCase().includes('medium')) return 'medium';
            if (issue.risk_level.includes('低') || issue.risk_level.toLowerCase().includes('low')) return 'low';
        }
        return 'medium';
    };
    
    // 按风险等级排序
    const sortedIssues = [...issues].sort((a, b) => {
        const riskOrder = { high: 0, medium: 1, low: 2 };
        return riskOrder[getRisk(a)] - riskOrder[getRisk(b)];
    });
    
    sortedIssues.forEach(issue => {
        const issueEl = document.createElement('div');
        const risk = getRisk(issue);
        issueEl.className = `issue-item ${risk}-risk`;
        
        // 兼容新旧字段
        const exactQuote = issue.exact_quote || issue.wrongWord || issue.matchedWord || '';
        const quoteMeaning = issue.quote_meaning_zh || '';
        const problemPosition = issue.problem_position || '';
        const riskType = issue.risk_type || issue.type || '文化合规';
        const culturalBackground = issue.cultural_background || issue.description || '';
        const reason = issue.reason || '';
        const ragEvidence = issue.rag_evidence || '';
        const modificationSuggestion = issue.modification_suggestion || issue.suggestion || '请根据描述修改相关文案';
        const suggestedRewrite = issue.suggested_rewrite || '';
        const sourceUnitId = issue.source_unit_id || '';
        
        const riskEmoji = risk === 'high' ? '🔴 ' : risk === 'medium' ? '🟡 ' : '🟢 ';
        
        issueEl.innerHTML = `
            <div class="issue-header" onclick="toggleIssue(this)">
                <div class="issue-title">
                    <span class="issue-type" style="color: var(--${risk}-risk)">${riskEmoji}${sourceUnitId ? '['+sourceUnitId+'] ' : ''}${escapeHtml(riskType)}</span>
                </div>
                <span class="issue-risk">${getRiskLabel(risk)} <i class="fas fa-chevron-down"></i></span>
            </div>
            <div class="issue-content collapsed">
                ${exactQuote ? `<p><strong>问题原文：</strong><span class="quote-text">"${escapeHtml(exactQuote)}"</span>${quoteMeaning ? ` <span class="quote-meaning">（${escapeHtml(quoteMeaning)}）</span>` : ''}</p>` : ''}
                ${problemPosition ? `<p><strong>问题位置：</strong>${escapeHtml(problemPosition)}</p>` : ''}
                <p><strong>风险等级：</strong>${riskEmoji}${getRiskLabel(risk)}</p>
                ${culturalBackground ? `<p><strong>文化背景：</strong>${escapeHtml(culturalBackground)}</p>` : ''}
                ${reason ? `<p><strong>问题原因：</strong>${escapeHtml(reason)}</p>` : ''}
                ${ragEvidence ? `<details class="rag-details"><summary>RAG证据参考</summary><p>${escapeHtml(ragEvidence)}</p></details>` : ''}
                <div class="suggestion-box">
                    <p><strong>修改建议：</strong>${escapeHtml(modificationSuggestion)}</p>
                </div>
                ${suggestedRewrite ? `<div class="rewrite-box"><p><strong>建议改写：</strong><span class="rewrite-text">${escapeHtml(suggestedRewrite)}</span></p></div>` : ''}
            </div>
        `;
        
        elements.issuesList.appendChild(issueEl);
    });
}

function getRiskLabel(risk) {
    const labels = {
        high: '高危',
        medium: '中危',
        low: '提示'
    };
    return labels[risk] || risk;
}

function toggleIssue(header) {
    const content = header.nextElementSibling;
    content.classList.toggle('collapsed');
    const icon = header.querySelector('.fa-chevron-down');
    if (content.classList.contains('collapsed')) {
        icon.style.transform = '';
    } else {
        icon.style.transform = 'rotate(180deg)';
    }
}

// ===================================
// 案例库渲染
// ===================================

function renderCases() {
    const container = document.getElementById('cases-container');
    container.innerHTML = '';
    
    TYPICAL_CASES.forEach(case_ => {
        const card = document.createElement('div');
        card.className = 'case-card';
        
        let issuesHtml = '';
        case_.issues.forEach(issue => {
            const riskClass = issue.risk === 'high' ? 'high-risk' : issue.risk === 'medium' ? 'medium-risk' : 'low-risk';
            issuesHtml += `
                <div class="issue-item ${riskClass}">
                    <div class="issue-header">
                        <div class="issue-title">
                            <span class="issue-type">${issue.type}</span>
                        </div>
                        <span class="issue-risk">${getRiskLabel(issue.risk)}</span>
                    </div>
                    <div class="issue-content">
                        <p><strong>问题：</strong>${issue.description}</p>
                        <div class="suggestion-box">
                            <p><strong>建议：</strong>${issue.suggestion}</p>
                        </div>
                    </div>
                </div>
            `;
        });
        
        card.innerHTML = `
            <div class="case-header">
                <span class="case-title">${case_.title}</span>
            </div>
            <div class="case-comparison">
                <div class="case-column">
                    <h4><i class="fas fa-times-circle"></i> 原文</h4>
                    <div class="case-text">${case_.original}</div>
                </div>
                <div class="case-column">
                    <h4><i class="fas fa-check-circle"></i> 优化后</h4>
                    <div class="case-text">${case_.optimized}</div>
                </div>
            </div>
            <div class="case-issues">
                <h4>问题详情</h4>
                ${issuesHtml}
            </div>
        `;
        
        container.appendChild(card);
    });
}

// 渲染历史会话记录
function renderHistoryRecords() {
    const container = document.getElementById('review-history');
    const countElement = document.getElementById('history-count');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    HISTORY_RECORDS.forEach(record => {
        const item = document.createElement('div');
        item.className = 'history-item';
        item.dataset.recordId = record.id;
        
        const issueText = record.issueCount > 0 ? `发现 ${record.issueCount} 个问题` : '未发现问题';
        
        item.innerHTML = `
            <div class="history-content">
                <p class="history-text">${record.text}</p>
                <p class="history-meta">${record.countryName} · ${issueText}</p>
            </div>
        `;
        
        container.appendChild(item);
    });
    
    if (countElement) {
        countElement.textContent = HISTORY_RECORDS.length;
    }
}

// 保存审查报告到历史记录
function saveToHistory(text, country, issues, productType) {
    // 获取当前时间
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day} ${hours}:${minutes}`;
    
    // 获取国家名称
    const countryName = getCountryName(country);
    
    // 确定状态
    const highCount = issues.filter(i => i.riskLevel === 'high').length;
    const mediumCount = issues.filter(i => i.riskLevel === 'medium').length;
    let status, statusText;
    if (highCount > 0) {
        status = 'high';
        statusText = '已优化';
    } else if (mediumCount > 0) {
        status = 'medium';
        statusText = '已优化';
    } else if (issues.length > 0) {
        status = 'low';
        statusText = '已优化';
    } else {
        status = 'safe';
        statusText = '合规';
    }
    
    // 创建新记录
    const newRecord = {
        id: `${country}-${Date.now()}`,
        text: text.length > 100 ? text.substring(0, 100) + '...' : text,
        country: country,
        countryName: countryName,
        productType: productType || '',
        date: dateStr,
        issueCount: issues.length,
        status: status,
        statusText: statusText,
        originalText: text,
        optimizedText: currentState.optimizedText,
        issues: issues,
        extra: currentState.extra || {}
    };
    
    // 添加到历史记录开头（最新的在最前面）
    HISTORY_RECORDS.unshift(newRecord);
    
    // 限制历史记录数量（最多20条）
    if (HISTORY_RECORDS.length > 20) {
        HISTORY_RECORDS.pop();
    }
    
    // 更新历史记录显示（如果当前在个人中心页面）
    if (currentState.currentView === 'profile') {
        renderHistoryRecords();
        showToast('历史记录已更新');
    }
    
    console.log('审查报告已保存到历史记录，当前记录数:', HISTORY_RECORDS.length);
}

// ===================================
// 数据统计
// ===================================

let countryChart = null;
let typeChart = null;

function updateStats() {
    // 数字动画
    animateValue('total-checks', 0, STATS_DATA.totalChecks, 1000);
    animateValue('issues-found', 0, STATS_DATA.issuesFound, 1000);
    animateValue('high-risk-count', 0, STATS_DATA.highRiskCount, 1000);
    const avg = STATS_DATA.totalChecks > 0 ? (STATS_DATA.issuesFound / STATS_DATA.totalChecks).toFixed(1) : 0;
    animateValue('avg-fixes', 0, parseFloat(avg), 1000);
    
    // 更新图表
    updateCharts();
}

function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    const range = end - start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        obj.textContent = current.toFixed(end % 1 === 0 ? 0 : 1);
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            obj.textContent = typeof end === 'number' && end % 1 !== 0 ? end.toFixed(1) : end;
            clearInterval(timer);
        }
    }, stepTime);
}

function updateCharts() {
    const countryCtx = document.getElementById('country-chart').getContext('2d');
    const typeCtx = document.getElementById('type-chart').getContext('2d');
    
    // 国家分布数据
    const countryLabels = [];
    const countryData = [];
    const countryColors = [
        '#2563eb', '#0ea5e9', '#10b981', '#f59e0b', 
        '#ef4444', '#8b5cf6', '#ec4899', '#6b7280', '#14b8a6', '#7c3aed'
    ];
    
    Object.entries(STATS_DATA.countryDistribution)
        .sort((a, b) => b[1] - a[1])
        .forEach(([key, count]) => {
            if (count > 0) {
                countryLabels.push(KNOWLEDGE_BASE[key] ? KNOWLEDGE_BASE[key].name : key);
                countryData.push(count);
            }
        });
    
    // 问题类型分布
    const typeLabels = {
        spelling: '拼写错误',
        grammar: '语法错误',
        sensitive: '敏感词',
        cultural: '文化禁忌',
        religious: '宗教禁忌',
        political: '政治敏感',
        certification: '认证问题',
        platform_policy: '平台规则'
    };
    
    const typeLabelList = [];
    const typeDataList = [];
    const typeColors = ['#dc2626', '#f59e0b', '#0ea5e9', '#16a34a', '#8b5cf6', '#f97316', '#06b6d4', '#64748b'];
    
    Object.entries(STATS_DATA.typeDistribution)
        .sort((a, b) => b[1] - a[1])
        .forEach(([key, count]) => {
            typeLabelList.push(typeLabels[key] || key);
            typeDataList.push(count);
        });
    
    // 销毁旧图表
    if (countryChart) {
        countryChart.destroy();
    }
    if (typeChart) {
        typeChart.destroy();
    }
    
    countryChart = new Chart(countryCtx, {
        type: 'pie',
        data: {
            labels: countryLabels,
            datasets: [{
                data: countryData,
                backgroundColor: countryColors.slice(0, countryLabels.length),
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
    
    typeChart = new Chart(typeCtx, {
        type: 'doughnut',
        data: {
            labels: typeLabelList,
            datasets: [{
                data: typeDataList,
                backgroundColor: typeColors.slice(0, typeLabelList.length),
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// ===================================
// 事件绑定
// ===================================

function initEventListeners() {
    // 字符计数
    elements.textInput.addEventListener('input', updateCharCount);
    
    // 清空按钮
    elements.clearBtn.addEventListener('click', () => {
        elements.textInput.value = '';
        updateCharCount();
    });
    
    // 分析按钮
    elements.analyzeBtn.addEventListener('click', analyzeText);
    
    // 复制优化文案
    elements.copyBtn.addEventListener('click', () => {
        if (!currentState.optimizedText) {
            showToast('暂无优化文案');
            return;
        }
        navigator.clipboard.writeText(currentState.optimizedText).then(() => {
            showToast('优化文案已复制到剪贴板');
        }).catch(() => {
            // 降级方案
            const textArea = document.createElement('textarea');
            textArea.value = currentState.optimizedText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showToast('优化文案已复制到剪贴板');
        });
    });
    
    // 返回按钮点击事件
    elements.backBtn.addEventListener('click', () => {
        // 根据来源页面返回
        const targetView = currentState.lastView === 'profile' ? 'profile' : 'review';
        switchView(targetView);
        
        // 如果返回审查页面，聚焦输入框
        if (targetView === 'review') {
            elements.textInput.focus();
        }
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // 导航切换
    elements.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const viewName = link.dataset.view;
            switchView(viewName);
        });
    });
    
    // Hero CTA按钮点击事件（立即审查文案）
    const heroCta = document.querySelector('.hero-cta');
    if (heroCta) {
        heroCta.addEventListener('click', (e) => {
            e.preventDefault();
            const viewName = heroCta.dataset.view;
            switchView(viewName);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // 返回首页链接点击事件
    const backToHome = document.querySelector('.back-to-home');
    if (backToHome) {
        backToHome.addEventListener('click', (e) => {
            e.preventDefault();
            const viewName = backToHome.dataset.view;
            switchView(viewName);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // 审查记录点击事件（使用委托模式支持动态元素）
    document.addEventListener('click', (e) => {
        const historyItem = e.target.closest('.history-item');
        if (historyItem) {
            const recordId = historyItem.dataset.recordId;
            loadReviewReport(recordId);
        }
    });
    
    // 点击高亮问题，展开对应详情
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('highlight')) {
            const issueId = e.target.dataset.issueId;
            const issueItem = document.querySelector(`#issues-list .issue-item:nth-child(${parseInt(issueId) + 1})`);
            if (issueItem) {
                const content = issueItem.querySelector('.issue-content');
                const header = issueItem.querySelector('.issue-header');
                content.classList.remove('collapsed');
                const icon = header.querySelector('.fa-chevron-down');
                icon.style.transform = 'rotate(180deg)';
                issueItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
    
    // 回车键触发审查
    elements.textInput.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            analyzeText();
        }
    });
}

// ===================================
// 初始化
// ===================================

function init() {
    updateCharCount();
    initEventListeners();
    renderCases();
    renderHistoryRecords();
    
    // 显示初始统计
    if (currentState.currentView === 'stats') {
        updateStats();
    }
}

// ===================================
// 滚动动画
// ===================================

// 检测元素是否在视口中
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    // 元素顶部进入视口的80%时触发
    return rect.top < windowHeight * 0.85;
}

// 更新滚动动画
function updateScrollAnimations() {
    const animateElements = document.querySelectorAll('.scroll-animate, .fade-in, .slide-in-left, .slide-in-right, .scale-in');
    
    animateElements.forEach(element => {
        if (isInViewport(element)) {
            element.classList.remove('hidden');
            element.classList.add('active');
        }
    });
}

// 页面加载完成后立即检查一次
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(updateScrollAnimations, 100);
});

// 滚动时检查
window.addEventListener('scroll', updateScrollAnimations);

// 启动应用
init();