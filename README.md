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

## Platform Features

### Home

Dashboard overview with key gender statistics and quick access to recent resources and trending topics.

### Catalogue

Comprehensive data explorer with semantic search capabilities for browsing through 500+ gender-related resources from DHS, World Bank, and development institutions.

### Chat

AI-powered conversational interface that allows natural language queries about gender data, providing instant insights with interactive visualizations and charts.

### Insights

Interactive analytics dashboards featuring DHS Gender Data, World Bank Indicators, and Survey Analytics with customizable charts and trend analysis.

## Use Cases

### Pro-Femmes Twese Hamwe

**Scenario**: Preparing evidence-based advocacy materials for peacebuilding initiatives
<br>
**Platform Use**: Search the Catalogue for women's participation data in peace processes across regions, then use Chat to query "trends in women's political participation in post-conflict settings" to generate compelling visuals for policy briefs.

### Rwanda Women's Network (RWN)

**Scenario**: Designing socio-economic empowerment programs based on current data
<br>
**Platform Use**: Access Insights dashboard to analyze economic indicators by gender, then use Chat to ask "What are the key barriers to women's entrepreneurship in Rwanda?" to identify program focus areas with supporting data visualizations.

### Rwanda Men's Resource Center (RWAMREC)

**Scenario**: Developing male engagement strategies for GBV prevention campaigns  
<br>
**Platform Use**: Search Catalogue for masculinity and GBV prevention studies, then query Chat with "effective approaches for engaging men in gender equality" to access research-backed methodologies with trend analysis.

### Haguruka NGO

**Scenario**: Monitoring legal reform impact on women's rights
<br>
**Platform Use**: Use Insights to track women's legal empowerment indicators over time, then Chat to analyze "impact of legal reforms on women's property rights" with interactive charts showing before/after comparisons.

## Architecture

- **Frontend**: React TypeScript with Ant Design and Recharts
- **Backend**: FastAPI with vector database for semantic search
- **Data Sources**: DHS, World Bank, and curated gender data repositories

## Next Steps

- Expand data source integration
- Implement real-time data updates
- Add user authentication and personalization
