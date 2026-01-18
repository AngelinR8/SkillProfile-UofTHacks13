# OneProfile 开发路线图

> 本文档详细拆解了完成 OneProfile demo 所需的所有步骤。按顺序逐项完成，每完成一项可以在前面打 ✅。

---

## 📋 当前项目状态

### ✅ 已完成
- 前端 UI 设计（7个页面全部完成）
- 数据库模型定义（7个 Mongoose 模型）
- 后端 API 基础架构（Express 服务器、错误处理）
- CRUD API 端点（所有实体的 GET/POST/PUT/DELETE）
- `/api/vault/stats` 统计端点
- Dashboard 和 Identity Vault 统计数字的动态显示
- 完整的技术文档（6个 MD 文档）

### ❌ 待完成
- Identity Vault 前端数据加载和 CRUD 操作
- Profile 页面数据加载
- 所有 AI 功能集成（Gemini API）
- 简历生成功能
- 面试模拟功能
- Social Media Assistant 后端集成

---

## 🎯 第一阶段：完善基础数据交互（优先度：★★★★★）

> **目标**：让 Identity Vault 和 Profile 页面能够真正从数据库读取和修改数据。

---

### Task 1.1: Identity Vault - 加载教育经历数据

**任务描述**：
- 在 `identity_vault.html` 页面加载时，调用 `GET /api/education` 获取所有教育经历
- 动态渲染到 "🎓 DEGREES" 卡片中
- 如果没有数据，显示空状态提示

**涉及文件**：
- `front-end/identity_vault.html`
- `front-end/script.js`（可能需要添加新函数）

**实现步骤**：
1. 在 `identity_vault.html` 的 `<script>` 中添加 `loadEducationEntries()` 函数
2. 使用 `fetch('http://localhost:5000/api/education')` 获取数据
3. 遍历返回的数据，创建 `vault-entry` DOM 元素
4. 将统计数字更新到标题中（如 "🎓 DEGREES (实际数量)"）
5. 在页面加载时调用此函数

**验收标准**：
- ✅ 页面打开时能看到数据库中的所有教育经历
- ✅ 统计数字正确显示
- ✅ 如果没有数据，显示 "No education entries yet"

---

### Task 1.2: Identity Vault - 加载工作经历数据

**任务描述**：
- 调用 `GET /api/experience` 获取所有工作经历
- 动态渲染到 "💼 EXPERIENCES" 卡片中

**涉及文件**：
- `front-end/identity_vault.html`
- `front-end/script.js`

**实现步骤**：
1. 添加 `loadExperienceEntries()` 函数
2. 调用 `GET /api/experience` API
3. 渲染数据到对应卡片
4. 更新标题中的统计数字

**验收标准**：
- ✅ 工作经历正确显示
- ✅ 统计数字正确

---

### Task 1.3: Identity Vault - 加载项目数据

**任务描述**：
- 调用 `GET /api/projects` 获取所有项目
- 动态渲染到 "🚀 PROJECTS" 卡片中

**涉及文件**：
- `front-end/identity_vault.html`

**实现步骤**：
1. 添加 `loadProjectEntries()` 函数
2. 调用 `GET /api/projects` API
3. 渲染数据

**验收标准**：
- ✅ 项目数据正确显示

---

### Task 1.4: Identity Vault - 加载技能数据

**任务描述**：
- 调用 `GET /api/skills` 获取所有技能
- 动态渲染到 "🛠️ SKILLS" 卡片中

**涉及文件**：
- `front-end/identity_vault.html`

**实现步骤**：
1. 添加 `loadSkillEntries()` 函数
2. 调用 `GET /api/skills` API
3. 渲染数据

**验收标准**：
- ✅ 技能数据正确显示

---

### Task 1.5: Identity Vault - 加载奖项数据

**任务描述**：
- 调用 `GET /api/awards` 获取所有奖项
- 动态渲染到 "🏆 AWARDS" 卡片中

**涉及文件**：
- `front-end/identity_vault.html`

**实现步骤**：
1. 添加 `loadAwardEntries()` 函数
2. 调用 `GET /api/awards` API
3. 渲染数据

