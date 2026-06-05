# 东南亚纺织品出口文化禁忌与法规 RAG 知识库
> 用途：导入 Dify 知识库，服务于 AI 语义复核模块。每条记录建议作为单独 chunk。

## TH-CULT-001｜泰国｜王室相关表达与符号高度敏感
- 国家：Thailand / 泰国
- 类型：cultural_taboo
- 风险等级：high
- 风险类型：royal_political_risk
- 内容：泰国市场中，涉及 king, queen, royal, crown, palace, monarchy, royal emblem, heir, regent 等王室相关词汇、图案或暗示，应作为高风险线索。纺织品文案、图案、包装和广告中不应调侃、贬低、戏仿或商业化使用王室形象、王冠、王室徽章、王室相关数字梗或政治隐喻。若产品名或宣传语出现 royal-inspired, king pattern, queen style, crown blessing 等，应要求人工复核。
- 关键词：king, queen, royal, crown, monarchy, palace, royal emblem, heir, regent, 112
- 触发示例：royal-inspired blanket; king crown pattern scarf; queen blessing home textile
- 建议动作：删除或替换王室相关表达，改为 neutral, elegant, classic, premium, heritage-inspired 等中性词；避免王冠和王室徽章图案。
- 来源：Thai Criminal Code Section 112 translation; Thailand embassy country profile

## TH-CULT-002｜泰国｜佛教符号与神圣图像不得用于不敬场景
- 国家：Thailand / 泰国
- 类型：cultural_taboo
- 风险等级：high
- 风险类型：religious_cultural_risk
- 内容：泰国多数民众信仰佛教，佛像、佛头、僧侣、寺庙、经文、莲花等宗教元素在商业纺织品中需谨慎。若 Buddha, monk, temple, sacred, holy, blessing, prayer 等词或图案出现在脚垫、地毯、浴巾、内衣、床品等身体接触或低位使用场景，容易被视为不敬。
- 关键词：Buddha, monk, temple, sacred, holy, prayer, blessing, lotus, 佛像, 僧侣, 寺庙
- 触发示例：Buddha floor mat; sacred temple towel; monk pattern underwear
- 建议动作：删除宗教词汇和图案；改为 geometric pattern, floral pattern, oriental-style pattern 等中性描述；若保留宗教文化元素，需人工复核。
- 来源：Royal Thai Consulate profile on religion; general Buddhist cultural sensitivity rule

## TH-LAW-001｜泰国｜广告不得虚假、夸大、误导或损害社会文化
- 国家：Thailand / 泰国
- 类型：regulation
- 风险等级：medium
- 风险类型：advertising_consumer_protection
- 内容：泰国消费者保护法规定，广告不得包含对消费者不公平、可能对社会整体产生不良影响的陈述，包括虚假或夸大陈述、导致消费者误解商品或服务重要要素的陈述、鼓励违法或不道德行为或有损国家文化的陈述。纺织品文案中的 best, No.1, guaranteed, miracle, 100% safe 等绝对化宣传应触发复核。
- 关键词：best, No.1, guaranteed, miracle, 100% safe, false, exaggerated, misleading, national culture
- 触发示例：No.1 Thai royal textile; guaranteed miracle healing blanket
- 建议动作：将绝对化营销词替换为客观材质、工艺、尺寸和使用场景描述；保留可证明的事实。
- 来源：Thailand Consumer Protection Act B.E.2522 Section 22

## ID-CULT-001｜印度尼西亚｜伊斯兰相关词汇、清真、祈祷、猪皮等敏感组合需重点复核
- 国家：Indonesia / 印度尼西亚
- 类型：cultural_taboo
- 风险等级：high
- 风险类型：religious_cultural_risk
- 内容：印尼为穆斯林人口众多市场。文案涉及 Allah, Muhammad, mosque, Quran, prayer, halal, haram, pork, pigskin, blessed, sacred 等宗教词汇时需高度谨慎。将伊斯兰术语与不洁、玩笑、低俗、脚垫、浴巾、内衣等产品场景组合，可能造成宗教冒犯。若使用 halal 一词宣传纺织品或消费品，应核验是否具备合规依据。
- 关键词：Allah, Muhammad, mosque, Quran, prayer, halal, haram, pork, pigskin, sacred, blessed
- 触发示例：halal prayer towel fashion; Allah pattern rug; pigskin halal leather label
- 建议动作：避免将宗教词汇用于普通营销；若涉及 halal 声称，要求证书或删除；使用 neutral, breathable, soft, modest-style 等中性表达。
- 来源：BPJPH halal product assurance; Indonesian Advertising Code of Ethics

