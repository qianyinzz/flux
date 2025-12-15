/**
 * 邮箱发送功能使用示例
 * 
 * 使用方法：
 * 1. 确保 .env 文件中设置了 RESEND_API_KEY=你的API密钥
 * 2. 启动服务器: npm start
 * 3. 在前端调用此API
 */

// 示例1: 使用 fetch 发送邮件
async function sendTestEmail() {
    try {
        const response = await fetch('http://localhost:3000/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'onboarding@resend.dev',
                to: 'zhanxj0527@163.com',
                subject: 'Hello World',
                html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
            })
        });

        const result = await response.json();
        console.log('Email sent successfully:', result);
        return result;
    } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
    }
}

// 示例2: 使用自定义内容发送邮件
async function sendCustomEmail(to, subject, htmlContent) {
    try {
        const response = await fetch('http://localhost:3000/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                to: to,
                subject: subject,
                html: htmlContent
            })
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
    }
}

// Node.js 环境下测试（需要安装 node-fetch）
// 如果在浏览器控制台中测试，直接调用: sendTestEmail();
