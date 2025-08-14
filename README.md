# Freelance Message Generator 🤖💬

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://freelance-message-app.vercel.app/)
[![React](https://img.shields.io/badge/React-18+-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)](https://typescriptlang.org/)
[![AI Powered](https://img.shields.io/badge/AI-OpenRouter-green)](https://openrouter.ai/)

> **AI-powered professional message generator for freelancers** - Generate perfect client communications, pricing negotiations, and timeline extensions instantly.

## 🚀 Live Demo

**[Try it now →](https://freelance-message-app.vercel.app/)**

## ✨ Features

- **🤖 AI-Powered Generation**: Uses advanced language models via OpenRouter API
- **💬 Professional Templates**: Pricing negotiations, timeline extensions, project proposals
- **🎨 Tone Selection**: Friendly, formal, concise, apology, and gratitude tones
- **⚡ Real-time Generation**: Instant message creation with smart fallbacks
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **🎯 Smart Fallbacks**: Intelligent offline message generation when AI is unavailable
- **💾 Message History**: Save and reuse successful message templates
- **🔒 Privacy-First**: No data stored on servers, API keys stay local

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: CSS3, Framer Motion animations
- **AI Integration**: OpenRouter API with multiple model fallbacks
- **Deployment**: Vercel with automatic GitHub integration
- **Performance**: Optimized with lazy loading and code splitting

## 🎯 Use Cases

### Perfect for:
- **Freelance Developers** - Handle client communications professionally
- **Design Agencies** - Negotiate project scope and timelines
- **Consultants** - Manage client expectations and pricing discussions
- **Remote Workers** - Craft professional responses to challenging situations

### Message Types:
- 💰 **Budget Negotiations** - Request higher rates with clear value proposition
- ⏰ **Timeline Extensions** - Professional deadline adjustment requests  
- 🤝 **Project Proposals** - Compelling pitches for new work
- 💔 **Difficult Conversations** - Handle scope creep and boundary setting
- 🙏 **Professional Apologies** - Graceful error acknowledgment and resolution

## 🚀 Getting Started

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
