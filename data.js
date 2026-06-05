// 知识库数据：东南亚各国合规规则
const KNOWLEDGE_BASE = {
    indonesia: {
        name: '印度尼西亚',
        religious: [
            {
                item: '伊斯兰相关',
                description: '印尼87%人口信奉伊斯兰教，严禁使用亵渎宗教的词汇'
            },
            {
                item: '猪肉相关',
                description: '严禁使用猪、狗图案及相关制品，避免使用"pig"、"pork"等词汇'
            },
            {
                item: '古兰经',
                description: '严禁将古兰经经文用于商业广告'
            },
            {
                item: '清真认证要求',
                description: '2026年10月17日起，所有纺织产品强制BPJPH清真认证，覆盖服装、家纺、针织品等'
            },
            {
                item: '动物源性原料',
                description: '含动物源性成分（皮革、羊毛）审核更严格，必须来自清真屠宰场'
            }
        ],
        cultural: [
            {
                item: '国旗国徽',
                description: '严禁使用印尼国徽"神鹰"、总统形象进行商业宣传'
            },
            {
                item: '服装暴露',
                description: '女性服装不能露出手臂和膝盖，领口不能过低'
            },
            {
                item: '左手',
                description: '印尼文化中左手被认为不洁，避免提及左手相关的贬义描述'
            },
            {
                item: '爪哇皮影戏',
                description: '爪哇皮影戏图案需确认版权，谨慎使用'
            }
        ],
        political: [
            {
                item: '东帝汶问题',
                description: '避免涉及敏感政治议题'
            },
            {
                item: '分离主义',
                description: '严禁任何涉及分离主义的表述'
            }
        ],
        color: [
            {
                item: '白色',
                description: '白色在印尼文化中与死亡和哀悼相关'
            },
            {
                item: '蓝色',
                description: '某些地区蓝色与禁忌相关'
            }
        ],
        platform: [
            {
                item: 'Shopee/TikTok Shop要求',
                description: '女性服饰领口不能过低，手臂膝盖需遮盖；禁止带有"猪"、"狗"图案的T恤'
            },
            {
                item: '斋月营销',
                description: '斋月期间调整营销策略，晚上8点-凌晨2点为购物高峰'
            }
        ],
        certification: [
            {
                item: 'SNI认证',
                description: '需符合SNI国家标准，标签需用印尼文标注'
            },
            {
                item: '标签语言',
                description: '标签需使用印尼文+英文双语标注'
            }
        ],
        textile: [
            {
                item: '清真生产要求',
                description: '生产、仓储、运输需设置独立区域与专用设备，与非清真产品物理隔离'
            },
            {
                item: '成分溯源',
                description: '需留存完整的生产、仓储、运输溯源记录'
            }
        ]
    },
    thailand: {
        name: '泰国',
        religious: [
            {
                item: '佛教',
                description: '泰国95%人口信奉佛教，严禁亵渎佛像、僧侣'
            },
            {
                item: '佛陀',
                description: '不得使用"Buddha"作为产品名称或商标'
            },
            {
                item: '寺庙礼仪',
                description: '进入寺庙需脱鞋、衣着得体（遮肩盖膝）'
            },
            {
                item: '佛像禁忌',
                description: '佛像神圣不可侵犯，严禁商业亵渎'
            }
        ],
        cultural: [
            {
                item: '王室相关',
                description: '泰国法律严禁亵渎王室，对王室相关元素零容忍，任何涉及王室的负面表述都违法'
            },
            {
                item: '王室徽章肖像',
                description: '禁止使用王室徽章、国王肖像'
            },
            {
                item: '头部',
                description: '头部被认为是神圣部位，避免触摸他人头部'
            },
            {
                item: '脚部',
                description: '脚被认为是不洁部位，避免使用脚部指向他人，鞋底不可对人'
            },
            {
                item: '僧侣禁忌',
                description: '避免使用僧侣形象、寺庙图案；女性不可与僧侣握手或邻坐'
            }
        ],
        political: [
            {
                item: '君主制',
                description: '严禁批评泰国君主制'
            },
            {
                item: '王室成员',
                description: '任何对王室成员的不尊重言论都违法'
            },
            {
                item: '话题禁忌',
                description: '避免谈论王室及政治敏感话题'
            }
        ],
        color: [
            {
                item: '红色',
                description: '红色与政治派系相关，需谨慎使用'
            },
            {
                item: '黄色',
                description: '黄色代表王室，商业使用需谨慎'
            },
            {
                item: '褐色',
                description: '忌讳褐色'
            }
        ],
        platform: [
            {
                item: '王室零容忍',
                description: '平台对王室相关元素零容忍，违规直接下架'
            },
            {
                item: '宗教商品',
                description: '禁止销售佛牌及宗教法器（假冒或未经开光）'
            }
        ],
        certification: [
            {
                item: '本地纱线新规',
                description: '2026年3月新规，纺织品本地纱线含量需达50%以上'
            },
            {
                item: '标签语言',
                description: '标签需使用泰文标注'
            }
        ],
        clothing: [
            {
                item: '正式场合要求',
                description: '正式场合需着深色西装，女性裙长过膝'
            }
        ]
    },
    vietnam: {
        name: '越南',
        religious: [
            {
                item: '宗教宣传',
                description: '严禁在商业产品中进行宗教传教活动'
            }
        ],
        cultural: [
            {
                item: '统一问题',
                description: '避免涉及南北分裂相关的敏感表述'
            },
            {
                item: '龙图腾',
                description: '龙在越南文化中正面，但需注意使用场景'
            },
            {
                item: '行为礼仪',
                description: '忌讳拍别人肩膀或用手指指人'
            },
            {
                item: '莲花图案',
                description: '莲花图案需确认非政府专属标识'
            },
            {
                item: '数字禁忌',
                description: '忌讳数字4（谐音"死"）'
            },
            {
                item: '颜色禁忌',
                description: '部分民族忌讳白色，认为不吉利'
            }
        ],
        political: [
            {
                item: '越南共产党',
                description: '严禁批评越南共产党和国家领导人'
            },
            {
                item: '南海问题',
                description: '避免涉及南海争议领土表述'
            },
            {
                item: '政治敏感',
                description: '禁止政治敏感图案、书籍和物品'
            },
            {
                item: '国旗领导人',
                description: '避免使用越南国旗、胡志明肖像'
            }
        ],
        color: [
            {
                item: '黑色',
                description: '黑色与死亡和哀悼相关'
            }
        ],
        platform: [
            {
                item: '商品限制',
                description: '禁止二手内衣；商品图片中避免出现非标准版越南地图'
            }
        ],
        certification: [
            {
                item: '标签要求',
                description: '标签需用越南文标注完整成分、原产地、进口商信息'
            }
        ],
        clothing: [
            {
                item: '商务着装',
                description: '商务场合不穿无袖上衣、短裤'
            }
        ]
    },
    malaysia: {
        name: '马来西亚',
        religious: [
            {
                item: '伊斯兰教',
                description: '60%人口信奉伊斯兰教，严禁亵渎宗教'
            },
            {
                item: '猪肉',
                description: '禁止猪形象产品，避免使用"pig"、"pork"等词汇'
            },
            {
                item: '清真认证',
                description: '清真认证为"黄金标准"，尤其食品、化妆品、保健品；未获得清真认证不得声称产品为清真'
            },
            {
                item: '印度教神像',
                description: '印度教神像禁止商用'
            },
            {
                item: '宗教符号',
                description: '禁止与伊斯兰教义冲突的商品（如十字架装饰）'
            }
        ],
        cultural: [
            {
                item: '马来族',
                description: '避免涉及种族歧视性言论'
            },
            {
                item: '左手',
                description: '马来文化中左手被认为不洁，递物、进食需使用右手'
            },
            {
                item: '进入礼仪',
                description: '进入清真寺或当地人家需脱鞋'
            },
            {
                item: '斋月注意',
                description: '非穆斯林斋月期间避免公共场合饮食'
            },
            {
                item: '数字禁忌',
                description: '忌讳0、4、13'
            }
        ],
        political: [
            {
                item: '君主制',
                description: '严禁批评马来王室'
            },
            {
                item: '种族关系',
                description: '避免煽动种族矛盾，不要谈论宗教和人种'
            }
        ],
        color: [
            {
                item: '黄色',
                description: '黄色是王室专用颜色，慎用于商务场景'
            },
            {
                item: '包装禁忌',
                description: '忌讳黄色、白色和黑色包装纸'
            }
        ],
        platform: [
            {
                item: '酒精标注',
                description: '含酒精化妆品需注明"无酒精"'
            },
            {
                item: '清真品类',
                description: '清真认证品类避免动物图案'
            }
        ],
        clothing: [
            {
                item: '着装要求',
                description: '女性服装不能露出手臂和膝盖，领口不能过低'
            }
        ]
    },
    philippines: {
        name: '菲律宾',
        religious: [
            {
                item: '天主教',
                description: '80%以上人口信奉天主教，避免亵渎宗教'
            }
        ],
        cultural: [
            {
                item: '家庭观念',
                description: '菲律宾重视家庭，避免贬低家庭价值'
            }
        ],
        political: [
            {
                item: '国家领导人',
                description: '避免恶意批评国家领导人'
            },
            {
                item: '南部问题',
                description: '避免涉及棉兰老穆斯林自治区敏感问题'
            }
        ]
    },
    singapore: {
        name: '新加坡',
        cultural: [
            {
                item: '种族和谐',
                description: '严禁种族歧视言论，法律严惩'
            },
            {
                item: '宗教宽容',
                description: '维持宗教和谐，严禁煽动宗教矛盾'
            },
            {
                item: '话题禁忌',
                description: '忌谈宗教与政治、种族摩擦'
            },
            {
                item: '数字禁忌',
                description: '忌讳4、7、8、13、37、69'
            },
            {
                item: '颜色禁忌',
                description: '视紫色、黑色为不吉利，黑、白、黄为禁忌色'
            }
        ],
        political: [
            {
                item: '法律尊重',
                description: '避免侮辱政府和司法系统'
            }
        ],
        platform: [
            {
                item: '商品禁令',
                description: '禁止口香糖（医疗用途除外）、电子烟；对食品进口管控严格，需进口许可证'
            }
        ]
    },
    myanmar: {
        name: '缅甸',
        political: [
            {
                item: '民族问题',
                description: '避免涉及罗兴亚人等敏感民族问题'
            },
            {
                item: '军方',
                description: '政治局势敏感，避免涉及争议话题'
            }
        ],
        religious: [
            {
                item: '佛教',
                description: '多数人口信奉佛教，尊重宗教信仰'
            },
            {
                item: '神牛信仰',
                description: '敬黄牛为"神牛"，不能伤害、役使'
            }
        ],
        cultural: [
            {
                item: '头部禁忌',
                description: '不可触摸他人头部，包括小孩'
            }
        ]
    },
    cambodia: {
        name: '柬埔寨',
        cultural: [
            {
                item: '王室',
                description: '尊重柬埔寨王室，避免不敬言论'
            },
            {
                item: '吴哥窟',
                description: '吴哥窟是国家象征，不得用于不当商业用途'
            },
            {
                item: '头部禁忌',
                description: '不可触摸他人头部，包括小孩'
            },
            {
                item: '颜色禁忌',
                description: '忌讳白色，认为不吉利'
            }
        ],
        religious: [
            {
                item: '佛教',
                description: '95%人口信奉佛教，尊重宗教信仰'
            }
        ]
    },
    laos: {
        name: '老挝',
        political: [
            {
                item: '执政党',
                description: '严禁批评老挝人民革命党'
            }
        ],
        religious: [
            {
                item: '佛教',
                description: '多数人口信奉佛教，尊重宗教信仰'
            }
        ],
        cultural: [
            {
                item: '头部禁忌',
                description: '不可触摸他人头部，包括小孩'
            }
        ]
    },
    brunei: {
        name: '文莱',
        religious: [
            {
                item: '伊斯兰教',
                description: '国教为伊斯兰教，严禁使用亵渎宗教的词汇'
            },
            {
                item: '猪肉酒精',
                description: '禁止猪肉、酒精及非清真屠宰的动物制品'
            },
            {
                item: '猪狗禁忌',
                description: '严禁使用猪、狗图案及相关制品'
            }
        ],
        cultural: [
            {
                item: '左手禁忌',
                description: '左手被视为不洁，递物、进食、握手均需使用右手'
            },
            {
                item: '头部禁忌',
                description: '头部神圣不可触摸，尤其避免摸小孩头部'
            },
            {
                item: '着装要求',
                description: '女性服装需遮盖手臂和膝盖，领口不能过低'
            }
        ]
    }
};