**验收标准**：
- ✅ 奖项数据正确显示

---

### Task 1.6: Identity Vault - 实现“添加教育经历”功能

**任务描述**：
- 点击 "+ Add Degree" 按钮时，打开模态框
- 用户填写表单后，调用 `POST /api/education` 创建新条目
- 创建成功后，重新加载教育经历列表

**涉及文件**：
- `front-end/identity_vault.html`
- `front-end/script.js`

**实现步骤**：
1. 修改现有的 `confirmAdd` 按钮事件监听器
2. 判断当前是哪个类型的条目（通过按钮所在卡片的标识）
3. 如果是教育经历，收集表单数据（institution, degree, fieldOfStudy, startDate, endDate, gpa 等）
4. 调用 `POST /api/education`，body 包含必要字段
5. 成功后调用 `loadEducationEntries()` 刷新列表
6. 关闭模态框并清空表单

**验收标准**：
- ✅ 添加后新条目立即出现在页面上
- ✅ 统计数字自动更新
- ✅ 表单验证（必填字段）

---

### Task 1.7: Identity Vault - 实现“添加工作经历”功能

**任务描述**：
- 类似 Task 1.6，但调用 `POST /api/experience`

**涉及文件**：
- `front-end/identity_vault.html`
- `front-end/script.js`

**实现步骤**：
1. 扩展 `confirmAdd` 逻辑，支持工作经历类型
2. 收集公司、职位、日期、bullet points 等数据
3. 调用 `POST /api/experience`
4. 刷新列表

**验收标准**：
- ✅ 工作经历能成功添加

---

### Task 1.8: Identity Vault - 实现“添加项目”功能

**任务描述**：
- 调用 `POST /api/projects` 添加项目

**验收标准**：
- ✅ 项目能成功添加

---

### Task 1.9: Identity Vault - 实现“添加技能”功能

**任务描述**：
- 调用 `POST /api/skills` 添加技能

**验收标准**：
- ✅ 技能能成功添加

---

### Task 1.10: Identity Vault - 实现“添加奖项”功能

**任务描述**：
- 调用 `POST /api/awards` 添加奖项

**验收标准**：
- ✅ 奖项能成功添加

---

### Task 1.11: Identity Vault - 实现“编辑”功能

**任务描述**：
- 点击 "✏️ Edit" 按钮时，将条目变为可编辑状态（已经在前端实现）
- 点击 "💾 Save" 后，调用 `PUT /api/education/:id`（或其他对应端点）
- 更新成功后刷新列表

**涉及文件**：
- `front-end/script.js`

**实现步骤**：
1. 修改现有的编辑/保存逻辑
2. 在点击 "💾 Save" 时，收集编辑后的内容
3. 根据条目的 `data-id` 属性（需要在渲染时添加）确定要调用哪个 API
4. 调用对应的 `PUT` 端点
5. 成功后刷新对应类型的列表

**注意**：
- 需要在渲染时给每个 `vault-entry` 添加 `data-id` 和 `data-type` 属性
- 需要解析编辑后的 DOM 内容，转换为 API 所需的 JSON 格式

**验收标准**：
- ✅ 编辑后保存，数据库中的数据被更新
- ✅ 页面显示更新后的内容

---

### Task 1.12: Identity Vault - 实现“删除”功能

**任务描述**：
- 点击 "🗑️ Delete" 时，先确认
- 确认后调用 `DELETE /api/education/:id`（或其他对应端点）
- 删除成功后从页面移除该条目，并更新统计

**涉及文件**：
- `front-end/script.js`

**实现步骤**：
1. 修改现有的删除逻辑
2. 确认对话框（已有 `confirm()`）
3. 根据 `data-id` 和 `data-type` 确定要调用的 DELETE 端点
4. 调用对应的 `DELETE` API
5. 成功后从 DOM 中移除该条目
6. 重新加载统计数字（或手动减1）

**验收标准**：
- ✅ 删除后条目从页面消失
- ✅ 数据库中的数据被删除
- ✅ 统计数字自动更新

---

