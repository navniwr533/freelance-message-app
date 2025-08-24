import React, { useState, useRef, useEffect } from 'react';
import './App.css';

// Tone template options
const templates = [
  { value: 'default', label: 'Default' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'formal', label: 'Formal' },
  { value: 'concise', label: 'Concise' },
  { value: 'apology', label: 'Apology' },
  { value: 'gratitude', label: 'Gratitude' }
];

function App() {
  const [project, setProject] = useState('');
  const [intent, setIntent] = useState('');
  const [output, setOutput] = useState('Your message will appear here...');
  const [template, setTemplate] = useState(templates[0].value);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Enhanced tone configuration with stronger prompting
  function getToneInstructions(tone: string) {
    const baseParams = {
      maxTokens: 300,
      temperature: 0.7,
      topP: 0.9,
      frequencyPenalty: 0.1,
      presencePenalty: 0.1
    };
    
    switch (tone) {
      case 'formal':
        return {
          systemInstructions: `
MANDATORY TONE: PROFESSIONAL AND FORMAL
- Use formal business language throughout
- Address as "Dear Client" or professional equivalent
- Use complete sentences, no contractions
- Maintain respectful, courteous tone
- Include proper business closings
- No casual expressions or slang
Example phrases: "I would be pleased to...", "I appreciate your consideration", "Please allow me to..."`,
          userPrefix: "Write a FORMAL business message:",
          modelParams: { ...baseParams, temperature: 0.5, topP: 0.8 }
        };
        
      case 'friendly':
        return {
          systemInstructions: `
MANDATORY TONE: WARM AND APPROACHABLE
- Use conversational language with natural flow
- Include contractions (I'm, we'll, it's)
- Add enthusiasm with exclamation marks where appropriate!
- Use "we" and "us" to create partnership feeling
- Include personal touches and empathy
- Start with a warm greeting sentiment (but no "Dear/Hi")
Example phrases: "I'm excited to...", "That's great!", "I'd love to help with..."`,
          userPrefix: "Write a FRIENDLY and warm message:",
          modelParams: { ...baseParams, temperature: 0.8, topP: 0.95 }
        };
        
      case 'concise':
        return {
          systemInstructions: `
MANDATORY: ULTRA-CONCISE MESSAGE
CRITICAL RULES:
1. Maximum 20 words total - NO EXCEPTIONS
2. ONE sentence only - no periods except at end
3. NO bullet points, NO lists, NO line breaks
4. Core message only - strip ALL unnecessary words
5. Use strong action verbs
6. If you write more than 20 words, you have FAILED

Examples of good concise messages:
- "Extension needed until Friday due to technical issues."
- "Budget exceeds scope - proposing phased approach instead."
- "Delivered milestone - invoice attached for immediate payment."`,
          userPrefix: "Write ONLY the essential message in UNDER 20 WORDS:",
          modelParams: { maxTokens: 50, temperature: 0.3, topP: 0.7 }
        };
        
      case 'apology':
        return {
          systemInstructions: `
MANDATORY TONE: SINCERE APOLOGY
Structure (follow this order):
1. Direct acknowledgment of the issue (no deflection)
2. Take full responsibility (use "I" statements)
3. Express genuine regret for the impact
4. Provide specific solution or corrective action
5. Commit to preventing future issues
- Never blame external factors or make excuses
- Use phrases like "I sincerely apologize", "I take full responsibility"
- Sound genuinely remorseful but professional`,
          userPrefix: "Write a SINCERE APOLOGY message:",
          modelParams: { ...baseParams, temperature: 0.6, topP: 0.85 }
        };
        
      case 'gratitude':
        return {
          systemInstructions: `
MANDATORY TONE: HEARTFELT GRATITUDE
- Express genuine appreciation and thankfulness
- Use specific details about what you're grateful for
- Include emotional warmth while staying professional
- Use phrases like "truly grateful", "deeply appreciate", "honored"
- Mention specific positive impacts or experiences
- End with forward-looking positive sentiment
Example phrases: "I'm truly grateful for...", "Your trust means...", "This opportunity has..."`,
          userPrefix: "Write a GRATEFUL and appreciative message:",
          modelParams: { ...baseParams, temperature: 0.75, topP: 0.9 }
        };
        
      default:
        return {
          systemInstructions: `
PROFESSIONAL FREELANCER MESSAGE
- Write a clear, professional response
- Be helpful and solution-oriented
- Match the tone to the situation appropriately
- Be concise but complete
- End with a call to action or next steps
- Sound confident and competent`,
          userPrefix: "Write a professional message:",
          modelParams: baseParams
        };
    }
  }

  // Smart model selection based on tone requirements
  function getSmartModelOrder(tone: string): string[] {
    const modelSets = {
      concise: ['anthropic/claude-3-haiku', 'openai/gpt-4o-mini', 'meta-llama/llama-3.1-8b-instruct'],
      formal: ['anthropic/claude-3-sonnet', 'openai/gpt-4o', 'meta-llama/llama-3.1-70b-instruct'],
      friendly: ['openai/gpt-4o', 'anthropic/claude-3-sonnet', 'meta-llama/llama-3.1-70b-instruct'],
      apology: ['anthropic/claude-3-sonnet', 'openai/gpt-4o', 'deepseek/deepseek-chat'],
      gratitude: ['openai/gpt-4o', 'anthropic/claude-3-sonnet', 'google/gemini-pro-1.5'],
      default: ['anthropic/claude-3-sonnet', 'openai/gpt-4o', 'meta-llama/llama-3.1-70b-instruct']
    };
    
    return modelSets[tone as keyof typeof modelSets] || modelSets.default;
  }

  // Enhanced message validation and processing
  function validateAndProcessMessage(message: string, tone: string): { isValid: boolean; processedMessage: string; issues: string[] } {
    const issues: string[] = [];
    let processedMessage = message.trim();
    
    // Basic validation
    if (!processedMessage || processedMessage.length < 10) {
      issues.push('Message too short');
      return { isValid: false, processedMessage, issues };
    }
    
    // Tone-specific validation
    switch (tone) {
      case 'concise':
        const wordCount = processedMessage.split(/\s+/).length;
        if (wordCount > 20) {
          issues.push(`Too long for concise tone: ${wordCount} words (max 20)`);
        }
        // Remove multiple line breaks for concise
        processedMessage = processedMessage.replace(/\n\s*\n/g, ' ').replace(/\n/g, ' ');
        break;
        
      case 'formal':
        if (processedMessage.includes("I'm") || processedMessage.includes("don't") || processedMessage.includes("can't")) {
          // Convert contractions for formal tone
          processedMessage = processedMessage
            .replace(/I'm/g, 'I am')
            .replace(/don't/g, 'do not')
            .replace(/can't/g, 'cannot')
            .replace(/won't/g, 'will not')
            .replace(/it's/g, 'it is');
        }
        break;
        
      case 'friendly':
        if (!processedMessage.match(/[!]/)) {
          // Add enthusiasm if missing for friendly tone
          processedMessage = processedMessage.replace(/\.$/, '!');
        }
        break;
    }
    
    return { isValid: issues.length === 0, processedMessage, issues };
  }

  // Enhanced fallback with intelligent templates
  function generateEnhancedFallback(project: string, intent: string, tone: string): string {
    const templates = {
      concise: {
        negotiation: "Budget adjustment needed for quality delivery.",
        timeline: "Extension required - will deliver excellence.",
        mismatch: "Skills differ - can recommend specialists.",
        update: "Project progressing well - on track.",
        apology: "Sincere apologies - implementing fixes immediately.",
        gratitude: "Thank you - excited to deliver!"
      },
      formal: {
        negotiation: "I would like to discuss a budget adjustment to ensure we deliver the highest quality results that meet your expectations.",
        timeline: "I must respectfully request an extension to ensure thorough completion of all project requirements.",
        mismatch: "Upon review, I believe this project would benefit from specialized expertise I can recommend.",
        update: "I am pleased to report that your project is progressing according to schedule and specifications.",
        apology: "Please accept my sincere apologies. I take full responsibility and will implement immediate corrective measures.",
        gratitude: "I am deeply grateful for this opportunity and am committed to delivering exceptional results."
      },
      friendly: {
        negotiation: "I'd love to chat about adjusting the budget so we can create something amazing together!",
        timeline: "I want to make sure we get this right - would a small extension work for you?",
        mismatch: "This isn't quite my specialty, but I know some fantastic people who'd be perfect for this!",
        update: "Great news! Everything's moving along smoothly and I'm excited about how it's turning out.",
        apology: "I'm really sorry about this! I'm taking full responsibility and fixing everything right away.",
        gratitude: "Thank you so much! I'm genuinely excited to work on this with you!"
      },
      apology: {
        negotiation: "I sincerely apologize for needing to revisit our budget discussion. I should have been more thorough initially.",
        timeline: "I deeply regret that I need to request additional time. I take full responsibility for this oversight.",
        mismatch: "I apologize, but I must be transparent that this falls outside my expertise to ensure you get the best results.",
        update: "I apologize for the delay in providing this update. Here's where we currently stand with your project.",
        apology: "I am truly sorry for this situation. I take complete responsibility and am committed to making this right.",
        gratitude: "Thank you for your patience with me. I'm sorry for any inconvenience and grateful for your understanding."
      },
      gratitude: {
        negotiation: "I'm grateful for your understanding as we discuss optimizing the budget for exceptional results.",
        timeline: "Thank you for being flexible with timing - it means I can deliver the quality you deserve!",
        mismatch: "I appreciate your trust in me, and I want to honor that by connecting you with the perfect specialist.",
        update: "I'm so appreciative of your collaboration - it's making this project truly special!",
        apology: "Thank you for bringing this to my attention. I'm grateful for the chance to make this right.",
        gratitude: "I'm incredibly thankful for this opportunity and can't wait to exceed your expectations!"
      }
    };
    
    // Intelligent intent classification
    const lcIntent = intent.toLowerCase();
    const lcProject = project.toLowerCase();
    
    let intentType = 'update';
    if (/budget|price|cost|pay|money/.test(lcIntent + lcProject)) intentType = 'negotiation';
    else if (/time|deadline|delay|extension/.test(lcIntent + lcProject)) intentType = 'timeline';
    else if (/skill|experience|can't|unable/.test(lcIntent + lcProject)) intentType = 'mismatch';
    else if (/sorry|apologize|mistake/.test(lcIntent + lcProject)) intentType = 'apology';
    else if (/thank|grateful|appreciate/.test(lcIntent + lcProject)) intentType = 'gratitude';
    
    const toneTemplates = templates[tone as keyof typeof templates] || templates.formal;
    return toneTemplates[intentType as keyof typeof toneTemplates] || toneTemplates.update;
  }

  // Smart fallback when AI APIs fail
  function generateOfflineFallback(project: string, intent: string, template: string): string {
    const selectedTone = templates.find(t => t.value === template)?.label?.toLowerCase() || 'default';
    return generateEnhancedFallback(project, intent, selectedTone);
  }

  // Main enhanced generation function
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!project.trim() || !intent.trim()) {
      setOutput('Please fill in both the project and intent fields.');
      return;
    }
    
    setLoading(true);
    setOutput('Generating your message...');
    
    try {
      const { systemInstructions, userPrefix, modelParams } = getToneInstructions(template);
      const models = getSmartModelOrder(template);
      
      const userMessage = `${userPrefix}

Project Context: "${project}"
What I want to communicate: "${intent}"

Requirements:
- Address the client professionally
- Be specific to the context provided
- Match the requested tone exactly
- Include actionable next steps
- Keep it natural and authentic`;

      let finalMessage = '';
      let usedFallback = false;
      
      // Try each model in the smart order
      for (const model of models) {
        try {
          const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${(import.meta as any).env?.VITE_OPENROUTER_API_KEY}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': window.location.origin,
            },
            body: JSON.stringify({
              model,
              messages: [
                { role: 'system', content: systemInstructions },
                { role: 'user', content: userMessage }
              ],
              ...modelParams
            })
          });
          
          if (!response.ok) {
            console.warn(`Model ${model} failed:`, response.status);
            continue;
          }
          
          const data = await response.json();
          const rawMessage = data.choices?.[0]?.message?.content;
          
          if (rawMessage) {
            const validation = validateAndProcessMessage(rawMessage, template);
            if (validation.isValid) {
              finalMessage = validation.processedMessage;
              break;
            } else {
              console.warn(`Model ${model} validation failed:`, validation.issues);
              continue;
            }
          }
        } catch (error) {
          console.warn(`Model ${model} error:`, error);
          continue;
        }
      }
      
      // If all AI models fail, use enhanced fallback
      if (!finalMessage) {
        finalMessage = generateOfflineFallback(project, intent, template);
        usedFallback = true;
      }
      
      setOutput(finalMessage);
      
    } catch (error) {
      console.error('Generation error:', error);
      setOutput(generateOfflineFallback(project, intent, template));
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Professional Message Generator
            </h1>
            <p className="text-slate-300 text-lg">
              Generate professional client messages with AI assistance
            </p>
          </div>

          {/* Main Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project Input */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Project / Context
                </label>
                <textarea
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  placeholder="Describe the project or situation..."
                  className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-600 focus:border-purple-400 focus:outline-none resize-none"
                  rows={3}
                  required
                />
              </div>

              {/* Intent Input */}
              <div>
                <label className="block text-white font-medium mb-2">
                  What do you want to communicate?
                </label>
                <textarea
                  value={intent}
                  onChange={(e) => setIntent(e.target.value)}
                  placeholder="What message do you want to send to your client?"
                  className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-600 focus:border-purple-400 focus:outline-none resize-none"
                  rows={3}
                  required
                />
              </div>

              {/* Tone Selection */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Tone
                </label>
                <select
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-600 focus:border-purple-400 focus:outline-none"
                >
                  {templates.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Generate Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? 'Generating...' : 'Generate Message'}
              </button>
            </form>
          </div>

          {/* Output Section */}
          <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-medium text-lg">Generated Message</h3>
              <button
                onClick={handleCopy}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 min-h-[100px]">
              <p className="text-slate-100 whitespace-pre-wrap leading-relaxed">
                {output}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
