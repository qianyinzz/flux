// Vercel Serverless Function for sending emails
import { Resend } from 'resend';

export default async function handler(req, res) {
    // 只允许 POST 请求
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // CORS 头部设置
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // 处理 OPTIONS 请求（CORS 预检）
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const { to, subject, html, from } = req.body;

        // 验证必填字段
        if (!to || !subject || !html) {
            return res.status(400).json({
                error: 'Missing required fields',
                details: 'to, subject, and html are required'
            });
        }

        // 从环境变量获取 API 密钥
        const apiKey = process.env.RESEND_API_KEY;

        if (!apiKey) {
            console.error('RESEND_API_KEY is not configured');
            return res.status(500).json({
                error: 'Server configuration error',
                details: 'RESEND_API_KEY is not configured'
            });
        }

        // 初始化 Resend
        const resend = new Resend(apiKey);

        // 发送邮件
        const result = await resend.emails.send({
            from: from || 'onboarding@resend.dev',
            to: to,
            subject: subject,
            html: html
        });

        console.log('Email sent successfully:', result);

        // 返回成功响应
        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error('Email sending error:', error);

        return res.status(500).json({
            error: 'Failed to send email',
            details: error.message
        });
    }
}