### Task 1.13: Identity Vault - 统一数据加载函数

**任务描述**：
- 创建一个 `loadAllVaultData()` 函数，统一调用所有类型的加载函数
- 在页面加载时调用一次
- 优化代码结构，避免重复

**涉及文件**：
- `front-end/identity_vault.html`

**实现步骤**：
1. 创建 `loadAllVaultData()` 函数
2. 在其中依次调用：`loadEducationEntries()`, `loadExperienceEntries()`, `loadProjectEntries()`, `loadSkillEntries()`, `loadAwardEntries()`
3. 在 `DOMContentLoaded` 时调用 `loadAllVaultData()`
4. 重新加载统计（已有 `loadVaultStats()` 函数）

**验收标准**：
- ✅ 页面加载时所有数据一次性加载完成

---

### Task 1.14: Profile 页面 - 加载用户数据

**任务描述**：
- 页面加载时调用 `GET /api/user/profile`
- 将用户信息填充到页面（姓名、邮箱、电话、位置、链接、简介等）

**涉及文件**：
- `front-end/profile.html`

**实现步骤**：
1. 添加 `loadUserProfile()` 函数
2. 调用 `GET /api/user/profile`
3. 更新页面各个位置的文本内容：
   - 姓名（.name-title）
   - 邮箱、电话、位置（.contact-row）
   - 链接（LinkedIn, GitHub 等）
   - About Me 部分的简介

**验收标准**：
- ✅ Profile 页面显示真实的用户数据

---

### Task 1.15: Profile 页面 - 实现编辑功能

**任务描述**：
- 点击 "Edit Info" 按钮时，打开编辑模态框
- 用户修改后，调用 `PUT /api/user/profile` 更新数据
- 更新成功后刷新页面显示

**涉及文件**：
- `front-end/profile.html`

**实现步骤**：
1. 创建编辑模态框（或复用现有的）
2. 填充当前用户数据到表单
3. 提交时调用 `PUT /api/user/profile`
4. 成功后调用 `loadUserProfile()` 刷新显示

**验收标准**：
- ✅ 可以成功更新用户信息
- ✅ 更新后页面立即显示新数据

---

## 🤖 第二阶段：AI 集成基础（优先度：★★★★☆）

> **目标**：配置 Gemini API，建立基础的 AI 调用机制。

---

### Task 2.1: 安装和配置 Gemini API SDK

**任务描述**：
- 安装 `@google/generative-ai` 包
- 在 `.env` 文件中配置 `GEMINI_API_KEY`
- 在 `back-end/src/index.js` 中导入并初始化 Gemini

**涉及文件**：
- `back-end/package.json`
- `back-end/.env`（需要创建）
- `back-end/src/index.js`

**实现步骤**：
1. 在 `back-end` 目录运行：`npm install @google/generative-ai`
2. 创建 `back-end/.env` 文件（如果还没有）
3. 添加 `GEMINI_API_KEY=your_api_key_here`
4. 在 `index.js` 中导入：`import { GoogleGenerativeAI } from "@google/generative-ai"`
5. 初始化：`const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)`

**验收标准**：
- ✅ 包安装成功
- ✅ 环境变量配置正确
- ✅ 没有导入错误

---

### Task 2.2: 创建 AI 服务工具函数

**任务描述**：
- 创建一个 `aiService.js` 文件，封装通用的 AI 调用函数
- 提供 `callGemini(prompt, options)` 函数

**涉及文件**：
- `back-end/src/aiService.js`（新建）

**实现步骤**：
1. 创建 `back-end/src/aiService.js`
2. 导入 Gemini 相关模块
3. 导出 `callGemini(prompt, modelName = 'gemini-pro')` 函数
4. 函数内部处理 API 调用、错误处理、返回结果

**代码结构**：
```javascript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function callGemini(prompt, modelName = 'gemini-pro') {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error(`AI service error: ${error.message}`);
  }
}
```

**验收标准**：
- ✅ 可以成功调用 Gemini API
- ✅ 错误处理完善

---

### Task 2.3: 测试 AI 服务

