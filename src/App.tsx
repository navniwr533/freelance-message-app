import React, { useState, useRef } from 'react';
// import { useMotionValue, useSpring } from 'framer-motion';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

function App() {
  // ...existing code (all hooks, functions, etc.)...
  // Place the return statement here:
  const palette = {
    sand: '#D6A99D',
    cream: '#FBF3D5',
    mint: '#D6DAC8',
    sage: '#9CAFAA',
    black: '#18181b',
    purple: '#7c3aed',
    white: '#fff',
  };

  function handleCopy() {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = output;
    const text = tempDiv.innerText;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }
  // For card cursor-following effect
  const cardRef = useRef<HTMLDivElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0, active: false });
  const [project, setProject] = useState('');
  const [intent, setIntent] = useState('');
  const [output, setOutput] = useState('Your message will appear here...');
  // Message history
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('messageHistory');
    return saved ? JSON.parse(saved) : [];
  });
  // Template/tone selector
  const templates = [
    { label: 'Default', value: '' },
    { label: 'Friendly', value: 'Use a friendly, upbeat tone.' },
    { label: 'Formal', value: 'Use a formal, professional tone.' },
    { label: 'Concise', value: 'Be concise and to the point.' },
    { label: 'Apology', value: 'Express a polite apology.' },
    { label: 'Gratitude', value: 'Express gratitude and appreciation.' },
  ];
  const [template, setTemplate] = useState(templates[0].value);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  // For global custom cursor (zero latency, follows mouse exactly)
  const [cursorPos, setCursorPos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  // (Click spark effect removed for speed)
  const [cursorType, setCursorType] = useState<'default' | 'theory' | 'card'>('default');

  // Track mouse globally, update instantly (no smoothing)
  React.useEffect(() => {
    const move = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, []);

  // Hide system cursor
  React.useEffect(() => {
    document.body.style.cursor = 'none';
    return () => { document.body.style.cursor = ''; };
  }, []);

  // Minimal cleanup: preserve content, format basic markup
  function cleanMessage(text: string) {
    if (!text) return '';
    return text
      .trim()
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  }

  // (Removed offline fallback generator per request; focusing on real AI responses only)

  // Usage count for free/pro logic
  const [usage, setUsage] = useState(() => {
    const saved = localStorage.getItem('usageCount');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isPro, setIsPro] = useState(() => {
    return localStorage.getItem('isPro') === 'true';
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setOutput('<span style="color:' + palette.sand + '">⏳ Generating message...</span>');
    setCopied(false);
    if (!isPro && usage >= 5) {
      setOutput('<span style="color:#f87171;">🚫 Free limit reached. Upgrade to Pro for unlimited messages.</span>');
      setLoading(false);
      return;
    }
    try {
  // ULTRA SIMPLE prompt that even dumb AI can follow
      let systemPrompt = "";
      let userPrompt = "";
      
      // Classify intent and build targeted prompts so output matches the freelancer's goal
      const lcIntent = (intent || '').toLowerCase();
      const isCancel = /cancel|not\s*proceed|withdraw|decline|can't\s*continue|unable\s*to\s*continue/.test(lcIntent);
      const isPrice = /price|budget|rate|increase|raise|adjust/.test(lcIntent);
      const isTimeline = /deadline|timeline|delay|postpone|extend/.test(lcIntent);
      const isApology = /sorry|apologize|regret|unfortunately/.test(lcIntent);
      const isGratitude = /thank|appreciate|gratitude/.test(lcIntent);
      const isImprove = /improve|enhance|upgrade|better|add\s*value|next\s*level/.test(lcIntent);
      const isPersonal = /about\s*(you|her|him|son|daughter|child|kid)|your\s*(background|profile|experience)|personal\s*details|who\s*you\s*are|more\s*about\s*(you|him|her|son|daughter|child|kid)|only\s*(about|regarding)\s*(you|him|her|son|daughter|child|kid)/.test(lcIntent);

      // Detect family/person focus for personal-only cases
      let personFocus = 'the client';
      if (isPersonal) {
        if (/son/.test(lcIntent)) personFocus = "their son";
        else if (/daughter/.test(lcIntent)) personFocus = "their daughter";
        else if (/(child|kid)/.test(lcIntent)) personFocus = "their child";
        else if (/(her|him)\s+only|only\s+about\s*(her|him)/.test(lcIntent)) personFocus = 'the client';
      }

      // Extract freelancer name if provided, e.g., "my name is navni"
      const nameMatch = /my name is\s+([\w .'-]{1,40})/i.exec(intent || '');
      const freelancerName = nameMatch ? nameMatch[1].trim() : '';

      // Tone handling
      const tone = (template || '').toLowerCase();
      const toneHint = tone.includes('concise')
        ? 'Keep it to 1-2 sentences, no lists.'
        : tone.includes('formal')
        ? 'Use a professional, measured tone. Prefer short paragraphs over lists.'
        : tone.includes('friendly')
        ? 'Sound warm and approachable. Prefer a short paragraph; avoid bullets unless truly needed.'
        : tone.includes('apology')
        ? 'Include a polite, brief apology.'
        : tone.includes('gratitude')
        ? 'Express brief, genuine appreciation.'
        : 'Short paragraph, natural tone, avoid bullets unless necessary.';

      // Goal based on intent
      let goal = '';
      if (isCancel) goal = 'Politely decline proceeding with the project.';
      else if (isPrice) goal = 'Discuss pricing transparently and propose a call or range if appropriate.';
      else if (isTimeline) goal = 'Request a reasonable timeline extension and confirm constraints.';
      else if (isApology) goal = 'Deliver a brief apology and restate your intended action.';
      else if (isGratitude) goal = 'Thank them and express enthusiasm to collaborate.';
      else if (isImprove) goal = 'Propose a higher-value approach without sounding pushy.';
  else if (isPersonal) goal = `Ask only about ${personFocus} (not features). Useful aspects: role in decisions, preferred communication, availability/time zone, and any accessibility or usage considerations.`;
      else goal = 'Respond helpfully to their request and ask only the minimal, relevant follow-ups.';

      // Guardrails
      const rules = [
        'Treat the first input as the client request and the second as the freelancer intent.',
        "Do not restate the client's text verbatim; paraphrase naturally.",
  'Avoid assumptions and avoid generic checklists.',
  isPersonal ? `Do NOT ask about app features, budget, or tech; ask only about ${personFocus}.` : 'Ask only questions aligned with the stated intent.',
  'Do not invent or guess any names. No placeholders like [Client\'s Name] or [Your Name].',
  freelancerName ? `You may sign off with "${freelancerName}" (first name only). Do not introduce yourself in the opening.` : 'Do not include your own name in the message.',
  'Do not address the client by name unless an explicit client name is provided in inputs.',
        toneHint,
      ].join(' ');

      systemPrompt = `You write short, professional client messages. ${rules}`;

      // Compose user prompt with explicit goal and context
      userPrompt = [
        `Client request/context: ${project}`,
        `Freelancer intent/goal: ${intent}`,
        freelancerName ? `Freelancer name to optionally sign with: ${freelancerName}` : 'No freelancer name provided; do not include one.',
        isPersonal ? `Person to focus on: ${personFocus}` : 'Not a personal-only request.',
        `Your objective: ${goal}`,
        'Output only the final message to the client (one short paragraph).',
      ].join('\n');
      
      console.log('=== DEBUG PROMPTS ===');
      console.log('System Prompt:', systemPrompt);
      console.log('User Prompt:', userPrompt);
      console.log('===================');

      const API_BASE = import.meta.env.VITE_API_BASE_URL as string | undefined;
      const OPENROUTER_KEY = import.meta.env.VITE_OPENROUTER_API_KEY as string | undefined;
      if (!API_BASE && !OPENROUTER_KEY) {
        setOutput('<span style="color:#f87171;">❌ Missing API config. Set VITE_API_BASE_URL (preferred) to your Worker URL, or set VITE_OPENROUTER_API_KEY in .env and restart.</span>');
        setLoading(false);
        return;
      }

      // Faster, world-class routing: per-tone model priority + parallel race with timeouts
      const toneKey = (template || '').toLowerCase();
      const getOrderedModels = () => {
        // Base pool
        const base = [
          'deepseek/deepseek-chat-v3-0324:free',
          'meta-llama/llama-3.1-8b-instruct:free',
          'google/gemma-2-9b-it:free',
          'mistralai/mistral-7b-instruct:free',
          'qwen/qwen-2.5-7b-instruct:free',
        ];
        if (toneKey.includes('formal') || toneKey.includes('concise')) {
          return [
            'meta-llama/llama-3.1-8b-instruct:free',
            'google/gemma-2-9b-it:free',
            'deepseek/deepseek-chat-v3-0324:free',
            'mistralai/mistral-7b-instruct:free',
            'qwen/qwen-2.5-7b-instruct:free',
          ];
        }
        if (toneKey.includes('apology') || toneKey.includes('gratitude')) {
          return [
            'meta-llama/llama-3.1-8b-instruct:free',
            'deepseek/deepseek-chat-v3-0324:free',
            'google/gemma-2-9b-it:free',
            'mistralai/mistral-7b-instruct:free',
            'qwen/qwen-2.5-7b-instruct:free',
          ];
        }
        // Friendly/default
        return base;
      };

      const getToneSettings = () => {
        if (toneKey.includes('concise')) return { temperature: 0.25, maxTokens: 120 };
        if (toneKey.includes('formal')) return { temperature: 0.3, maxTokens: 160 };
        if (toneKey.includes('apology') || toneKey.includes('gratitude')) return { temperature: 0.35, maxTokens: 160 };
        if (toneKey.includes('friendly')) return { temperature: 0.5, maxTokens: 180 };
        return { temperature: 0.4, maxTokens: 180 };
      };

      const orderedModels = getOrderedModels();
      const { temperature, maxTokens } = getToneSettings();

      const callModelDirect = (model: string, signal: AbortSignal) =>
        fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENROUTER_KEY}`,
            'HTTP-Referer': window.location.origin,
            'X-Title': 'Client Message Generator',
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            max_tokens: maxTokens,
            temperature,
            top_p: 0.9,
          }),
          signal,
        })
          .then(async (res) => {
            if (!res.ok) {
              const errText = await res.text();
              throw new Error(`HTTP ${res.status} ${res.statusText}: ${errText}`);
            }
            const data = await res.json();
            const content = data?.choices?.[0]?.message?.content;
            if (!content) throw new Error('No content in choices');
            return content as string;
          });

      // Server-side path: call our API/generate once; no need to race models client-side.
      const callServer = async (): Promise<string> => {
        const res = await fetch(`${API_BASE}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            project_description: project,
            message_purpose: intent,
            // Let server choose model; keep for compatibility
            model: orderedModels[0],
          }),
        });
        if (!res.ok) {
          const t = await res.text();
          throw new Error(`Server API error: ${res.status} ${t}`);
        }
        const data = await res.json();
        const content = data?.message;
        if (!content) throw new Error('No message in response');
        return content as string;
      };

  const raceBatch = async (models: string[], timeoutMs = 12000) => {
        const controllers = models.map(() => new AbortController());
        const timers: any[] = [];
        try {
          const promises = models.map((m, i) => {
            const controller = controllers[i];
            timers[i] = setTimeout(() => controller.abort(), timeoutMs);
    return callModelDirect(m, controller.signal);
          });
          const result = await Promise.any(promises);
          return result as string;
        } finally {
          controllers.forEach((c) => c.abort());
          timers.forEach((t) => clearTimeout(t));
        }
      };

      let message: string | null = null;
      let lastError: any = null;
      if (API_BASE) {
        try {
          message = await callServer();
        } catch (e) {
          lastError = e;
          console.warn('Server generate failed', e);
        }
      } else {
        // Race in small batches for speed and lower rate-limits impact (direct OpenRouter)
        for (let i = 0; i < orderedModels.length && !message; i += 2) {
          const batch = orderedModels.slice(i, i + 2);
          try {
            const result = await raceBatch(batch);
            if (result) message = result;
          } catch (e) {
            lastError = e;
            console.warn('Batch failed', batch, e);
          }
        }
      }

      if (!message) {
        if (lastError) console.warn('OpenRouter last error (no fallback):', lastError);
        message = '❌ AI request failed. Check console for details (OpenRouter status) and ensure your API key is valid.';
      }
      setOutput(cleanMessage(message));
      // Save to history
      const newHistory = [
        {
          project,
          intent,
          template,
          message: cleanMessage(message),
          date: new Date().toISOString(),
        },
        ...history.slice(0, 19), // keep last 20
      ];
      setHistory(newHistory);
      localStorage.setItem('messageHistory', JSON.stringify(newHistory));
      if (!isPro) {
        const newUsage = usage + 1;
        setUsage(newUsage);
        localStorage.setItem('usageCount', newUsage.toString());
      }
    } catch (err) {
      setOutput('<span style="color:#f87171;">❌ Failed to generate message. Check console.</span>');
    }
    setLoading(false);
  }

  function handleUpgrade() {
    setIsPro(true);
    localStorage.setItem('isPro', 'true');
  }

  return (
    <>
      {/* Click spark effect removed for speed */}

      {/* Custom global cursor */}
      <motion.div
        style={{
          position: 'fixed',
          left: cursorPos.x - 18,
          top: cursorPos.y - 18,
          width: 36,
          height: 36,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'exclusion',
          border: `2.5px solid ${palette.purple}`,
          boxSizing: 'border-box',
          willChange: 'transform, background, box-shadow',
          background:
            cursorType === 'theory'
              ? `radial-gradient(circle at 50% 50%, ${palette.purple} 0%, ${palette.cream} 80%, transparent 100%)`
              : cursorType === 'card'
              ? `radial-gradient(circle at 50% 50%, ${palette.purple} 0%, ${palette.sand} 80%, transparent 100%)`
              : `radial-gradient(circle at 50% 50%, ${palette.purple} 0%, ${palette.sand} 80%, transparent 100%)`,
          boxShadow:
            cursorType === 'theory'
              ? `0 0 32px 8px ${palette.purple}55`
              : cursorType === 'card'
              ? `0 2px 24px 0 ${palette.purple}44`
              : `0 2px 16px 0 ${palette.purple}33`,
        }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          minHeight: '100vh',
          width: '100vw',
          overflow: 'auto',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Poppins, Inter, Arial, sans-serif',
          background: `radial-gradient(ellipse 90% 70% at 60% 20%, #D6A99D 0%, #FBF3D5 40%, #D6DAC8 70%, #9CAFAA 100%), linear-gradient(120deg, #7c3aed33 0%, #18181b 100%)`,
          boxSizing: 'border-box',
          zIndex: 0,
        }}
      >
        {/* Heavy animated background gradient and glow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none',
            background: 'radial-gradient(circle at 70% 30%, #7c3aed66 0%, transparent 60%), radial-gradient(circle at 20% 80%, #D6A99D55 0%, transparent 70%)',
            mixBlendMode: 'screen',
            animation: 'moveGlow 10s ease-in-out infinite alternate',
          }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none',
            background: 'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.035\'/%3E%3C/svg%3E")',
          }}
        />
        <style>{`
          @keyframes moveGlow {
            0% { filter: blur(0px) brightness(1); }
            100% { filter: blur(3.5px) brightness(1.12); }
          }
        `}</style>
        {/* Animated site theory/description */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.9, type: 'spring', stiffness: 60 }}
          style={{
            zIndex: 2,
            marginBottom: '1.5rem',
            maxWidth: 600,
            padding: '0 1.5rem',
            textAlign: 'center',
          }}
          onMouseEnter={() => setCursorType('theory')}
          onMouseLeave={() => setCursorType('default')}
        >
          <span style={{
            fontFamily: 'Poppins, Inter, Arial, sans-serif',
            fontWeight: 700,
            fontSize: '2.1rem',
            color: palette.purple,
            letterSpacing: '-1.5px',
            textShadow: '0 2px 16px #7c3aed33',
            display: 'block',
            marginBottom: '0.5rem',
          }}>
            The Ultimate Client Message Generator
          </span>
          <span style={{
            fontFamily: 'Poppins, Inter, Arial, sans-serif',
            fontWeight: 500,
            fontSize: '1.18rem',
            color: palette.sand,
            textShadow: '0 1px 8px #D6A99D22',
            lineHeight: 1.6,
          }}>
            Instantly craft perfect, human-like messages for your freelance clients. Powered by AI, styled for 2025, and animated for pure delight. <br />
            <span style={{ color: palette.cream, fontWeight: 600 }}>Mobile-friendly, beautiful, and always on brand.</span>
          </span>
        </motion.div>
        <motion.div
          ref={cardRef}
          initial={{ y: 60, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 80, damping: 16, duration: 0.7 }}
          style={{
            background: palette.black,
            borderRadius: '1.3rem',
            boxShadow: '0 8px 32px 0 rgba(0,0,0,0.10), 0 1.5px 8px 0 rgba(214,169,157,0.08) inset',
            padding: '2.5rem 1.2rem 2rem 1.2rem',
            maxWidth: 680,
            minWidth: 320,
            width: '100%',
            margin: '2rem 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            border: `2px solid ${palette.sand}`,
            position: 'relative',
            boxSizing: 'border-box',
            zIndex: 3,
            overflow: 'visible',
            cursor: 'none',
          }}
          onMouseMove={e => {
            if (!cardRef.current) return;
            const rect = cardRef.current.getBoundingClientRect();
            setCursor({
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
              active: true,
            });
          }}
          onMouseLeave={() => setCursor(c => ({ ...c, active: false }))}
          onMouseEnter={() => setCursorType('card')}
          onMouseOut={() => setCursorType('default')}
        >
          {/* Cursor-following animated gradient overlay */}
          {cursor.active && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              style={{
                pointerEvents: 'none',
                position: 'absolute',
                left: cursor.x - 120,
                top: cursor.y - 120,
                width: 240,
                height: 240,
                borderRadius: '50%',
                background: 'radial-gradient(circle, #7c3aed88 0%, #D6A99D33 60%, transparent 100%)',
                filter: 'blur(12px)',
                zIndex: 10,
                opacity: 0.7,
                transition: 'opacity 0.2s',
              }}
            />
          )}
          <motion.h2
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, type: 'spring', stiffness: 60 }}
            style={{
              marginBottom: '1.2rem',
              fontWeight: 600,
              fontSize: '2rem',
              letterSpacing: '-1px',
              color: palette.sand,
              textAlign: 'center',
              fontFamily: 'Poppins, Inter, Arial, sans-serif',
            }}
          >
            Client Message Generator
          </motion.h2>
          <motion.form
            style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'none' }}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7, type: 'spring', stiffness: 60 }}
          >
            <div style={{ cursor: 'none' }}>
              <motion.input
                type="text"
                placeholder="e.g., 'ecommerce website for handmade jewelry', 'mobile app for fitness tracking'"
                value={project}
                onChange={e => setProject(e.target.value)}
                required
                whileFocus={{ scale: 1.03, boxShadow: `0 0 0 2px ${palette.purple}` }}
                style={{
                  width: '100%',
                  padding: '0.9rem 1rem',
                  border: `1.5px solid ${palette.mint}`,
                  borderRadius: '0.7rem',
                  background: `linear-gradient(90deg, ${palette.sage} 0%, ${palette.cream} 100%)`,
                  color: palette.black,
                  fontSize: '1rem',
                  marginBottom: '0.2rem',
                  outline: 'none',
                  fontFamily: 'Poppins, Inter, Arial, sans-serif',
                  boxSizing: 'border-box',
                  transition: 'box-shadow 0.2s, border 0.2s',
                  cursor: 'none',
                }}
              />
            </div>
            <div style={{ cursor: 'none' }}>
              <motion.input
                type="text"
                placeholder="e.g., 'want to negotiate higher rate', 'need to propose timeline extension'"
                value={intent}
                onChange={e => setIntent(e.target.value)}
                required
                whileFocus={{ scale: 1.03, boxShadow: `0 0 0 2px ${palette.purple}` }}
                style={{
                  width: '100%',
                  padding: '0.9rem 1rem',
                  border: `1.5px solid ${palette.mint}`,
                  borderRadius: '0.7rem',
                  background: `linear-gradient(90deg, ${palette.sage} 0%, ${palette.cream} 100%)`,
                  color: palette.black,
                  fontSize: '1rem',
                  marginBottom: '0.2rem',
                  outline: 'none',
                  fontFamily: 'Poppins, Inter, Arial, sans-serif',
                  boxSizing: 'border-box',
                  transition: 'box-shadow 0.2s, border 0.2s',
                  cursor: 'none',
                }}
              />
            </div>
            <div style={{ cursor: 'none', display: 'flex', gap: '0.7rem', alignItems: 'center' }}>
              <label htmlFor="template" style={{ color: palette.cream, fontWeight: 500, fontSize: '1rem', fontFamily: 'Poppins, Inter, Arial, sans-serif' }}>Tone/Template:</label>
              <select
                id="template"
                value={template}
                onChange={e => setTemplate(e.target.value)}
                style={{
                  borderRadius: '0.6rem',
                  border: `1.5px solid ${palette.sage}`,
                  padding: '0.5rem 0.8rem',
                  fontFamily: 'Poppins, Inter, Arial, sans-serif',
                  fontSize: '1rem',
                  background: palette.cream,
                  color: palette.black,
                  cursor: 'none',
                  outline: 'none',
                  boxShadow: `0 1px 4px 0 ${palette.sand}22`,
                  marginLeft: '0.2rem',
                }}
              >
                {templates.map(t => (
                  <option key={t.label} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.04, background: `linear-gradient(90deg, ${palette.purple} 0%, ${palette.sand} 100%)` }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: `linear-gradient(90deg, ${palette.sand} 0%, ${palette.purple} 100%)`,
                color: palette.white,
                fontWeight: 600,
                border: 'none',
                borderRadius: '0.7rem',
                padding: '0.9rem 1rem',
                fontSize: '1.1rem',
                cursor: 'none',
                marginTop: '0.2rem',
                boxShadow: `0 1.5px 6px 0 ${palette.sand}22`,
                opacity: loading ? 0.7 : 1,
                transition: 'background 0.2s, transform 0.1s, color 0.2s, opacity 0.2s',
              }}
            >
              {loading ? 'Generating...' : 'Generate'}
            </motion.button>
          </motion.form>
          <div
            style={{
              width: '100%',
              maxWidth: '100%',
              boxSizing: 'border-box',
              position: 'relative',
              marginTop: '1.5rem',
            }}
          >
            <AnimatePresence mode="wait">
              {output && output !== 'Your message will appear here...' && (
                <motion.div
                  key={output}
                  id="output"
                  initial={{ opacity: 0, y: 30, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 0.98 }}
                  transition={{ duration: 0.6, type: 'spring', stiffness: 60 }}
                  style={{
                    background: palette.black,
                    padding: '1.2rem 2.2rem 1.2rem 1.2rem',
                    borderRadius: '1rem',
                    minHeight: 80,
                    maxHeight: 340,
                    width: '100%',
                    maxWidth: 600,
                    fontSize: '1.13rem',
                    whiteSpace: 'pre-wrap',
                    boxShadow: `0 2px 12px 0 ${palette.sand}22`,
                    color: palette.cream,
                    overflowY: 'auto',
                    overflowX: 'auto',
                    border: `2px solid ${palette.sand}`,
                    wordBreak: 'break-word',
                    fontFamily: 'Poppins, Inter, Arial, sans-serif',
                    transition: 'box-shadow 0.2s',
                    boxSizing: 'border-box',
                    position: 'relative',
                    cursor: 'none',
                  }}
                  dangerouslySetInnerHTML={{ __html: output }}
                />
              )}
            </AnimatePresence>
            {/* Copy icon */}
            {output && output !== 'Your message will appear here...' && (
              <motion.div
                className="copy-icon"
                onClick={handleCopy}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 12,
                  width: 26,
                  height: 26,
                  background: palette.mint,
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'none',
                  border: `1.5px solid ${palette.sage}`,
                  boxShadow: `0 1.5px 6px 0 ${palette.sand}22`,
                  zIndex: 2,
                  transition: 'background 0.15s, box-shadow 0.15s',
                }}
                title="Copy to clipboard"
              >
                {copied ? (
                  <svg viewBox="0 0 20 20" width={16} height={16} style={{ fill: palette.sand }}><path d="M7.629 15.314a1 1 0 0 1-1.415 0l-3.243-3.243a1 1 0 1 1 1.415-1.415l2.536 2.536 6.95-6.95a1 1 0 1 1 1.415 1.415l-7.658 7.657z"/></svg>
                ) : (
                  <svg viewBox="0 0 20 20" width={16} height={16} style={{ fill: palette.black }}><path d="M6 2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6.828A2 2 0 0 0 15.414 6L12 2.586A2 2 0 0 0 10.828 2H6zm0 2h4.828L16 7.172V16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4zm2 4a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2h-2a1 1 0 0 1-1-1z"/></svg>
                )}
              </motion.div>
            )}
            {/* History Toggle Icon & Monetization */}
            <div style={{ 
              marginTop: '1.5rem', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              width: '100%',
              gap: '1rem'
            }}>
              {/* History Toggle */}
              {history.length > 0 && (
                <motion.button
                  onClick={() => setShowHistory(!showHistory)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: showHistory ? palette.purple : palette.sand,
                    color: showHistory ? palette.cream : palette.black,
                    border: `3px solid ${showHistory ? palette.cream : palette.black}`,
                    borderRadius: '10px',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'none',
                    boxShadow: `0 4px 12px 0 ${palette.sand}66`,
                    transition: 'all 0.2s',
                    fontSize: '18px',
                    fontWeight: 'bold'
                  }}
                  title="Toggle Message History"
                >
                  🕒
                </motion.button>
              )}
              
              {/* Monetization Buttons */}
              <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                <motion.a
                  href="https://ko-fi.com/bluemoonsoon"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: `linear-gradient(45deg, ${palette.sand} 0%, ${palette.purple} 100%)`,
                    color: palette.black,
                    fontWeight: 600,
                    textDecoration: 'none',
                    border: 'none',
                    borderRadius: '0.6rem',
                    padding: '0.6rem 1rem',
                    fontSize: '0.9rem',
                    cursor: 'none',
                    boxShadow: `0 2px 8px 0 ${palette.sand}33`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  ☕ Tip
                </motion.a>
                
                <motion.button
                  onClick={() => navigator.share ? navigator.share({
                    title: 'Client Message Generator',
                    text: 'Check out this amazing AI tool for freelancers!',
                    url: window.location.href
                  }) : navigator.clipboard.writeText(window.location.href)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: palette.black,
                    color: palette.cream,
                    border: `1px solid ${palette.sage}`,
                    borderRadius: '0.6rem',
                    padding: '0.6rem',
                    cursor: 'none',
                    boxShadow: `0 2px 8px 0 ${palette.sand}22`,
                  }}
                  title="Share this tool"
                >
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M15 8a3 3 0 1 0-2.977-2.63l-4.94 2.47a3 3 0 1 0 0 4.319l4.94 2.47a3 3 0 1 0 .895-1.789l-4.94-2.47a3.027 3.027 0 0 0 0-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
                  </svg>
                </motion.button>
              </div>
            </div>
            
            {/* Message history (toggled) */}
            {showHistory && history.length > 0 && (
              <div style={{ marginTop: '2.2rem', background: palette.sand, borderRadius: 12, padding: '1.1rem 1.2rem', boxShadow: `0 1.5px 8px 0 ${palette.sage}22`, color: palette.black, maxWidth: 600, width: '100%' }}>
                <div style={{ fontWeight: 700, fontSize: '1.08rem', marginBottom: '0.7rem', color: palette.purple, letterSpacing: '-0.5px' }}>Message History</div>
                <div style={{ maxHeight: 180, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                  {history.map((h: any, i: number) => (
                    <div key={i} style={{ background: palette.cream, borderRadius: 8, padding: '0.7rem 1rem', fontSize: '1.01rem', color: palette.black, boxShadow: `0 1px 4px 0 ${palette.sage}11`, position: 'relative' }}>
                      <div style={{ fontWeight: 600, color: palette.purple, fontSize: '0.98rem', marginBottom: 2 }}>{h.project} <span style={{ color: palette.sage, fontWeight: 400, fontSize: '0.93rem' }}>({h.template ? templates.find(t => t.value === h.template)?.label : 'Default'})</span></div>
                      <div style={{ color: palette.sage, fontSize: '0.97rem', marginBottom: 2 }}>{h.intent}</div>
                      <div style={{ color: palette.black, marginTop: 2 }} dangerouslySetInnerHTML={{ __html: h.message }} />
                      <div style={{ fontSize: '0.85rem', color: palette.sage, marginTop: 2 }}>{new Date(h.date).toLocaleString()}</div>
                      {/* Share/Export buttons */}
                      <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => {
                            const text = h.message.replace(/<br\s*\/?\s*>/gi, '\n').replace(/<[^>]+>/g, '');
                            if (navigator.share) {
                              navigator.share({ text });
                            } else {
                              navigator.clipboard.writeText(text);
                              alert('Copied to clipboard!');
                            }
                          }}
                          style={{ background: palette.mint, border: 'none', borderRadius: 6, padding: '0.2rem 0.7rem', fontWeight: 600, color: palette.black, cursor: 'pointer', fontSize: '0.97rem', boxShadow: `0 1px 4px 0 ${palette.sage}11` }}
                          title="Share or copy"
                        >Share</button>
                        <button
                          onClick={() => {
                            const text = h.message.replace(/<br\s*\/?\s*>/gi, '\n').replace(/<[^>]+>/g, '');
                            const blob = new Blob([text], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `client-message-${i + 1}.txt`;
                            document.body.appendChild(a);
                            a.click();
                            setTimeout(() => {
                              document.body.removeChild(a);
                              URL.revokeObjectURL(url);
                            }, 100);
                          }}
                          style={{ background: palette.sage, border: 'none', borderRadius: 6, padding: '0.2rem 0.7rem', fontWeight: 600, color: palette.black, cursor: 'pointer', fontSize: '0.97rem', boxShadow: `0 1px 4px 0 ${palette.sage}11` }}
                          title="Export as .txt"
                        >Export</button>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Donate button */}
                <div style={{ marginTop: '1.1rem', textAlign: 'center' }}>
                  <a
                    href="https://www.buymeacoffee.com/yourusername"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      background: palette.purple,
                      color: palette.white,
                      fontWeight: 700,
                      borderRadius: 8,
                      padding: '0.7rem 1.3rem',
                      fontSize: '1.08rem',
                      textDecoration: 'none',
                      boxShadow: `0 1.5px 6px 0 ${palette.sand}22`,
                      marginTop: 4,
                      letterSpacing: '0.01em',
                      transition: 'background 0.2s, color 0.2s',
                    }}
                  >
                    ☕ Buy Me a Coffee
                  </a>
                </div>
              </div>
            )}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7, type: 'spring', stiffness: 60 }}
          style={{
            marginTop: '2rem',
            color: palette.sage,
            fontSize: '1.02rem',
            textAlign: 'center',
            opacity: 0.85,
            fontFamily: 'Poppins, Inter, Arial, sans-serif',
            letterSpacing: '0.01em',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.7rem',
          }}
        >
          <span style={{ color: palette.black, fontWeight: 600, background: `${palette.cream}CC`, borderRadius: 8, padding: '0.2rem 0.7rem', boxShadow: `0 1px 6px 0 ${palette.sand}22` }}>
            {isPro ? '🌟 Pro user: Unlimited generations!' : `Free: ${5 - usage} messages left today`}
          </span>
          {!isPro && (
            <motion.button
              onClick={handleUpgrade}
              whileHover={{ scale: 1.07, background: `linear-gradient(90deg, ${palette.purple} 0%, ${palette.sand} 100%)`, color: palette.black }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: `linear-gradient(90deg, ${palette.sand} 0%, ${palette.purple} 100%)`,
                color: palette.black,
                fontWeight: 700,
                border: 'none',
                borderRadius: '0.7rem',
                padding: '0.7rem 1.2rem',
                fontSize: '1.05rem',
                cursor: 'none',
                boxShadow: `0 1.5px 6px 0 ${palette.sand}22`,
                transition: 'background 0.2s, transform 0.1s, color 0.2s',
                letterSpacing: '0.01em',
                textShadow: '0 1px 6px #fff8',
              }}
            >
              Upgrade to Pro (Demo)
            </motion.button>
          )}
          <span style={{ fontSize: '0.98rem', opacity: 0.8, color: palette.black, background: `${palette.cream}B0`, borderRadius: 6, padding: '0.1rem 0.5rem', fontWeight: 500 }}>
            Powered by OpenRouter, Vercel, and AI
          </span>
        </motion.div>
      </motion.div>
      {/* Hide text cursor (I-beam) on all input fields */}
      <style>{`
        input, input:focus, input:hover, textarea, textarea:focus, textarea:hover {
          cursor: none !important;
        }
      `}</style>
    </>
  );
}

export default App;