## ID-CULT-002｜印度尼西亚｜不得贬低宗教、民族、传统文化或特定族群
- 国家：Indonesia / 印度尼西亚
- 类型：cultural_taboo
- 风险等级：medium
- 风险类型：ethnic_social_risk
- 内容：印尼广告伦理要求广告不得冒犯或贬低国家尊严、宗教信仰、道德伦理、传统文化、种族或利益群体。纺织品文案不得把某民族、宗教或地方文化作为笑料、刻板印象或低级梗；不得将宗教仪式、传统服饰、地方图腾作为夸张营销噱头。
- 关键词：race, ethnicity, religion, tradition, culture, ritual, joke, stereotype, discrimination
- 触发示例：funny Muslim pattern; tribal primitive design; ritual magic cloth
- 建议动作：删除嘲讽、低俗或刻板化表达；使用尊重性来源描述，如 traditional-inspired geometric motif，但避免冒用特定族群神圣符号。
- 来源：Indonesian Advertising Code of Ethics

## ID-LAW-001｜印度尼西亚｜清真认证和 halal 声称需谨慎核验
- 国家：Indonesia / 印度尼西亚
- 类型：regulation
- 风险等级：medium
- 风险类型：halal_regulatory_risk
- 内容：印尼设有 BPJPH 负责清真产品保障。涉及食品、化妆品、化学产品、生物产品、消费品等类别的 halal 声称，需要核验是否属于强制认证或是否具备有效证书。纺织品虽不一定全部属于高频强制类，但若文案主动使用 halal、sharia-compliant、Islamic certified 等词，应触发证据核验。
- 关键词：halal, sharia, certified halal, Islamic certified, BPJPH, JPH
- 触发示例：halal certified fabric; sharia-compliant blanket
- 建议动作：若无证书，删除 halal/certified 等声称；如确有证书，在上架前保存认证材料并核验适用范围。
- 来源：BPJPH, Law No. 33 of 2014 concerning Halal Product Assurance

## MY-CULT-001｜马来西亚｜商业广告原则上不得利用宗教获取商业利益
- 国家：Malaysia / 马来西亚
- 类型：cultural_taboo
- 风险等级：high
- 风险类型：religious_cultural_risk
- 内容：马来西亚内容准则明确指出，广告中原则上禁止以任何形式使用宗教，以维护宗教神圣性和敏感性，避免商业利用、制造恐惧或不和谐。文案中出现 holy, sacred, blessed by, Quran, Allah, mosque, halal miracle, religious testimonial 等，应触发高优先级复核。
- 关键词：Allah, Quran, mosque, holy, sacred, blessed, religious testimonial, halal miracle, cleric, preacher
- 触发示例：blessed Islamic bedding; holy Quran pattern scarf; cleric recommended textile
- 建议动作：删除宗教权威背书、圣书关联和神圣化营销；改为材质、工艺、舒适度、设计风格等中性描述。
- 来源：Malaysia Content Code 2022, Abuse of Religion

## MY-CULT-002｜马来西亚｜避免种族、宗教、文化、性别等歧视或冒犯
- 国家：Malaysia / 马来西亚
- 类型：cultural_taboo
- 风险等级：medium
- 风险类型：ethnic_social_risk
- 内容：马来西亚内容准则要求内容不得含有基于种族、宗教、文化、民族、国籍、性别、年龄等方面的辱骂、歧视或贬损材料。纺织品广告中的族群刻板印象、贬低性描述、将宗教或民族作为玩笑或低俗梗，均应触发复核。
- 关键词：race, religion, culture, ethnicity, national origin, gender, discrimination, offensive, stereotype
- 触发示例：funny Malay style; cheap immigrant pattern; primitive ethnic cloth
- 建议动作：改为客观、中性和尊重的描述；避免把族群作为质量、审美或身份标签。
- 来源：Malaysia Content Code 2022, non-discrimination and decency

