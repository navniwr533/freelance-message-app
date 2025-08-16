import React, { useState, useRef } from 'react';
// import { useMotionValue, useSpring } from 'framer-motion';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import Landing from './Landing';
import Capabilities from './Capabilities';
import Showcase from './Showcase';
import Footer from './Footer';
import Contact from './Contact';
import Nav from './Nav';
import Services from './Services';
import Testimonials from './Testimonials';
import Logos from './Logos';

function App() {
  // Global loading state for IFOXY STUDIOS intro animation
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  
  // Complete intro after IFOXY STUDIOS animation - faster and smoother
  React.useEffect(() => {
    const timer = setTimeout(() => setIsIntroComplete(true), 2400); // Reduced to 2.4 seconds
    return () => clearTimeout(timer);
  }, []);

  // ...existing code (all hooks, functions, etc.)...
  React.useEffect(() => {
    console.log('OpenRouter API Key:', (import.meta as any).env.VITE_OPENROUTER_API_KEY);
  }, []);

  // Place the return statement here:
  const palette = {
    // Warm, light theme aligned with reference site
    sand: '#CBB59C',   // accent
    cream: '#FFF9F0',  // light surface
    mint: '#E9E1D8',   // soft ui
    sage: '#B9AFA5',   // warm grey
    black: '#141414',  // ink
    purple: '#8B6F4E', // brand (bronze)
    white: '#fff',
  };

  // Smooth scroll from landing to app
  function handleStart() {
    const el = document.getElementById('app-root');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

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
  const [origin, setOrigin] = useState<'ai' | 'fallback'>('ai');
  const [genError, setGenError] = useState<string | null>(null);
  const [hasApiKey] = useState<boolean>(() => !!(import.meta as any).env?.VITE_OPENROUTER_API_KEY);
  // Expose OpenRouter API key
  const OPENROUTER_KEY = (import.meta as any).env?.VITE_OPENROUTER_API_KEY as string | undefined;
  // Input focus state for hint logic
  const [projectFocused, setProjectFocused] = useState(false);
  const [intentFocused, setIntentFocused] = useState(false);
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
  // Loading states for better UX
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Generate');
  const [copied, setCopied] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  // For global custom cursor (zero latency, follows mouse exactly)
  const [cursorPos, setCursorPos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [hasPointer, setHasPointer] = useState(false);

  // Check if device has fine pointer (mouse/trackpad) vs coarse pointer (touch)
  React.useEffect(() => {
    const checkPointer = () => {
      setHasPointer(window.matchMedia('(pointer: fine)').matches);
    };
    checkPointer();
    
    // Listen for changes (rare but possible)
    const media = window.matchMedia('(pointer: fine)');
    media.addEventListener('change', checkPointer);
    return () => media.removeEventListener('change', checkPointer);
  }, []);

  // (Click spark effect removed for speed)
  // Removed cursorType variations; single neutral cursor used for clarity

  // Track mouse globally, update instantly (optimized for smooth performance)
  React.useEffect(() => {
    if (!hasPointer) return; // Don't track on touch devices
    
    const move = (e: MouseEvent) => {
      // Direct update without requestAnimationFrame for zero-lag cursor
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => {
      window.removeEventListener('mousemove', move);
    };
  }, [hasPointer]);

  // Hide system cursor only on pointer devices
  React.useEffect(() => {
    if (hasPointer) {
      document.body.style.cursor = 'none';
      return () => { document.body.style.cursor = ''; };
    }
  }, [hasPointer]);

  // Typewriter placeholder utility
  function useTypewriter(lines: string[], enabled: boolean) {
    const [text, setText] = useState('');
    React.useEffect(() => {
      let i = 0, pos = 0, dir: 1 | -1 = 1;
      let t: any;
      let mounted = true;
      const tick = () => {
        if (!mounted || !enabled) { setText(''); return; }
        const full = lines[i];
        if (dir > 0) {
          if (pos < full.length) { pos++; setText(full.slice(0, pos) + '_'); t = setTimeout(tick, 60); }
          else { t = setTimeout(() => { dir = -1; tick(); }, 900); }
        } else {
          if (pos > 0) { pos--; setText(full.slice(0, pos) + '_'); t = setTimeout(tick, 35); }
          else { dir = 1; i = (i + 1) % lines.length; t = setTimeout(tick, 300); }
        }
      };
      if (enabled) tick();
      return () => { mounted = false; clearTimeout(t); };
    }, [enabled, lines.join('|')]);
    return text;
  }

  const projectHint = useTypewriter([
    "Client needs a Shopify store for handmade jewelry",
    "Landing page for a local fitness studio",
    "iOS app to track study habits",
  ], !project && !projectFocused);
  const intentHint = useTypewriter([
    "Propose a higher budget with clear value",
    "Request a 1-week timeline extension",
    "Ask only about their usage and constraints",
  ], !intent && !intentFocused);

  // Minimal cleanup: preserve content, format basic markup
  function cleanMessage(text: string) {
    if (!text) return '';
    return text
      .trim()
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  }

  // Enforce concise limits if concise tone is selected - SUPER STRICT
  function enforceConciselimits(text: string, template: string): string {
    if (!template.toLowerCase().includes('concise')) return text;
    
    // Remove HTML tags and get plain text
    let plainText = text.replace(/<[^>]*>/g, '').trim();
    
    // Remove bullet points, numbers, and excessive formatting
    plainText = plainText.replace(/^[-•*]\s*/gm, '').replace(/^\d+\.\s*/gm, '');
    
    // Split into sentences, take only the first one
    const sentences = plainText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    let result = sentences[0]?.trim() || plainText;
    
    // Split into words and enforce 20 word limit (even stricter)
    const words = result.split(/\s+/).filter(word => word.length > 0);
    if (words.length > 20) {
      result = words.slice(0, 20).join(' ');
    }
    
    // Ensure proper ending
    if (!result.match(/[.!?]$/)) {
      result += '.';
    }
    
    return cleanMessage(result);
  }

  // Smart fallback when AI APIs fail - uses intent classification
  function generateOfflineFallback(project: string, intent: string, template: string): string {
    const lcIntent = intent.toLowerCase();
    const lcProject = project.toLowerCase();
    const tone = template.toLowerCase();
  // Detect if the so-called project field is actually a situation / complaint / emotional context
  const hasBuildKeywords = /project|website|web\s*site|app|application|landing|store|shopify|wordpress|react|nextjs|vue|platform|dashboard|logo|design|ui|feature|integration|api|software|system|landing\s*page|app\s*idea/.test(lcProject);
  const situationPattern = /client\s+wants|client\s+asked|client\s+is|weird|unusual|strange|inappropriate|creepy|angry|frustrated|annoyed|upset|uncomfortable|pressure|pressuring|rude|boundary|unethical|scam|refuse|refusing|demand(?:s|ed)?|issue|problem|complain|complaint|threat/;
  const emotionalPattern = /i feel|i'm\s+(angry|upset|scared|worried|anxious|uncomfortable)|this\s+feels|makes\s+me\s+feel/;
  const intentLower = lcIntent; // reuse existing lcIntent from outer scope when fallback called
  const hasSituationKeywords = situationPattern.test(lcProject) || situationPattern.test(intentLower);
  const hasEmotionKeywords = emotionalPattern.test(lcProject) || emotionalPattern.test(intentLower);
  const isInappropriateRequest = /head massage|manicure|massage|personal favor|dating|romantic|physical (?:contact|touch)|send (?:photos|picture)|video call (?:late|private)|unpaid (?:extra|work)|free (?:work|trial)/.test(lcProject + ' ' + intentLower);
  const isSituationContext = (!hasBuildKeywords && (hasSituationKeywords || hasEmotionKeywords)) || isInappropriateRequest;
    
    // Intent classification
    const isPrice = /price|budget|rate|increase|raise|adjust|cost|fee|charge|expensive|cheap|more money|higher|lower|settle/.test(lcIntent);
    const isSkill = /proficient|experienced|skilled|specialize|expert|good at|better at|android|ios|react|vue|python|java/.test(lcIntent);
    const isApology = /sorry|apologize|regret|unfortunately|mistake|error/.test(lcIntent);
    const isGratitude = /thank|appreciate|grateful/.test(lcIntent);
    const isConcise = tone.includes('concise');
    const isFormal = tone.includes('formal');
    const isFriendly = tone.includes('friendly');
    
    let greeting = isFormal ? 'Dear Client,' : isFriendly ? 'Hi there!' : 'Hi,';
    let message = '';
    
    if (isPrice) {
      if (isConcise) {
        message = `${greeting} After reviewing your ${project} requirements, I'd like to discuss a revised budget of $X to ensure premium quality delivery. Can we schedule a brief call?`;
      } else {
        message = `${greeting}\n\nThank you for sharing your ${project} project details. After careful consideration of the scope and requirements, I believe this project warrants a higher investment to deliver the quality results you deserve.\n\nI'd like to propose a budget adjustment to $X, which would allow me to:\n- Dedicate proper time to research and planning\n- Implement best practices and thorough testing\n- Provide ongoing support and revisions\n\nWould you be open to discussing this further? I'm confident the value will exceed your expectations.`;
      }
    } else if (isSkill) {
      if (lcIntent.includes('android') && lcProject.includes('ios')) {
        message = `${greeting}\n\nI appreciate you considering me for your iOS app project. While my expertise is primarily in Android development, I want to be transparent about this mismatch.\n\nI can offer a few options:\n- Partner with an iOS specialist I trust for the best results\n- Explore a cross-platform solution using React Native or Flutter\n- Refer you to a qualified iOS developer in my network\n\nWhat approach would work best for your timeline and goals?`;
      } else {
        message = `${greeting}\n\nThank you for the project details. I want to be upfront - my core expertise doesn't fully align with your technical requirements for ${project}.\n\nI believe in delivering excellence, so I'd recommend either:\n- Collaborating with a specialist in this area\n- Exploring alternative technical approaches that leverage my strengths\n\nWould you like me to suggest some qualified professionals who would be a perfect fit?`;
      }
    } else if (isApology) {
      message = `${greeting}\n\nI sincerely apologize for the inconvenience regarding your ${project} project. I take full responsibility and want to make this right immediately.\n\nHere's how I plan to resolve this:\n- [Specific corrective action based on the issue]\n- Additional quality checks to prevent future occurrences\n- Priority treatment for any revisions needed\n\nI value our working relationship and am committed to exceeding your expectations moving forward.`;
    } else if (isGratitude) {
      message = `${greeting}\n\nThank you so much for considering me for your ${project} project! I'm genuinely excited about the opportunity to bring your vision to life.\n\nYour project aligns perfectly with my expertise, and I'm already envisioning some creative approaches that could add real value. I appreciate your trust in my abilities and look forward to collaborating with you.\n\nShall we schedule a quick call to discuss the next steps?`;
    } else {
      // Situation / complaint / emotional context handling (don't call it a "project")
      if (isSituationContext) {
        if (isInappropriateRequest) {
          message = `${greeting}\n\nI need to stay within professional boundaries, so I won't be able to accommodate that personal request. I'm happy to continue with the agreed work and keep things focused on the deliverables. If you have any updates related to the actual work, send them over and I'll prioritize them.`;
        } else if (isApology) {
          message = `${greeting}\n\nI understand there's frustration around this. I take the concern seriously and want to move us forward constructively. Here's what I'll do next:\n- Clarify what’s been completed so far\n- Identify any gap or misunderstanding\n- Provide a concrete adjustment or timeline if needed\n\nLet me know if that plan works or if you'd like a different approach.`;
        } else {
          message = `${greeting}\n\nThanks for outlining the situation. Here's a professional reply you can send:\n\n"I appreciate your message. To keep things productive, I'd like to stay focused on the agreed scope. That request doesn’t fall under my role, so I’ll have to decline it. If there’s anything specific you need related to the work, let me know and I’ll address it promptly."\n\nLet me know if you want a softer or firmer tone and I can adjust.`;
        }
      } else {
        // General project response
        if (isConcise) {
          message = `${greeting} Thanks for the ${project} details. I understand your requirements and I'm ready to help. Let's discuss the next steps - are you available for a brief call this week?`;
        } else {
          message = `${greeting}\n\nThank you for sharing the details about your ${project} project. I've reviewed your requirements and I'm confident I can deliver exactly what you're looking for.\n\nBased on what you've described, I can help you achieve your goals effectively. I'd love to discuss your specific preferences and timeline to ensure we're perfectly aligned.\n\nWhat would be the best way to move forward? I'm available for a call this week to dive deeper into the details.`;
        }
      }
    }
    
    return message;
  }

  // (Removed offline fallback generator per request; focusing on real AI responses only)

  // Usage/Pro (disabled: app is free). Keeping minimal state to avoid bigger refactors.
  // Free mode: no usage or pro state

  // Optional: UPI donate config (set in Vercel env as VITE_UPI_ID and VITE_UPI_NAME)
  const UPI_ID = (import.meta as any).env?.VITE_UPI_ID as string | undefined;
  const UPI_NAME = (import.meta as any).env?.VITE_UPI_NAME as string | undefined;
  const makeUpiLink = (amount?: number, note = 'Support the project') => {
    if (!UPI_ID) return '';
    const parts = [
      `pa=${encodeURIComponent(UPI_ID)}`,
      `pn=${encodeURIComponent(UPI_NAME || 'Creator')}`,
      'cu=INR',
    ];
    if (amount) parts.push(`am=${encodeURIComponent(String(amount))}`);
    if (note) parts.push(`tn=${encodeURIComponent(note)}`);
    return `upi://pay?${parts.join('&')}`;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setGenError(null);
    
    // Dynamic loading messages for better UX
    setLoadingText('Crafting...');
    setTimeout(() => setLoadingText('Polishing...'), 2000);
    setTimeout(() => setLoadingText('Almost ready...'), 5000);
    
    // Model selection based on tone - prioritize fastest models
    const getOrderedModels = () => {
      // Fast, reliable models prioritized for speed
      const fastModels = [
        'meta-llama/llama-3.1-8b-instruct:free',  // Very fast
        'deepseek/deepseek-chat-v3-0324:free',    // Fast and good quality
        'google/gemma-2-9b-it:free',              // Fast Google model
        'mistralai/mistral-7b-instruct:free',     // Reliable and quick
        'qwen/qwen-2.5-7b-instruct:free',         // Good backup
      ];
      return fastModels;
    };
    
    // Prompt setup
    const isConcise = template.toLowerCase().includes('concise');
    
    const systemPrompt = `You are an expert freelance messaging assistant.

${isConcise ? '🚨🚨 ULTRA CONCISE MODE: Reply with EXACTLY ONE SHORT SENTENCE. Maximum 15 words total. No bullet points, no explanations, no formatting. Just ONE direct sentence answering their need. 🚨🚨' : ''}

CRITICAL INSTRUCTIONS:
- Do not include salutations like "Dear Client," at the beginning or closing sign-offs like "Regards," or "Sincerely," at the end.
- Read the CLIENT CONTEXT, FREELANCER INTENT, and TONE PREFERENCE carefully.
- Write a response that directly addresses the freelancer's specific goal using the requested tone.
- Always analyze all three fields before crafting your response; integrate insights from all inputs.
- Do not describe your writing process or provide tips; only output the complete, ready-to-send message.
- Use **bold** to highlight key points or important statements.${isConcise ? '' : `
- Use bullet points when they improve clarity (max 4 points with "- " prefix).
- Use numbered lists for sequential or step-by-step instructions (use "1. " prefix).`}

TONE GUIDELINES:
- CONCISE: MANDATORY - Maximum 15 words total. One sentence only. No bullet points ever. Direct answer only.
- FORMAL: Professional language, structured approach, avoid contractions
- FRIENDLY: Warm, approachable tone while maintaining professionalism
- APOLOGY: Acknowledge responsibility, express genuine regret, offer solutions
- GRATITUDE: Express appreciation, acknowledge value, maintain humble confidence
- DEFAULT: Balanced professional tone, clear and engaging

RESPONSE FORMATS:
- Single paragraph for simple responses.
- Multiple paragraphs for complex situations.
- Mix formats when it enhances clarity.`;

    const userPrompt = `CLIENT CONTEXT: ${project}
FREELANCER INTENT: ${intent}
TONE PREFERENCE: ${template}`;

    try {
      if (!OPENROUTER_KEY) throw new Error('Missing OpenRouter API key');
      
      // Direct fetch to OpenRouter primary model with timeout
      const model = getOrderedModels()[0];
      
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        signal: controller.signal,
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
          max_tokens: template.includes('concise') ? 25 : 280, // Ultra strict for concise
          temperature: 0.4, // Lower for faster, more focused responses
          top_p: 0.8, // Slightly lower for speed
          frequency_penalty: 0.1, // Reduce repetition
        }),
      });
      
      clearTimeout(timeoutId); // Clear timeout on success
      
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`OpenRouter ${res.status}: ${errText.slice(0,160)}`);
      }
      
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error('No AI content returned');
      
      setOrigin('ai');
      const cleanedMessage = enforceConciselimits(cleanMessage(content), template);
      setOutput(cleanedMessage);
      
      // Save to history
      const newEntry = { project, intent, message: cleanedMessage, timestamp: new Date().toISOString() };
      const updatedHistory = [newEntry, ...history].slice(0, 10); // Keep only last 10
      setHistory(updatedHistory);
      localStorage.setItem('messageHistory', JSON.stringify(updatedHistory));
      
      try { (window as any).plausible?.('Generate Success'); } catch {}
      
    } catch (err: any) {
      console.error('AI generation error', err);
      
      // Handle specific timeout errors
      if (err.name === 'AbortError') {
        setGenError('Generation timeout - using fallback');
      } else {
        setGenError(err.message);
      }
      
      // Fallback if AI fails or key missing
      const fallback = generateOfflineFallback(project, intent, template);
      setOrigin('fallback');
      const cleanedFallback = enforceConciselimits(cleanMessage(fallback), template);
      setOutput(cleanedFallback);
      
      // Save fallback to history too
      const newEntry = { project, intent, message: cleanedFallback, timestamp: new Date().toISOString() };
      const updatedHistory = [newEntry, ...history].slice(0, 10);
      setHistory(updatedHistory);
      localStorage.setItem('messageHistory', JSON.stringify(updatedHistory));
      
      try { (window as any).plausible?.('Generate Failure'); } catch {}
    } finally {
      setLoading(false);
      setLoadingText('Generate');
    }
  }

  // Upgrade disabled (free forever)

  return (
    <>
      {/* Custom global cursor - ALWAYS on top */}
      {hasPointer && (
        <div
            style={{
              position: 'fixed',
              left: cursorPos.x - 14,
              top: cursorPos.y - 14,
              width: 28,
              height: 28,
              borderRadius: '50%',
              pointerEvents: 'none',
              zIndex: 999999,
              mixBlendMode: 'normal',
              border: 'none',
              boxSizing: 'border-box',
              willChange: 'transform',
              transform: 'translate3d(0, 0, 0)',
              background: `radial-gradient(circle at 50% 50%, ${palette.cream} 0%, ${palette.sand}AA 70%, transparent 100%)`,
              boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
              transition: 'none',
            }}
          />
      )}
      
      {/* IFOXY STUDIOS Intro Animation */}
      <AnimatePresence mode="wait">
        {!isIntroComplete && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              scale: 1.02,
              filter: "blur(4px)"
            }}
            transition={{ 
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1]
            }}
            style={{
              position: 'fixed',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `linear-gradient(135deg, ${palette.cream} 0%, #F8F4EC 50%, ${palette.mint} 100%)`,
              zIndex: 1000,
              willChange: 'transform, opacity, filter',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ 
                opacity: 0, 
                y: -10, 
                scale: 0.98
              }}
              transition={{ 
                duration: 0.8, 
                ease: [0.16, 1, 0.3, 1],
                delay: 0.1 
              }}
              style={{
                fontSize: 'clamp(2.5rem, 8vw, 5rem)',
                fontWeight: 800,
                color: palette.purple,
                letterSpacing: '-2px',
                textAlign: 'center',
                textShadow: `0 2px 20px ${palette.purple}20`,
                willChange: 'transform, opacity',
              }}
            >
              IFOXY STUDIOS
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main App Content - Show after intro */}
      <AnimatePresence mode="wait">
        {isIntroComplete && (
          <motion.div
            initial={{ 
              opacity: 0,
              y: 8,
              filter: "blur(6px)",
              scale: 0.99
            }}
            animate={{ 
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              scale: 1
            }}
            transition={{ 
              duration: 0.6, 
              ease: [0.16, 1, 0.3, 1],
              delay: 0.05
            }}
            style={{ willChange: 'transform, opacity, filter' }}
          >
            <Nav />
            {/* Landing hero */}
            <main>
              <Landing onStart={handleStart} />
              {/* Showcase section */}
              <Showcase />
              {/* Main application section */}
              <section id="app-root" style={{ position: 'relative' }} aria-label="Freelance Message Generator Tool">
                <h1 style={{ position: 'absolute', left: '-9999px' }}>
                  AI-Powered Freelance Message Generator - Professional Client Communication Tool
                </h1>
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          minHeight: '100vh',
          width: '100%',
      // Avoid nested scroll containers; let the document handle scroll for smoother behavior
      overflow: 'visible',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Poppins, Inter, Arial, sans-serif',
          background: `linear-gradient(180deg, ${palette.cream} 0%, #F5F1EA 60%, #F2ECE3 100%)`,
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
            background: `radial-gradient(circle at 70% 30%, ${palette.purple}22 0%, transparent 50%), radial-gradient(circle at 20% 80%, ${palette.sand}22 0%, transparent 60%)`,
            mixBlendMode: 'multiply',
            // animation removed to reduce jank on low-power devices
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
          
        >
          <span style={{
            fontFamily: 'Poppins, Inter, Arial, sans-serif',
            fontWeight: 700,
            fontSize: '2.1rem',
            color: palette.purple,
            letterSpacing: '-1.5px',
            textShadow: `0 2px 16px ${palette.purple}33`,
            display: 'block',
            marginBottom: '0.5rem',
          }}>
            The Ultimate Client Message Generator
          </span>
          <span style={{
            fontFamily: 'Poppins, Inter, Arial, sans-serif',
            fontWeight: 500,
            fontSize: '1.18rem',
            color: palette.purple,
            textShadow: `0 1px 8px ${palette.purple}33`,
            lineHeight: 1.6,
          }}>
            Instantly craft perfect, human-like messages for your freelance clients. Powered by AI, styled for 2025, and animated for pure delight. <br />
            <span style={{ color: palette.black, fontWeight: 600 }}>Mobile-friendly, beautiful, and always on brand.</span>
          </span>
        </motion.div>
        <motion.div
          ref={cardRef}
          initial={{ y: 60, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 80, damping: 16, duration: 0.7 }}
          style={{
            background: palette.cream,
            borderRadius: '1.3rem',
            boxShadow: '0 8px 24px 0 rgba(0,0,0,0.06)',
            padding: 'clamp(1.5rem, 4vw, 2.5rem) clamp(1rem, 3vw, 1.2rem) clamp(1.5rem, 4vw, 2rem) clamp(1rem, 3vw, 1.2rem)',
            maxWidth: 680,
            minWidth: 320,
            width: 'calc(100% - 2rem)',
            margin: 'clamp(1rem, 3vw, 2rem) 1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            border: `1.5px solid ${palette.sand}`,
            position: 'relative',
            boxSizing: 'border-box',
            zIndex: 3,
            overflow: 'visible',
            cursor: hasPointer ? 'none' : 'auto',
          }}
          onMouseMove={e => {
            if (!cardRef.current) return;
            const rect = cardRef.current.getBoundingClientRect();
            const newX = e.clientX - rect.left;
            const newY = e.clientY - rect.top;
            // Only update if position changed significantly (reduces jank)
            if (Math.abs(newX - cursor.x) > 2 || Math.abs(newY - cursor.y) > 2) {
              setCursor({
                x: newX,
                y: newY,
                active: true,
              });
            }
          }}
          onMouseEnter={() => setCursor(c => ({ ...c, active: true }))}
          onMouseLeave={() => setCursor(c => ({ ...c, active: false }))}
          
        >
          {/* Cursor-following animated gradient overlay */}
          {cursor.active && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.25, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{
                pointerEvents: 'none',
                position: 'absolute',
                left: cursor.x - 60,
                top: cursor.y - 60,
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${palette.purple}33 0%, ${palette.sand}15 70%, transparent 100%)`,
                filter: 'blur(4px)',
                zIndex: 10,
                willChange: 'transform, opacity',
              }}
            />
          )}
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              marginBottom: '1.2rem',
              fontWeight: 600,
              fontSize: '2rem',
              letterSpacing: '-1px',
              color: palette.purple,
              textAlign: 'center',
              fontFamily: 'Poppins, Inter, Arial, sans-serif',
              willChange: 'transform, opacity',
            }}
          >
            Client Message Generator
          </motion.h2>
          <motion.form
            style={{ 
              width: '100%', 
              maxWidth: '600px',
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1rem', 
              cursor: hasPointer ? 'none' : 'auto',
              padding: '0 1rem'
            }}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7, type: 'spring', stiffness: 60 }}
          >
            <div style={{ cursor: hasPointer ? 'none' : 'auto' }}>
              <label htmlFor="project" style={{ color: palette.black, fontWeight: 600, fontSize: '0.95rem', fontFamily: 'Poppins, Inter, Arial, sans-serif', display: 'block', marginBottom: '0.35rem' }}>
                Project summary
              </label>
              <motion.input
                id="project"
                name="project"
                type="text"
                placeholder={project ? '' : projectHint}
                value={project}
                onChange={e => setProject(e.target.value)}
                onFocus={(e) => {
                  setProjectFocused(true);
                  e.target.style.outline = 'none';
                  e.target.style.border = `2px solid ${palette.sage}`;
                  e.target.style.transition = 'border-color 0.15s ease-out';
                }}
                onBlur={(e) => {
                  setProjectFocused(false);
                  e.target.style.border = `1.5px solid ${palette.mint}`;
                  e.target.style.transition = 'border-color 0.15s ease-out';
                }}
                required
                aria-label="Project summary - Describe your client's project or situation"
                aria-describedby="project-help"
                autoComplete="off"
                whileFocus={{ 
                  scale: 1.01, 
                  boxShadow: `0 0 0 2px ${palette.sage}33`,
                  transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] }
                }}
                style={{
                  width: '100%',
                  padding: 'clamp(0.7rem, 2vw, 0.9rem) 1rem',
                  border: `1.5px solid ${palette.mint}`,
                  borderRadius: '0.7rem',
                  background: `linear-gradient(90deg, ${palette.sage} 0%, ${palette.cream} 100%)`,
                  color: palette.black,
                  fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                  marginBottom: '0.2rem',
                  outline: 'none',
                  fontFamily: '"Courier New", Courier, monospace',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: hasPointer ? 'none' : 'auto',
                }}
              />
            </div>
            <div style={{ cursor: hasPointer ? 'none' : 'auto' }}>
              <label htmlFor="intent" style={{ color: palette.black, fontWeight: 600, fontSize: '0.95rem', fontFamily: 'Poppins, Inter, Arial, sans-serif', display: 'block', marginBottom: '0.35rem' }}>
                Your intent
              </label>
              <motion.input
                id="intent"
                name="intent"
                type="text"
                placeholder={intent ? '' : intentHint}
                value={intent}
                onChange={e => setIntent(e.target.value)}
                onFocus={(e) => {
                  setIntentFocused(true);
                  e.target.style.outline = 'none';
                  e.target.style.border = `2px solid ${palette.sage}`;
                  e.target.style.transition = 'border-color 0.15s ease-out';
                }}
                onBlur={(e) => {
                  setIntentFocused(false);
                  e.target.style.border = `1.5px solid ${palette.mint}`;
                  e.target.style.transition = 'border-color 0.15s ease-out';
                }}
                required
                aria-label="Your intent - What do you want to achieve with this message"
                aria-describedby="intent-help"
                autoComplete="off"
                whileFocus={{ 
                  scale: 1.01, 
                  boxShadow: `0 0 0 2px ${palette.sage}33`,
                  transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] }
                }}
                style={{
                  width: '100%',
                  padding: 'clamp(0.7rem, 2vw, 0.9rem) 1rem',
                  border: `1.5px solid ${palette.mint}`,
                  borderRadius: '0.7rem',
                  background: `linear-gradient(90deg, ${palette.sage} 0%, ${palette.cream} 100%)`,
                  color: palette.black,
                  fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                  marginBottom: '0.2rem',
                  outline: 'none',
                  fontFamily: '"Courier New", Courier, monospace',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: hasPointer ? 'none' : 'auto',
                }}
              />
            </div>
            <div style={{ cursor: hasPointer ? 'none' : 'auto', width: '100%' }}>
              <label style={{ color: palette.black, fontWeight: 600, fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', fontFamily: 'Poppins, Inter, Arial, sans-serif', display: 'block', marginBottom: '0.8rem' }}>Tone:</label>
              <div style={{ 
                display: 'flex', 
                gap: '0.6rem', 
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                {templates.map(t => (
                  <motion.button
                    key={t.label}
                    type="button"
                    onClick={() => setTemplate(t.value)}
                    whileHover={{ 
                      scale: 1.03,
                      background: template === t.value 
                        ? `linear-gradient(135deg, ${palette.purple} 0%, ${palette.sand} 100%)`
                        : `linear-gradient(135deg, ${palette.sand} 0%, ${palette.sage} 100%)`,
                      boxShadow: `0 4px 12px ${palette.purple}25`,
                      transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] }
                    }}
                    whileTap={{ 
                      scale: 0.97,
                      transition: { duration: 0.08 }
                    }}
                    animate={{
                      background: template === t.value 
                        ? `linear-gradient(135deg, ${palette.purple} 0%, ${palette.sand} 100%)`
                        : `linear-gradient(135deg, ${palette.cream} 0%, ${palette.mint} 100%)`,
                      color: template === t.value ? palette.white : palette.black,
                      boxShadow: template === t.value 
                        ? `0 3px 8px ${palette.purple}30`
                        : `0 2px 6px ${palette.sand}20`,
                      border: template === t.value 
                        ? `2px solid ${palette.purple}`
                        : `1.5px solid ${palette.sage}`,
                    }}
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '1.5rem',
                      fontFamily: 'Poppins, Inter, Arial, sans-serif',
                      fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                      fontWeight: template === t.value ? 600 : 500,
                      cursor: hasPointer ? 'none' : 'pointer',
                      outline: 'none',
                      border: 'none',
                      position: 'relative',
                      overflow: 'hidden',
                      minWidth: '80px',
                      textAlign: 'center',
                    }}
                  >
                    {template === t.value && (
                      <motion.div
                        layoutId="activeTone"
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: `linear-gradient(135deg, ${palette.purple}15 0%, ${palette.sand}15 100%)`,
                          borderRadius: '1.5rem',
                          zIndex: -1,
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    {t.label}
                  </motion.button>
                ))}
              </div>
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ 
                scale: 1.02, 
                background: `linear-gradient(90deg, ${palette.purple} 0%, ${palette.sand} 100%)`,
                transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] }
              }}
              whileTap={{ 
                scale: 0.98,
                transition: { duration: 0.08, ease: [0.16, 1, 0.3, 1] }
              }}
              style={{
                background: `linear-gradient(90deg, ${palette.sand} 0%, ${palette.purple} 100%)`,
                color: palette.white,
                fontWeight: 600,
                border: 'none',
                borderRadius: '0.7rem',
                padding: '0.9rem 1rem',
                fontSize: '1.1rem',
                cursor: hasPointer ? 'none' : 'auto',
                marginTop: '0.2rem',
                boxShadow: `0 6px 18px 0 ${palette.purple}22`,
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {loading ? loadingText : 'Generate'}
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
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -40, scale: 0.95 }}
                  transition={{ 
                      duration: 0.4, 
                      type: 'spring', 
                      stiffness: 120, 
                      damping: 16,
                      ease: [0.4, 0, 0.2, 1]
                    }}
                  style={{
                    background: palette.cream,
                    padding: '1.2rem 2.2rem 1.2rem 1.2rem',
                    borderRadius: '1rem',
                    minHeight: 80,
                    maxHeight: 340,
                    width: '100%',
                    maxWidth: 600,
                    margin: '0 auto', // center within wrapper
                    fontSize: '1.13rem',
                    whiteSpace: 'pre-wrap',
                    boxShadow: `0 2px 10px 0 rgba(0,0,0,0.06)`,
                    color: palette.black,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    border: `1.5px solid ${palette.sand}`,
                    wordBreak: 'break-word',
                    fontFamily: '"Courier New", Courier, monospace',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxSizing: 'border-box',
                    position: 'relative',
                    cursor: hasPointer ? 'none' : 'auto',
                  }}
                  className="generator-output"
                >
                  {/* Origin badge */}
                  <div style={{
                    position: 'sticky',
                    top: 0,
                    left: 0,
                    display: 'inline-flex',
                    gap: '0.4rem',
                    zIndex: 6,
                    marginBottom: '0.4rem'
                  }}>
                    <span style={{
                      fontSize: '0.65rem',
                      letterSpacing: '0.08em',
                      fontWeight: 700,
                      padding: '0.2rem 0.5rem',
                      borderRadius: 6,
                      background: origin === 'ai' ? palette.purple : palette.sage,
                      color: origin === 'ai' ? palette.white : palette.black,
                      boxShadow: `0 1px 4px 0 ${palette.sand}44`
                    }}>{origin === 'ai' ? 'AI' : 'FALLBACK'}</span>
                    {origin === 'fallback' && (
                      <span style={{
                        fontSize: '0.6rem',
                        padding: '0.2rem 0.45rem',
                        borderRadius: 6,
                        background: palette.mint,
                        color: palette.black,
                        fontWeight: 600,
                        boxShadow: `0 1px 3px 0 ${palette.sand}33`
                      }}>Add API key for full AI</span>
                    )}
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: output }} />
                  {/* Copy button moved inside the output box */}
                  <motion.button
                    type="button"
                    onClick={handleCopy}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 10,
                      width: 30,
                      height: 30,
                      background: palette.mint,
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: hasPointer ? 'none' : 'pointer',
                      border: `1.5px solid ${palette.sage}`,
                      boxShadow: `0 1.5px 6px 0 ${palette.sand}22`,
                      zIndex: 5,
                      padding: 0,
                    }}
                    aria-label="Copy generated message"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <svg viewBox="0 0 20 20" width={16} height={16} style={{ fill: palette.sand }}><path d="M7.629 15.314a1 1 0 0 1-1.415 0l-3.243-3.243a1 1 0 1 1 1.415-1.415l2.536 2.536 6.95-6.95a1 1 0 1 1 1.415 1.415l-7.658 7.657z"/></svg>
                    ) : (
                      <svg viewBox="0 0 20 20" width={16} height={16} style={{ fill: palette.black }}><path d="M6 2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6.828A2 2 0 0 0 15.414 6L12 2.586A2 2 0 0 0 10.828 2H6zm0 2h4.828L16 7.172V16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4zm2 4a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2h-2a1 1 0 0 1-1-1z"/></svg>
                    )}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
            {genError && (
              <div style={{
                marginTop: '0.8rem',
                background: palette.mint,
                border: `1px solid ${palette.sage}`,
                borderRadius: 10,
                padding: '0.65rem 0.85rem',
                fontSize: '0.7rem',
                fontFamily: '"Courier New", monospace',
                color: palette.black,
                lineHeight: 1.35,
                boxShadow: `0 1px 4px 0 ${palette.sand}44`
              }}>
                {genError}
                {origin === 'fallback' && (
                  <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <button
                      onClick={() => handleSubmit({ preventDefault(){} } as any)}
                      style={{
                        background: palette.purple,
                        color: palette.white,
                        border: 'none',
                        borderRadius: 6,
                        padding: '0.45rem 0.75rem',
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        boxShadow: `0 1px 4px 0 ${palette.sand}55`
                      }}
                      disabled={loading}
                    >Retry AI</button>
                    {!hasApiKey && (
                      <span style={{ fontSize: '0.6rem', fontWeight: 600 }}>Add .env: VITE_OPENROUTER_API_KEY=your_key_here then reload.</span>
                    )}
                  </div>
                )}
              </div>
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
        background: 'transparent',
        color: palette.purple,
        border: `1.5px solid ${palette.purple}`,
        borderRadius: '0.6rem',
        width: '36px',
        height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'none',
        boxShadow: 'none',
        transition: 'all 0.2s',
        fontSize: '18px',
        fontWeight: 700
                  }}
                  title="Toggle Message History"
                >
                  {/* clock/history icon */}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <circle cx="12" cy="12" r="9"></circle>
                    <path d="M12 7v5l3 3"></path>
                  </svg>
                </motion.button>
              )}
              
              {/* Monetization Buttons */}
              <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
        {(makeUpiLink(75) ? (
                  <motion.a
                    href={makeUpiLink(75, 'Thanks for the tool!')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
          background: 'transparent',
          color: palette.purple,
          fontWeight: 600,
          textDecoration: 'none',
          border: `1.5px solid ${palette.purple}`,
          borderRadius: '0.6rem',
          padding: '0.6rem 1rem',
          fontSize: '0.9rem',
          cursor: 'none',
          boxShadow: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem'
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 3.99 4 6.5 4c1.74 0 3.41 1.01 4.22 2.53C11.09 5.01 12.76 4 14.5 4 17.01 4 19 6 19 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    UPI Tip
                  </motion.a>
                ) : (
                  <motion.a
                    href="https://ko-fi.com/bluemoonsoon"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
          background: 'transparent',
          color: palette.purple,
          fontWeight: 600,
          textDecoration: 'none',
          border: `1.5px solid ${palette.purple}`,
          borderRadius: '0.6rem',
          padding: '0.6rem 1rem',
          fontSize: '0.9rem',
          cursor: 'none',
          boxShadow: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem'
                    }}
                  >
                    {/* mug icon */}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M3 7h13v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7z"></path>
                      <path d="M16 11h2a3 3 0 1 1 0 6h-2"></path>
                    </svg>
                    Tip
                  </motion.a>
                ))}
                
        <motion.button
                  onClick={() => navigator.share ? navigator.share({
                    title: 'Client Message Generator',
                    text: 'Check out this amazing AI tool for freelancers!',
                    url: window.location.href
                  }) : navigator.clipboard.writeText(window.location.href)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
          background: 'transparent',
          color: palette.purple,
          border: `1.5px solid ${palette.purple}`,
                    borderRadius: '0.6rem',
                    padding: '0.6rem',
                    cursor: 'none',
          boxShadow: 'none',
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
            Free forever. If this helps, consider a small tip.
          </span>
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {/* UPI donate if configured */}
            {makeUpiLink(50) && (
              <a
                href={makeUpiLink(50, 'Tip - Client Message Generator')}
        style={{ background: 'transparent', color: palette.purple, padding: '0.5rem 0.9rem', borderRadius: 8, textDecoration: 'none', fontWeight: 700, border: `1.5px solid ${palette.purple}` }}
              >
                ₹50 UPI Tip
              </a>
            )}
            {makeUpiLink(100) && (
              <a
                href={makeUpiLink(100, 'Tip - Client Message Generator')}
        style={{ background: 'transparent', color: palette.purple, padding: '0.5rem 0.9rem', borderRadius: 8, textDecoration: 'none', fontWeight: 700, border: `1.5px solid ${palette.purple}` }}
              >
                ₹100 UPI Tip
              </a>
            )}
            {/* Fallback Ko-fi tip */}
            <a
              href="https://ko-fi.com/bluemoonsoon"
              target="_blank"
              rel="noopener noreferrer"
              style={{ background: 'transparent', color: palette.purple, padding: '0.5rem 0.9rem', borderRadius: 8, textDecoration: 'none', fontWeight: 700, border: `1.5px solid ${palette.purple}` }}
            >
              Ko‑fi
            </a>
          </div>
          
        </motion.div>
  </motion.div>
  {/* Studio-style sections */}
  <Services />
  <Testimonials />
  <Logos />
  <div id="capabilities"><Capabilities /></div>
              </section>
            </main>
            <Contact />
            <Footer />
            {/* Hide text cursor (I-beam) on all input fields */}
            <style>{`
              input, input:focus, input:hover, textarea, textarea:focus, textarea:hover {
                cursor: none !important;
              }
              
              /* Hardware acceleration and performance optimizations */
              * {
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
              }
              
              /* Mobile optimizations */
              @media (max-width: 768px) {
                /* Prevent zoom on input focus */
                input, textarea, select {
                  font-size: 16px !important;
                  transform: none !important;
                }
                
                /* Optimize touch targets */
                button, [role="button"] {
                  min-height: 44px;
                  min-width: 44px;
                }
                
                /* Improve mobile scrolling */
                body {
                  -webkit-overflow-scrolling: touch;
                  overscroll-behavior: contain;
                }
                
                /* Mobile-specific transitions */
                * {
                  transition-duration: 0.2s !important;
                }
              }
              
              /* Optimize animations for 60fps */
              [data-framer-component] {
                will-change: transform, opacity;
                transform: translate3d(0, 0, 0);
                backface-visibility: hidden;
              }
              
              /* Smooth transitions for all interactive elements */
              button, input, [role="button"] {
                transition: transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), 
                           opacity 0.15s cubic-bezier(0.16, 1, 0.3, 1),
                           background 0.15s cubic-bezier(0.16, 1, 0.3, 1),
                           border-color 0.15s cubic-bezier(0.16, 1, 0.3, 1),
                           box-shadow 0.15s cubic-bezier(0.16, 1, 0.3, 1);
                will-change: transform;
              }
              
              /* Optimize scroll performance */
              html {
                scroll-behavior: smooth;
              }
              
              /* Optimize repaints */
              .motion-div {
                contain: layout style paint;
              }
              
              /* Mobile cursor handling */
              @media (pointer: coarse) {
                * {
                  cursor: auto !important;
                }
              }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
