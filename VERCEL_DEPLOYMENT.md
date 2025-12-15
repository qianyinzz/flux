# 🚀 Vercel 部署指南

## ✅ 已完成的准备工作

项目已配置好 Vercel 部署所需的所有文件：

- ✅ `api/send-email.js` - Vercel Serverless Function（邮件发送API）
- ✅ `vercel.json` - Vercel 配置文件
- ✅ `package.json` - 包含 resend 依赖
- ✅ `contact.html` - 联系我们页面
- ✅ `test-email.html` - 邮件测试页面

## 📋 部署步骤

### 1. 推送代码到 Git 仓库

```bash
git add .
git commit -m "Add email sending functionality with Vercel Serverless Function"
git push origin main
```

### 2. 在 Vercel 中配置环境变量

⚠️ **重要：必须在 Vercel 中设置环境变量**

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 进入你的项目
3. 点击 **Settings** → **Environment Variables**
4. 添加以下环境变量：

```
RESEND_API_KEY = re_333jogPZ_3rFsF9DLu4s51frvz7VvLdcK
```

**环境选择：**
- ✅ Production
- ✅ Preview
- ✅ Development

点击 **Save** 保存。

### 3. 重新部署

配置环境变量后，需要重新部署：

1. 在 Vercel Dashboard 的 **Deployments** 页面
2. 找到最新的部署
3. 点击右侧的 **...** 菜单
4. 选择 **Redeploy**
5. 确认重新部署

或者，直接推送新的提交触发自动部署：

```bash
git commit --allow-empty -m "Trigger redeploy"
git push origin main
```

## 🔍 验证部署

### 1. 检查 API 端点

部署完成后，访问：
```
https://你的域名.vercel.app/api/send-email
```

应该返回：
```json
{"error":"Method not allowed"}
```

这说明 API 已正常运行（因为我们使用了 GET 请求，而API只接受 POST）。

### 2. 测试联系表单

访问：
```
https://你的域名.vercel.app/contact.html
```

填写表单并提交，检查：
- 是否显示"正在发送..."
- 是否收到成功/失败消息
- 检查邮箱是否收到邮件

### 3. 查看函数日志

如果出现问题，在 Vercel Dashboard 中：
1. 进入项目
2. 点击 **Functions** 标签
3. 找到 `send-email` 函数
4. 查看日志和错误信息

## 📂 项目文件结构

```
flux/
├── api/
│   └── send-email.js          # Vercel Serverless Function
├── contact.html                # 联系我们页面（生产环境）
├── test-email.html            # 邮件测试页面
├── index.html                  # 主页
├── package.json                # 依赖配置
├── vercel.json                 # Vercel 配置
├── .env                        # 本地环境变量（不会上传到 Git）
└── .gitignore                  # Git 忽略文件

```

## 🔒 安全注意事项

### .env 文件安全

✅ `.env` 文件已在 `.gitignore` 中，不会被推送到 Git
✅ 生产环境的 API 密钥通过 Vercel 环境变量配置
✅ 前端代码中没有硬编码任何密钥

### API 使用限制

当前配置允许任何人调用你的邮件 API。如果需要，可以添加：
- 速率限制
- 来源验证
- reCAPTCHA 验证

## 🌐 使用方式

### 在主页添加联系链接

在 `index.html` 中添加：

```html
<a href="/contact.html" class="btn btn-secondary">联系我们</a>
```

### API 调用示例

前端 JavaScript：

```javascript
async function sendEmail(to, subject, html) {
    const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ to, subject, html })
    });
    
    return response.json();
}
```

## 🐛 常见问题

### 1. API 返回 500 错误

**原因：** 环境变量未配置或配置错误

**解决：**
- 检查 Vercel 环境变量是否正确设置
- 重新部署项目

### 2. CORS 错误

**原因：** 跨域请求被阻止

**解决：**
- API 已配置 CORS 头部
- 确保使用相对路径 `/api/send-email` 而不是完整 URL

### 3. 邮件未收到

**原因：** Resend API 配置或邮箱问题

**解决：**
- 检查 Resend API 密钥是否有效
- 查看 Vercel 函数日志
- 检查垃圾邮件文件夹

## 📞 获取帮助

- Vercel 文档: https://vercel.com/docs
- Resend 文档: https://resend.com/docs
- 项目问题: 查看 GitHub Issues

## ✨ 完成！

现在你的网站已经具备完整的邮件发送功能！

访问 `https://你的域名.vercel.app/contact.html` 开始使用。