## MY-LAW-001｜马来西亚｜广告不得造成严重或广泛冒犯，并应诚实真实
- 国家：Malaysia / 马来西亚
- 类型：regulation
- 风险等级：medium
- 风险类型：advertising_decency_truthfulness
- 内容：马来西亚内容准则要求广告不得含有可能造成严重或广泛冒犯的内容，尤其应避免在种族、宗教、性别、性取向、身心障碍等方面造成冒犯；广告内容还应遵守诚实和真实性原则。纺织品文案中的绝对化承诺、虚假产地、虚假认证、冒犯性图像均应复核。
- 关键词：serious offence, race, religion, truthfulness, false claim, misleading, certified, guaranteed
- 触发示例：guaranteed halal miracle fabric; 100% official royal approved cloth
- 建议动作：保留可证明信息；删除无法证明的认证、权威背书和绝对化功效。
- 来源：Malaysia Content Code 2022

## VN-CULT-001｜越南｜不得违背越南传统、历史、文化、道德和良好习俗
- 国家：Vietnam / 越南
- 类型：cultural_taboo
- 风险等级：medium
- 风险类型：national_culture_risk
- 内容：越南广告法框架禁止违背越南传统、历史、文化、道德和良好习俗的广告内容。纺织品文案中涉及越战、国家领袖、国旗、政治符号、历史冲突、民族贬低、低俗化传统服饰等，应触发人工复核。
- 关键词：Vietnam war, national flag, Ho Chi Minh, communist, revolution, traditional costume, offensive, customs, history
- 触发示例：Vietnam war victory fashion scarf; funny national flag blanket; sexy ao dai costume
- 建议动作：避免使用政治历史冲突、国旗国徽、国家领袖和低俗化传统服饰；改为中性地域风格描述。
- 来源：Vietnam Advertising Law, WIPO Lex

## VN-LAW-001｜越南｜越南广告中的外语文字比例和呈现需注意
- 国家：Vietnam / 越南
- 类型：regulation
- 风险等级：medium
- 风险类型：advertising_language_format
- 内容：越南广告法对包含越南语和外语的广告有格式要求：外语字号不得超过越南语的四分之三，并应置于越南语下方；在广播电视等视听媒体中，越南语应先于外语。若系统用于越南本地广告投放或本地化页面，应提示用户补充越南语版本并遵守呈现要求。
- 关键词：Vietnamese language, foreign language, font size, advertising format, localization
- 触发示例：English-only Vietnam ad page; large English slogan above Vietnamese text
- 建议动作：如面向越南本地广告投放，生成越南语优先版本；外语作为辅助信息。
- 来源：Vietnam Law No.16/2012/QH13 on Advertising, WIPO Lex

## VN-LAW-002｜越南｜广告内容需真实，不得误导消费者
- 国家：Vietnam / 越南
- 类型：regulation
- 风险等级：medium
- 风险类型：advertising_truthfulness
- 内容：越南广告法及后续修订强调广告活动的法律框架和线上广告治理。对于纺织品，应避免虚假材质、虚假认证、夸大功能、绝对化功效承诺、未经许可使用人物或组织背书。
- 关键词：misleading, false claim, certified, official, No.1, best, guaranteed, online advertising
- 触发示例：No.1 official Vietnam textile; guaranteed healing blanket
- 建议动作：将宣传语改为可验证属性，如 cotton percentage, size, color, washing instruction, use case。
- 来源：Vietnam Advertising Law and 2025 amendment summaries

## SG-CULT-001｜新加坡｜不得损害种族与宗教和谐
- 国家：Singapore / 新加坡
- 类型：cultural_taboo
- 风险等级：medium
- 风险类型：racial_religious_harmony
- 内容：新加坡广告和广播监管强调广告不得损害国家利益、公共秩序、国家和谐，也不得冒犯种族或宗教群体。多族群社会中，涉及 Chinese, Malay, Indian, Muslim, Hindu, Christian, Buddhist 等族群或宗教表达时，要避免刻板印象、贬低、玩笑化和挑衅性内容。
- 关键词：race, religion, harmony, Malay, Chinese, Indian, Muslim, Hindu, Christian, Buddhist, stereotype
- 触发示例：funny Malay prayer cloth; Indian style cheap fabric; racial joke T-shirt
- 建议动作：保持中性、尊重和包容；删除族群笑话、宗教梗和刻板化描述。
- 来源：IMDA TV and Radio Advertising and Sponsorship Code; SCAP