**任务描述**：
- 创建一个测试端点 `/api/test/ai`，验证 Gemini API 是否工作

**涉及文件**：
- `back-end/src/index.js`

**实现步骤**：
1. 在 `index.js` 中导入 `callGemini`
2. 创建 `GET /api/test/ai` 端点
3. 调用 `callGemini("Hello, respond with 'AI is working!'")`
4. 返回结果

**验收标准**：
- ✅ 访问 `/api/test/ai` 能收到 AI 的回复

---

## 💬 第三阶段：Social Media Assistant（优先度：★★★★☆）

> **目标**：实现进展更新处理和 LinkedIn 建议生成。

---

### Task 3.1: 创建“进展更新”API 端点

**任务描述**：
- 创建 `POST /api/progress/update` 端点
- 接收用户输入的原始文本
- 暂时只保存到 `ProgressUpdate` 模型，不做 AI 处理

**涉及文件**：
- `back-end/src/index.js`

**实现步骤**：
1. 创建 `POST /api/progress/update` 路由
2. 接收 `{ rawText: string }` 请求体
3. 创建 `ProgressUpdate` 记录，保存原始文本和 userId
4. 返回成功响应

**验收标准**：
- ✅ 可以通过 API 保存进展更新
- ✅ 数据保存到数据库

---

### Task 3.2: 实现实体提取 Prompt

**任务描述**：
- 设计 prompt，让 AI 从原始文本中提取：
  - 教育信息（学位、学校、日期等）
  - 工作经历（公司、职位、日期、成就等）
  - 项目（名称、描述、技术栈等）
  - 技能（技能名称、熟练度等）
  - 奖项（奖项名称、颁发机构等）

**涉及文件**：
- `back-end/src/aiPrompts.js`（新建）

**实现步骤**：
1. 创建 `back-end/src/aiPrompts.js`
2. 创建 `getEntityExtractionPrompt(rawText, existingVaultData)` 函数
3. 设计 prompt，要求 AI 以 JSON 格式返回提取的实体
4. 明确输出格式要求

**Prompt 示例结构**：
```
你是一个职业信息提取助手。分析以下文本，提取职业相关信息。

原始文本：
${rawText}

用户现有的 Identity Vault 数据：
${JSON.stringify(existingVaultData)}

请以 JSON 格式返回提取的实体：
{
  "education": [...],
  "experience": [...],
  "projects": [...],
  "skills": [...],
  "awards": [...]
}
```

**验收标准**：
- ✅ Prompt 设计清晰
- ✅ 输出格式规范

---

### Task 3.3: 实现进展更新的 AI 处理

**任务描述**：
- 在 `POST /api/progress/update` 中集成 AI 处理
- 调用实体提取 prompt
- 解析 AI 返回的 JSON，保存到对应的模型（EducationEntry, ExperienceEntry 等）

**涉及文件**：
- `back-end/src/index.js`
- `back-end/src/aiPrompts.js`
- `back-end/src/aiService.js`

**实现步骤**：
1. 获取用户现有的 Identity Vault 数据（所有类型的条目）
2. 调用 `getEntityExtractionPrompt()` 生成 prompt
3. 调用 `callGemini()` 获取 AI 响应
4. 解析 JSON 响应
5. 遍历提取的实体，创建对应的数据库记录
6. 保存 `ProgressUpdate` 记录（包含原始文本和提取的实体）

**验收标准**：
- ✅ 输入原始文本，能提取并保存实体到数据库
- ✅ 每个实体类型都能正确保存

---

### Task 3.4: 设计 LinkedIn 建议生成 Prompt

**任务描述**：
- 设计 prompt，让 AI 基于新的进展更新和现有数据，生成 LinkedIn 更新建议

**涉及文件**：
- `back-end/src/aiPrompts.js`

**实现步骤**：
1. 创建 `getLinkedInSuggestionsPrompt(newProgress, vaultData)` 函数
2. Prompt 需要生成四类建议：
   - **Posts**：动态内容，带话题标签
   - **Education**：教育经历更新
   - **Experience/Position**：工作经历更新
   - **Skills**：技能更新
