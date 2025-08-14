import type { VercelRequest, VercelResponse } from '@vercel/node';

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
    // Basic rate limit: 15 requests / 3 minutes per IP
    const key = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'anon');
    const now = Date.now();
    // @ts-ignore
    globalThis.__rlg = globalThis.__rlg || new Map<string, number[]>();
    // @ts-ignore
    const list: number[] = globalThis.__rlg.get(key) || [];
    const recent = list.filter((t) => now - t < 180_000);
    if (recent.length >= 15) return res.status(429).json({ error: 'Too many requests' });
    recent.push(now);
    // @ts-ignore
    globalThis.__rlg.set(key, recent);
    
    const { project_description, message_purpose, model = 'meta-llama/llama-3.1-8b-instruct:free', tone = '' } = req.body;

    if (!project_description || !message_purpose) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get OpenRouter API key
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.VITE_OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Missing OpenRouter API key' });
    }

    // Intelligent intent classification
    const lcIntent = (message_purpose || '').toLowerCase();
    const isPrice = /price|budget|rate|increase|raise|adjust|cost|fee|charge|expensive|cheap|more money|higher|lower|settle/.test(lcIntent);
    const isSkill = /proficient|experienced|skilled|specialize|expert|good at|better at|android|ios|react|vue|python|java|technology|tech/.test(lcIntent);
    const isTimeline = /deadline|timeline|delay|postpone|extend|rush|urgent|quick|fast|slow/.test(lcIntent);
    const isApology = /sorry|apologize|regret|unfortunately|mistake|error/.test(lcIntent);
    const isGratitude = /thank|appreciate|grateful/.test(lcIntent);
    const isCancel = /cancel|not proceed|withdraw|decline|can't continue|unable to continue/.test(lcIntent);

    // Dynamic tone mapping with stronger differentiation
    const toneKey = (tone || '').toLowerCase();
    let toneInstructions = '';
    if (toneKey.includes('friendly')) {
      toneInstructions = 'Write in a warm, conversational, and approachable tone. Use casual language and be personable. Show enthusiasm.';
    } else if (toneKey.includes('formal')) {
      toneInstructions = 'Write in a highly professional, business-appropriate tone. Use formal language, proper structure, and respectful phrasing.';
    } else if (toneKey.includes('concise')) {
      toneInstructions = 'Write extremely briefly. Use 2-3 sentences maximum. Be direct and get straight to the point. No fluff.';
    } else if (toneKey.includes('apology')) {
      toneInstructions = 'Express genuine regret and take responsibility. Be humble, empathetic, and solution-focused.';
    } else if (toneKey.includes('gratitude')) {
      toneInstructions = 'Show sincere appreciation and enthusiasm. Be positive, thankful, and forward-looking about collaboration.';
    } else {
      toneInstructions = 'Write in a natural, professional tone that feels authentic and human.';
    }

    // Build context-aware system prompt
    const systemPrompt = `You are an expert freelancer writing a message to a client. ${toneInstructions}

CRITICAL INSTRUCTIONS:
- Read the CLIENT CONTEXT and FREELANCER INTENT carefully
- Write a response that directly addresses the freelancer's specific goal
- Use bullet points when they improve clarity (max 4 points with "- " prefix)
- Never use generic templates or placeholder text
- Don't copy the client's words verbatim - paraphrase naturally
- Be specific to this exact situation
- No fake names or placeholders like [Your Name]

RESPONSE FORMATS:
- Single paragraph for simple responses
- Multiple paragraphs for complex situations  
- Bullet lists for organizing options, steps, or features
- Mix formats when it enhances clarity`;

    // Context-specific guidance based on intent
    let specificGuidance = '';
    if (isPrice) {
      specificGuidance = 'PRICING NEGOTIATION: The freelancer wants to discuss higher rates/budget. Address pricing directly - suggest a specific higher rate, explain the value justification, or propose premium options. Be confident about your worth and provide concrete numbers or ranges.';
    } else if (isSkill) {
      specificGuidance = 'SKILL MISMATCH: The freelancer has concerns about technology/skill alignment. Address the gap honestly - offer alternatives (different tech stack), suggest collaboration with specialists, or professionally decline if appropriate.';
    } else if (isTimeline) {
      specificGuidance = 'TIMELINE ISSUE: Address deadline/timeline concerns. Be clear about what you need and why. Propose specific date alternatives or explain timeline constraints.';
    } else if (isApology) {
      specificGuidance = 'APOLOGY REQUIRED: Express genuine remorse. Take responsibility and offer specific corrective actions or solutions.';
    } else if (isGratitude) {
      specificGuidance = 'EXPRESS APPRECIATION: Show thanks and enthusiasm for the opportunity. Be positive about collaboration prospects.';
    } else if (isCancel) {
      specificGuidance = 'DECLINE PROJECT: Politely decline the work. Be professional, brief, and optionally suggest alternatives or referrals.';
    } else {
      specificGuidance = 'GENERAL RESPONSE: Address their specific situation helpfully. Ask relevant follow-up questions if needed for project clarity.';
    }

    const userPrompt = `CLIENT CONTEXT: ${project_description}

FREELANCER INTENT: ${message_purpose}

SPECIFIC GUIDANCE: ${specificGuidance}

Write the freelancer's message to the client now. Be authentic, specific, and directly address the situation.`;

    // Adjust temperature based on tone and intent
    let temperature = 0.8; // Higher for more natural variation
    if (toneKey.includes('concise')) temperature = 0.4;
    else if (toneKey.includes('formal')) temperature = 0.6;
    else if (isPrice || isSkill) temperature = 0.7; // Need precision but personality
    else if (toneKey.includes('friendly')) temperature = 0.9; // Most creative

    const maxTokens = toneKey.includes('concise') ? 120 : 350;

    console.log('=== AI REQUEST DEBUG ===');
    console.log('System:', systemPrompt.substring(0, 200) + '...');
    console.log('User:', userPrompt.substring(0, 200) + '...');
    console.log('Temperature:', temperature, 'MaxTokens:', maxTokens);
    console.log('========================');

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.VERCEL_URL || 'http://localhost:5173',
        'X-Title': 'Client Message Generator'
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: maxTokens,
        temperature,
        top_p: 0.9,
        frequency_penalty: 0.3, // Reduce repetition
        presence_penalty: 0.1
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      return res.status(response.status).json({ 
        error: `OpenRouter API failed: ${response.status} ${errorText}` 
      });
    }

    const data = await response.json();
    const message = data.choices?.[0]?.message?.content;
    
    if (!message) {
      console.error('No message in OpenRouter response:', data);
      return res.status(500).json({ error: 'No message generated by AI' });
    }

    console.log('=== AI RESPONSE ===');
    console.log('Generated:', message.substring(0, 150) + '...');
    console.log('==================');

    return res.status(200).json({ message });

  } catch (error: any) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: `Server error: ${error.message}` 
    });
  }
}