## SG-LAW-001｜新加坡｜国旗、国徽、国歌等国家象征的商业使用需谨慎
- 国家：Singapore / 新加坡
- 类型：regulation
- 风险等级：medium
- 风险类型：national_symbols_and_advertising
- 内容：新加坡 SCAP 相关法规清单提到 National Emblems 相关规定，公共展示国家旗帜、国徽、国歌以及受法律禁止的外国旗帜用于商业用途受到规制。纺织品图案或广告若使用新加坡国旗、国徽、国歌歌词、国家象征，应触发高优先级人工复核。
- 关键词：Singapore flag, state crest, national anthem, national emblem, Merlion, commercial use
- 触发示例：Singapore flag blanket; state crest towel; national anthem slogan shirt
- 建议动作：避免在商品图案和广告中使用国旗国徽国歌；改用城市风景、颜色灵感或中性图案。
- 来源：ASAS SCAP statutes chapter; National Emblems controls

## SG-LAW-002｜新加坡｜广告应合法、体面、诚实、真实
- 国家：Singapore / 新加坡
- 类型：regulation
- 风险等级：medium
- 风险类型：advertising_decency_truthfulness
- 内容：新加坡广告准则强调广告应合法、体面、诚实、真实，并尊重公平竞争。纺织品文案中的虚假产地、虚假认证、绝对化功能、无法证明的环保或安全声明，应触发复核。
- 关键词：legal, decent, honest, truthful, false claim, misleading, certified, eco-friendly, safe
- 触发示例：100% official certified eco fabric without proof; guaranteed allergy cure bedding
- 建议动作：要求证据；删除无法证明的认证、环保和健康功效承诺。
- 来源：Singapore Code of Advertising Practice

## PH-CULT-001｜菲律宾｜广告应尊重宗教信仰、社区传统和身份
- 国家：Philippines / 菲律宾
- 类型：cultural_taboo
- 风险等级：medium
- 风险类型：religious_and_community_sensitivity
- 内容：菲律宾广告标准要求广告尊重宗教信仰，敏感对待不同宗教或世俗信念、风俗、文化、传统、历史背景和菲律宾各社区身份。纺织品文案不得嘲讽宗教、传统服饰、地方文化或少数群体。
- 关键词：religion, church, cross, saint, holy, Catholic, community, tradition, culture, identity
- 触发示例：funny saint pattern blanket; holy cross bath towel; tribal costume joke
- 建议动作：避免戏仿宗教人物和符号；将文化元素改为客观设计来源描述并进行人工复核。
- 来源：Ad Standards Council Philippines Guidebook

## PH-LAW-001｜菲律宾｜不得贬损、嘲讽或攻击宗教、文化、习俗、传统及群体
- 国家：Philippines / 菲律宾
- 类型：regulation
- 风险等级：medium
- 风险类型：disparagement_and_discrimination
- 内容：菲律宾广告标准禁止直接或间接贬损、嘲讽、批评或攻击任何人、群体或社会部门，尤其基于性别、社会经济阶层、宗教、民族、种族或国籍。恶意嘲讽或贬低宗教、文化、习俗和传统被禁止。
- 关键词：disparage, ridicule, religion, culture, customs, traditions, ethnicity, race, nationality
- 触发示例：cheap tribal people style; religion joke shirt; mocking Filipino tradition print
- 建议动作：删除贬低、戏仿和攻击性表达；使用尊重、客观、非歧视性描述。
- 来源：Ad Standards Council Philippines, Other Standards of Presentation

## BN-CULT-001｜文莱｜伊斯兰、王室和清真相关表达高度敏感
- 国家：Brunei / 文莱
- 类型：cultural_taboo
- 风险等级：high
- 风险类型：islamic_cultural_risk
- 内容：文莱官方宗教为伊斯兰教，广告实践中需要特别注意宗教、王室、国家政策、道德标准和社会行为。纺织品文案涉及 Allah, Quran, mosque, halal, sharia, Sultan, royal 等，应触发严格复核，避免商业化、戏仿、贬低或未经证实的清真声称。
- 关键词：Allah, Quran, mosque, halal, sharia, Sultan, royal, race, religion
- 触发示例：Sultan royal scarf; Allah pattern blanket; halal certified textile without proof
- 建议动作：删除或核验证据；避免宗教和王室符号商业化使用。
- 来源：Brunei Broadcasting Code of Practice for Advertising; religious freedom reports

