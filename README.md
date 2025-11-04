# Preprint Commons

<div align="center">
  <img src="frontend/images/preprint_commons_logo2.svg" alt="Preprint Commons Logo" width="400"/>
  
  <p><strong>A dedicated database and visualization platform for large-scale preprint meta-analysis</strong></p>
  
  ![Status](https://img.shields.io/badge/Status-Active-green)
  ![React](https://img.shields.io/badge/React-19.1.0-blue)
  ![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green)
  ![Python](https://img.shields.io/badge/Python-3.10+-blue)
</div>

---

## 📖 About

Preprint Commons is the first dedicated database and analytical platform for large-scale preprint meta-analysis, featuring over **344,000 preprints** from three major life sciences repositories. Built on rigorous academic research, the platform provides researchers, data scientists, and institutions with powerful tools to understand trends, collaborations, and the impact of open science.

### 🎯 Mission

To address the critical gap in preprint ecosystem analysis by providing a centralized platform for large-scale meta-analysis, enabling cross-disciplinary trend analysis and comparative impact assessment.

## 🌟 Key Features

- **📊 Comprehensive Database**: 344,843 preprints from bioRxiv (239,847), medRxiv (55,695), and arXiv q-bio (49,301)
- **🤖 AI-Enhanced Metadata**: LLM-based extraction of missing author affiliations and geographic data
- **🗺️ Interactive Visualizations**: Dynamic charts, maps, and dashboards powered by Chart.js and D3.js
- **🔍 Advanced Search**: Full-text search, filters by country/year/subject, and complex query support
- **📈 Citation Analysis**: Track citation patterns, identify high-impact papers, and analyze networks
- **🌐 Geographic Analytics**: Country-wise distribution and institutional affiliation mapping
- **👥 Author Profiles**: Comprehensive author search with publication counts and metrics
- **🔬 Subject Analysis**: Disciplinary adoption rates and cross-field trend analysis
- **🌍 Open Access**: Complete dataset available via public REST API with bulk download options

## 🏗️ Architecture

### Backend (FastAPI + PostgreSQL/SQLite)
- **FastAPI** web framework with modular router structure
- **PostgreSQL/SQLite** database with optimized queries and indexing
- **Pandas** for efficient data processing and analysis
- **Pydantic** models for request/response validation
- **20+ RESTful API endpoints** with comprehensive filtering and pagination
- **Asynchronous capabilities** for high performance
- **Automatic OpenAPI documentation** at `/docs`

### Frontend (React 19 + Vite)
- **React 19** with modern hooks and functional components
- **React Router v7** for client-side navigation
- **CSS Modules** for scoped component styling
- **Chart.js** for data visualization
- **Custom D3.js components** for advanced visualizations
- **Responsive design** optimized for all devices
- **Vite** for fast development and optimized builds

## 🚀 Quick Start

### Prerequisites

- **Python 3.10+**
- **Node.js 18+**
- **npm** or **yarn**
- **PostgreSQL** (optional, SQLite works for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PPC-Backend-main
   ```

2. **Set up the Python backend**
   ```bash
   # Install Python dependencies
   pip install -r requirements.txt

   # Create the database (requires combined_db_with_ppc_id.csv)
   python create_db.py
   ```

3. **Set up the React frontend**
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

#### Development Setup (Recommended)
```bash
# Backend (from project root)
python run_simple.py

# Frontend (in new terminal)
cd frontend
npm run dev
```

This will start:
- Frontend development server at `http://localhost:5173`
- Backend API server at `http://localhost:8000`
- Interactive API Documentation at `http://localhost:8000/docs`

## 📊 Database Setup

The application requires a CSV file named `combined_db_with_ppc_id.csv` containing preprint data. Place this file in the project root and run:

```bash
python create_db.py
```

This will create a database (`ppc.db`) with the papers table and all necessary indexes.

## 🛠️ Development

### Project Structure
```
PPC-Backend-main/
├── app/                   # Modular backend structure
│   ├── routers/          # API route modules
│   │   ├── papers.py     # Paper endpoints
│   │   ├── analytics.py  # Analytics endpoints
│   │   ├── authors.py    # Author endpoints
│   │   ├── subjects.py   # Subject analysis endpoints
│   │   └── health.py     # Health check endpoints
│   ├── main.py           # FastAPI application
│   ├── config.py         # Configuration management
│   ├── database.py       # Database connection
│   └── models.py         # Pydantic models
├── frontend/             # React frontend application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   │   ├── layout/   # Layout components
│   │   │   ├── sections/ # Page sections
│   │   │   └── ui/       # UI elements
│   │   ├── pages/        # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   ├── DocumentationPage.jsx
│   │   │   └── FaqPage.jsx
│   │   ├── styles/       # Global styles and themes
│   │   │   ├── index.css
│   │   │   └── theme.css
│   │   └── main.jsx      # Application entry point
│   ├── public/           # Static assets
│   └── package.json      # Frontend dependencies
├── create_db.py          # Database setup script
├── requirements.txt      # Python dependencies
├── .env                  # Environment configuration
└── README.md             # This file
```

### Available Scripts

**Backend:**
- `python run_simple.py` - Start development server
- `python create_db.py` - Initialize database
- `uvicorn app.main:app --reload` - Start with uvicorn directly

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 API Endpoints

### Core Endpoints

#### Papers
- `GET /api/papers/` - Fetch papers with comprehensive filtering and pagination
- `GET /api/papers/search` - Search papers by title, DOI, or author
- `POST /api/papers/advanced-search` - Advanced search with multiple criteria
- `GET /api/papers/{ppc_id}` - Get complete paper details

#### Analytics
- `GET /api/analytics/country-data` - Country-wise paper distribution by year
- `GET /api/analytics/dashboard` - Comprehensive analytics dashboard data
- `GET /api/analytics/citations` - Unified citation data for visualizations

#### Authors
- `GET /api/authors/search` - Search papers by author name

#### Subjects
- `GET /api/subjects/analysis` - Subject evolution, citations, and version analysis

### Example API Usage

```bash
# Search for papers
curl "http://localhost:8000/api/papers/search?query=covid&page=1&page_size=10"

# Get analytics dashboard
curl http://localhost:8000/api/analytics/dashboard

# Get country-wise data
curl http://localhost:8000/api/analytics/country-data

# Get specific paper
curl http://localhost:8000/api/papers/PPC_001

# Interactive API documentation
open http://localhost:8000/docs
```

## 🎨 Frontend Pages

- **Home** (`/`) - Landing page with hero section, features, and interactive map
- **About** (`/about`) - Platform mission, logo story, and open science commitment
- **Documentation** (`/documentation`) - Complete API reference, data sources, and methodology
- **FAQ** (`/faq`) - Frequently asked questions
- **Explore** - Data exploration and visualization tools (coming soon)

## 🔧 Configuration

### Environment Variables (.env)
```bash
# Environment
ENVIRONMENT=development
DEBUG=True

# Database
DATABASE_URL=sqlite:///./ppc.db
DATABASE_NAME=ppc.db

# API
API_HOST=0.0.0.0
API_PORT=8000
API_RELOAD=True

# CORS
ALLOWED_ORIGINS=["http://localhost:5173", "http://localhost:8000"]

# Pagination
DEFAULT_PAGE_SIZE=10
MAX_PAGE_SIZE=100
```

## 📈 Data Sources

Preprint Commons aggregates data from three major life sciences repositories:

| Repository | Coverage | Fields |
|------------|----------|--------|
| **bioRxiv** | 239,847 preprints | Biology, Neuroscience, Bioinformatics, Cell Biology, Genomics |
| **medRxiv** | 55,695 preprints | Medicine, Health Sciences, Public Health, Epidemiology |
| **arXiv (q-bio)** | 49,301 preprints | Quantitative Biology, Biophysics, Computational Biology |

### Data Quality
- **85-90%** accuracy for LLM-extracted metadata
- **Quarterly updates** to maintain current coverage
- **Comprehensive validation** through random sampling
- **Complete version history** preserved for all preprints

## 🔬 Research Methodology

### Data Acquisition
- Programmatic retrieval via dedicated APIs
- Comprehensive metadata including DOI, authors, affiliations, citations
- JATS XML parsing for structured data

### AI Enhancement
- **NVIDIA/Llama-3.1-Nemotron-70B-Instruct-HF** model
- Deployed across 8 A100-SXM4 GPUs
- Extracts missing geographic and institutional metadata
- Structured JSON output with error handling

### Processing Pipeline
1. Data collection from repositories
2. JSON to CSV conversion
3. Duplicate detection and removal
4. Geographic data enhancement via LLM
5. Citation data integration
6. Database consolidation
7. API deployment

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Documentation page](http://localhost:5173/documentation) for detailed information
2. Review the [FAQ page](http://localhost:5173/faq) for common questions
3. Open an issue on GitHub
4. Contact the development team

## 👥 Team

Built by researchers, for researchers:
- **Bibhu Prasad Behera** - Research & Development
- **Binay Panda** - Academic Supervision

**Institutional Support:**
- Jawaharlal Nehru University (JNU)
- Centre for Development of Advanced Computing (C-DAC)

## 🎯 Target Audience

- **Researchers & Scientists** - Analyze trends and discover collaborations
- **Graduate Students** - Explore research landscapes and identify opportunities
- **Data Scientists** - Access comprehensive APIs for custom analytics
- **Publishers & Editors** - Monitor research trends and publication patterns
- **Research Organizations** - Track global trends and assess scientific output
- **Open Science Advocates** - Support preprint adoption and transparency

## 🔮 Roadmap

### Completed ✅
- Core database with 344,000+ preprints
- RESTful API with 20+ endpoints
- Interactive frontend with React 19
- Geographic analytics and mapping
- Citation analysis and tracking
- Author search and profiles
- Subject analysis and trends
- Comprehensive documentation

### In Progress 🚧
- Advanced search filters
- Enhanced analytics dashboards
- Performance optimizations
- Mobile responsiveness improvements

### Planned 📋
- Integration with additional repositories
- Real-time data updates
- Advanced machine learning insights
- Author network visualization
- Retraction watch integration
- Similar papers recommendations
- User authentication and personalization

---

<div align="center">
  <strong>Made with ❤️ for the open science community</strong>
  
  <p>Empowering the next generation to drive the democratization of science</p>
</div>