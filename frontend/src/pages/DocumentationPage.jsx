import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/layout/Layout/Layout';
import Button from '../components/ui/Button/Button';
import Card from '../components/ui/Card/Card';
import CodeBlock from '../components/ui/CodeBlock/CodeBlock';
import ApiEndpoint from '../components/sections/ApiEndpoint/ApiEndpoint';
import DataSourceCard from '../components/sections/DataSourceCard/DataSourceCard';
import MethodologyFlow from '../components/sections/MethodologyFlow/MethodologyFlow';
import ResearchPaper from '../components/sections/ResearchPaper/ResearchPaper';
import styles from './DocumentationPage.module.css';

const DocumentationPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const location = useLocation();

  // Handle hash-based navigation from footer links
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash && ['overview', 'api', 'sources', 'methodology', 'paper'].includes(hash)) {
      setActiveTab(hash);
    }
  }, [location.hash]);

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const apiEndpoints = [
    // Root Endpoint
    {
      method: 'GET',
      endpoint: '/',
      description: 'Root endpoint providing API information and version',
      parameters: [],
      response: {
        message: "PPC Research Papers API",
        version: "2.0.0",
        docs: "/docs",
        health: "/api/health"
      }
    },

    // Health Endpoints
    {
      method: 'GET',
      endpoint: '/api/health/',
      description: 'Health check endpoint to verify API and database status',
      parameters: [],
      response: {
        status: "healthy",
        database: true,
        timestamp: "2024-01-15T10:30:00"
      }
    },

    // Papers Endpoints
    {
      method: 'GET',
      endpoint: '/api/papers/',
      description: 'Fetch papers with comprehensive filtering and pagination',
      parameters: [
        { name: 'country', type: 'string', required: false, description: 'Filter by country name' },
        { name: 'year', type: 'integer', required: false, description: 'Filter by year (YYYY)' },
        { name: 'subject', type: 'string', required: false, description: 'Filter by subject area' },
        { name: 'page', type: 'integer', required: false, description: 'Page number (default: 1)' },
        { name: 'page_size', type: 'integer', required: false, description: 'Items per page (max: 100)' }
      ],
      response: {
        papers: [
          {
            PPC_Id: "PPC_001",
            preprint_title: "Sample Research Paper",
            preprint_doi: "10.1101/2023.01.01.000001",
            total_citation: 156,
            preprint_submission_date: "2023-01-01",
            all_authors: "John Doe, Jane Smith",
            preprint_subject: "bioinformatics",
            preprint_server: "bioRxiv",
            country_name: "United States"
          }
        ],
        total: 344843,
        page: 1,
        page_size: 10,
        has_next: true
      }
    },
    {
      method: 'GET',
      endpoint: '/api/papers/search',
      description: 'Search papers by title, DOI, or author with pagination',
      parameters: [
        { name: 'query', type: 'string', required: true, description: 'Search query (min 1 character)' },
        { name: 'page', type: 'integer', required: false, description: 'Page number (default: 1)' },
        { name: 'page_size', type: 'integer', required: false, description: 'Items per page (max: 100)' }
      ],
      response: {
        papers: [
          {
            PPC_Id: "PPC_002",
            preprint_title: "COVID-19 Research Analysis",
            preprint_doi: "10.1101/2023.02.01.000002",
            total_citation: 89,
            all_authors: "Jane Smith, Bob Johnson"
          }
        ],
        total: 1247,
        page: 1,
        page_size: 10,
        has_next: true
      }
    },
    {
      method: 'POST',
      endpoint: '/api/papers/advanced-search',
      description: 'Advanced search with multiple criteria and operators',
      parameters: [
        { name: 'search_criteria', type: 'object', required: true, description: 'Search criteria object (see below)' },
        { name: 'page', type: 'integer', required: false, description: 'Page number (default: 1)' },
        { name: 'page_size', type: 'integer', required: false, description: 'Items per page (max: 100)' }
      ],
      response: {
        papers: [],
        total: 0,
        page: 1,
        page_size: 10,
        has_next: false
      },
      requestBody: {
        year_from: "2020",
        year_to: "2023",
        month: "2023-06",
        subject: "neuroscience",
        server: "bioRxiv",
        country: "United States",
        authors: "John Doe",
        institution: "MIT",
        license: "CC BY",
        citation_min: 10,
        citation_max: 1000
      }
    },
    {
      method: 'GET',
      endpoint: '/api/papers/{ppc_id}',
      description: 'Get complete paper details by PPC_Id',
      parameters: [
        { name: 'ppc_id', type: 'string', required: true, description: 'Unique paper identifier (path parameter)' }
      ],
      response: {
        PPC_Id: "PPC_001",
        preprint_title: "Sample Research Paper",
        preprint_doi: "10.1101/2023.01.01.000001",
        preprint_subject: "bioinformatics",
        preprint_server: "bioRxiv",
        preprint_submission_date: "2023-01-01",
        preprint_abstract: "Abstract text...",
        all_authors: "John Doe, Jane Smith",
        submission_contact: "john.doe@university.edu",
        corresponding_institution: "University of Example",
        country_name: "United States",
        total_citation: 156,
        published_DOI: "10.1038/s41586-023-12345-6",
        versions: "[{\"version\": 1, \"date\": \"2023-01-01\"}]"
      }
    },
    {
      method: 'GET',
      endpoint: '/api/papers/subjects',
      description: 'Get unique subjects for filter dropdown',
      parameters: [],
      response: [
        "neuroscience",
        "microbiology",
        "bioinformatics",
        "cell biology",
        "genomics"
      ]
    },
    {
      method: 'GET',
      endpoint: '/api/papers/servers',
      description: 'Get unique preprint servers for filter dropdown',
      parameters: [],
      response: [
        "bioRxiv",
        "medRxiv",
        "arXiv"
      ]
    },
    {
      method: 'GET',
      endpoint: '/api/papers/countries',
      description: 'Get unique countries for filter dropdown',
      parameters: [],
      response: [
        "United States",
        "United Kingdom",
        "Germany",
        "China",
        "India"
      ]
    },
    {
      method: 'GET',
      endpoint: '/api/papers/licenses',
      description: 'Get unique licenses for filter dropdown',
      parameters: [],
      response: [
        "CC BY",
        "CC BY-NC",
        "CC BY-NC-ND",
        "CC0"
      ]
    },

    // Analytics Endpoints
    {
      method: 'GET',
      endpoint: '/api/analytics/country-data',
      description: 'Get country-wise paper distribution by year for geographic analysis',
      parameters: [],
      response: {
        data: [
          {
            country_name: "United States",
            year: "2023",
            count: 45678
          }
        ]
      }
    },
    {
      method: 'GET',
      endpoint: '/api/analytics/subjects',
      description: 'Get all unique subject areas from the database',
      parameters: [],
      response: {
        data: [
          "neuroscience",
          "microbiology",
          "bioinformatics",
          "cell biology",
          "genomics",
          "evolutionary biology"
        ]
      }
    },
    {
      method: 'GET',
      endpoint: '/api/analytics/dashboard',
      description: 'Get comprehensive analytics dashboard data',
      parameters: [],
      response: {
        timelineData: [
          {
            month: "2023-01",
            submissions: 1234
          }
        ],
        subjectData: [
          {
            subject: "neuroscience",
            count: 42923,
            percentage: 12.4
          }
        ],
        serverData: [
          {
            server: "bioRxiv",
            count: 239847,
            percentage: 69.6
          }
        ],
        statisticsData: {
          totalPapers: 344843,
          dateRange: {
            startDate: "2013-11-11",
            endDate: "2024-06-30"
          },
          mostActivePeriod: {
            period: "2020-04",
            count: 8945
          },
          averagePapersPerMonth: 2876,
          activeSubjects: 42,
          activeServers: 3
        },
        metadata: {
          lastUpdated: "2024-01-15T10:30:00",
          totalRecords: 344843
        }
      }
    },
    {
      method: 'GET',
      endpoint: '/api/analytics/citations',
      description: 'Get unified citation data for all citation-related visualizations',
      parameters: [
        { name: 'time_range', type: 'string', required: false, description: 'Time filter: all, last_year, last_5_years, last_10_years (default: all)' },
        { name: 'subject', type: 'string', required: false, description: 'Subject area filter' },
        { name: 'limit', type: 'integer', required: false, description: 'Limit for top papers (1-100, default: 10)' },
        { name: 'sort_by', type: 'string', required: false, description: 'Sort: citations_desc, citations_asc, date_desc, date_asc, title_asc (default: citations_desc)' }
      ],
      response: {
        impactData: [
          {
            PPC_Id: "PPC_001",
            preprint_title: "High Impact Paper",
            publication_date: "2023-01-01",
            total_citation: 892,
            preprint_subject: "molecular biology"
          }
        ],
        trendsData: [
          {
            year: "2023",
            citations: 15678,
            papers: 234
          }
        ],
        heatmapData: [
          {
            year: 2023,
            month: 6,
            day: 15,
            citations: 45
          }
        ],
        topPapersData: [
          {
            PPC_Id: "PPC_001",
            preprint_title: "Top Cited Paper",
            publication_date: "2023-01-01",
            total_citation: 892,
            preprint_subject: "molecular biology"
          }
        ],
        metadata: {
          time_range: "all",
          subject: null,
          limit: 10,
          sort_by: "citations_desc",
          total_impact_records: 500,
          total_trends_records: 10,
          total_heatmap_records: 120,
          total_top_papers_records: 10
        }
      }
    },

    // Authors Endpoints
    {
      method: 'GET',
      endpoint: '/api/authors/search',
      description: 'Search papers by author name using submission contact field',
      parameters: [
        { name: 'query', type: 'string', required: true, description: 'Author name search query (min 1 character)' },
        { name: 'page', type: 'integer', required: false, description: 'Page number (default: 1)' },
        { name: 'page_size', type: 'integer', required: false, description: 'Items per page (max: 100, default: 10)' }
      ],
      response: {
        papers: [
          {
            PPC_Id: "PPC_003",
            preprint_title: "Author's Research Paper",
            preprint_doi: "10.1101/2023.03.01.000003",
            submission_contact: "author@university.edu",
            preprint_submission_date: "2023-03-01",
            total_citation: 67,
            preprint_server: "bioRxiv",
            preprint_subject: "neuroscience",
            country_name: "United States"
          }
        ],
        total: 45,
        page: 1,
        page_size: 10,
        has_next: true
      }
    },
    {
      method: 'GET',
      endpoint: '/api/authors/list',
      description: 'Get a list of unique authors for autocomplete/suggestions',
      parameters: [
        { name: 'page', type: 'integer', required: false, description: 'Page number (default: 1)' },
        { name: 'page_size', type: 'integer', required: false, description: 'Items per page (1-200, default: 50)' }
      ],
      response: {
        authors: [
          {
            author_name: "John Doe",
            paper_count: 15,
            max_citations: 234
          }
        ],
        total: 125000,
        page: 1,
        page_size: 50,
        has_next: true
      }
    },
    {
      method: 'GET',
      endpoint: '/api/authors/{author_name}/papers',
      description: 'Get all papers by a specific author',
      parameters: [
        { name: 'author_name', type: 'string', required: true, description: 'Author name (path parameter)' },
        { name: 'page', type: 'integer', required: false, description: 'Page number (default: 1)' },
        { name: 'page_size', type: 'integer', required: false, description: 'Items per page (max: 100, default: 10)' }
      ],
      response: {
        papers: [],
        total: 0,
        page: 1,
        page_size: 10,
        has_next: false
      }
    },

    // Subjects Endpoints
    {
      method: 'GET',
      endpoint: '/api/subjects/analysis',
      description: 'Unified endpoint for subject evolution, citations ranking, and version analysis',
      parameters: [
        { name: 'time_range', type: 'string', required: false, description: 'Time filter: all, last_year, last_5_years, last_10_years (default: all)' },
        { name: 'subject', type: 'string', required: false, description: 'Subject filter (substring match)' },
        { name: 'subjects', type: 'string', required: false, description: 'CSV of subjects for comparison (e.g., "bioinformatics,neuroscience")' },
        { name: 'top', type: 'integer', required: false, description: 'Top N subjects to include when no specific subject selected (1-50, default: 10)' }
      ],
      response: {
        evolutionData: [
          {
            year: "2023",
            subject: "neuroscience",
            count: 5678
          }
        ],
        citationRanking: [
          {
            subject: "neuroscience",
            paper_count: 42923,
            total_citation: 567890,
            avg_citation: 13.23
          }
        ],
        versionDistribution: [
          {
            versions: 1,
            count: 250000
          }
        ],
        versionDistributionBySubject: [
          {
            subject: "neuroscience",
            versions: 2,
            count: 15000
          }
        ],
        monthlyTrends: [
          {
            month: "2023-06",
            subject: "neuroscience",
            count: 456
          }
        ],
        serverDistribution: [
          {
            subject: "neuroscience",
            server: "bioRxiv",
            count: 35000
          }
        ],
        citationGrowth: [
          {
            year: "2023",
            subject: "neuroscience",
            paper_count: 5678,
            avg_citation: 12.5,
            max_citation: 892
          }
        ],
        versionSummary: {
          totalPapers: 344843,
          multiVersionPapers: 89234,
          percentMultiVersion: 25.88
        },
        metadata: {
          time_range: "all",
          subject: null,
          subjects: [],
          top: 10,
          selectedSubjects: ["neuroscience", "bioinformatics"]
        }
      }
    },

    // Additional Root-Level Endpoints
    {
      method: 'GET',
      endpoint: '/country-data',
      description: 'Get country-wise paper distribution by year for geographic analysis',
      parameters: [],
      response: {
        data: [
          {
            country_name: "United States",
            year: "2023",
            count: 45678
          }
        ]
      }
    },
    {
      method: 'GET',
      endpoint: '/analytics-data',
      description: 'Get comprehensive analytics dashboard data',
      parameters: [],
      response: {
        timelineData: [],
        subjectData: [],
        serverData: [],
        statisticsData: {},
        metadata: {}
      }
    },
    {
      method: 'GET',
      endpoint: '/subjects',
      description: 'Get all unique subject areas from the database',
      parameters: [],
      response: {
        data: ["neuroscience", "bioinformatics"]
      }
    },
    {
      method: 'GET',
      endpoint: '/citation-data-unified',
      description: 'Get unified citation data for all citation-related visualizations',
      parameters: [
        { name: 'time_range', type: 'string', required: false, description: 'Time filter: all, last_year, last_5_years, last_10_years' },
        { name: 'subject', type: 'string', required: false, description: 'Subject filter' },
        { name: 'limit', type: 'integer', required: false, description: 'Limit for top papers (1-100)' },
        { name: 'sort_by', type: 'string', required: false, description: 'Sort order' }
      ],
      response: {
        impactData: [],
        trendsData: [],
        heatmapData: [],
        topPapersData: [],
        metadata: {}
      }
    },
    {
      method: 'GET',
      endpoint: '/papers',
      description: 'Fetch papers with comprehensive filtering and pagination',
      parameters: [
        { name: 'country', type: 'string', required: false, description: 'Filter by country' },
        { name: 'year', type: 'integer', required: false, description: 'Filter by year' },
        { name: 'subject', type: 'string', required: false, description: 'Filter by subject' },
        { name: 'page', type: 'integer', required: false, description: 'Page number' },
        { name: 'page_size', type: 'integer', required: false, description: 'Items per page' }
      ],
      response: {
        papers: [],
        total: 0,
        page: 1,
        page_size: 10,
        has_next: false
      }
    },
    {
      method: 'GET',
      endpoint: '/paper/{ppc_id}',
      description: 'Get complete paper details by PPC_Id',
      parameters: [
        { name: 'ppc_id', type: 'string', required: true, description: 'Paper ID (path parameter)' }
      ],
      response: {
        PPC_Id: "PPC_001",
        preprint_title: "Sample Paper"
      }
    },
    {
      method: 'GET',
      endpoint: '/search',
      description: 'Search papers - redirects to /api/papers/search',
      parameters: [],
      response: {
        redirect: "/api/papers/search"
      }
    }
  ];

  const dataSources = [
    {
      name: 'bioRxiv',
      description: 'Biological sciences preprints - largest contributor to our database',
      url: 'https://www.biorxiv.org',
      coverage: '239,847',
      fields: ['Biology', 'Neuroscience', 'Bioinformatics', 'Cell Biology', 'Genomics'],
      color: '#27ae60'
    },
    {
      name: 'medRxiv',
      description: 'Medical and health sciences preprints with focus on clinical research',
      url: 'https://www.medrxiv.org',
      coverage: '55,695',
      fields: ['Medicine', 'Health Sciences', 'Public Health', 'Epidemiology', 'Clinical Research'],
      color: '#e74c3c'
    },
    {
      name: 'arXiv (q-bio)',
      description: 'Quantitative biology section of arXiv repository',
      url: 'https://arxiv.org/list/q-bio/recent',
      coverage: '49,301',
      fields: ['Quantitative Biology', 'Biophysics', 'Computational Biology', 'Systems Biology'],
      color: '#3498db'
    }
  ];

  return (
    <Layout>
      <div className={styles.documentation}>
        {/* Page Header */}
        <section className={styles.pageHeader}>
          <div className={styles.container}>
            <div className={styles.headerContent}>
              <h1 className={styles.pageTitle}>
                Research Documentation & API Reference
              </h1>
              <p className={styles.pageSubtitle}>
                Comprehensive documentation for Preprint Commons platform including API endpoints, 
                data sources, methodology, and research findings.
              </p>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <section className={styles.navigation}>
          <div className={styles.container}>
            <div className={styles.tabNav}>
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'api', label: 'API Reference' },
                { id: 'sources', label: 'Data Sources' },
                { id: 'methodology', label: 'Methodology' },
                { id: 'paper', label: 'Research Paper' }
              ].map(tab => (
                <button
                  key={tab.id}
                  className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
                  onClick={() => {
                    setActiveTab(tab.id);
                    window.history.pushState(null, null, `#${tab.id}`);
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <div className={styles.container}>
          {activeTab === 'overview' && (
            <section className={styles.overview}>
              <div className={styles.overviewGrid}>
                <Card className={styles.overviewCard}>
                  <Card.Header>
                    <h3 className="text-heading-3">Research Foundation</h3>
                  </Card.Header>
                  <Card.Content>
                    <p className="text-body">
                      Preprint Commons is the first dedicated database and analytical platform for large-scale preprint meta-analysis, 
                      built on rigorous academic research by Bibhu Prasad Behera and Binay Panda with institutional support from 
                      Jawaharlal Nehru University (JNU) and Centre for Development of Advanced Computing (C-DAC).
                    </p>
                    <div style={{ marginTop: 'var(--spacing-lg)' }}>
                      <strong>Published Research:</strong> "Preprint Commons: A Database for Tracking Trends, Impact, and Collaboration in Open Science"
                    </div>
                  </Card.Content>
                </Card>

                <Card className={styles.overviewCard}>
                  <Card.Header>
                    <h3 className="text-heading-3">Database Statistics</h3>
                  </Card.Header>
                  <Card.Content>
                    <div className={styles.metrics}>
                      <div className={styles.metric}>
                        <span className={styles.metricNumber}>344,843</span>
                        <span className={styles.metricLabel}>Total Preprints</span>
                      </div>
                      <div className={styles.metric}>
                        <span className={styles.metricNumber}>3</span>
                        <span className={styles.metricLabel}>Repositories</span>
                      </div>
                      <div className={styles.metric}>
                        <span className={styles.metricNumber}>150+</span>
                        <span className={styles.metricLabel}>Countries</span>
                      </div>
                    </div>
                    <div style={{ marginTop: 'var(--spacing-md)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                      bioRxiv: 239,847 • medRxiv: 55,695 • arXiv (q-bio): 49,301
                    </div>
                  </Card.Content>
                </Card>
              </div>

              {/* Technical Architecture Section */}
              <Card style={{ marginTop: 'var(--spacing-2xl)' }}>
                <Card.Header>
                  <h3 className="text-heading-3">Advanced Technical Architecture</h3>
                </Card.Header>
                <Card.Content>
                  <p className="text-body" style={{ marginBottom: 'var(--spacing-xl)' }}>
                    Built with modern full-stack architecture designed for scalability, maintainability, and high performance.
                  </p>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                    gap: 'var(--spacing-lg)'
                  }}>
                    {[
                      { 
                        icon: '🚀', 
                        title: 'FastAPI Backend', 
                        desc: 'Python-based backend with 20+ RESTful endpoints, asynchronous capabilities, and automatic OpenAPI documentation',
                        color: 'var(--color-primary)'
                      },
                      { 
                        icon: '🗄️', 
                        title: 'PostgreSQL Database', 
                        desc: 'Normalized relational schema optimized for preprint data with efficient indexing and caching strategies',
                        color: 'var(--color-secondary)'
                      },
                      { 
                        icon: '⚛️', 
                        title: 'React 19 Frontend', 
                        desc: 'Modern responsive application with Chart.js visualizations, D3.js components, and interactive dashboards',
                        color: 'var(--color-accent)'
                      },
                      { 
                        icon: '🤖', 
                        title: 'AI Enhancement', 
                        desc: 'NVIDIA/Llama-3.1-Nemotron-70B-Instruct-HF model for metadata extraction and geographic classification',
                        color: 'var(--color-success)'
                      }
                    ].map((tech, index) => (
                      <div key={index} style={{
                        padding: 'var(--spacing-lg)',
                        background: 'var(--color-bg-secondary)',
                        borderRadius: 'var(--radius-lg)',
                        borderLeft: `4px solid ${tech.color}`
                      }}>
                        <div style={{
                          fontSize: 'var(--font-size-2xl)',
                          marginBottom: 'var(--spacing-md)'
                        }}>
                          {tech.icon}
                        </div>
                        <h4 className="text-heading-4" style={{ 
                          marginBottom: 'var(--spacing-sm)',
                          color: tech.color
                        }}>
                          {tech.title}
                        </h4>
                        <p className="text-body-small" style={{ 
                          color: 'var(--color-text-secondary)',
                          lineHeight: 'var(--line-height-relaxed)'
                        }}>
                          {tech.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <div style={{ 
                    marginTop: 'var(--spacing-xl)', 
                    padding: 'var(--spacing-lg)', 
                    background: 'var(--color-bg-secondary)', 
                    borderRadius: 'var(--radius-lg)' 
                  }}>
                    <h4 className="text-heading-4" style={{ marginBottom: 'var(--spacing-md)' }}>
                      Infrastructure Specifications
                    </h4>
                    <ul className={styles.techList}>
                      <li><strong>Computing Power:</strong> 8 A100-SXM4 GPUs for AI processing</li>
                      <li><strong>API Endpoints:</strong> 20+ RESTful endpoints with automatic documentation</li>
                      <li><strong>Data Processing:</strong> Asynchronous pipeline with efficient caching</li>
                      <li><strong>Visualization:</strong> Chart.js and D3.js for interactive analytics</li>
                      <li><strong>Performance:</strong> Optimized database queries with connection pooling</li>
                    </ul>
                  </div>
                </Card.Content>
              </Card>

              {/* Research Methodology Overview */}
              <Card style={{ marginTop: 'var(--spacing-2xl)' }}>
                <Card.Header>
                  <h3 className="text-heading-3">Research Methodology Overview</h3>
                </Card.Header>
                <Card.Content>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                    gap: 'var(--spacing-lg)',
                    marginTop: 'var(--spacing-lg)'
                  }}>
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-lg)' }}>
                      <div style={{ 
                        fontSize: 'var(--font-size-3xl)', 
                        marginBottom: 'var(--spacing-md)',
                        color: 'var(--color-primary)'
                      }}>📊</div>
                      <h4 className="text-heading-4">Data Acquisition</h4>
                      <p className="text-body-small" style={{ color: 'var(--color-text-secondary)' }}>
                        Systematic pipeline gathering metadata from bioRxiv, medRxiv, and arXiv q-bio via dedicated APIs
                      </p>
                    </div>
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-lg)' }}>
                      <div style={{ 
                        fontSize: 'var(--font-size-3xl)', 
                        marginBottom: 'var(--spacing-md)',
                        color: 'var(--color-secondary)'
                      }}>🤖</div>
                      <h4 className="text-heading-4">AI Enhancement</h4>
                      <p className="text-body-small" style={{ color: 'var(--color-text-secondary)' }}>
                        NVIDIA Nemotron-70B model deployed across 8 A100 GPUs for metadata extraction and geographic classification
                      </p>
                    </div>
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-lg)' }}>
                      <div style={{ 
                        fontSize: 'var(--font-size-3xl)', 
                        marginBottom: 'var(--spacing-md)',
                        color: 'var(--color-accent)'
                      }}>✅</div>
                      <h4 className="text-heading-4">Quality Control</h4>
                      <p className="text-body-small" style={{ color: 'var(--color-text-secondary)' }}>
                        Random sampling validation with 85-90% accuracy rate and transparent reporting of limitations
                      </p>
                    </div>
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-lg)' }}>
                      <div style={{ 
                        fontSize: 'var(--font-size-3xl)', 
                        marginBottom: 'var(--spacing-md)',
                        color: 'var(--color-success)'
                      }}>🌐</div>
                      <h4 className="text-heading-4">Open Access</h4>
                      <p className="text-body-small" style={{ color: 'var(--color-text-secondary)' }}>
                        Full dataset available via REST API and bulk download, supporting reproducible research
                      </p>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            </section>
          )}

          {activeTab === 'api' && (
            <section className={styles.apiSection}>
              <div className={styles.sectionHeader}>
                <h2 className="text-heading-2">API Reference</h2>
                <p className="text-body-large">
                  RESTful API endpoints for accessing preprint data and analytics
                </p>
              </div>

              <div className={styles.apiEndpoints}>
                {apiEndpoints.map((endpoint, index) => (
                  <ApiEndpoint key={index} {...endpoint} />
                ))}
              </div>

              <Card className={styles.apiInfo}>
                <Card.Header>
                  <h3 className="text-heading-3">Authentication & Rate Limits</h3>
                </Card.Header>
                <Card.Content>
                  <p className="text-body mb-4">
                    Currently, the API is open and does not require authentication. 
                    Rate limiting may be implemented in future versions.
                  </p>
                  <div className={styles.apiDetails}>
                    <div>
                      <strong>Base URL:</strong> <code>http://localhost:8000</code>
                    </div>
                    <div>
                      <strong>Content Type:</strong> <code>application/json</code>
                    </div>
                    <div>
                      <strong>CORS:</strong> Enabled for development origins
                    </div>
                  </div>
                </Card.Content>
              </Card>
            </section>
          )}

          {activeTab === 'sources' && (
            <section className={styles.sourcesSection}>
              <div className={styles.sectionHeader}>
                <h2 className="text-heading-2">Data Sources</h2>
                <p className="text-body-large">
                  We aggregate data from leading preprint repositories worldwide
                </p>
              </div>

              <div className={styles.sourcesGrid}>
                {dataSources.map((source, index) => (
                  <DataSourceCard 
                    key={index} 
                    {...source}
                    apiIntegration={true}
                    qualityScore="High"
                    updateFrequency="Real-time via API"
                    dataPoints={[
                      'DOI and metadata',
                      'Author affiliations', 
                      'Citation networks',
                      'Version histories',
                      'Subject classifications'
                    ]}
                  />
                ))}
              </div>

            </section>
          )}

          {activeTab === 'methodology' && (
            <section className={styles.methodologySection}>
              <div className={styles.sectionHeader}>
                <h2 className="text-heading-2">Research Methodology</h2>
                <p className="text-body-large">
                  Our comprehensive approach to preprint data analysis and visualization
                </p>
              </div>

              <div className={styles.methodologyDetails}>
                <Card>
                  <Card.Header>
                    <h3 className="text-heading-3">LLM-Based Enhancement Process</h3>
                  </Card.Header>
                  <Card.Content>
                    <p className="text-body mb-4">
                      Advanced NVIDIA/Llama-3.1-Nemotron-70B-Instruct-HF model processes preprint text to extract
                      missing geographic and institutional metadata with structured JSON output format.
                    </p>
                    <div className={styles.aiProcess}>
                      <div className={styles.aiStep}>
                        <h4>Tiered Extraction Strategy</h4>
                        <p>JATS XML parsing followed by LLM analysis for missing affiliations, with chunking mechanism for longer texts</p>
                      </div>
                      <div className={styles.aiStep}>
                        <h4>Geographic Classification</h4>
                        <p>Country extraction from raw affiliation strings using structured prompts and error handling for malformed outputs</p>
                      </div>
                      <div className={styles.aiStep}>
                        <h4>Citation Network Integration</h4>
                        <p>OpenCitations API integration for comprehensive citation metadata and network analysis capabilities</p>
                      </div>
                    </div>
                    
                    <div style={{
                      marginTop: 'var(--spacing-lg)',
                      padding: 'var(--spacing-md)',
                      background: 'var(--color-warning)',
                      color: 'white',
                      borderRadius: 'var(--radius-md)'
                    }}>
                      <strong>Known Limitation:</strong> LLM processing limited to first two pages due to computational constraints,
                      which may result in missing affiliations located beyond this range.
                    </div>
                  </Card.Content>
                </Card>

                <Card>
                  <Card.Header>
                    <h3 className="text-heading-3">Validated Quality Metrics</h3>
                  </Card.Header>
                  <Card.Content>
                    <div className={styles.qualityMetrics}>
                      <div className={styles.qualityMetric}>
                        <span className={styles.qualityNumber}>85-90%</span>
                        <span className={styles.qualityLabel}>Overall LLM data extraction accuracy (only country and institution)</span>
                      </div>
                      <div className={styles.qualityMetric}>
                        <span className={styles.qualityNumber}>10-15%</span>
                        <span className={styles.qualityLabel}>Error rate in LLM data (only country and institution)</span>
                      </div>
                      <div className={styles.qualityMetric}>
                        <span className={styles.qualityNumber}>344,843</span>
                        <span className={styles.qualityLabel}>Total records</span>
                      </div>
                    </div>
                    <p className="text-body-small" style={{ marginTop: 'var(--spacing-md)', color: 'var(--color-text-secondary)' }}>
                      Quality control conducted through random sampling approach due to computational feasibility constraints.
                      Primary error sources include LLM hallucination and input truncation limitations.
                    </p>
                  </Card.Content>
                </Card>
              </div>
              <MethodologyFlow />
            </section>
          )}

          {activeTab === 'paper' && (
            <section className={styles.paperSection}>
              <ResearchPaper />
            </section>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DocumentationPage;