3. 要求 AI 判断每类是否需要进行更新

**输出格式**：
```json
{
  "posts": {
    "shouldUpdate": true/false,
    "suggestions": ["..."]
  },
  "education": {
    "shouldUpdate": true/false,
    "suggestions": ["..."]
  },
  "experience": {
    "shouldUpdate": true/false,
    "suggestions": ["..."]
  },
  "skills": {
    "shouldUpdate": true/false,
    "suggestions": ["..."]
  }
}
```

**验收标准**：
- ✅ Prompt 能生成符合格式的建议

---

### Task 3.5: 创建 LinkedIn 建议生成 API

**任务描述**：
- 创建 `GET /api/linkedin/suggestions` 端点
- 调用 LinkedIn 建议生成 prompt
- 返回建议数据

**涉及文件**：
- `back-end/src/index.js`

**实现步骤**：
1. 创建 `GET /api/linkedin/suggestions` 路由
2. 可选：接收 `progressUpdateId` 参数（指定基于哪个进展更新生成）
3. 如果没有指定，获取最新的 `ProgressUpdate`
4. 调用 `getLinkedInSuggestionsPrompt()` 和 `callGemini()`
5. 解析并返回建议

**验收标准**：
- ✅ API 能返回 LinkedIn 建议

---

### Task 3.6: 前端集成 - Social Media Assistant 发送消息

**任务描述**：
- 修改 `social_media_assistant.html` 中的 `sendMessage()` 函数
- 发送消息到 `POST /api/progress/update`
- 显示加载状态和 AI 回复

**涉及文件**：
- `front-end/social_media_assistant.html`

**实现步骤**：
1. 修改 `sendMessage()` 函数
2. 收集用户输入
3. 调用 `POST /api/progress/update`，body: `{ rawText: message }`
4. 显示 AI 处理中的状态
5. 收到响应后，显示 AI 的回复（例如："我已经分析了你的进展，并提取了相关信息..."）
6. 调用生成建议的函数（下一步）

**验收标准**：
- ✅ 发送消息后能收到后端响应
- ✅ AI 回复显示在聊天框中

---

### Task 3.7: 前端集成 - 加载 LinkedIn 建议

**任务描述**：
- 在用户发送消息后，调用 `GET /api/linkedin/suggestions`
- 将建议填充到 LinkedIn 模块的各个 tab 中

**涉及文件**：
- `front-end/social_media_assistant.html`

**实现步骤**：
1. 创建 `loadLinkedInSuggestions()` 函数
2. 调用 `GET /api/linkedin/suggestions`
3. 根据返回的数据，更新四个 tab 的内容：
   - `#tab-posts` → Posts suggestions
   - `#tab-education` → Education suggestions
   - `#tab-experience` → Experience suggestions
   - `#tab-skills` → Skills suggestions
4. 如果 `shouldUpdate` 为 false，显示 "No update needed"
5. 更新 "NEW" badge 显示（如果有新建议）

**验收标准**：
- ✅ 建议正确显示在对应 tab 中
- ✅ 复制功能正常工作

---

## 📄 第四阶段：Smart Resume Builder（优先度：★★★☆☆）

> **目标**：实现根据职位描述生成定制简历。

---

### Task 4.1: 设计简历生成 Prompt

**任务描述**：
- 设计 prompt，让 AI 基于职位描述和 Identity Vault 数据生成简历

**涉及文件**：
- `back-end/src/aiPrompts.js`

**实现步骤**：
1. 创建 `getResumeGenerationPrompt(jobDescription, userProfile, vaultData)` 函数
2. Prompt 要求 AI 生成：
   - **Header**：姓名、联系方式、简短介绍（1-2句）
   - **Education**：相关教育经历，每个包含 degree + GPA、日期、3个 bullet points
   - **Experience**：最多3个相关经历，每个包含 title、日期、3个 bullet points
   - **Skills**：3-4个 bullet points，每个一行，简短

3. 强调简历要一页，内容要针对职位要求

**输出格式**：参考 `docs/resume-generation-schema.md`

**验收标准**：
- ✅ Prompt 设计清晰，能生成符合格式的简历

