# Preprint Commons

A comprehensive platform for tracking, analyzing, and visualizing preprint research data from major repositories worldwide. Preprint Commons provides researchers, policy makers, and institutions with powerful tools to understand trends, collaborations, and the impact of open science.

![Preprint Commons](https://img.shields.io/badge/Status-Active-green)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green)
![Python](https://img.shields.io/badge/Python-3.10+-blue)

## 🌟 Features

- **Global Coverage**: Comprehensive data from major preprint repositories (medRxiv, bioRxiv, arXiv)
- **AI-Enhanced Metadata**: Advanced language models extract and enrich missing information
- **Interactive Visualizations**: Dynamic charts, maps, and dashboards for data exploration
- **Real-time Updates**: Continuously updated data ensuring the latest insights
- **Search & Discovery**: Advanced search capabilities to find specific papers and research
- **Country-wise Analytics**: Detailed breakdown of preprint submissions by country and year

## 🏗️ Architecture

### Backend (FastAPI + SQLite)
- **FastAPI** web framework with modular router structure
- **SQLite** database with connection pooling and error handling
- **Pandas** for efficient data processing and analysis
- **Pydantic** models for request/response validation
- **Environment-based configuration** for different deployment stages
- **Comprehensive logging** and health monitoring
- **Docker support** for containerized deployment

### Frontend (React + Vite)
- **React 19** with modern hooks and components
- **React Router v7** for navigation
- **CSS Modules** for component styling
- **Chart.js** for data visualization
- **Vite** for fast development and building

## 🚀 Quick Start

### Prerequisites

- **Python 3.10+**
- **Node.js 18+**
- **npm** or **yarn**
- **Docker** (optional, for containerized deployment)

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

#### Option 1: Simple Development Setup (Recommended)
```bash
# Backend (from project root)
python run_simple.py

# Frontend (in new terminal)
cd frontend
npm run dev
```

#### Option 2: Using the Improved Backend Structure
```bash
# Backend with new modular structure
python run.py

# Frontend (in new terminal)
cd frontend
npm run dev
```

#### Option 3: Docker Deployment (Production)
```bash
# Build and run with Docker
docker-compose up -d

# View logs
docker-compose logs -f
```

This will start:
- Frontend development server at `http://localhost:5173`
- Backend API server at `http://localhost:8000`
- API Documentation at `http://localhost:8000/docs`

## 📊 Database Setup

The application requires a CSV file named `combined_db_with_ppc_id.csv` containing preprint data. Place this file in the project root and run:

```bash
python create_db.py
```

This will create a SQLite database (`ppc.db`) with the papers table.

## 🛠️ Development

### Project Structure
```
PPC-Backend-main/
├── main.py                 # Legacy FastAPI backend (still works)
├── run_simple.py          # Simple runner for main.py
├── create_db.py           # Database setup script
├── requirements.txt       # Python dependencies
├── .env                   # Environment configuration
├── ppc.db                 # SQLite database (created after setup)
├── app/                   # Improved modular backend structure
│   ├── __init__.py
│   ├── main.py           # New FastAPI app with better structure
│   ├── config.py         # Configuration management
│   ├── database.py       # Database connection handling
│   ├── models.py         # Pydantic models
│   └── routers/          # API route modules
│       ├── papers.py     # Paper-related endpoints
│       ├── analytics.py  # Analytics endpoints
│       └── health.py     # Health check endpoints
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Docker Compose setup
├── nginx.conf           # Nginx reverse proxy config
├── frontend/            # React frontend application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── styles/      # Global styles and themes
│   │   └── App.jsx      # Main application component
│   ├── public/          # Static assets
│   └── package.json     # Frontend dependencies
└── README.md            # This file
```

### Available Scripts

**Backend:**
- `python run_simple.py` - Start simple backend (main.py)
- `python run.py` - Start improved modular backend
- `python create_db.py` - Initialize database
- `docker-compose up -d` - Run with Docker

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 API Endpoints

### Legacy Endpoints (main.py)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/country-data` | GET | Get preprint counts by country and year |
| `/papers` | GET | Fetch papers by country and year |
| `/search` | GET | Search papers by title or DOI |
| `/paper/{ppc_id}` | GET | Get specific paper details |
| `/analytics-data` | GET | Get comprehensive analytics data |
| `/subjects` | GET | Get all unique subject areas |
| `/citation-data-unified` | GET | Get unified citation data |

### New API Endpoints (app/main.py)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health/` | GET | Health check endpoint |
| `/api/papers/search` | GET | Search papers with pagination |
| `/api/papers/{ppc_id}` | GET | Get specific paper details |
| `/api/papers/` | GET | Fetch papers with filters and pagination |
| `/api/analytics/country-data` | GET | Country-wise paper distribution |
| `/api/analytics/subjects` | GET | All unique subject areas |
| `/api/analytics/dashboard` | GET | Comprehensive analytics data |
| `/api/analytics/citations` | GET | Unified citation data |

### Example API Usage

```bash
# Legacy endpoints
curl http://localhost:8000/country-data
curl "http://localhost:8000/search?query=covid"
curl "http://localhost:8000/papers?country=United States&year=2023"

# New endpoints with better features
curl http://localhost:8000/api/health
curl "http://localhost:8000/api/papers/search?query=covid&page=1&page_size=10"
curl http://localhost:8000/api/analytics/dashboard

# Interactive API documentation
open http://localhost:8000/docs
```

## 🎨 Frontend Pages

- **Home** (`/`) - Landing page with overview and interactive map
- **Explore** (`/explore`) - Data exploration and visualization tools
- **About** (`/about`) - Information about the platform
- **FAQ** (`/faq`) - Frequently asked questions
- **Contact** (`/contact`) - Contact information
- **Paper Details** (`/paper/:id`) - Individual paper view

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
ALLOWED_ORIGINS=["http://127.0.0.1:8000", "http://localhost:8000", "http://localhost:5173"]

# Pagination
DEFAULT_PAGE_SIZE=10
MAX_PAGE_SIZE=100
```

### Database Configuration
- Database file: `ppc.db`
- Table: `papers`
- Required CSV: `combined_db_with_ppc_id.csv`
- Connection pooling and error handling included

### Deployment Options
1. **Development**: `python run_simple.py`
2. **Production**: `docker-compose up -d`
3. **Manual**: `gunicorn app.main:app -w 4 -k uvicorn.workers.UnicornWorker`

## 📈 Data Sources

Preprint Commons aggregates data from:
- **medRxiv** - Medical preprints
- **bioRxiv** - Biological sciences preprints
- **arXiv(Q-bio)** - Physics, mathematics, and other sciences

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [FAQ page](frontend/src/pages/Faq.jsx) for common questions
2. Open an issue on GitHub
3. Contact the development team

## 🚀 Recent Improvements

### Backend Enhancements
- ✅ **Modular Architecture**: Organized code into logical modules
- ✅ **Better Error Handling**: Comprehensive exception handling
- ✅ **Environment Configuration**: Flexible settings management
- ✅ **API Documentation**: Auto-generated interactive docs
- ✅ **Health Monitoring**: Database and application health checks
- ✅ **Docker Support**: Containerized deployment ready
- ✅ **Pagination**: Efficient handling of large datasets
- ✅ **Logging**: Structured logging for debugging and monitoring

### Production Ready Features
- ✅ **Nginx Reverse Proxy**: Load balancing and security
- ✅ **Docker Compose**: Multi-container orchestration
- ✅ **Security Headers**: XSS protection and security hardening
- ✅ **Rate Limiting**: API abuse prevention
- ✅ **Backward Compatibility**: Legacy endpoints still work

## 🔮 Future Roadmap
- [ ] GeographicAnalyticsCard`
- [ ] AuthorAnalyticsCard`
- [ ] SubjectAnalyticsCard`
- [ ] CitationTrendsCard`
- [ ] AuthorNetworkCard`
- [ ] QualityMetricsCard`
- [ ] AdvancedCorrelationsCard

- [ ] retraction watch
- [X] API rate limiting and caching
- [ ] Pickel search
- [ ] Update the rest of the pages with static text

- [ ] make clickable papers everywhere
- [X] fix the country dropdown in explore page citation analystics
- [ ] update the citation heatmap based on the subject
- [ ] make the analytics daashboard to have stacked publication timeline
- [ ] fix subject distribution with others as well 
- [x] Make the existing slider better in citation impact visualiser  
- [X] Author page

- [ ] Author network
- [ ] Integration with more preprint repositories
- [ ] Real-time data updates
- [ ] Authentication and user management
- [ ] Advanced analytics and machine learning insights

---

**Made with ❤️ for the open science community**
