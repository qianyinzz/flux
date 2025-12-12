export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt } = request.body;

    if (!prompt) {
        return response.status(400).json({ error: 'Prompt is required' });
    }

    const token = process.env.REPLICATE_API_TOKEN;

    if (!token) {
        return response.status(500).json({ error: 'Server configuration error: Missing API Token' });
    }

    try {
        const replicateResponse = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Prefer': 'wait'
            },
            body: JSON.stringify({
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
            })
        });

        const data = await replicateResponse.json();

        if (replicateResponse.ok && data.output) {
            return response.status(200).json({ output: data.output });
        } else {
            return response.status(500).json({ error: data.error || 'Generation failed' });
        }
    } catch (error) {
        console.error('API Error:', error);
        return response.status(500).json({ error: 'Internal server error' });
    }
}
