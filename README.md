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
- **FastAPI** web framework for high-performance API
- **SQLite** database for storing preprint metadata
- **Pandas** for data processing and analysis
- **CORS** enabled for frontend integration

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

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PPC-Backend-main
   ```

2. **Set up the Python backend**
   ```bash
   # Install Python dependencies
   pip install fastapi uvicorn pandas sqlite3

   # Create the database (requires combined_db_with_ppc_id.csv)
   python create_db.py
   ```

3. **Set up the React frontend**
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

#### Option 1: Run Both Servers Concurrently (Recommended)
```bash
cd frontend
npm run dev:all
```

This will start:
- Frontend development server at `http://localhost:5173`
- Backend API server at `http://localhost:8000`

#### Option 2: Run Servers Separately

**Backend:**
```bash
# From project root
uvicorn main:app --reload
```

**Frontend:**
```bash
# From frontend directory
cd frontend
npm run dev
```

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
├── main.py                 # FastAPI backend application
├── create_db.py           # Database setup script
├── ppc.db                 # SQLite database (created after setup)
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── styles/        # Global styles and themes
│   │   └── App.jsx        # Main application component
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
└── README.md              # This file
```

### Available Scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run dev:all` - Start both frontend and backend
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

**Backend:**
- `uvicorn main:app --reload` - Start development server
- `python create_db.py` - Initialize database

## 🌐 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/country-data` | GET | Get preprint counts by country and year |
| `/papers` | GET | Fetch papers by country and year |
| `/search` | GET | Search papers by title or DOI |
| `/paper/{ppc_id}` | GET | Get specific paper details |

### Example API Usage

```bash
# Get country data
curl http://localhost:8000/country-data

# Search papers
curl "http://localhost:8000/search?query=covid"

# Get papers by country and year
curl "http://localhost:8000/papers?country=United States&year=2023"
```

## 🎨 Frontend Pages

- **Home** (`/`) - Landing page with overview and interactive map
- **Explore** (`/explore`) - Data exploration and visualization tools
- **About** (`/about`) - Information about the platform
- **FAQ** (`/faq`) - Frequently asked questions
- **Contact** (`/contact`) - Contact information
- **Paper Details** (`/paper/:id`) - Individual paper view

## 🔧 Configuration

### CORS Settings
The backend is configured to accept requests from:
- `http://127.0.0.1:8000`
- `http://localhost:8000`
- `http://localhost:5173`

### Database Configuration
- Database file: `ppc.db`
- Table: `papers`
- Required CSV: `combined_db_with_ppc_id.csv`

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

## 🔮 Future Roadmap

- [ ] Advanced search page
- [ ] Export functionality for research data
- [ ] Integration with more preprint repositories (qbio)

---

**Made with ❤️ for the open science community**