---

### Task 4.2: 创建简历生成 API

**任务描述**：
- 创建 `POST /api/resume/generate` 端点
- 接收职位描述（company, position, requirements）
- 获取用户资料和 Identity Vault 数据
- 调用简历生成 prompt
- 返回生成的简历内容

**涉及文件**：
- `back-end/src/index.js`

**实现步骤**：
1. 创建 `POST /api/resume/generate` 路由
2. 接收请求体：`{ company, position, requirements }`
3. 获取 `User` profile
4. 获取所有 Identity Vault 数据（education, experience, projects, skills, awards）
5. 调用 `getResumeGenerationPrompt()` 生成 prompt
6. 调用 `callGemini()` 获取 AI 响应
7. 解析 JSON 响应
8. 返回格式化的简历数据

**验收标准**：
- ✅ API 能返回结构化的简历数据

---

### Task 4.3: 前端集成 - 简历生成表单提交

**任务描述**：
- 修改 `smart_resume_builder.html` 中的表单提交逻辑
- 收集职位描述信息，发送到 `POST /api/resume/generate`

**涉及文件**：
- `front-end/smart_resume_builder.html`

**实现步骤**：
1. 找到表单提交按钮（或"Generate Resume"按钮）
2. 添加事件监听器
3. 收集表单数据（公司、职位、要求）
4. 调用 `POST /api/resume/generate`
5. 显示加载状态

**验收标准**：
- ✅ 表单能正确发送数据到后端

---

### Task 4.4: 前端集成 - 渲染生成的简历

**任务描述**：
- 接收 API 返回的简历数据
- 渲染到简历预览卡片中（Header, Education, Experience, Skills）

**涉及文件**：
- `front-end/smart_resume_builder.html`

**实现步骤**：
1. 在 Task 4.3 的回调中，处理 API 响应
2. 更新 `#resumeHeader` 部分（姓名、联系方式、简介）
3. 更新 `#educationSection`（遍历 education，创建对应的 HTML）
4. 更新 `#experienceSection`（遍历 experience，创建对应的 HTML）
5. 更新 `#skillsSection`（渲染技能 bullet points）
6. 显示 `#resumePreviewCard`（如果之前隐藏）

**验收标准**：
- ✅ 生成的简历正确显示在预览区域

---

### Task 4.5: 前端集成 - 简历下载功能（可选）

**任务描述**：
- 实现"Download PDF"和"Download DOCX"按钮功能
- 可以使用前端库（如 `html2pdf.js` 或 `jsPDF`）生成 PDF
- DOCX 功能可能需要后端支持（可选，不强制）

**涉及文件**：
- `front-end/smart_resume_builder.html`

**实现步骤**：
1. 安装 `jsPDF` 或其他 PDF 生成库
2. 创建函数将简历预览 HTML 转换为 PDF
3. 绑定到"Download PDF"按钮

**验收标准**：
- ✅ 可以下载 PDF 格式的简历

---

## 🎤 第五阶段：Interview Prep（优先度：★★★☆☆）

> **目标**：实现 AI 面试模拟器。

---

### Task 5.1: 设计面试问题生成 Prompt

**任务描述**：
- 设计 prompt，基于职位描述和用户资料生成个性化面试问题

**涉及文件**：
- `back-end/src/aiPrompts.js`

**实现步骤**：
1. 创建 `getInterviewQuestionPrompt(jobDescription, userProfile, conversationHistory)` 函数
2. Prompt 要求 AI ：
   - 根据职位要求生成相关问题
   - 考虑用户的背景和技能
   - 根据对话历史，生成后续问题（如果是对话中）
   - 或者生成开场问题（如果是首次）

**输出格式**：
```json
{
  "question": "问题文本",
  "type": "technical" | "behavioral" | "mixed"
}
```

**验收标准**：
- ✅ Prompt 能生成相关面试问题

---

### Task 5.2: 创建面试会话管理

**任务描述**：
- 创建面试会话模型（InterviewSession）或在内存中管理会话
- 创建 `POST /api/interview/start` 端点，开始新的面试会话
- 创建 `POST /api/interview/message` 端点，处理用户回答并生成下一个问题

