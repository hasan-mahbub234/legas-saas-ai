Legal AI Platform - Full Stack SaaS Application
📋 Project Overview
Legal AI Platform is a comprehensive SaaS solution for AI-powered legal document analysis. It uses modern AI technologies to analyze, summarize, and extract insights from legal documents through an intuitive web interface.

🏗️ Architecture
Backend (FastAPI + Python)
Framework: FastAPI with async support
Database: PostgreSQL with SQLAlchemy ORM
Authentication: JWT with refresh tokens
AI Processing: Groq API (Llama/Mixtral) + Pinecone vector database
Document Processing: PDF/DOCX/TXT extraction with multiple fallbacks
API: RESTful endpoints with OpenAPI documentation

Frontend (Next.js 14 + React)
Framework: Next.js 14 with App Router
Styling: Tailwind CSS with glass morphism effects
UI Components: Radix UI + custom shadcn components
State Management: React Context for auth

API Client: Custom fetch wrapper with token refresh

🚀 Features
Core Features
📁 Document Management: Upload, list, download, and delete legal documents
🤖 AI Analysis: Automatic extraction of key points, risks, and summaries
💬 RAG-Powered Chat: Ask questions about documents with sourced answers
🔒 Secure Authentication: JWT-based auth with refresh tokens
📊 Dashboard: Document statistics and quick actions

AI Capabilities
Document summarization and analysis
Risk identification and recommendations
Vector embeddings with Pinecone
Real-time Q&A with document context

📁 Project Structure
text
Legal_SaaS_Project/
├── backend/ # FastAPI backend
│ ├── src/
│ │ ├── auth/ # Authentication module
│ │ ├── documents/ # Document processing
│ │ ├── ai/ # AI/RAG services
│ │ ├── core/ # Config and security
│ │ ├── database.py # Database configuration
│ │ └── main.py # App entry point
│ ├── requirements.txt # Python dependencies
│ ├── Dockerfile # Backend container
│ └── railway.json #Railway deployment configuration
├── frontend/ # Next.js frontend
│ ├── app/ # App router pages
│ ├── components/ # Reusable UI components
│ ├── lib/ # Utilities and API client
│ └── package.json # Node dependencies
├── docker-compose.yml # Multi-container setup
└── README.md # This file

🛠️ Prerequisites
Docker & Docker Compose
Python 3.11+ (for local development)
Node.js 22+ (for frontend development)
Groq API key (for AI features)
Pinecone account (for vector storage)
PostgreSQL (or use Docker)

⚡ Quick Start
Using Docker Compose (Recommended)
Clone and configure:
bash
git clone <repository-url>
cd Legal_SaaS_Project
cp .env.example .env
Edit .env file:

env
DATABASE_URL=postgresql://user:pass@postgres:5432/legal_saas
GROQ_API_KEY=your_groq_key
PINECONE_API_KEY=your_pinecone_key
PINECONE_ENVIRONMENT=your_env
JWT_SECRET=your_secret_key
Start the application:

bash
docker-compose up -d
Access the services:

Frontend: http://localhost:3000
Backend API: http://localhost:8000
API Documentation: http://localhost:8000/docs

## Manual Setup

Backend:
bash
cd backend
python -m venv venv
source venv/bin/activate # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload

Frontend:
bash
cd frontend
npm install
npm run dev
🔧 Configuration
Environment Variables
Backend (.env):

env
DATABASE_URL=postgresql://user:pass@localhost:5432/legal_saas
GROQ_API_KEY=your_groq_api_key_here
PINECONE_API_KEY=your_pinecone_key
PINECONE_ENVIRONMENT=us-east-1
JWT_SECRET=your_jwt_secret_here
Frontend (.env.local):

env
NEXT_PUBLIC_API_URL=http://localhost:8000
AI Services Setup
Groq API: Get API key from console.groq.com
Pinecone: Create account at pinecone.io
Create Pinecone Index: Name: legal-documents, Dimension: 768, Metric: cosine

📚 API Endpoints
Authentication
POST /auth/register - User registration
POST /auth/login - User login
POST /auth/refresh - Refresh access token
GET /auth/me - Get current user

Documents
POST /documents/upload - Upload document
GET /documents - List documents
GET /documents/{id} - Get document details
DELETE /documents/{id} - Delete document

AI Services
POST /ai/chat - Chat with document
GET /ai/chat-history/{id} - Get chat history
POST /ai/analyze-text - Analyze raw text
POST /ai/summarize/{id} - Summarize document

🚀 Quick Deploy
Backend (Railway)
Install Railway CLI:
bash
npm i -g @railway/cli

Deploy backend:
bash
cd backend
railway login
railway init
railway up

Set environment variables:
bash
railway variables set DATABASE_URL="postgresql://..."
railway variables set GROQ_API_KEY="your_key"
railway variables set PINECONE_API_KEY="your_key"
railway variables set PINECONE_ENVIRONMENT="us-east-1"
railway variables set JWT_SECRET=$(openssl rand -hex 32)
railway variables set ALLOWED_ORIGINS="https://your-frontend.vercel.app"
Get backend URL:
bash
railway status

# Use this URL for NEXT_PUBLIC_API_URL

Frontend (Vercel)
Push code to GitHub
Import to Vercel:
Connect GitHub repo
Root directory: frontend
Framework: Next.js
Set environment variables:
NEXT_PUBLIC_API_URL: Your Railway backend URL
Deploy!

🤝 Contributing
Fork the repository
Create a feature branch
Make changes with tests
Submit a pull request

📄 License
Proprietary - All rights reserved.

📞 Support
For issues and questions:
Check the Troubleshooting section
Review API documentation at /docs
Open a GitHub issue
