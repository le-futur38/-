# 织鉴AI合规审查平台

基于AI的跨境电商合规审查平台，帮助企业审查出口到东南亚市场的农产品和纺织品文案。

## 功能特点

- 🤖 AI智能审查：接入Dify AI大模型进行智能合规分析
- 🌍 多市场支持：支持泰国、印尼、越南、马来西亚、新加坡等市场
- 📋 智能检测：识别宗教禁忌、文化禁忌、政治敏感、颜色禁忌等问题
- 💾 历史记录：自动保存审查记录，方便追溯管理
- 🎨 美观界面：深蓝色主题，带滚动动画效果

## 项目结构

```
zhijian-web/
├── index.html          # 主页面
├── style.css           # 样式文件
├── app.js              # 前端逻辑
├── data.js             # 数据文件
├── server.js           # 后端服务器（保护API Key）
├── package.json        # Node.js依赖
├── .env                # 环境变量（包含API Key，不上传GitHub）
├── .env.example        # 环境变量示例
├── .gitignore          # Git忽略文件
└── README.md           # 项目说明
```

## 本地开发

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env`，并填入您的API Key：

```bash
cp .env.example .env
```

### 3. 启动服务器

```bash
npm start
```

访问 http://localhost:3000

## 部署到GitHub Pages

由于GitHub Pages只能托管静态文件，需要将后端部署到其他地方（如Railway、Render、Vercel等）。

### 方案一：使用代理服务（推荐）

1. **前端部署到GitHub Pages**
   - 将代码推送到GitHub仓库
   - 在仓库设置中启用GitHub Pages
   - 访问 `https://您的用户名.github.io/仓库名/`

2. **后端部署到Railway**
   - 创建Railway账号
   - 连接GitHub仓库
   - 部署 server.js
   - 配置环境变量（API Key）
   - 获取API端点URL

3. **修改前端API地址**
   - 在 app.js 中将 `/api/analyze` 改为您的Railway API地址

### 方案二：使用Vercel Serverless Functions

1. 创建 `api/analyze.js` 文件
2. 部署到Vercel
3. 修改前端API调用地址

## API接口

### POST /api/analyze

审查文案

**请求体：**
```json
{
  "text": "待审查的文案内容",
  "country": "目标市场代码（thailand/indonesia/vietnam/malaysia/singapore）"
}
```

**响应：**
```json
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
      "position": 在原文中的位置
    }
  ]
}
```

## 安全说明

⚠️ **重要提示**：
- `.env` 文件包含真实的API Key，已添加到 `.gitignore`，不会上传到GitHub
- API Key仅存在于后端服务器，前端代码不包含任何敏感信息
- 建议定期更换API Key
- 生产环境建议添加API调用频率限制

## 技术栈

- **前端**：HTML5 + CSS3 + JavaScript（原生）
- **后端**：Node.js + Express
- **AI服务**：Dify.ai API
- **部署**：GitHub Pages + Railway/Render

## 许可证

MIT License

## 联系方式

如有问题，请联系：zhijian@163.com
