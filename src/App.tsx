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

function App() {
  // Global loading state for IFOXY STUDIOS intro animation
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  
  // Complete intro after IFOXY STUDIOS animation - Extended for better brand impression
  React.useEffect(() => {
    const timer = setTimeout(() => setIsIntroComplete(true), 2800); // Extended intro duration for better brand impression
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
  // Input focus state for hint logic
  const [projectFocused, setProjectFocused] = useState(false);
  const [intentFocused, setIntentFocused] = useState(false);
  // Message history with proper typing
  const [history, setHistory] = useState<GeneratedMessage[]>(() => {
    const saved = localStorage.getItem('messageHistory');
    return saved ? JSON.parse(saved) : [];
  });
  // Expandable history items
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
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
  const [copied, setCopied] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  // For global custom cursor (optimized initialization) - COMMENTED OUT
  // const [cursorPos, setCursorPos] = useState(() => {
  //   // Safe initialization to prevent stuck cursor
  //   if (typeof window !== 'undefined') {
  //     return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  //   }
  //   return { x: 0, y: 0 };
  // });
  // const [hasPointer, setHasPointer] = useState(false);

  // Check if device has fine pointer (mouse/trackpad) vs coarse pointer (touch) - COMMENTED OUT
  // React.useEffect(() => {
  //   const checkPointer = () => {
  //     const hasFinePinter = window.matchMedia('(pointer: fine)').matches;
  //     setHasPointer(hasFinePinter);
      
  //     // Immediately update cursor position if pointer detected
  //     if (hasFinePinter) {
  //       const updateCursorNow = (e: MouseEvent) => {
  //         setCursorPos({ x: e.clientX, y: e.clientY });
  //         document.removeEventListener('mousemove', updateCursorNow);
  //       };
  //       document.addEventListener('mousemove', updateCursorNow, { passive: true, once: true });
  //     }
  //   };
  //   checkPointer();
    
  //   // Listen for changes (rare but possible)
  //   const media = window.matchMedia('(pointer: fine)');
  //   media.addEventListener('change', checkPointer);
  //   return () => media.removeEventListener('change', checkPointer);
  // }, []);

  // (Click spark effect removed for speed)
  // Removed cursorType variations; single neutral cursor used for clarity

  // Track mouse globally with 120fps performance and zero-lag during intro - COMMENTED OUT
  // React.useEffect(() => {
  //   if (!hasPointer) return; // Don't track on touch devices
    
  //   let rafId: number;
  //   let lastTime = 0;
  //   const throttleMs = 8.33; // True 120fps (8.33ms intervals)
  //   let isFirstMove = true;
    
  //   const move = (e: MouseEvent) => {
  //     const now = performance.now();
      
  //     // ZERO delay for first movement - instant response
  //     if (isFirstMove) {
  //       setCursorPos({ x: e.clientX, y: e.clientY });
  //       isFirstMove = false;
  //       lastTime = now;
  //       return;
  //     }
      
  //     if (now - lastTime < throttleMs) return; // Skip if too frequent
      
  //     // Use requestAnimationFrame for consistent 120fps updates
  //     if (rafId) cancelAnimationFrame(rafId);
  //     rafId = requestAnimationFrame(() => {
  //       setCursorPos({ x: e.clientX, y: e.clientY });
  //       lastTime = now;
  //     });
  //   };
    
  //   // Apply to entire document for consistent cursor speed everywhere
  //   document.addEventListener('mousemove', move, { passive: true, capture: false });
    
  //   // Multiple initialization methods for instant cursor response
  //   const initCursor = (e: MouseEvent) => {
  //     setCursorPos({ x: e.clientX, y: e.clientY });
  //     isFirstMove = false;
  //   };
    
  //   // Immediate initialization on any mouse activity
  //   document.addEventListener('mouseenter', initCursor, { passive: true, once: true });
  //   document.addEventListener('mouseover', initCursor, { passive: true, once: true });
  //   document.addEventListener('mousedown', initCursor, { passive: true, once: true });
    
  //   return () => {
  //     document.removeEventListener('mousemove', move);
  //     document.removeEventListener('mouseenter', initCursor);
  //     document.removeEventListener('mouseover', initCursor);
  //     document.removeEventListener('mousedown', initCursor);
  //     if (rafId) cancelAnimationFrame(rafId);
  //   };
  // }, [hasPointer]);

  // Hide system cursor only on pointer devices - COMMENTED OUT
  // React.useEffect(() => {
  //   if (hasPointer) {
  //     document.body.style.cursor = 'none';
  //     return () => { document.body.style.cursor = ''; };
  //   }
  // }, [hasPointer]);

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

  // Enhanced tone instruction system with Claude 4.1's upgraded logic
  const getToneInstructions = (selectedTone: string): {
    systemInstructions: string;
    userPrefix: string;
    modelParams: { maxTokens: number; temperature: number; topP: number };
  } => {
    const baseParams = { maxTokens: 450, temperature: 0.7, topP: 0.9 };
    
    // UNIVERSAL READABILITY INSTRUCTIONS (applies to ALL tones)
    const universalFormatting = `
UNIVERSAL FORMATTING RULES (USE INTELLIGENTLY):
- Use **bold** for key information (prices, dates, deliverables, important points)
- Use bullet points (- ) when listing 3+ items or features
- Use numbered lists (1. 2. 3.) for sequential steps or phases
- Break into paragraphs for different topics (when message > 50 words)
- Use line breaks strategically for visual clarity
- Add subtle section headers when covering multiple topics

MANDATORY BOLD & HEADING USAGE:
- ALL TONES (except concise): MUST use **bold text** for emphasis and section headings
- Section headings can appear at top, middle, or throughout the message as needed
- Examples: "**Project Details:**", "**Timeline:**", "**Next Steps:**", "**Pricing:**"
- CONCISE TONE: Use **bold** selectively for 2-3 key words/phrases only
- Always bold important numbers, dates, and deliverables

INTELLIGENT FORMATTING:
- Short messages (< 30 words): Bold key words, minimal structure
- Medium messages (30-100 words): Bold emphasis + 1-2 section headings
- Long messages (100+ words): Full formatting with multiple **headings**, paragraphs, lists
- Match formatting complexity to content complexity`;

    // ADAPTIVE CONCISE RULES (for optimal length based on input complexity)
    const adaptiveConciseRules = `
ADAPTIVE CONCISE RULES:
- Input < 20 words → Response: 30-60 words (brief and direct)
- Input 20-50 words → Response: 40-80 words (balanced detail)
- Input 50+ words → Response: 60-120 words (comprehensive coverage)
- Always prioritize clarity over brevity
- Include all essential information regardless of length`;

    // ADAPTIVE TOKEN LIMITS
    const adaptiveConciseTokens = 300; // Balanced for all content types
    
    switch (selectedTone) {
      case 'formal':
        return {
          systemInstructions: `
MANDATORY TONE: FORMAL BUSINESS COMMUNICATION
${universalFormatting}

FORMAL SPECIFIC REQUIREMENTS:
- Complete sentences with proper grammar
- Formal vocabulary ("regarding" not "about", "furthermore" not "also")
- NO contractions (use "I am" not "I'm", "cannot" not "can't")
- Professional structure with clear sections
- Use transitional phrases between paragraphs

FORMAL STRUCTURE:
1. **Opening**: Professional acknowledgment
2. **Main Body**: Organized with clear sections
3. **Details**: Bullet points for specifications
4. **Closing**: Clear next steps or call to action

Example formatting:
"**Project Proposal for [Project Name]**

I am pleased to present my proposal regarding your requirements. 

**Scope of Work:**
- Comprehensive analysis of...
- Development of...
- Implementation of...

**Timeline:** The project will require..."`,
            userPrefix: "Write a FORMAL business message with professional formatting:",
            modelParams: { ...baseParams, temperature: 0.5, topP: 0.85 }
          };
          
        case 'friendly':
          return {
            systemInstructions: `
MANDATORY TONE: WARM AND APPROACHABLE
${universalFormatting}

FRIENDLY SPECIFIC REQUIREMENTS:
- Conversational language with enthusiasm
- Use contractions naturally (I'm, we'll, it's)
- Exclamation marks for excitement!
- Personal touches and empathy
- Casual but organized structure

FRIENDLY STRUCTURE:
- Start with enthusiasm
- Use **bold** to highlight exciting parts
- Bullet points for fun features/benefits
- Keep paragraphs short and punchy
- End with engaging question or next step

Example formatting:
"I'm really excited about your project! 

**What I love about this:**
- The creative freedom you're offering
- The potential impact on users
- The innovative approach

Let me share how we can make this amazing..."`,
            userPrefix: "Write a FRIENDLY message with engaging formatting:",
            modelParams: { ...baseParams, temperature: 0.8, topP: 0.95 }
          };
          
        case 'concise':
          return {
            systemInstructions: `
MANDATORY: CONCISE BUT COMPLETE MESSAGE

ADAPTIVE CONCISE RULES:
1. For SHORT inputs (< 50 words total): Maximum 30 words response
2. For MEDIUM inputs (50-150 words): Maximum 60 words response  
3. For LONG inputs (150+ words): Maximum 100 words response
4. NEVER skip critical information from intent or project
5. Use minimal but smart formatting

CONCISE FORMATTING:
- Use **bold** only for crucial points (prices, deadlines)
- NO bullet points unless absolutely necessary
- Single paragraph for short messages
- 2-3 short paragraphs maximum for complex messages
- Every word must earn its place

PRIORITY ORDER (include in this order):
1. Core action/response to intent
2. Key details (price, timeline, deliverables)
3. Next step
4. (Skip pleasantries and fluff)

Example for complex input:
"**\$2000** for complete website development. **3-week timeline** includes design, development, testing. 

Covers all requirements: responsive design, payment integration, SEO optimization. 

Start Monday?"`,
            userPrefix: "Write a CONCISE but COMPLETE message (adapt length to input complexity):",
            modelParams: { maxTokens: 150, temperature: 0.4, topP: 0.75 }
          };
          
        case 'apology':
          return {
            systemInstructions: `
MANDATORY TONE: INTELLIGENT ADAPTIVE APOLOGY

FIRST: ANALYZE THE SITUATION SEVERITY:
1. Read the project summary and intent carefully
2. Detect the severity level:
   - MINOR ISSUE: Small delay, minor miscommunication, slight inconvenience
   - MODERATE ISSUE: Missed deadline, quality concerns, budget overrun
   - MAJOR ISSUE: Project failure, broken trust, significant loss
   - RELATIONSHIP CONTEXT: New client vs long-term client

ADAPTIVE APOLOGY LEVELS:

**LEVEL 1 - LIGHT ACKNOWLEDGMENT (Minor Issues):**
- Simple acknowledgment: "I understand the confusion about..."
- Light regret: "I should have communicated this earlier..."
- Quick solution: "Let me clarify/fix this right away..."
- Tone: Professional but not overly apologetic
Example: "I see where the miscommunication happened. Let me clarify the timeline - the design phase takes 3 days, not 2 as you understood. I should have been clearer about this."

**LEVEL 2 - MODERATE APOLOGY (Medium Issues):**
- Clear apology: "I apologize for the delay in..."
- Responsibility: "This was my oversight and I take responsibility..."
- Compensation: "To make up for this, I will..."
- Tone: Genuinely apologetic but maintaining professionalism
Example: "I apologize for missing yesterday's deadline. This was my oversight and I take responsibility. To make up for this, I'll prioritize your project today and deliver by evening, plus add an extra revision round at no charge."

**LEVEL 3 - DEEP APOLOGY (Major Issues):**
- Strong opening: "I sincerely apologize for..."
- Full accountability: "I take complete responsibility..."
- Impact acknowledgment: "I understand this has caused significant..."
- Major compensation: "To make this right, I will..."
- Future prevention: "I've implemented new processes to ensure..."
- Tone: Deeply apologetic, showing genuine remorse
Example: "I sincerely apologize for the complete failure to deliver your project on time. I take complete responsibility for this significant breach of trust. I understand this has impacted your business launch. To make this right, I will work through the weekend at no additional charge and provide a 30% discount. I've also implemented new project tracking to ensure this never happens again."

INTELLIGENCE RULES:
1. If the intent mentions "small" "slight" "minor" → Use Level 1
2. If the intent mentions "missed" "late" "wrong" → Use Level 2  
3. If the intent mentions "failed" "ruined" "disaster" → Use Level 3
4. If client is described as "understanding" "flexible" → Reduce level by 1
5. If client is described as "angry" "upset" "furious" → Increase level by 1
6. For long-term clients mentioned → Add personal touch
7. For new clients → Be more formal

NEVER OVER-APOLOGIZE:
- Don't apologize if the freelancer did nothing wrong
- Don't apologize for client's mistakes
- Don't apologize for industry-standard practices
- Match apology intensity to actual fault level

FORMATTING:
- Level 1: Single paragraph, minimal formatting
- Level 2: 2-3 paragraphs with **bold** key points
- Level 3: Full structured format with clear sections

${universalFormatting}
${adaptiveConciseRules}`,
            userPrefix: "Write an APPROPRIATELY SCALED apology based on the severity:",
            modelParams: { ...baseParams, temperature: 0.6, maxTokens: adaptiveConciseTokens }
          };
          
        case 'gratitude':
          return {
            systemInstructions: `
MANDATORY TONE: GENUINE GRATITUDE
${universalFormatting}

GRATITUDE SPECIFIC STRUCTURE:
**Opening:** Specific thanks
"Thank you for [specific action/support]"

**Impact:** How it helps (use bullets if multiple)
- Personal impact
- Project impact
- Future possibilities

**Recognition:** Acknowledge their effort
"Your [specific quality] made this possible"

**Reciprocation:** How you'll honor their trust
"In return, I will deliver..."

Use **bold** to emphasize what you're grateful for.`,
            userPrefix: "Write a GRATEFUL message with warm formatting:",
            modelParams: { ...baseParams, temperature: 0.75 }
          };
          
        default:
          return {
            systemInstructions: `
TONE: BALANCED PROFESSIONAL
${universalFormatting}

DEFAULT STRUCTURE:
- Clear topic introduction
- **Bold** key information
- Bullets for lists (3+ items)
- Numbered steps for processes
- Paragraphs for different topics
- Strong closing with next steps`,
            userPrefix: "Write a professional message with optimal formatting:",
            modelParams: baseParams
          };
      }
    };

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

  // Supporting functions for improved handleSubmit
  const getSmartModelOrder = (tone: string): string[] => {
    // ACCURATE free models that handle numbers/facts correctly
    const accurateFreeModels = [
      'google/gemini-2.0-flash-exp:free',  // BEST for accuracy
      'google/gemini-exp-1206:free',        // Excellent with numbers
      'meta-llama/llama-3.1-70b-instruct:free', // Larger = more accurate
      'meta-llama/llama-3.1-405b-instruct:free', // Huge model, very accurate
      'nousresearch/hermes-3-llama-3.1-405b:free', // Great for precision
      'qwen/qwen-2.5-72b-instruct',         // Good with facts
      'mistralai/mistral-7b-instruct:free', // Decent baseline
    ];
    
    // NOTE: Avoid meta-llama/llama-3.2-1b and 3.2-3b models - too small, hallucinate numbers
    
    const toneOptimizedOrder: { [key: string]: string[] } = {
      concise: [
        // For concise, prioritize ACCURATE models, not small ones!
        'google/gemini-2.0-flash-exp:free',  // Fast AND accurate
        'google/gemini-exp-1206:free',
        'mistralai/mistral-7b-instruct:free',
        ...accurateFreeModels.filter(m => !m.includes('405b')) // Skip huge ones for speed
      ],
      formal: [
        'google/gemini-exp-1206:free',  // Best for professional accuracy
        'nousresearch/hermes-3-llama-3.1-405b:free',
        'meta-llama/llama-3.1-70b-instruct:free',
        ...accurateFreeModels
      ],
      friendly: [
        'google/gemini-2.0-flash-exp:free',
        'meta-llama/llama-3.1-70b-instruct:free',
        ...accurateFreeModels
      ],
      apology: [
        'google/gemini-exp-1206:free',
        'nousresearch/hermes-3-llama-3.1-405b:free',
        ...accurateFreeModels
      ],
      gratitude: [
        'google/gemini-2.0-flash-exp:free',
        'meta-llama/llama-3.1-70b-instruct:free',
        ...accurateFreeModels
      ],
      default: accurateFreeModels
    };
    
    // Add premium models at the beginning if API key has credits
    const premiumModels = [
      'anthropic/claude-3-5-sonnet',
      'openai/gpt-4o-mini',  // Cheaper but accurate
    ];
    
    const models = toneOptimizedOrder[tone] || toneOptimizedOrder.default;
    return [...premiumModels, ...models, 'openrouter/auto']; // Auto as final fallback
  };

  const validateAndProcessMessage = (message: string, tone: string): string | null => {
    if (!message || message.trim().length === 0) return null;
    
    // Clean up common issues
    message = message
      .replace(/^(dear|hi|hello|greetings|hey)\s+\w+[,!]?\s*/gi, '')
      .replace(/(regards|sincerely|best|thanks|thank you|cheers|yours|warm regards|best regards|respectfully)[,.]?\s*$/gi, '')
      .trim();
    
    // Tone-specific validation and processing
    switch (tone) {
      case 'concise':
        // Strict enforcement for concise
        const sentences = message.split(/[.!?]+/).filter(s => s.trim());
        if (sentences.length === 0) return null;
        
        let conciseMessage = sentences[0].trim();
        const words = conciseMessage.split(/\s+/);
        
        if (words.length > 20) {
          // Force truncation with intelligent cutting
          const importantWords = words.filter(w => 
            !['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for'].includes(w.toLowerCase())
          );
          conciseMessage = importantWords.slice(0, 15).join(' ');
        }
        
        // Remove any formatting
        conciseMessage = conciseMessage.replace(/[*_~`]/g, '');
        
        return conciseMessage.endsWith('.') ? conciseMessage : conciseMessage + '.';
        
      case 'formal':
        // Verify formal tone markers
        if (message.includes("can't") || message.includes("won't") || message.includes("I'm")) {
          message = message
            .replace(/can't/g, 'cannot')
            .replace(/won't/g, 'will not')
            .replace(/I'm/g, 'I am')
            .replace(/we'll/g, 'we will')
            .replace(/it's/g, 'it is');
        }
        break;
        
      case 'friendly':
        // Ensure friendly tone has appropriate warmth
        if (!message.includes('!') && message.length < 200) {
          // Add subtle enthusiasm if missing
          message = message.replace(/\.$/, '!');
        }
        break;
    }
    
    return message;
  };

  const generateEnhancedFallback = (project: string, intent: string, tone: string): string => {
    // Actually analyze the user inputs instead of using generic templates
    const projectLower = project.toLowerCase().trim();
    const intentLower = intent.toLowerCase().trim();
    
    // Extract key information from project description
    const projectType = projectLower.includes('saas') ? 'SaaS platform' :
                       projectLower.includes('website') ? 'website' :
                       projectLower.includes('app') ? 'mobile app' :
                       projectLower.includes('ecommerce') ? 'ecommerce site' :
                       projectLower.includes('landing') ? 'landing page' :
                       'project';
    
    // Extract key information from intent
    const isTimeline = intentLower.includes('timeline') || intentLower.includes('deadline') || intentLower.includes('week') || intentLower.includes('month');
    const isBudget = intentLower.includes('budget') || intentLower.includes('price') || intentLower.includes('cost') || intentLower.includes('rate');
    const isQuestion = intentLower.includes('question') || intentLower.includes('ask') || intentLower.includes('clarify');
    
    // Extract specific timeline/budget mentions
    const timelineMatch = intent.match(/(\d+)\s*(week|month|day)s?/i);
    const budgetMatch = intent.match(/\$?(\d+)/);
    
    // Generate contextual response based on actual inputs
    let response = '';
    
    if (tone === 'concise') {
      if (isTimeline && timelineMatch) {
        response = `Requesting ${timelineMatch[0]} for the ${projectType}. Will ensure quality delivery within this timeframe.`;
      } else if (isBudget && budgetMatch) {
        response = `Proposing $${budgetMatch[1]} budget adjustment for the ${projectType} to meet requirements effectively.`;
      } else if (isQuestion) {
        response = `Need clarification on ${projectType} requirements. Can we discuss specifics?`;
      } else {
        response = `Regarding your ${projectType}: ${intent.split(' ').slice(0, 8).join(' ')}. Let's discuss next steps.`;
      }
    } else if (tone === 'formal') {
      if (isTimeline && timelineMatch) {
        response = `I am writing regarding the ${projectType} timeline. Based on the scope discussed, I would like to request ${timelineMatch[0]} to ensure comprehensive delivery that meets all requirements and quality standards.`;
      } else if (isBudget) {
        response = `Thank you for providing the ${projectType} details. After reviewing the requirements, I believe a budget discussion would be beneficial to ensure optimal results within your parameters.`;
      } else if (isQuestion) {
        response = `I have reviewed your ${projectType} requirements and have some questions to ensure precise delivery. Would you be available for a brief discussion to clarify the specific details?`;
      } else {
        response = `Thank you for sharing the ${projectType} information. I understand you need assistance with: ${intent}. I am prepared to address this professionally and efficiently.`;
      }
    } else { // friendly
      if (isTimeline && timelineMatch) {
        response = `Thanks for the ${projectType} details! I'd love to work on this with you. For the timeline, ${timelineMatch[0]} would work perfectly to make sure everything is polished and meets your vision.`;
      } else if (isBudget) {
        response = `Excited about your ${projectType}! I think we can create something amazing together. Let's chat about the budget to make sure we're aligned on delivering great results.`;
      } else if (isQuestion) {
        response = `Your ${projectType} sounds interesting! I have a few quick questions to make sure I understand exactly what you're looking for. Mind if we hop on a brief call?`;
      } else {
        response = `Love the concept for your ${projectType}! Regarding "${intent}" - I'm definitely up for helping with this. Let's discuss how we can make it happen!`;
      }
    }
    
    return response;
  };

  // Type for generated messages
  interface GeneratedMessage {
    id: string;
    project: string;
    intent: string;
    template: string;
    output: string;
    timestamp: Date;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setGenError(null);
    setOrigin('ai'); // Assume AI first
    
    const OPENROUTER_KEY = (import.meta as any).env?.VITE_OPENROUTER_API_KEY as string | undefined;
    
    if (!OPENROUTER_KEY) {
      console.log('🔴 NO API KEY - Using fallback template');
      setGenError('OpenRouter API key not configured');
      const fallback = generateOfflineFallback(project, intent, template);
      setOutput(fallback);
      setOrigin('fallback');
      setLoading(false);
      return;
    }
    
    const selectedTone = templates.find(t => t.value === template)?.label?.toLowerCase() || 'default';
    const toneConfig = getToneInstructions(selectedTone);
    
    // Enhanced system prompt that clearly establishes the freelancer-client relationship
    const systemPrompt = `You are writing AS a freelancer directly TO their client.

CRITICAL CONTEXT:
- You ARE the freelancer writing this message
- You are writing TO the client who hired you (or wants to hire you)
- The PROJECT SUMMARY describes what the CLIENT wants/needs from you
- The FREELANCER INTENT is what YOU (the freelancer) want to communicate to the client
- Generate the ACTUAL message the freelancer will send - not advice or consultation

ABSOLUTE REQUIREMENTS:
1. NO greetings (Dear, Hi, Hello) at the start
2. NO sign-offs (Regards, Sincerely, Thanks) at the end
3. Write in FIRST person as the freelancer ("I can deliver...", "I will need...")
4. Address the client directly in SECOND person ("your project", "you mentioned")
5. Follow the tone instructions EXACTLY as specified below

${toneConfig.systemInstructions}

FORMATTING GUIDELINES:
${selectedTone === 'concise' ? 
  '- Plain text only - NO formatting, NO bold, NO lists' : 
  `- Use **bold** to emphasize key points (prices, timelines, deliverables)
- Use bullet points (- ) for listing services, features, or deliverables (max 4 items)
- Use numbered lists (1. ) for step-by-step processes or phases
- Break into paragraphs for better readability when appropriate
- For complex messages, consider using subtle section breaks`
}

MESSAGE STRUCTURE:
${selectedTone === 'concise' ? 
  'Single sentence. Core message only. Under 20 words.' :
  selectedTone === 'formal' ?
  `1. Professional acknowledgment of their requirements
2. Clear statement of your proposal/response
3. Detailed explanation with specifics
4. Clear next steps or call to action` :
  selectedTone === 'friendly' ?
  `1. Warm acknowledgment showing enthusiasm
2. Your main response/proposal
3. Additional value or personal touch
4. Engaging question or next step` :
  selectedTone === 'apology' ?
  `1. Direct acknowledgment of the issue
2. Take responsibility without excuses
3. Specific solution or remedy
4. Commitment to improvement` :
  selectedTone === 'gratitude' ?
  `1. Specific appreciation for what they did
2. How it impacts you positively
3. Value it brings to the project
4. Forward-looking statement` :
  `1. Acknowledge their needs
2. Present your response/solution
3. Support with details if needed
4. Clear action items`
}

REMEMBER: You're the freelancer responding to the client's project needs with your specific intent.`;

    // Enhanced user prompt that's much clearer about the relationship
    const userPrompt = `Generate a message FROM the freelancer TO the client.

${toneConfig.userPrefix}

WHAT THE CLIENT WANTS/NEEDS (Project Summary):
${project}

WHAT THE FREELANCER WANTS TO COMMUNICATE (Your Intent):
${intent}

Based on the above, write the freelancer's message to the client that accomplishes the freelancer's intent while addressing the client's project needs.

${selectedTone === 'concise' ? 
  'CRITICAL: Maximum 20 words! One sentence only!' : 
  `Tone reminder: ${selectedTone} - Make sure the tone is clearly ${selectedTone} throughout the message.`}`;

    const models = getSmartModelOrder(selectedTone);
    let finalMessage: string | null = null;
    let attempts = 0;
    const maxAttempts = Math.min(15, models.length); // Try up to 15 models
    let hitPremiumLimit = false;
    
    const loadingMessages = [
      "Generating with AI...",
      "Trying premium models...",
      "Premium limit reached, switching to free models...",
      "Connecting to free Llama model...",
      "Trying Google Gemini free tier...",
      "Attempting Qwen model...",
      "Connecting to Mistral...",
      "Trying alternative free models...",
      "Searching for available AI...",
      "Almost there...",
      "Finding best available model...",
      "One more attempt...",
      "Finalizing generation..."
    ];
    
    console.log(`🚀 Starting AI generation for ${selectedTone} tone with ${models.length} available models`);
    
    while (attempts < maxAttempts && !finalMessage) {
      const model = models[attempts];
      const isPremium = !model.includes(':free') && !model.includes('auto');
      attempts++;
      
      // Skip premium models if we already hit the limit
      if (isPremium && hitPremiumLimit) {
        console.log(`⏭️ Skipping premium model ${model} (already hit limit)`);
        continue;
      }
      
      setOutput(loadingMessages[Math.min(attempts - 1, loadingMessages.length - 1)]);
      
      console.log(`🔄 Attempt ${attempts}/${maxAttempts}: Trying ${model} (${isPremium ? 'PREMIUM' : 'FREE'})`);
      
      try {
        const controller = new AbortController();
        const timeoutMs = isPremium ? 25000 : 30000; // More time for free models
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        
        const requestBody = {
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          ...toneConfig.modelParams,
          stream: false,
        };
        
        console.log(`📤 Sending request to ${model}...`);
        
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENROUTER_KEY}`,
            'HTTP-Referer': window.location.origin,
            'X-Title': 'Freelance Message Generator',
          },
          signal: controller.signal,
          body: JSON.stringify(requestBody),
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          const errorText = await response.text();
          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch {
            errorData = { error: errorText };
          }
          
          console.warn(`❌ Model ${model} failed (${response.status}):`, errorData?.error?.message || errorText.slice(0, 200));
          
          // Detect premium limit errors
          if (response.status === 403 || response.status === 402) {
            if (isPremium) {
              console.log(`💰 Premium model ${model} hit limit - switching to FREE models only`);
              hitPremiumLimit = true;
            }
          } else if (response.status === 404) {
            console.log(`🚫 Model ${model} not found - trying next`);
          } else if (response.status === 429) {
            console.log(`⏳ Rate limit hit - waiting 2s before retry`);
            await new Promise(resolve => setTimeout(resolve, 2000));
          } else if (response.status === 401) {
            console.error('🔑 Invalid API key!');
            throw new Error('Invalid API key');
          }
          continue;
        }
        
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        
        if (!content || content.trim().length < 10) {
          console.warn(`⚠️ Invalid/empty content from ${model}`);
          continue;
        }
        
        console.log(`✅ SUCCESS with ${isPremium ? 'PREMIUM' : 'FREE'} model: ${model}`);
        console.log(`📝 Raw AI Response (first 200 chars): ${content.slice(0, 200)}...`);
        
        // Validate and process the message
        finalMessage = validateAndProcessMessage(content, selectedTone);
        
        if (finalMessage) {
          console.log(`🎉 Final processed message ready (${finalMessage.length} chars)`);
          setOrigin('ai');
          break;
        }
        
      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.warn(`⏱️ Timeout for model ${model}`);
        } else if (error.message === 'Invalid API key') {
          setGenError('API key authentication failed');
          break;
        } else {
          console.error(`🔥 Error with model ${model}:`, error.message || error);
        }
      }
    }
    
    // Only use fallback if ALL models failed
    if (!finalMessage) {
      console.log('🔴 ALL AI MODELS FAILED - Using template fallback as last resort');
      console.log(`📊 Tried ${attempts} models, hit premium limit: ${hitPremiumLimit}`);
      finalMessage = generateEnhancedFallback(project, intent, selectedTone);
      setOrigin('fallback');
      setGenError('All AI services unavailable - using smart fallback');
    } else {
      console.log('✨ Successfully generated AI message');
    }
    
    // Save to history
    const newMessage: GeneratedMessage = {
      id: Date.now().toString(),
      project,
      intent,
      template,
      output: finalMessage,
      timestamp: new Date(),
    };
    
    const updatedHistory = [newMessage, ...history.slice(0, 9)];
    setHistory(updatedHistory);
    localStorage.setItem('messageHistory', JSON.stringify(updatedHistory));
    
    // Apply final tone enforcement for concise messages
    if (selectedTone === 'concise') {
      finalMessage = enforceConciselimits(finalMessage, template);
    }
    
    setOutput(cleanMessage(finalMessage));
    setLoading(false);
  }

  // Upgrade disabled (free forever)

  return (
    <>
      {/* 
      Custom global cursor - COMMENTED OUT
      {hasPointer && (
        <div
            style={{
              position: 'fixed',
              left: cursorPos.x - 12,
              top: cursorPos.y - 12,
              width: 24,
              height: 24,
              borderRadius: '50%',
              pointerEvents: 'none',
              zIndex: 999999,
              mixBlendMode: 'normal',
              border: 'none',
              boxSizing: 'border-box',
              willChange: 'transform',
              transform: 'translate3d(0, 0, 0)',
              background: `radial-gradient(circle at 50% 50%, ${palette.cream} 0%, ${palette.sand}66 70%, transparent 100%)`,
              boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
              transition: 'none',
            }}
          />
      )}
      */}
      
      
      {/* IFOXY STUDIOS Intro Animation - Extended Duration with Ultra-Smooth 120fps Transitions */}
      <AnimatePresence mode="wait">
        {!isIntroComplete && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              scale: 1.002,
              filter: 'blur(1px)'
            }}
            transition={{ 
              duration: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.1
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
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)',
              contain: 'layout style paint',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                transition: {
                  duration: 1.2,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  delay: 0.3
                }
              }}
              exit={{ 
                opacity: 0, 
                y: -8, 
                scale: 1.02,
                transition: {
                  duration: 0.5,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }
              }}
              transition={{ 
                duration: 0.2, 
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              style={{
                fontSize: 'clamp(2.5rem, 8vw, 5rem)',
                fontWeight: 800,
                color: palette.purple,
                letterSpacing: '-2px',
                textAlign: 'center',
                textShadow: `0 2px 20px ${palette.purple}20`,
                willChange: 'transform, opacity',
                backfaceVisibility: 'hidden',
                transform: 'translateZ(0)',
                contain: 'layout style',
              }}
            >
              IFOXY STUDIOS
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main App Content - Enhanced 120fps Optimized Transition */}
      <AnimatePresence mode="wait">
        {isIntroComplete && (
          <motion.div
            initial={{ 
              opacity: 0,
              scale: 0.995,
              y: 8
            }}
            animate={{ 
              opacity: 1,
              scale: 1,
              y: 0
            }}
            transition={{ 
              duration: 0.8, 
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.1
            }}
            style={{ 
              willChange: 'transform, opacity',
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)',
              contain: 'layout style paint'
            }}
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
        transition={{ duration: 0.4 }}
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
          animate={{ opacity: 0.8 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none',
            background: `radial-gradient(circle at 70% 30%, ${palette.purple}15 0%, transparent 50%), radial-gradient(circle at 20% 80%, ${palette.sand}15 0%, transparent 60%)`,
            mixBlendMode: 'multiply',
          }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none',
            background: 'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.02\'/%3E%3C/svg%3E")',
          }}
        />
        <style>{`
          @keyframes moveGlow {
            0% { filter: blur(0px) brightness(1); }
            100% { filter: blur(3.5px) brightness(1.12); }
          }
          
          @keyframes slideDown {
            0% { 
              opacity: 0; 
              transform: translateY(-10px); 
              max-height: 0;
            }
            100% { 
              opacity: 1; 
              transform: translateY(0); 
              max-height: 500px;
            }
          }
        `}</style>
        {/* Animated site theory/description */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, type: 'spring', stiffness: 80 }}
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
            letterSpacing: '-1.2px',
            textShadow: `0 2px 16px ${palette.purple}33`,
            display: 'block',
            marginBottom: '0.5rem',
            overflow: 'visible',
            paddingRight: '2px',
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
          transition={{ type: 'spring', stiffness: 100, damping: 20, duration: 0.4 }}
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
            cursor: 'auto',
          }}
          onMouseMove={e => {
            if (!cardRef.current) return;
            const rect = cardRef.current.getBoundingClientRect();
            const newX = e.clientX - rect.left;
            const newY = e.clientY - rect.top;
            // Increased threshold to reduce updates and improve performance
            if (Math.abs(newX - cursor.x) > 15 || Math.abs(newY - cursor.y) > 15) {
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
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 0.15, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{
                pointerEvents: 'none',
                position: 'absolute',
                left: cursor.x - 40,
                top: cursor.y - 40,
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${palette.purple}25 0%, ${palette.sand}10 70%, transparent 100%)`,
                filter: 'blur(3px)',
                zIndex: 10,
                willChange: 'transform, opacity',
              }}
            />
          )}
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
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
              cursor: 'auto',
              padding: '0 1rem'
            }}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7, type: 'spring', stiffness: 60 }}
          >
            <div style={{ cursor: 'auto' }}>
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
                  cursor: 'text',
                }}
              />
            </div>
            <div style={{ cursor: 'auto' }}>
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
                  cursor: 'text',
                }}
              />
            </div>
            <div style={{ cursor: 'auto', width: '100%' }}>
              <label style={{ color: palette.black, fontWeight: 600, fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', fontFamily: 'Poppins, Inter, Arial, sans-serif', display: 'block', marginBottom: '0.8rem' }}>Tone:</label>
              <div style={{ 
                display: 'flex', 
                gap: '0.6rem', 
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                {templates.map(t => {
                  const isSelected = template === t.value;
                  return (
                    <button
                      key={t.label}
                      type="button"
                      onClick={() => setTemplate(t.value)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '1.5rem',
                        fontFamily: 'Poppins, Inter, Arial, sans-serif',
                        fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                        fontWeight: isSelected ? 600 : 500,
                        cursor: 'pointer',
                        outline: 'none',
                        border: isSelected 
                          ? `2px solid ${palette.purple}`
                          : `1.5px solid ${palette.sage}`,
                        background: isSelected 
                          ? `linear-gradient(135deg, ${palette.purple} 0%, ${palette.sand} 100%)`
                          : `linear-gradient(135deg, ${palette.cream} 0%, ${palette.mint} 100%)`,
                        color: isSelected ? palette.white : palette.black,
                        boxShadow: isSelected 
                          ? `0 2px 6px ${palette.purple}25`
                          : `0 1px 3px ${palette.sand}15`,
                        position: 'relative',
                        overflow: 'hidden',
                        minWidth: '80px',
                        textAlign: 'center',
                        transition: 'transform 0.05s ease-out',
                        transform: 'scale(1)',
                        willChange: 'transform',
                        backfaceVisibility: 'hidden',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.015)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                      onMouseDown={(e) => {
                        e.currentTarget.style.transform = 'scale(0.985)';
                      }}
                      onMouseUp={(e) => {
                        e.currentTarget.style.transform = 'scale(1.015)';
                      }}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ 
                scale: 1.015, 
                background: `linear-gradient(90deg, ${palette.purple} 0%, ${palette.sand} 100%)`,
                transition: { duration: 0.08, ease: [0.25, 0.46, 0.45, 0.94] }
              }}
              whileTap={{ 
                scale: 0.985,
                transition: { duration: 0.05, ease: [0.25, 0.46, 0.45, 0.94] }
              }}
              style={{
                background: `linear-gradient(90deg, ${palette.sand} 0%, ${palette.purple} 100%)`,
                color: palette.white,
                fontWeight: 600,
                border: 'none',
                borderRadius: '0.7rem',
                padding: '0.9rem 1rem',
                fontSize: '1.1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '0.2rem',
                boxShadow: `0 6px 18px 0 ${palette.purple}22`,
                opacity: loading ? 0.7 : 1,
                transition: 'opacity 0.15s ease-out',
                willChange: 'transform, background',
                outline: 'none',
                boxSizing: 'border-box',
                backfaceVisibility: 'hidden',
                transform: 'translateZ(0)',
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
                  initial={{ 
                    opacity: 0, 
                    y: 30, 
                    scale: 0.96,
                    filter: 'blur(8px)'
                  }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    filter: 'blur(0px)'
                  }}
                  exit={{ 
                    opacity: 0, 
                    y: -20, 
                    scale: 0.98,
                    filter: 'blur(4px)'
                  }}
                  transition={{ 
                    duration: 0.8, 
                    type: 'spring', 
                    stiffness: 80, 
                    damping: 20,
                    ease: [0.25, 0.46, 0.45, 0.94]
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
                    boxShadow: `0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)`,
                    color: palette.black,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    border: `1.5px solid ${palette.sand}`,
                    wordBreak: 'break-word',
                    fontFamily: '"Courier New", Courier, monospace',
                    transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    boxSizing: 'border-box',
                    position: 'relative',
                    willChange: 'transform, opacity, filter',
                    backfaceVisibility: 'hidden',
                    transform: 'translateZ(0)',
                    cursor: 'text',
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
                    whileHover={{ 
                      scale: 1.06,
                      transition: { duration: 0.08, ease: [0.25, 0.46, 0.45, 0.94] }
                    }}
                    whileTap={{ 
                      scale: 0.94,
                      transition: { duration: 0.05, ease: [0.25, 0.46, 0.45, 0.94] }
                    }}
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
                      cursor: 'pointer',
                      border: `1.5px solid ${palette.sage}`,
                      boxShadow: `0 1.5px 6px 0 ${palette.sand}22`,
                      zIndex: 5,
                      padding: 0,
                      willChange: 'transform',
                      backfaceVisibility: 'hidden',
                      transform: 'translateZ(0)',
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
              <motion.button
                onClick={() => setShowHistory(!showHistory)}
                whileHover={{ 
                  scale: 1.04,
                  transition: { duration: 0.08, ease: [0.25, 0.46, 0.45, 0.94] }
                }}
                whileTap={{ 
                  scale: 0.96,
                  transition: { duration: 0.05, ease: [0.25, 0.46, 0.45, 0.94] }
                }}
                style={{
                  background: 'transparent',
                  color: history.length > 0 ? palette.purple : palette.sage,
                  border: `1.5px solid ${history.length > 0 ? palette.purple : palette.sage}`,
                  borderRadius: '0.6rem',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: 'none',
                  transition: 'color 0.15s ease-out, border-color 0.15s ease-out, opacity 0.15s ease-out',
                  fontSize: '18px',
                  fontWeight: 700,
                  opacity: history.length > 0 ? 1 : 0.6,
                  willChange: 'transform',
                  backfaceVisibility: 'hidden',
                  transform: 'translateZ(0)',
                }}
                title={history.length > 0 ? "Toggle Message History" : "No message history yet"}
              >
                {/* clock/history icon */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <circle cx="12" cy="12" r="9"></circle>
                  <path d="M12 7v5l3 3"></path>
                </svg>
              </motion.button>
              
              {/* Monetization Buttons */}
              <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
        {(makeUpiLink(75) ? (
                  <motion.a
                    href={makeUpiLink(75, 'Thanks for the tool!')}
                    whileHover={{ 
                      scale: 1.03,
                      transition: { duration: 0.08, ease: [0.25, 0.46, 0.45, 0.94] }
                    }}
                    whileTap={{ 
                      scale: 0.97,
                      transition: { duration: 0.05, ease: [0.25, 0.46, 0.45, 0.94] }
                    }}
                    style={{
                      background: 'transparent',
                      color: palette.purple,
                      fontWeight: 600,
                      textDecoration: 'none',
                      border: `1.5px solid ${palette.purple}`,
                      borderRadius: '0.6rem',
                      padding: '0.6rem 1rem',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      boxShadow: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      willChange: 'transform',
                      backfaceVisibility: 'hidden',
                      transform: 'translateZ(0)',
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
                    whileHover={{ 
                      scale: 1.03,
                      transition: { duration: 0.08, ease: [0.25, 0.46, 0.45, 0.94] }
                    }}
                    whileTap={{ 
                      scale: 0.97,
                      transition: { duration: 0.05, ease: [0.25, 0.46, 0.45, 0.94] }
                    }}
                    style={{
                      background: 'transparent',
                      color: palette.purple,
                      fontWeight: 600,
                      textDecoration: 'none',
                      border: `1.5px solid ${palette.purple}`,
                      borderRadius: '0.6rem',
                      padding: '0.6rem 1rem',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      boxShadow: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      willChange: 'transform',
                      backfaceVisibility: 'hidden',
                      transform: 'translateZ(0)',
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
                  whileHover={{ 
                    scale: 1.03,
                    transition: { duration: 0.08, ease: [0.25, 0.46, 0.45, 0.94] }
                  }}
                  whileTap={{ 
                    scale: 0.97,
                    transition: { duration: 0.05, ease: [0.25, 0.46, 0.45, 0.94] }
                  }}
                  style={{
                    background: 'transparent',
                    color: palette.purple,
                    border: `1.5px solid ${palette.purple}`,
                    borderRadius: '0.6rem',
                    padding: '0.6rem',
                    cursor: 'pointer',
                    boxShadow: 'none',
                    willChange: 'transform',
                    backfaceVisibility: 'hidden',
                    transform: 'translateZ(0)',
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
                <div style={{ maxHeight: 500, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {history.map((h: any, i: number) => {
                    const isExpanded = expandedItems.has(i);
                    return (
                      <div key={i} style={{ 
                        background: palette.cream, 
                        borderRadius: 10, 
                        boxShadow: `0 2px 6px 0 ${palette.sage}22`, 
                        overflow: 'visible',
                        border: `1px solid ${palette.sage}33`,
                        marginBottom: isExpanded ? '1rem' : '0'
                      }}>
                        {/* Clickable header */}
                        <div 
                          onClick={() => {
                            const newExpanded = new Set<number>();
                            if (!isExpanded) {
                              newExpanded.add(i); // Only expand this one, auto-collapse others
                            }
                            // If already expanded, clicking will collapse (newExpanded stays empty)
                            setExpandedItems(newExpanded);
                          }}
                          style={{ 
                            padding: '1rem 1.2rem', 
                            cursor: 'pointer',
                            background: 'transparent',
                            transition: 'background-color 0.2s ease',
                            borderBottom: isExpanded ? `2px solid ${palette.sage}44` : 'none',
                            position: 'relative'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = `${palette.mint}66`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ 
                                fontWeight: 700, 
                                color: palette.purple, 
                                fontSize: '1.05rem', 
                                marginBottom: '0.4rem',
                                lineHeight: 1.3,
                                wordBreak: 'break-word'
                              }}>
                                {h.project}
                              </div>
                              <div style={{ 
                                color: palette.black, 
                                fontSize: '0.95rem',
                                fontWeight: 500,
                                marginBottom: '0.3rem',
                                lineHeight: 1.4,
                                wordBreak: 'break-word'
                              }}>
                                Intent: {h.intent}
                              </div>
                              <div style={{ 
                                color: palette.sage, 
                                fontSize: '0.85rem',
                                fontWeight: 600
                              }}>
                                Tone: {h.template ? templates.find(t => t.value === h.template)?.label : 'Default'}
                                <span style={{ marginLeft: '1rem', fontSize: '0.8rem' }}>
                                  {new Date(h.timestamp).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div style={{ 
                              fontSize: '1.2rem', 
                              color: palette.purple, 
                              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.25s ease',
                              flexShrink: 0,
                              marginTop: '0.2rem'
                            }}>
                              ▼
                            </div>
                          </div>
                        </div>
                        
                        {/* Expandable content */}
                        {isExpanded && (
                          <div style={{
                            animation: 'slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            background: palette.white,
                            borderTop: `1px solid ${palette.sage}33`,
                            position: 'relative'
                          }}>
                            <div style={{ padding: '1.2rem', paddingTop: '2rem' }}>
                              {/* Copy button like main generator */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const text = h.output.replace(/<br\s*\/?\s*>/gi, '\n').replace(/<[^>]+>/g, '');
                                  navigator.clipboard.writeText(text);
                                  // Brief visual feedback
                                  const btn = e.currentTarget;
                                  const originalText = btn.innerHTML;
                                  btn.innerHTML = '✓';
                                  btn.style.background = palette.purple;
                                  setTimeout(() => {
                                    btn.innerHTML = originalText;
                                    btn.style.background = palette.mint;
                                  }, 800);
                                }}
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
                                  cursor: 'pointer',
                                  border: `1.5px solid ${palette.sage}`,
                                  boxShadow: `0 1.5px 6px 0 ${palette.sand}22`,
                                  zIndex: 5,
                                  padding: 0,
                                  transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.transform = 'scale(1.08)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = 'scale(1)';
                                }}
                                title="Copy to clipboard"
                              >
                                <svg viewBox="0 0 20 20" width={16} height={16} style={{ fill: palette.black }}>
                                  <path d="M6 2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6.828A2 2 0 0 0 15.414 6L12 2.586A2 2 0 0 0 10.828 2H6zm0 2h4.828L16 7.172V16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4zm2 4a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2h-2a1 1 0 0 1-1-1z"/>
                                </svg>
                              </button>

                              <div style={{ 
                                marginBottom: '1rem'
                              }}>
                                <div style={{ 
                                  fontWeight: 600, 
                                  color: palette.purple, 
                                  fontSize: '0.9rem', 
                                  marginBottom: '0.5rem',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px'
                                }}>
                                  Generated Message:
                                </div>
                                <div style={{ 
                                  color: palette.black, 
                                  padding: '1.2rem',
                                  background: `${palette.cream}AA`,
                                  borderRadius: '8px',
                                  border: `1px solid ${palette.sage}22`,
                                  fontSize: '1rem',
                                  lineHeight: 1.6,
                                  minHeight: 'auto',
                                  maxHeight: 'none',
                                  height: 'auto',
                                  wordBreak: 'break-word',
                                  whiteSpace: 'pre-wrap',
                                  overflow: 'visible'
                                }} dangerouslySetInnerHTML={{ __html: h.output }} />
                              </div>
                              
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem' }}>
                                <div style={{ fontSize: '0.85rem', color: palette.sage, fontWeight: 500 }}>
                                  Created: {new Date(h.timestamp).toLocaleString()}
                                </div>
                                
                                {/* Export button */}
                                <div style={{ display: 'flex', gap: '0.6rem' }}>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const text = h.output.replace(/<br\s*\/?\s*>/gi, '\n').replace(/<[^>]+>/g, '');
                                      const blob = new Blob([text], { type: 'text/plain' });
                                      const url = URL.createObjectURL(blob);
                                      const a = document.createElement('a');
                                      a.href = url;
                                      a.download = `freelance-message-${i + 1}.txt`;
                                      document.body.appendChild(a);
                                      a.click();
                                      setTimeout(() => {
                                        document.body.removeChild(a);
                                        URL.revokeObjectURL(url);
                                      }, 100);
                                    }}
                                    style={{ 
                                      background: `linear-gradient(135deg, ${palette.sage} 0%, ${palette.mint} 100%)`, 
                                      border: 'none', 
                                      borderRadius: 8, 
                                      padding: '0.4rem 1rem', 
                                      fontWeight: 600, 
                                      color: palette.black, 
                                      cursor: 'pointer', 
                                      fontSize: '0.9rem', 
                                      boxShadow: `0 2px 6px 0 ${palette.sage}33`,
                                      transition: 'all 0.15s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.transform = 'translateY(-1px)';
                                      e.currentTarget.style.boxShadow = `0 4px 12px 0 ${palette.sage}44`;
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.transform = 'translateY(0)';
                                      e.currentTarget.style.boxShadow = `0 2px 6px 0 ${palette.sage}33`;
                                    }}
                                    title="Download as text file"
                                  >
                                    💾 Export
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
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
  <div id="capabilities"><Capabilities /></div>
              </section>
            </main>
            <Contact />
            <Footer />
            {/* Input field styling */}
            <style>{`
              input, input:focus, input:hover, textarea, textarea:focus, textarea:hover {
                cursor: text !important;
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
              
              /* Optimize animations for TRUE 120fps performance */
              [data-framer-component] {
                will-change: transform, opacity;
                transform: translate3d(0, 0, 0);
                backface-visibility: hidden;
                contain: layout style paint;
              }
              
              /* Ultra-smooth 120fps transitions for all interactive elements */
              button, input, [role="button"] {
                transition: transform 0.06s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                           opacity 0.06s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                           background 0.08s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                           border-color 0.08s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                           box-shadow 0.08s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                will-change: transform;
                backface-visibility: hidden;
                transform: translateZ(0);
              }
              
              /* Ultra-optimized 120fps scroll performance */
              html {
                scroll-behavior: smooth;
                scroll-snap-type: y proximity;
                transform: translateZ(0); /* Force hardware acceleration */
              }
              
              /* Maximum performance containment and 120fps optimization */
              .motion-div {
                contain: layout style paint;
                will-change: transform, opacity;
                backface-visibility: hidden;
                transform: translateZ(0); /* Hardware acceleration */
              }
              
              /* Ultra-smooth scrolling performance with 120fps support */
              body {
                -webkit-overflow-scrolling: touch;
                overscroll-behavior: contain;
                scroll-behavior: smooth;
                transform: translateZ(0); /* Hardware acceleration */
                contain: layout style;
              }
              
              /* Additional 120fps optimizations for all animations */
              * {
                box-sizing: border-box;
                -webkit-transform: translateZ(0);
                -moz-transform: translateZ(0);
                -ms-transform: translateZ(0);
                -o-transform: translateZ(0);
                transform: translateZ(0);
              }
              
              /* Ultra-smooth scrolling with 120fps support */
              html, body {
                scroll-behavior: smooth !important;
                -webkit-scroll-behavior: smooth !important;
                scrollbar-width: thin;
                scrollbar-color: ${palette.sand} transparent;
              }
              
              /* Smooth webkit scrollbar */
              ::-webkit-scrollbar {
                width: 8px;
              }
              
              ::-webkit-scrollbar-track {
                background: transparent;
              }
              
              ::-webkit-scrollbar-thumb {
                background: ${palette.sand};
                border-radius: 4px;
              }
              
              ::-webkit-scrollbar-thumb:hover {
                background: ${palette.purple};
              }
              
              /* Force GPU acceleration on all animated elements */
              [style*="transform"], 
              .motion-div,
              [class*="motion-"] {
                will-change: transform, opacity;
                backface-visibility: hidden;
                transform: translateZ(0);
                contain: layout style paint;
              }
              
              /* 120fps animation optimization */
              @keyframes slideDown {
                from {
                  height: 0;
                  opacity: 0;
                  transform: translateY(-4px);
                }
                to {
                  height: auto;
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              
              /* Force 120fps hardware acceleration */
              * {
                transform: translateZ(0);
                backface-visibility: hidden;
                perspective: 1000px;
              }
              
              /* Reduce motion for performance */
              @media (prefers-reduced-motion: reduce) {
                *, *::before, *::after {
                  animation-duration: 0.01ms !important;
                  animation-iteration-count: 1 !important;
                  transition-duration: 0.01ms !important;
                  scroll-behavior: auto !important;
                }
              }
              
              /* Mobile cursor handling */
              @media (pointer: coarse) {
                * {
                  cursor: default !important;
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
