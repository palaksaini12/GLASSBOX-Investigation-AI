# GLASSBOX — AI-Powered Digital Investigation Assistant

GLASSBOX is a hybrid forensic investigation assistant combining **Agentic GraphRAG (Neo4j)**, **Evidence Retrieval (RAG)**, **Interactive Network Visualization**, and **Multilingual Support** for digital forensic case analysis.

## Live Deployment
- **Frontend (Vercel):** https://glassbox-investigation-ai-assistant.vercel.app
- **Backend API (Render):** https://glassbox-backend-ox6i.onrender.com

*(Note: The free Render backend spins down after 15 minutes of inactivity. The first query may take 30–50 seconds to wake up.)*

## Key Features
- **Hybrid Privacy-First Engine:** Runs 100% offline/air-gapped locally (Ollama + ChromaDB + Neo4j Desktop) and switches automatically to Cloud Mode (Groq + Neo4j AuraDB) for 24/7 team access.
- **Agentic GraphRAG:** Autonomous LangChain tools (`search_evidence`, `analyze_suspect_network`, `draft_report`) with mandatory source file citations.
- **Interactive Knowledge Graph:** Live Neo4j entity graph linking suspects, phone numbers, locations, and transactions.
- **Multilingual UI & AI:** Supports English, Hindi, Marathi, Tamil, and auto-detected regional languages.
- **Case Diary Export:** One-click `.TXT` and printable PDF Case Diary export.

## Tech Stack
- **Frontend:** Next.js, React, Tailwind CSS, Lucide React
- **Backend:** Python, FastAPI, Uvicorn, LangChain
- **AI & Databases:** Ollama (`llama3.2`) / Groq (`openai/gpt-oss-120b`), ChromaDB, Neo4j Desktop / Neo4j AuraDB

## Local Setup

### 1. Clone the Repository
```bash
git clone [https://github.com/palaksaini12/GLASSBOX-Investigation-AI.git](https://github.com/palaksaini12/GLASSBOX-Investigation-AI.git)
cd GLASSBOX-Investigation-AI