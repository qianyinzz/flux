# 邮箱发送功能说明

这个项目已经集成了基于 Resend 的邮箱发送功能。

## 🔧 配置

### 1. 设置 API 密钥

在项目根目录的 `.env` 文件中添加你的 Resend API 密钥：

```env
RESEND_API_KEY=your_resend_api_key_here
REPLICATE_API_TOKEN=your_existing_token
```

**注意：** 请将示例代码中的硬编码 API 密钥 `re_333jogPZ_3rFsF9DLu4s51frvz7VvLdcK` 替换为你自己的密钥。

### 2. 安装依赖

```bash
npm install
```

## 🚀 使用方法

### 启动服务器

```bash
npm start
```

服务器将在 `http://localhost:3000` 启动，邮箱 API 端点为：`http://localhost:3000/api/send-email`

### API 调用示例

#### 在前端 JavaScript 中使用

```javascript
// 发送邮件
async function sendEmail() {
    const response = await fetch('http://localhost:3000/api/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            from: 'onboarding@resend.dev',  // 可选，默认为 onboarding@resend.dev
            to: 'recipient@example.com',
            subject: 'Hello World',
            html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
        })
    });

    const result = await response.json();
    console.log(result);
}
```

#### 在 HTML 中添加发送按钮

```html
<button onclick="sendTestEmail()">发送测试邮件</button>

<script>
async function sendTestEmail() {
    try {
        const response = await fetch('http://localhost:3000/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                to: 'zhanxj0527@163.com',
                subject: 'Hello World',
                html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
            })
        });

        const result = await response.json();
        
        if (result.success) {
            alert('邮件发送成功！');
            console.log('Email sent:', result.data);
        } else {
            alert('邮件发送失败：' + result.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('邮件发送出错');
    }
}
</script>
```

## 📋 API 参数说明

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `to` | string | 是 | 收件人邮箱地址 |
| `subject` | string | 是 | 邮件主题 |
| `html` | string | 是 | 邮件HTML内容 |
| `from` | string | 否 | 发件人邮箱（默认：onboarding@resend.dev） |

### 响应格式

**成功响应：**
```json
{
    "success": true,
    "data": {
        "id": "email_id_from_resend"
    }
}
```

**失败响应：**
```json
{
    "error": "Failed to send email",
    "details": "错误详情"
}
```

## 📁 文件结构

```
flux/
├── api/
│   ├── send-email.js       # 邮箱发送模块
│   ├── email-example.js    # 使用示例
│   └── generate.js         # 图片生成API
├── local-server.js         # 本地服务器（已添加邮箱路由）
├── .env                    # 环境变量（需要添加 RESEND_API_KEY）
└── package.json
```

## 🔍 常见问题

### 1. 邮件发送失败
- 检查 `.env` 文件中的 `RESEND_API_KEY` 是否正确设置
- 确认 Resend API 密钥是否有效
- 查看服务器控制台的错误日志

### 2. CORS 错误
- 本地服务器已配置 CORS，允许所有来源访问
- 如果部署到生产环境，请根据需要调整 CORS 设置

### 3. 从哪里获取 API 密钥
- 访问 [Resend.com](https://resend.com) 注册账号
- 在控制面板中创建 API 密钥
- 将密钥复制到 `.env` 文件

## 🔗 相关链接

- [Resend 官方文档](https://resend.com/docs)
- [Resend Node.js SDK](https://github.com/resendlabs/resend-node)
