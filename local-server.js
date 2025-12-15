import http from 'http';
import fs from 'fs';
import path from 'path';
import url from 'url';
import https from 'https';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env manually since we don't want to depend on dotenv package
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
}

const PORT = 3000;

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // API Route: /api/generate
    if (parsedUrl.pathname === '/api/generate' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const { prompt } = JSON.parse(body);
                const token = process.env.REPLICATE_API_TOKEN;

                if (!token) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Missing REPLICATE_API_TOKEN in .env' }));
                    return;
                }

                // Proxy to Replicate
                const replicateReq = https.request('https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'wait'
                    }
                }, (replicateRes) => {
                    let data = '';
                    replicateRes.on('data', chunk => data += chunk);
                    replicateRes.on('end', () => {
                        res.writeHead(replicateRes.statusCode, { 'Content-Type': 'application/json' });
                        res.end(data);
                    });
                });

                replicateReq.on('error', (e) => {
                    console.error(e);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Failed to connect to Replicate' }));
                });

                replicateReq.write(JSON.stringify({
                    input: {
                        prompt: prompt,
                        go_fast: true,
                        megapixels: "1",
                        num_outputs: 1,
                        aspect_ratio: "1:1",
                        output_format: "webp",
                        output_quality: 80,
                        num_inference_steps: 4
                    }
                }));
                replicateReq.end();

            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
        return;
    }

    // API Route: /api/send-email
    if (parsedUrl.pathname === '/api/send-email' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const { to, subject, html, from } = JSON.parse(body);
                const apiKey = process.env.RESEND_API_KEY;

                if (!apiKey) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Missing RESEND_API_KEY in .env' }));
                    return;
                }

                // Import Resend
                const { Resend } = await import('resend');
                const resend = new Resend(apiKey);

                const result = await resend.emails.send({
                    from: from || 'onboarding@resend.dev',
                    to: to,
                    subject: subject,
                    html: html
                });

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, data: result }));

            } catch (e) {
                console.error('Email sending error:', e);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    error: 'Failed to send email',
                    details: e.message
                }));
            }
        });
        return;
    }

    // Static File Serving
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log(`API Proxy ready at http://localhost:${PORT}/api/generate`);
    console.log(`Email API ready at http://localhost:${PORT}/api/send-email`);
});