## BN-LAW-001｜文莱｜广告代码关注国家政策、种族宗教、道德标准、儿童广告等
- 国家：Brunei / 文莱
- 类型：regulation
- 风险等级：medium
- 风险类型：broadcast_advertising_code
- 内容：文莱广播法规附表中包含广告实践准则，覆盖 National Policy, Race and Religion, Moral Standards/Social Behaviour, Children and Advertising 等主题。面向文莱的广告应对宗教、种族、王室、国家政策和道德标准保持谨慎。
- 关键词：national policy, race, religion, moral standards, social behaviour, children advertising
- 触发示例：religion joke fabric; anti-social slogan T-shirt
- 建议动作：对宗教、种族、国家与道德敏感表达进行人工复核；避免低俗、冒犯和政治化表达。
- 来源：Laws of Brunei, Broadcasting Code of Practice for Advertising

## MM-LAW-001｜缅甸｜消费者保护法关注错误陈述、虚假广告和夸大宣传
- 国家：Myanmar / 缅甸
- 类型：regulation
- 风险等级：medium
- 风险类型：consumer_protection_advertising
- 内容：缅甸消费者保护法将通过错误陈述或虚假广告误导消费者的行为视为欺诈相关风险；法律资料还列出未说明产品危害、未经许可使用人物或事件、无证据夸大商品服务信息等广告问题。纺织品文案应避免虚假材质、夸大功效、未经授权人物背书。
- 关键词：false advertisement, misleading, exaggerating without proof, warranty, permission, hazards
- 触发示例：guaranteed medical healing fabric; endorsed by celebrity without permission
- 建议动作：删除无法证明的功效和背书；保留客观商品属性。
- 来源：Myanmar Consumer Protection Law 2019 translations and NCPP

## KH-CULT-001｜柬埔寨｜佛教、王室、吴哥和国家象征需谨慎
- 国家：Cambodia / 柬埔寨
- 类型：cultural_taboo
- 风险等级：medium
- 风险类型：buddhist_and_national_culture
- 内容：柬埔寨市场中，佛教符号、僧侣、寺庙、吴哥窟/Angkor、王室、国旗和民族历史元素用于商业纺织品时应谨慎。不得低俗化、脚垫化、内衣化或戏仿神圣与国家象征。由于可用英文法规资料有限，系统应将此类内容标为需人工复核。
- 关键词：Buddha, monk, temple, Angkor, royal, king, flag, national emblem
- 触发示例：Angkor temple bath mat; Buddha underwear print; royal Cambodia blanket
- 建议动作：避免神圣和国家象征用于不敬产品；改用 neutral geometric / floral / heritage-inspired 表达。
- 来源：General cultural risk rule; requires further local legal verification

## LA-CULT-001｜老挝｜佛教、白伞王国历史和国家象征需谨慎
- 国家：Laos / 老挝
- 类型：cultural_taboo
- 风险等级：medium
- 风险类型：buddhist_and_national_culture
- 内容：老挝文化受佛教和历史王国传统影响。纺织品文案如出现 Buddha, monk, temple, sacred, prayer, national flag, white parasol, million elephants 等，应结合产品场景复核。将佛教符号用于脚垫、浴巾、内衣、低俗广告或夸张营销，可能构成文化冒犯。
- 关键词：Buddha, monk, temple, sacred, prayer, flag, white parasol, million elephants
- 触发示例：Buddha floor mat; sacred monk towel; million elephants royal underwear
- 建议动作：删除神圣或国家象征，改为中性纹样和材质描述；本地法规需人工二次确认。
- 来源：Lao tourism/cultural identity sources; requires further local legal verification

## TL-CULT-001｜东帝汶｜天主教、国家身份和历史冲突相关表达需谨慎
- 国家：Timor-Leste / 东帝汶
- 类型：cultural_taboo
- 风险等级：medium
- 风险类型：religious_and_national_identity
- 内容：东帝汶天主教文化影响较强，且国家历史身份敏感。纺织品文案若涉及 Catholic, cross, saint, holy, independence, colonial, national flag, political conflict 等，应避免戏仿、低俗化和政治化。由于本项目优先市场不一定覆盖东帝汶，此条作为扩展规则。
- 关键词：Catholic, cross, saint, holy, independence, national flag, colonial, political conflict
- 触发示例：holy cross bath towel; independence war fashion scarf
- 建议动作：尊重宗教和历史身份；避免把宗教符号用于低位或不敬产品场景。
- 来源：General cultural risk rule; requires local legal verification
