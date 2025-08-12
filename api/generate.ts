import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
  const { project_description, message_purpose, model = 'deepseek/deepseek-chat-v3-0324:free', byok, license } = req.body;

    if (!project_description || !message_purpose) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // System prompt for consistent, professional responses
    const systemPrompt = `You are an expert freelancer. Always reply to clients using this friendly, professional template:

Hi,

Thank you for sharing the details about your project: "${project_description}". I've carefully reviewed your requirements and I'm confident I can help you achieve your goals.

Here's how I plan to approach your project:
- [Briefly outline your approach or next steps based on the project]
- [Mention any relevant experience or similar work]

${message_purpose}

If you have any questions or specific preferences, please let me know. I'm excited to collaborate and deliver great results for you!

Looking forward to your response.

Best regards,
[Your Name]

Keep the tone warm, natural, and professional. Replace bracketed sections with specific details.`;

    // Determine API key to use: BYOK (client-provided) or app key (requires license)
    let apiKey = byok as string | undefined;
    if (!apiKey) {
      // App key path: require valid license token
      const appKey = process.env.OPENROUTER_API_KEY || process.env.VITE_OPENROUTER_API_KEY;
      if (!appKey) return res.status(500).json({ error: 'Missing server OpenRouter API key' });
      const secret = process.env.LICENSE_JWT_SECRET;
      if (!secret) return res.status(500).json({ error: 'Missing LICENSE_JWT_SECRET' });
      try {
        const decoded: any = jwt.verify(license, secret);
        if (!decoded || decoded.plan !== 'pro') throw new Error('Invalid plan');
      } catch (e: any) {
        return res.status(402).json({ error: 'Payment required or invalid license' });
      }
      apiKey = appKey;
    }

    // Call OpenRouter API directly
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
  'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.VERCEL_URL || 'http://localhost:5173',
        'X-Title': 'Client Message Generator'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Project: ${project_description}\nIntent: ${message_purpose}`
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      let errorData: any = null;
      try { errorData = await response.json(); } catch {}
      console.error('OpenRouter API error:', errorData || response.statusText);
      return res.status(response.status).json({ error: errorData?.error || response.statusText || 'Failed to generate message' });
    }

    const data = await response.json();
    const message = data.choices[0]?.message?.content || 'No message generated';

    return res.status(200).json({ message });

  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
