# RealityCheck MCP

RealityCheck is an AI-powered contrarian system that brutally analyzes your startup ideas instead of agreeing with them. It identifies risks, assumptions, and edge cases using an MCP (Model Context Protocol) server powered by Groq's fast Llama 3 models.

## Features
- **Analyze Idea**: Returns viability score, risks, uniqueness, and a summary.
- **Break Idea**: Identifies failure reasons, edge cases, and wrong assumptions.
- **Improve Idea**: Outputs an improved version, niche targeting, monetization strategy, and roadmap.
- **Roast Idea**: Gives a brutally honest, sarcastic roast of your idea.

## Tech Stack
- **Frontend**: Next.js 14, Tailwind CSS, Framer Motion, Lucide React (inspired by Shadcn UI aesthetics)
- **Backend / MCP Server**: Node.js, Express, `@modelcontextprotocol/sdk`
- **AI**: Groq API (llama3-8b-8192)

## Setup & Running

### 1. Backend
Open a terminal and:
```bash
cd server
npm install
```
Add your Groq API Key:
- Edit `server/.env` and add `GROQ_API_KEY=your_key_here`

Run the server:
```bash
node index.js
```
The Express API & MCP endpoints will start on `http://localhost:5000`.

### 2. Frontend
Open another terminal and:
```bash
cd client
npm install
npm run dev
```
Your Next.js frontend will run on `http://localhost:3000`.

## Architecture Details
- The backend wraps `@modelcontextprotocol/sdk/server` and binds standard analysis features as MCP tools.
- Express cleanly exposes these endpoints for the Next.js frontend to securely access outputs without exposing the Groq API key to the client.
- Aesthetically crafted with strict glassmorphism and stunning Framer Motion animations.