// 敏感词库：纺织行业和跨境电商常见违禁词
const SENSITIVE_WORDS = {
    // 通用违禁词
    general: [
        { word: 'free shipping', risk: 'low', type: 'platform_policy', description: '部分平台对"包邮"表述有规范要求' },
        { word: 'original', risk: 'medium', type: 'ip', description: '声称"原创"可能涉及知识产权纠纷' },
        { word: 'guarantee', risk: 'low', type: 'platform_policy', description: '保证类表述需要符合当地消费者保护法' },
        { word: '100% cotton', risk: 'low', type: 'claim', description: '需要确保产品确实符合描述，避免虚假宣传' },
        { word: 'organic', risk: 'medium', type: 'certification', description: '有机宣称需要相应认证证书' },
        { word: 'handmade', risk: 'low', type: 'claim', description: '需确保产品确实符合手工制作描述' }
    ],
    // 宗教敏感词
    religious: [
        { word: 'allah', risk: 'high', type: 'religious', description: '在非宗教产品中使用安拉之名可能冒犯穆斯林' },
        { word: 'pig', risk: 'high', type: 'religious', description: '猪肉相关词汇冒犯伊斯兰教信仰' },
        { word: 'pork', risk: 'high', type: 'religious', description: '猪肉相关词汇冒犯伊斯兰教信仰' },
        { word: 'buddha', risk: 'high', type: 'religious', description: '未经授权将佛陀用于商业可能冒犯佛教信仰' },
        { word: 'koran', risk: 'high', type: 'religious', description: '古兰经不得用于商业广告' },
        { word: 'quran', risk: 'high', type: 'religious', description: '古兰经不得用于商业广告' }
    ],
    // 政治敏感词
    political: [
        { word: 'king', risk: 'medium', type: 'political', description: '涉及王室词汇需谨慎，部分国家对王室有特殊保护' },
        { word: 'queen', risk: 'medium', type: 'political', description: '涉及王室词汇需谨慎，部分国家对王室有特殊保护' },
        { word: 'royal', risk: 'medium', type: 'political', description: '王室相关表述可能需要授权' }
    ]
};

