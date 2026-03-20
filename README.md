# GRB Resource Discovery Platform

## Team Members

- Julius Dona Zannu
- Olatunji Emmanuel Damilare
- Olinga Martine Dusabe Uwayo

## Project Objective

A comprehensive platform for discovering and analyzing gender-related resources and data sources, enabling policy makers and researchers to find relevant information through semantic search and AI-powered chat interface.

## User Persona

Policy makers, researchers, and development practitioners working on gender equality and women's empowerment initiatives who need quick access to relevant data sources and insights.

## Key Workflows

1. **Data Exploration**: Browse and search through curated data sources using semantic search
2. **AI Chat Interface**: Query data and get insights through conversational AI
3. **Data Visualization**: Access interactive charts and analytics for gender indicators
4. **Resource Discovery**: Find relevant documents, reports, and data sources

## Setup Steps

### Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Architecture

- **Frontend**: React TypeScript with Ant Design and Recharts
- **Backend**: FastAPI with vector database for semantic search
- **Data Sources**: DHS, World Bank, and curated gender data repositories

## Next Steps

- Expand data source integration
- Implement real-time data updates
- Add user authentication and personalization