**涉及文件**：
- `back-end/src/index.js`
- `back-end/models/InterviewSession.js`（可选，新建）

**实现步骤**：
1. 设计会话数据结构（sessionId, userId, jobDescription, conversationHistory, status）
2. 可以使用内存存储（Map）或数据库模型
3. `POST /api/interview/start`：
   - 接收 `{ jobDescription: {...} }`
   - 创建会话
   - 生成第一个问题
   - 返回 `{ sessionId, question }`
4. `POST /api/interview/message`：
   - 接收 `{ sessionId, userResponse }`
   - 获取会话历史
   - 调用 AI 生成下一个问题
   - 更新会话历史
   - 返回 `{ question }` 或 `{ interviewComplete: true }`

**验收标准**：
- ✅ 可以开始面试会话
- ✅ 可以连续问答

---

### Task 5.3: 设计面试反馈生成 Prompt

**任务描述**：
- 设计 prompt，基于整个面试对话生成反馈

**涉及文件**：
- `back-end/src/aiPrompts.js`

**实现步骤**：
1. 创建 `getInterviewFeedbackPrompt(conversationHistory, jobDescription, userProfile)` 函数
2. Prompt 要求 AI 生成：
   - **Score**：0-5 分评分
   - **Strengths**：优点列表
   - **Areas for Improvement**：需要改进的地方
   - **Recommended Actions**：建议行动

**输出格式**：参考 `docs/interview-schema.md`

**验收标准**：
- ✅ Prompt 能生成结构化的反馈

---

### Task 5.4: 创建面试结束和反馈 API

**任务描述**：
- 创建 `POST /api/interview/end` 端点
- 接收 sessionId，生成最终反馈

**涉及文件**：
- `back-end/src/index.js`

**实现步骤**：
1. 创建 `POST /api/interview/end` 路由
2. 获取会话历史
3. 调用 `getInterviewFeedbackPrompt()` 生成反馈
4. 调用 `callGemini()` 获取反馈
5. 解析并返回反馈数据
6. 更新会话状态为 "completed"

**验收标准**：
- ✅ 可以获取面试反馈

---

### Task 5.5: 前端集成 - 面试开始功能

**任务描述**：
- 修改 `interview_prep.html`，实现开始面试功能

**涉及文件**：
- `front-end/interview_prep.html`

**实现步骤**：
1. 找到职位描述输入框
2. 添加"Start Interview"按钮
3. 点击后收集职位描述信息
4. 调用 `POST /api/interview/start`
5. 保存 `sessionId`
6. 显示第一个问题在聊天框中
7. 启用聊天输入框

**验收标准**：
- ✅ 可以开始面试并看到第一个问题

---

### Task 5.6: 前端集成 - 面试对话功能

**任务描述**：
- 实现用户回答和 AI 提问的循环

**涉及文件**：
- `front-end/interview_prep.html`

**实现步骤**：
1. 修改 `sendMessage()` 函数
2. 用户输入回答后，调用 `POST /api/interview/message`
3. 显示用户回答
4. 显示 AI 的下一个问题
5. 如果返回 `interviewComplete: true`，显示结束提示

**验收标准**：
- ✅ 可以连续问答
- ✅ 对话流畅

---

### Task 5.7: 前端集成 - 显示面试反馈

**任务描述**：
- 面试结束时（AI 决定或用户点击结束），调用 `POST /api/interview/end`
- 显示反馈卡片（评分、优点、改进建议、行动建议）

**涉及文件**：
- `front-end/interview_prep.html`

**实现步骤**：
1. 添加"End Interview"按钮
2. 点击后调用 `POST /api/interview/end`
3. 显示 `.feedback-card`
4. 填充反馈内容：
   - 评分（星级显示）
   - 优点列表
   - 改进建议列表
   - 行动建议列表

**验收标准**：
- ✅ 反馈正确显示
- ✅ 所有反馈部分都有内容

---

## 🧪 第六阶段：测试和优化（优先度：★★☆☆☆）