// 拼写错误常见示例（用于演示）
const COMMON_SPELLING_ERRORS = [
    { wrong: 'cottonn', correct: 'cotton', type: 'spelling' },
    { wrong: 'beautifull', correct: 'beautiful', type: 'spelling' },
    { wrong: 'handmaded', correct: 'handmade', type: 'spelling' },
    { wrong: 'orgnic', correct: 'organic', type: 'spelling' },
    { wrong: 'batik', correct: 'batik', type: 'correct' }, // 正确示例
    { wrong: 'silkk', correct: 'silk', type: 'spelling' },
    { wrong: 'qualitty', correct: 'quality', type: 'spelling' },
    { wrong: 'naturall', correct: 'natural', type: 'spelling' },
    { wrong: 'premuim', correct: 'premium', type: 'spelling' },
    { wrong: 'fabrick', correct: 'fabric', type: 'spelling' }
];

// 典型案例数据
const TYPICAL_CASES = [
    {
        id: 1,
        title: '印尼市场蜡染T恤文案',
        country: 'indonesia',
        countryName: '印度尼西亚',
        original: 'Sabuk Kulit Babi Premium - Dibuat Tangan di Bali',
        optimized: 'Sabuk Kulit Asli Premium - Dibuat Tangan di Bali',
        issues: [
            {
                type: '宗教禁忌',
                risk: 'high',
                description: '"Babi"（猪）一词冒犯印尼穆斯林占多数人口的宗教信仰',
                suggestion: '改为"Kulit Asli"（真皮）即可'
            }
        ]
    },
    {
        id: 2,
        title: '泰国市场丝绸围巾',
        country: 'thailand',
        countryName: '泰国',
        original: 'ผ้ากันหนาวไหมราชวงศ์สีเหลืองสวยงาม - คุณภาพดีที่สุด',
        optimized: 'ผ้ากันหนาวไหมสีทองสวยงาม - คุณภาพดีที่สุด',
        issues: [
            {
                type: '文化禁忌',
                risk: 'high',
                description: '黄色是泰国王室专属颜色，未经授权商业使用不妥',
                suggestion: '改为"สีทอง"（金色）替代"สีเหลืองราชวงศ์"'
            }
        ]
    },
    {
        id: 3,
        title: '马来西亚棉麻衬衫',
        country: 'malaysia',
        countryName: '马来西亚',
        original: 'Baju Kain Kapas Murni 100% - Bahan Organik',
        optimized: 'Baju Kain Kapas Murni 100% - Bahan Organik',
        issues: [
            {
                type: '合规建议',
                risk: 'low',
                description: '马来语文案正确',
                suggestion: '文案符合要求'
            }
        ]
    },
    {
        id: 4,
        title: '越南传统服饰',
        country: 'vietnam',
        countryName: '越南',
        original: 'Áo Dài Việt Nam Thật Chính Hãng - May Tay Với Lụa Tự Nhiên',
        optimized: 'Áo Dài Việt Nam Thật Chính Hãng - May Tay Với Lụa Tự Nhiên',
        issues: [
            {
                type: '合规建议',
                risk: 'low',
                description: '越南语文案正确',
                suggestion: '文案符合要求'
            }
        ]
    }
];

