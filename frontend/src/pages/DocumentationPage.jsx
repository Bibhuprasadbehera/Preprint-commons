import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/layout/Layout/Layout';
import Button from '../components/ui/Button/Button';
import Card from '../components/ui/Card/Card';
import CodeBlock from '../components/ui/CodeBlock/CodeBlock';
import ApiEndpoint from '../components/sections/ApiEndpoint/ApiEndpoint';
import DataSourceCard from '../components/sections/DataSourceCard/DataSourceCard';
import MethodologyFlow from '../components/sections/MethodologyFlow/MethodologyFlow';
import styles from './DocumentationPage.module.css';

const DocumentationPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const location = useLocation();

  // Handle hash-based navigation from footer links
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash && ['overview', 'api', 'sources', 'methodology'].includes(hash)) {
      setActiveTab(hash);
    }
  }, [location.hash]);

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const apiEndpoints = [
    // Papers Endpoints - Data Collection
    {
      method: 'GET',
      endpoint: '/api/papers/',
      description: 'Fetch papers with filtering and pagination. Returns summary fields optimized for listing.',
      parameters: [
        { name: 'country', type: 'string', required: false, description: 'Filter by exact country name' },
        { name: 'year', type: 'integer', required: false, description: 'Filter by submission year (YYYY format)' },
        { name: 'subject', type: 'string', required: false, description: 'Filter by subject area (substring match)' },
        { name: 'page', type: 'integer', required: false, description: 'Page number (default: 1, minimum: 1)' },
        { name: 'page_size', type: 'integer', required: false, description: 'Items per page (default: 10, maximum: 100)' }
      ],
      response: {
        papers: [
          {
            PPC_Id: "PPC00000001",
            preprint_title: "Sample Research Paper",
            total_citation: 156,
            preprint_submission_date: "2023-01-01",
            all_authors: "John Doe, Jane Smith",
            preprint_subject: "bioinformatics",
            preprint_server: "bioRxiv",
            country_name: "United States",
            preprint_doi: null,
            preprint_abstract: null,
            submission_contact: null,
            corresponding_institution: null,
            versions: null,
            submission_type: null,
            submission_license: null,
            published_DOI: null,
            publication_date: null,
            citation: null
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
      description: 'Search papers by title, DOI, or author name. Results sorted by citation count (descending).',
      parameters: [
        { name: 'query', type: 'string', required: true, description: 'Search query string (minimum 1 character)' },
        { name: 'page', type: 'integer', required: false, description: 'Page number (default: 1, minimum: 1)' },
        { name: 'page_size', type: 'integer', required: false, description: 'Items per page (default: 10, maximum: 100)' }
      ],
      response: {
        papers: [
          {
            PPC_Id: "PPC00000002",
            preprint_title: "COVID-19 Research Analysis",
            preprint_doi: "10.1101/2023.02.01.000002",
            total_citation: 89,
            all_authors: "Jane Smith, Bob Johnson",
            preprint_submission_date: "2023-02-01",
            preprint_subject: "epidemiology",
            preprint_server: "medRxiv",
            country_name: "United Kingdom",
            preprint_abstract: null,
            submission_contact: null,
            corresponding_institution: null,
            versions: null,
            submission_type: null,
            submission_license: null,
            published_DOI: null,
            publication_date: null,
            citation: null
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
      description: 'Advanced search with multiple criteria. All filters are optional and combined with AND logic.',
      parameters: [
        { name: 'search_criteria', type: 'object', required: true, description: 'JSON object with search criteria (see request body example)' },
        { name: 'page', type: 'integer', required: false, description: 'Page number (default: 1, minimum: 1)' },
        { name: 'page_size', type: 'integer', required: false, description: 'Items per page (default: 10, maximum: 100)' }
      ],
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
      },
      response: {
        papers: [
          {
            PPC_Id: "PPC00000003",
            preprint_title: "Neuroscience Study",
            total_citation: 45,
            preprint_submission_date: "2023-06-15",
            all_authors: "John Doe, Alice Brown",
            preprint_subject: "neuroscience",
            preprint_server: "bioRxiv",
            country_name: "United States",
            preprint_doi: null,
            preprint_abstract: null,
            submission_contact: null,
            corresponding_institution: null,
            versions: null,
            submission_type: null,
            submission_license: null,
            published_DOI: null,
            publication_date: null,
            citation: null
          }
        ],
        total: 234,
        page: 1,
        page_size: 10,
        has_next: true
      }
    },
    {
      method: 'GET',
      endpoint: '/api/papers/{ppc_id}',
      description: 'Get complete details for a specific paper by its unique PPC_Id.',
      parameters: [
        { name: 'ppc_id', type: 'string', required: true, description: 'Unique paper identifier (path parameter, e.g., PPC00000001)' }
      ],
      response: {
        PPC_Id: "PPC00000001",
        preprint_title: "Sample Research Paper",
        preprint_doi: "10.1101/2023.01.01.000001",
        preprint_subject: "bioinformatics",
        preprint_server: "bioRxiv",
        preprint_submission_date: "2023-01-01",
        preprint_abstract: "This is the abstract of the research paper...",
        all_authors: "John Doe, Jane Smith, Bob Johnson",
        submission_contact: "john.doe@university.edu",
        corresponding_institution: "University of Example",
        country_name: "United States",
        total_citation: 156,
        published_DOI: "10.1038/s41586-023-12345-6",
        publication_date: "2023-06-01",
        submission_type: "new results",
        submission_license: "CC BY 4.0",
        versions: "[{\"version\": 1, \"date\": \"2023-01-01\"}, {\"version\": 2, \"date\": \"2023-02-15\"}]",
        citation: "[{\"doi\": \"10.1234/cite1\", \"count\": 50}, {\"doi\": \"10.1234/cite2\", \"count\": 106}]"
      }
    },
    {
      method: 'GET',
      endpoint: '/api/papers/subjects',
      description: 'Get list of unique subject areas available in the database for filter dropdowns. Returns a plain array of strings.',
      parameters: [],
      response: [
        "bioinformatics",
        "neuroscience",
        "molecular biology",
        "epidemiology",
        "genetics",
        "immunology"
      ]
    },
    {
      method: 'GET',
      endpoint: '/api/papers/servers',
      description: 'Get list of unique preprint servers available in the database for filter dropdowns. Returns a plain array of strings.',
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
      description: 'Get list of unique countries available in the database for filter dropdowns. Returns a plain array of strings.',
      parameters: [],
      response: [
        "United States",
        "United Kingdom",
        "China",
        "Germany",
        "France",
        "Canada"
      ]
    },
    {
      method: 'GET',
      endpoint: '/api/papers/licenses',
      description: 'Get list of unique license types available in the database for filter dropdowns. Returns a plain array of strings.',
      parameters: [],
      response: [
        "CC BY 4.0",
        "CC BY-NC 4.0",
        "CC BY-NC-ND 4.0",
        "CC0 1.0"
      ]
    },

    // Authors Endpoints - Data Collection
    {
      method: 'GET',
      endpoint: '/api/authors/search',
      description: 'Search papers by author name using the submission_contact field. Results sorted by citation count.',
      parameters: [
        { name: 'query', type: 'string', required: true, description: 'Author name search query (minimum 1 character, substring match)' },
        { name: 'page', type: 'integer', required: false, description: 'Page number (default: 1, minimum: 1)' },
        { name: 'page_size', type: 'integer', required: false, description: 'Items per page (default: 10, maximum: 100)' }
      ],
      response: {
        papers: [
          {
            PPC_Id: "PPC00000123",
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
      description: 'Get paginated list of unique authors with their publication counts and maximum citations.',
      parameters: [
        { name: 'page', type: 'integer', required: false, description: 'Page number (default: 1, minimum: 1)' },
        { name: 'page_size', type: 'integer', required: false, description: 'Items per page (default: 50, maximum: 200)' }
      ],
      response: {
        authors: [
          {
            author_name: "Duccio Cavalieri",
            paper_count: 15,
            max_citations: 892
          },
          {
            author_name: "David Morrison",
            paper_count: 12,
            max_citations: 456
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
      description: 'Get all papers by a specific author. Results sorted by citation count (descending).',
      parameters: [
        { name: 'author_name', type: 'string', required: true, description: 'Author name or email (path parameter, substring match)' },
        { name: 'page', type: 'integer', required: false, description: 'Page number (default: 1, minimum: 1)' },
        { name: 'page_size', type: 'integer', required: false, description: 'Items per page (default: 10, maximum: 100)' }
      ],
      response: {
        papers: [
          {
            PPC_Id: "PPC00000045",
            preprint_title: "Research Paper by Author",
            preprint_doi: "10.1101/2023.04.01.000004",
            total_citation: 234,
            preprint_submission_date: "2023-04-01",
            preprint_subject: "molecular biology",
            preprint_server: "bioRxiv",
            country_name: "United States",
            preprint_abstract: null,
            submission_contact: "author@university.edu",
            corresponding_institution: null,
            versions: null,
            submission_type: null,
            submission_license: null,
            published_DOI: null,
            publication_date: null,
            citation: null,
            all_authors: null
          }
        ],
        total: 15,
        page: 1,
        page_size: 10,
        has_next: true
      }
    },

    // Analytics Endpoints - Data Collection
    {
      method: 'GET',
      endpoint: '/api/analytics/country-data',
      description: 'Get country-wise paper distribution grouped by year for geographic analysis and mapping. Returns data wrapped in a "data" property.',
      parameters: [],
      response: {
        data: [
          {
            country_name: "United States",
            year: "2023",
            count: 45678
          },
          {
            country_name: "United Kingdom",
            year: "2023",
            count: 12345
          },
          {
            country_name: "China",
            year: "2023",
            count: 23456
          }
        ]
      }
    },
    {
      method: 'GET',
      endpoint: '/api/analytics/subjects',
      description: 'Get list of all unique subject areas for analytics filtering. Returns data wrapped in a "data" property.',
      parameters: [],
      response: {
        data: [
          "bioinformatics",
          "neuroscience",
          "molecular biology",
          "epidemiology",
          "genetics"
        ]
      }
    },
    {
      method: 'GET',
      endpoint: '/api/analytics/dashboard',
      description: 'Get comprehensive analytics dashboard data including timeline, subject distribution, server statistics, and key metrics.',
      parameters: [],
      response: {
        timelineData: [
          {
            month: "2023-01",
            submissions: 1234
          },
          {
            month: "2023-02",
            submissions: 1456
          }
        ],
        subjectData: [
          {
            subject: "neuroscience",
            count: 42923,
            percentage: 12.4
          },
          {
            subject: "bioinformatics",
            count: 38456,
            percentage: 11.2
          }
        ],
        serverData: [
          {
            server: "bioRxiv",
            count: 239847,
            percentage: 69.6
          },
          {
            server: "medRxiv",
            count: 55695,
            percentage: 16.1
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
      description: 'Get unified citation data including impact analysis, trends, heatmaps, and top cited papers.',
      parameters: [
        { name: 'time_range', type: 'string', required: false, description: 'Time filter: all | last_year | last_5_years | last_10_years (default: all)' },
        { name: 'subject', type: 'string', required: false, description: 'Subject area filter (substring match)' },
        { name: 'limit', type: 'integer', required: false, description: 'Limit for top papers (minimum: 1, maximum: 100, default: 10)' },
        { name: 'sort_by', type: 'string', required: false, description: 'Sort order: citations_desc | citations_asc | date_desc | date_asc | title_asc (default: citations_desc)' }
      ],
      response: {
        impactData: [
          {
            PPC_Id: "PPC00000001",
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
          },
          {
            year: "2022",
            citations: 14523,
            papers: 198
          }
        ],
        heatmapData: [
          {
            year: 2023,
            month: 6,
            day: 15,
            citations: 45
          },
          {
            year: 2023,
            month: 7,
            day: 20,
            citations: 52
          }
        ],
        topPapersData: [
          {
            PPC_Id: "PPC00000001",
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

    // Subjects Endpoints - Data Collection
    {
      method: 'GET',
      endpoint: '/api/subjects/analysis',
      description: 'Unified endpoint providing comprehensive subject analysis including evolution trends, citation rankings, version statistics, monthly trends, server distribution, and citation growth patterns.',
      parameters: [
        { name: 'time_range', type: 'string', required: false, description: 'Time filter: all | last_year | last_5_years | last_10_years (default: all)' },
        { name: 'subject', type: 'string', required: false, description: 'Single subject filter (substring match)' },
        { name: 'subjects', type: 'string', required: false, description: 'CSV list of subjects for comparison (e.g., "bioinformatics,neuroscience")' },
        { name: 'top', type: 'integer', required: false, description: 'Number of top subjects to include when no specific subject selected (minimum: 1, maximum: 50, default: 10)' }
      ],
      response: {
        evolutionData: [
          {
            year: "2023",
            subject: "neuroscience",
            count: 5678
          },
          {
            year: "2022",
            subject: "neuroscience",
            count: 5234
          }
        ],
        citationRanking: [
          {
            subject: "neuroscience",
            paper_count: 42923,
            total_citation: 567890,
            avg_citation: 13.23
          },
          {
            subject: "bioinformatics",
            paper_count: 38456,
            total_citation: 498765,
            avg_citation: 12.97
          }
        ],
        versionDistribution: [
          {
            versions: 1,
            count: 250000
          },
          {
            versions: 2,
            count: 75000
          },
          {
            versions: 3,
            count: 15000
          }
        ],
        versionDistributionBySubject: [
          {
            subject: "neuroscience",
            versions: 1,
            count: 30000
          },
          {
            subject: "neuroscience",
            versions: 2,
            count: 10000
          }
        ],
        monthlyTrends: [
          {
            month: "2023-06",
            subject: "neuroscience",
            count: 456
          },
          {
            month: "2023-07",
            subject: "neuroscience",
            count: 489
          }
        ],
        serverDistribution: [
          {
            subject: "neuroscience",
            server: "bioRxiv",
            count: 35000
          },
          {
            subject: "neuroscience",
            server: "medRxiv",
            count: 5000
          }
        ],
        citationGrowth: [
          {
            year: "2023",
            subject: "neuroscience",
            paper_count: 5678,
            avg_citation: 12.5,
            max_citation: 892
          },
          {
            year: "2022",
            subject: "neuroscience",
            paper_count: 5234,
            avg_citation: 11.8,
            max_citation: 756
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
                { id: 'methodology', label: 'Methodology' }
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
                    <h3 className="text-heading-3">Aim</h3>
                  </Card.Header>
                  <Card.Content>
                    <p className="text-body">
                      Preprint Commons is the first dedicated database and analytical platform meant to provide large-scale preprint meta-analysis.
                    </p>
                    <div style={{ marginTop: 'var(--spacing-lg)' }}>
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

              {/* Platform Capabilities */}
              <Card style={{ marginTop: 'var(--spacing-2xl)' }}>
                <Card.Header>
                  <h3 className="text-heading-3">Platform Capabilities</h3>
                </Card.Header>
                <Card.Content>
                  <p className="text-body" style={{ marginBottom: 'var(--spacing-xl)' }}>
                    Preprint Commons enables researchers to explore, analyze, and visualize bulk preprint data 
                    across multiple dimensions including temporal trends, geographic distribution, and citation patterns.
                  </p>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                    gap: 'var(--spacing-lg)'
                  }}>
                    {[
                      { 
                        icon: '🔍', 
                        title: 'Advanced Search', 
                        desc: 'Full-text search across titles, DOIs, and authors with complex filtering by time range, subject, country, and citation metrics.',
                        color: 'var(--color-primary)'
                      },
                      { 
                        icon: '📊', 
                        title: 'Interactive Analytics', 
                        desc: 'Dynamic visualizations including scatter plots, heatmaps, geographic maps, and trend analyses powered by D3.js and Chart.js.',
                        color: 'var(--color-secondary)'
                      },
                      { 
                        icon: '🌐', 
                        title: 'Geographic Mapping', 
                        desc: 'Explore global distribution of preprints with interactive maps showing country-wise contributions and institutional affiliations.',
                        color: 'var(--color-accent)'
                      },
                      { 
                        icon: '📈', 
                        title: 'Citation Analysis', 
                        desc: 'Track citation patterns and analyze citation mertics across disciplines and time periods.',
                        color: 'var(--color-success)'
                      },
                      { 
                        icon: '👥', 
                        title: 'Author Profiles', 
                        desc: 'Author search with publication counts, citation metrics, and institutional affiliations.',
                        color: '#f59e0b'
                      },
                      { 
                        icon: '🔬', 
                        title: 'Subject Analysis', 
                        desc: 'Analyze subject-wise adoption rates, track research trends, and compare subject-specific patterns over time.',
                        color: '#8b5cf6'
                      }
                    ].map((feature, index) => (
                      <div key={index} style={{
                        padding: 'var(--spacing-lg)',
                        background: 'var(--color-bg-secondary)',
                        borderRadius: 'var(--radius-lg)',
                        borderLeft: `4px solid ${feature.color}`
                      }}>
                        <div style={{
                          fontSize: 'var(--font-size-2xl)',
                          marginBottom: 'var(--spacing-md)'
                        }}>
                          {feature.icon}
                        </div>
                        <h4 className="text-heading-4" style={{ 
                          marginBottom: 'var(--spacing-sm)',
                          color: feature.color
                        }}>
                          {feature.title}
                        </h4>
                        <p
                          className="text-body-small"
                          style={{
                            color: 'var(--color-text-secondary)',
                            lineHeight: 'var(--line-height-relaxed)'
                          }}
                          dangerouslySetInnerHTML={{ __html: feature.desc }}
                        />
                      </div>
                    ))}
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
                  <h3 className="text-heading-3">API Information</h3>
                </Card.Header>
                <Card.Content>
                  <p className="text-body mb-4">
                    The API provides RESTful endpoints for accessing preprint data. All endpoints listed above are 
                    data collection endpoints used for retrieving information on preprints. 
                  </p>
                  <div className={styles.apiDetails}>
                    <div>
                      <strong>Base URL:</strong> <code>http://localhost:8000</code>
                    </div>
                    <div>
                      <strong>Content Type:</strong> <code>application/json</code>
                    </div>
                    <div>
                      <strong>Authentication:</strong> Not required (open API)
                    </div>
                    <div>
                      <strong>CORS:</strong> Enabled for development origins
                    </div>
                    <div>
                      <strong>Rate Limiting:</strong> Not currently implemented
                    </div>
                  </div>
                  <div style={{ 
                    marginTop: 'var(--spacing-lg)',
                    padding: 'var(--spacing-md)',
                    background: 'var(--color-bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    borderLeft: '4px solid var(--color-primary)'
                  }}>
                    <strong>Note:</strong> All endpoints support pagination where applicable. Maximum page size is 100 items 
                    for preprint endpoints and 200 items for author list endpoints. Results are cached for improved performance.
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
                  Comprehensive metadata from three major life sciences preprint repositories
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

              {/* Repository Selection Rationale */}
              <Card style={{ marginTop: 'var(--spacing-3xl)' }}>
                <Card.Header>
                  <h3 className="text-heading-3">Repository Selection Criteria</h3>
                </Card.Header>
                <Card.Content>
                  <p className="text-body" style={{ marginBottom: 'var(--spacing-lg)' }}>
                    Preprint Commons focuses on three primary repositories that provide structured, comprehensive, 
                    and high-quality metadata through well documented APIs covering multiple subjects in life and health sciences.
                  </p>
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                    gap: 'var(--spacing-lg)',
                    marginBottom: 'var(--spacing-xl)'
                  }}>
                    <div style={{
                      padding: 'var(--spacing-lg)',
                      background: 'var(--color-bg-secondary)',
                      borderRadius: 'var(--radius-lg)',
                      borderLeft: '4px solid var(--color-success)'
                    }}>
                      <h4 className="text-heading-4" style={{ marginBottom: 'var(--spacing-md)', color: 'var(--color-success)' }}>
                        ✓ Included Repositories
                      </h4>
                      <ul className={styles.techList} style={{ fontSize: 'var(--font-size-sm)' }}>
                        <li><strong>bioRxiv:</strong> Well documented API and JATS XML metadata</li>
                        <li><strong>medRxiv:</strong> Well documented API and health sciences focus</li>
                        <li><strong>arXiv (q-bio):</strong> Well documented API</li>
                      </ul>
                    </div>
                    </div>

                 
                </Card.Content>
              </Card>

              {/* Metadata Collection Details */}
              <Card style={{ marginTop: 'var(--spacing-2xl)' }}>
                <Card.Header>
                  <h3 className="text-heading-3">Metadata Collection & Processing</h3>
                </Card.Header>
                <Card.Content>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                    gap: 'var(--spacing-xl)'
                  }}>
                    <div>
                      <h4 className="text-heading-4" style={{ marginBottom: 'var(--spacing-md)', color: 'var(--color-primary)' }}>
                        📋 Standard Metadata Fields
                      </h4>
                      <ul className={styles.techList}>
                        <li>DOI (Digital Object Identifier)</li>
                        <li>Title and abstract</li>
                        <li>Authors and corresponding author</li>
                        <li>Submission and publication dates</li>
                        <li>Version information</li>
                        <li>License type</li>
                        <li>Subject category</li>
                        <li>Preprint server</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-heading-4" style={{ marginBottom: 'var(--spacing-md)', color: 'var(--color-secondary)' }}>
                        🔬 Enhanced Metadata
                      </h4>
                      <ul className={styles.techList}>
                        <li>Author institutional affiliations</li>
                        <li>Geographic country information</li>
                        <li>Citation counts</li>
                        <li>peer-reviewed article DOI (where applicable)</li>
                        <li>Complete version history</li>
                        <li>JATS XML structured data (medRxiv and bioRxiv)</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-heading-4" style={{ marginBottom: 'var(--spacing-md)', color: 'var(--color-accent)' }}>
                        🔄 Data Processing
                      </h4>
                      <ul className={styles.techList}>
                        <li>JSON to CSV conversion</li>
                        <li>Duplicate detection and removal</li>
                        <li>Date standardization (ISO format)</li>
                        <li>Text normalization</li>
                        <li>JATS XML parsing (medRxiv and bioRxiv)</li>
                        <li>LLM-based enhancement (arXiv-qbio)</li>
                      </ul>
                    </div>
                  </div>
                </Card.Content>
              </Card>

              {/* Data Quality & Updates */}
              <Card style={{ marginTop: 'var(--spacing-2xl)' }}>
                <Card.Header>
                  <h3 className="text-heading-3">Coverage and Data Quality</h3>
                </Card.Header>
                <Card.Content>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                    gap: 'var(--spacing-lg)'
                  }}>
                    <div style={{
                      padding: 'var(--spacing-lg)',
                      background: 'var(--color-bg-secondary)',
                      borderRadius: 'var(--radius-lg)',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-md)' }}>📅</div>
                      <h4 className="text-heading-4" style={{ marginBottom: 'var(--spacing-sm)' }}>Current Coverage</h4>
                      <p className="text-body-small" style={{ color: 'var(--color-text-secondary)' }}>
                        Dataset includes preprints up to <strong>June 2024</strong>
                      </p>
                    </div>

                    <div style={{
                      padding: 'var(--spacing-lg)',
                      background: 'var(--color-bg-secondary)',
                      borderRadius: 'var(--radius-lg)',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-md)' }}>✓</div>
                      <h4 className="text-heading-4" style={{ marginBottom: 'var(--spacing-sm)' }}>Quality Assurance</h4>
                      <p className="text-body-small" style={{ color: 'var(--color-text-secondary)' }}>
                        <strong>85-90% accuracy</strong> validated through random sampling
                      </p>
                    </div>
                  </div>
                </Card.Content>
              </Card>

            </section>
          )}

          {activeTab === 'methodology' && (
            <section className={styles.methodologySection}>
              <div className={styles.sectionHeader}>
                <h2 className="text-heading-2">Research Methodology</h2>
                <p className="text-body-large">
                  Systematic pipeline for data acquisition, preprocessing, integration, and analysis
                </p>
              </div>

              <div className={styles.methodologyDetails}>
                {/* Data Acquisition */}
                <Card>
                  <Card.Header>
                    <h3 className="text-heading-3">Data Acquisition</h3>
                  </Card.Header>
                  <Card.Content>
                    <p className="text-body mb-4">
                      The Preprint Commons database was constructed through systematic data acquisition from major preprint 
                      repositories in the life and medical sciences.
                    </p>
                    <div className={styles.aiProcess}>
                      <div className={styles.aiStep}>
                        <h4>Primary Data Sources</h4>
                        <p>Data programmatically retrieved via dedicated APIs from three repositories: bioRxiv (239,847 entries), 
                        medRxiv (55,695 entries), and arXiv q-bio subset (49,301 entries), totaling 344,843 preprints.</p>
                      </div>
                      <div className={styles.aiStep}>
                        <h4>Repository Selection Criteria</h4>
                        <p>Focus on repositories with structured, comprehensive metadata and APIs. </p>
                      </div>
                      <div className={styles.aiStep}>
                        <h4>Metadata Collection</h4>
                        <p>Collected metadata including DOIs, titles, authors, corresponding authors, institutions, 
                        submission dates, versions, license types, categories, JATS XMLs, publication status, and server information. 
                        Data returned in JSON format and converted to CSV for processing.</p>
                      </div>
                    </div>
                  </Card.Content>
                </Card>

                {/* Data Preprocessing */}
                <Card>
                  <Card.Header>
                    <h3 className="text-heading-3">Data Preprocessing and Integration</h3>
                  </Card.Header>
                  <Card.Content>
                    <p className="text-body mb-4">
                      Multi-stage preprocessing pipeline implemented to ensure data quality and consistency.
                    </p>
                    <div className={styles.aiProcess}>
                      <div className={styles.aiStep}>
                        <h4>Data Cleaning</h4>
                        <p>Duplicate entries identified and removed, retaining only latest versions. Complete version history 
                        preserved in dedicated "Versions" table stored in structured JSON format. Dates standardized to ISO 
                        format (YYYY-MM-DD) and text fields normalized for consistency.</p>
                      </div>
                      <div className={styles.aiStep}>
                        <h4>Geographic Data Enhancement</h4>
                        <p>Tiered extraction strategy: JATS XML parsing for author affiliations and country names, followed by
                        LLM analysis (<a href="https://huggingface.co/nvidia/Llama-3.1-Nemotron-70B-Instruct-HF" target="_blank" rel="noopener noreferrer">NVIDIA/Llama-3.1-Nemotron-70B-Instruct-HF</a>) for records with unavailable or incomplete
                        JATS XML data.</p>
                      </div>
                      <div className={styles.aiStep}>
                        <h4>Citation Data Integration</h4>
                        <p>Citation metadata retrieved programmatically for each preprint DOI using OpenCitations API. Citation 
                        counts stored in dedicated "Citations" table within database schema.</p>
                      </div>
                      <div className={styles.aiStep}>
                        <h4>Database Integration</h4>
                        <p>Metadata aligned and consolidated into unified relational architecture. Author records merged into 
                        "Authors" table, preprint metadata in "Preprints" table, version histories in "Versions" table.</p>
                      </div>
                    </div>
                  </Card.Content>
                </Card>


                {/* LLM Processing */}
                <Card>
                  <Card.Header>
                    <h3 className="text-heading-3">LLM-Based Country Extraction Pipeline</h3>
                  </Card.Header>
                  <Card.Content>
                    <p className="text-body mb-4">
                      Preprint Commons used NVIDIA/Nemotron-70B-Instruct-HF model deployed to extract missing geographic and institutional metadata.
                    </p>
                    <div className={styles.aiProcess}>
                      <div className={styles.aiStep}>
                        <h4>Input Preparation</h4>
                        <p>Raw affiliation strings from preprints without JATS XML collated into text files and processed in 
                        parallel batches using Slurm job scheduler.</p>
                      </div>
                      <div className={styles.aiStep}>
                        <h4>Structured Extraction</h4>
                        <p>LLM prompted with structured request for strict JSON format output including corresponding author 
                        name, affiliation, country, and email. Guidelines specify using last author if no corresponding author 
                        mentioned, returning "Not Available" for missing information.</p>
                      </div>
                      <div className={styles.aiStep}>
                        <h4>Text Chunking</h4>
                        <p>Chunking mechanism implemented with maximum 3,000 tokens and 10% overlap between chunks to maintain 
                        context for longer texts.</p>
                      </div>
                      <div className={styles.aiStep}>
                        <h4>Output Processing</h4>
                        <p>Model responses programmatically cleaned to extract valid JSON strings for all fields. All raw LLM outputs and processed extractions systematically logged for 
                        reproducibility and error analysis.</p>
                      </div>
                    </div>
                    
                    <div style={{
                      marginTop: 'var(--spacing-lg)',
                      padding: 'var(--spacing-md)',
                      borderRadius: 'var(--radius-md)'
                    }}>
                      <strong>Known Limitation:</strong> LLM processing limited to first two pages due to computational constraints. 
                      For preprints where affiliations are located beyond the second page or not present, the model either returns null values or 
                      may hallucinate information when context is insufficient, particularly for complex or ambiguously formatted affiliation strings. 
                      Highly variable affiliation string formats across repositories posed parsing challenges for certain preprints even when information was present.
                      Approximately 10-15% of records in Preprint Commons are affected by this.
                    </div>
                  </Card.Content>
                </Card>

                {/* Data Processing Pipeline */}
                <Card>
                  <Card.Header>
                    <h3 className="text-heading-3">Data Processing Pipeline</h3>
                  </Card.Header>
                  <Card.Content>
                    <p className="text-body mb-4">
                      Systematic workflow from data collection through visualization and API deployment.
                    </p>
                  </Card.Content>
                </Card>
                <MethodologyFlow />


                {/* Technical Infrastructure */}
                <Card>
                  <Card.Header>
                    <h3 className="text-heading-3">Technical Infrastructure & Implementation</h3>
                  </Card.Header>
                  <Card.Content>
                    <p className="text-body mb-4">
                      Modern, modular full-stack architecture designed for scalability, maintainability, and high performance.
                    </p>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                      gap: 'var(--spacing-lg)',
                      marginBottom: 'var(--spacing-xl)'
                    }}>
                      {[
                        { 
                          icon: '🚀', 
                          title: 'FastAPI Backend', 
                          desc: 'Python-based backend with 20+ RESTful endpoints, asynchronous capabilities, automatic OpenAPI documentation, and high performance.',
                          color: 'var(--color-primary)'
                        },
                        { 
                          icon: '🗄️', 
                          title: 'PostgreSQL Database', 
                          desc: 'Normalized relational schema optimized for preprint data with efficient indexing, caching strategies, and connection pooling.',
                          color: 'var(--color-secondary)'
                        },
                        { 
                          icon: '⚛️', 
                          title: 'React Frontend', 
                          desc: 'Modern responsive application with React Router for navigation, Chart.js for charting, and custom D3.js components for advanced visualizations.',
                          color: 'var(--color-accent)'
                        },
                        {
                          icon: '🤖',
                          title: 'AI Enhancement',
                          desc: '<a href="https://huggingface.co/nvidia/Llama-3.1-Nemotron-70B-Instruct-HF" target="_blank" rel="noopener noreferrer">NVIDIA/Llama-3.1-Nemotron-70B-Instruct-HF</a> model for metadata extraction and geographic classification.',
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
                          }} dangerouslySetInnerHTML={{ __html: tech.desc }}>
                          </p>
                        </div>
                      ))}
                    </div>
                    
                    <div style={{ 
                      padding: 'var(--spacing-lg)', 
                      background: 'var(--color-bg-secondary)', 
                      borderRadius: 'var(--radius-lg)',
                      marginBottom: 'var(--spacing-lg)'
                    }}>
                      <h4 className="text-heading-4" style={{ marginBottom: 'var(--spacing-md)' }}>
                        Data Analysis & Visualization
                      </h4>
                      <ul className={styles.techList}>
                        <li><strong>Analysis Tools:</strong> Python libraries including Pandas, NumPy, Seaborn, Plotly, and Matplotlib</li>
                        <li><strong>Analytical Approaches:</strong> Time-series analysis, comparative citation analysis, geographic distribution mapping, field-specific adoption rates</li>
                        <li><strong>Visualization:</strong> Interactive D3.js and Chart.js components with zoom controls, tooltips, and cross-filtering</li>
                        <li><strong>Data Export:</strong> JSON and CSV formats for web platform and bulk download</li>
                      </ul>
                    </div>

                  </Card.Content>
                </Card>

              </div>
            </section>
          )}

        </div>
      </div>
    </Layout>
  );
};

export default DocumentationPage;