---

### Task 6.1: 错误处理完善

**任务描述**：
- 在所有前端 API 调用中添加错误处理
- 显示用户友好的错误消息

**涉及文件**：
- 所有前端 HTML 文件

**验收标准**：
- ✅ API 错误时显示提示
- ✅ 网络错误有提示

---

### Task 6.2: 加载状态提示

**任务描述**：
- 在所有异步操作时显示加载状态（loading spinner 或文字）

**涉及文件**：
- 所有前端 HTML 文件

**验收标准**：
- ✅ 用户知道系统正在处理

---

### Task 6.3: 数据验证

**任务描述**：
- 前端表单验证（必填字段、格式检查）
- 后端 API 参数验证（已有部分，需要完善）

**验收标准**：
- ✅ 无效数据不会提交到后端

---

### Task 6.4: 环境变量配置文档

**任务描述**：
- 创建 `.env.example` 文件
- 更新 README 中的环境变量说明

**涉及文件**：
- `back-end/.env.example`（新建）
- `README.md`

**验收标准**：
- ✅ 新开发者可以根据文档配置环境

---

## 📝 完成清单

### 第一阶段：基础数据交互
- [ ] Task 1.1: 加载教育经历
- [ ] Task 1.2: 加载工作经历
- [ ] Task 1.3: 加载项目
- [ ] Task 1.4: 加载技能
- [ ] Task 1.5: 加载奖项
- [ ] Task 1.6: 添加教育经历
- [ ] Task 1.7: 添加工作经历
- [ ] Task 1.8: 添加项目
- [ ] Task 1.9: 添加技能
- [ ] Task 1.10: 添加奖项
- [ ] Task 1.11: 编辑功能
- [ ] Task 1.12: 删除功能
- [ ] Task 1.13: 统一数据加载
- [ ] Task 1.14: Profile 加载数据
- [ ] Task 1.15: Profile 编辑功能

### 第二阶段：AI 集成基础
- [ ] Task 2.1: 安装 Gemini SDK
- [ ] Task 2.2: 创建 AI 服务函数
- [ ] Task 2.3: 测试 AI 服务

### 第三阶段：Social Media Assistant
- [ ] Task 3.1: 进展更新 API
- [ ] Task 3.2: 实体提取 Prompt
- [ ] Task 3.3: AI 处理集成
- [ ] Task 3.4: LinkedIn 建议 Prompt
- [ ] Task 3.5: LinkedIn 建议 API
- [ ] Task 3.6: 前端发送消息
- [ ] Task 3.7: 前端加载建议

### 第四阶段：Smart Resume Builder
- [ ] Task 4.1: 简历生成 Prompt
- [ ] Task 4.2: 简历生成 API
- [ ] Task 4.3: 前端表单提交
- [ ] Task 4.4: 渲染简历
- [ ] Task 4.5: 简历下载（可选）

### 第五阶段：Interview Prep
- [ ] Task 5.1: 面试问题 Prompt
- [ ] Task 5.2: 面试会话管理
- [ ] Task 5.3: 反馈生成 Prompt
- [ ] Task 5.4: 面试结束 API
- [ ] Task 5.5: 前端开始面试
- [ ] Task 5.6: 前端对话功能
- [ ] Task 5.7: 显示反馈

### 第六阶段：测试和优化
- [ ] Task 6.1: 错误处理
- [ ] Task 6.2: 加载状态
- [ ] Task 6.3: 数据验证
- [ ] Task 6.4: 环境配置文档

---

## 🚀 快速开始提示

1. **从第一阶段开始**：先让数据能够正常读写，这是所有功能的基础。
2. **逐个完成**：不要跳步，每个 Task 完成后测试再继续。
3. **及时测试**：每完成一个 Task 就测试一下，确保功能正常。
4. **遇到问题**：查看 API 文档（`docs/api-endpoints.md`）和数据结构文档（`docs/identity-vault-schema.md`）。
5. **AI 功能放在后面**：第二阶段完成后，再开始 AI 相关的功能。

---

**最后更新**：2025-01-XX  
**文档版本**：1.0