// 统计数据（初始值）
let STATS_DATA = {
    totalChecks: 248,
    issuesFound: 187,
    highRiskCount: 42,
    countryDistribution: {
        indonesia: 65,
        thailand: 58,
        vietnam: 45,
        malaysia: 32,
        philippines: 20,
        singapore: 15,
        myanmar: 8,
        cambodia: 3,
        laos: 2
    },
    typeDistribution: {
        spelling: 68,
        sensitive: 45,
        cultural: 42,
        religious: 32
    }
};

// 历史会话简要数据（点击时通过 Dify API 还原完整报告）
let HISTORY_RECORDS = [
    {
        id: 'thailand-1',
        text: 'ผ้ากันหนาวไหมราชวงศ์สีเหลือง พร้อมลายหมูน่ารัก',
        country: 'thailand',
        countryName: '泰国',
        productType: '服装',
        date: '2026-06-01 14:30',
        issueCount: 3,
        status: 'high',
        statusText: '高风险',
        isDemo: true
    },
    {
        id: 'malaysia-1',
        text: 'Beg kulit babi terbaru, promosi eksklusif untuk bulan puasa',
        country: 'malaysia',
        countryName: '马来西亚',
        productType: '包袋布艺',
        date: '2026-06-03 20:16',
        issueCount: 3,
        status: 'high',
        statusText: '高风险',
        isDemo: false,
        conversationId: null
    },
    {
        id: 'singapore-1',
        text: 'Silk Scarf Traditional Pattern Luxury Collection',
        country: 'singapore',
        countryName: '新加坡',
        productType: '服饰配件',
        date: '2026-05-28 16:45',
        issueCount: 0,
        status: 'safe',
        statusText: '合规',
        isDemo: true
    },
    {
        id: 'indonesia-1',
        text: 'Kaos Batik Motif Naga - Bahan Katun',
        country: 'indonesia',
        countryName: '印度尼西亚',
        productType: '童装',
        date: '2026-05-20 11:20',
        issueCount: 2,
        status: 'medium',
        statusText: '中风险',
        isDemo: true
    },
    {
        id: 'vietnam-1',
        text: 'Áo Khoác Len Nông Thôn Việt Nam',
        country: 'vietnam',
        countryName: '越南',
        productType: '家用纺织品',
        date: '2026-05-15 15:00',
        issueCount: 0,
        status: 'safe',
        statusText: '合规',
        isDemo: true
    },
    {
        id: 'thailand-2',
        text: 'กระโปรงผ้าฝ้ายสีแดง สไตล์โมเดิร์น',
        country: 'thailand',
        countryName: '泰国',
        productType: '床上用品',
        date: '2026-05-10 10:30',
        issueCount: 1,
        status: 'low',
        statusText: '低风险',
        isDemo: true
    }
];