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
                    Preprint Commons provides comprehensive tools for exploring, analyzing, and visualizing preprint data 
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
                        desc: 'Full-text search across titles, DOIs, and authors with complex filtering by time range, subject, country, and citation metrics',
                        color: 'var(--color-primary)'
                      },
                      { 
                        icon: '📊', 
                        title: 'Interactive Analytics', 
                        desc: 'Dynamic visualizations including scatter plots, heatmaps, geographic maps, and trend analyses powered by D3.js and Chart.js',
                        color: 'var(--color-secondary)'
                      },
                      { 
                        icon: '🌐', 
                        title: 'Geographic Mapping', 
                        desc: 'Explore global distribution of preprints with interactive maps showing country-wise contributions and institutional affiliations',
                        color: 'var(--color-accent)'
                      },
                      { 
                        icon: '📈', 
                        title: 'Citation Analysis', 
                        desc: 'Track citation patterns, identify high-impact papers, and analyze citation networks across disciplines and time periods',
                        color: 'var(--color-success)'
                      },
                      { 
                        icon: '👥', 
                        title: 'Author Profiles', 
                        desc: 'Comprehensive author search with publication counts, citation metrics, and institutional affiliations',
                        color: '#f59e0b'
                      },
                      { 
                        icon: '🔬', 
                        title: 'Subject Analysis', 
                        desc: 'Analyze disciplinary adoption rates, track research trends, and compare subject-specific patterns over time',
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

              {/* Use Cases */}
              <Card style={{ marginTop: 'var(--spacing-2xl)' }}>
                <Card.Header>
                  <h3 className="text-heading-3">Research Applications</h3>
                </Card.Header>
                <Card.Content>
                  <p className="text-body" style={{ marginBottom: 'var(--spacing-lg)' }}>
                    Designed to serve various stakeholders in the global research ecosystem with actionable insights:
                  </p>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                    gap: 'var(--spacing-lg)'
                  }}>
                    <div style={{
                      padding: 'var(--spacing-lg)',
                      background: 'var(--color-bg-secondary)',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--color-neutral-200)'
                    }}>
                      <h4 className="text-heading-4" style={{ marginBottom: 'var(--spacing-md)', color: 'var(--color-primary)' }}>
                        🔬 Researchers
                      </h4>
                      <ul className={styles.techList} style={{ fontSize: 'var(--font-size-sm)' }}>
                        <li>Analyze disciplinary adoption rates</li>
                        <li>Track publication lifecycles from preprint to peer review</li>
                        <li>Identify emerging research trends</li>
                        <li>Discover collaboration opportunities</li>
                      </ul>
                    </div>
                    <div style={{
                      padding: 'var(--spacing-lg)',
                      background: 'var(--color-bg-secondary)',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--color-neutral-200)'
                    }}>
                      <h4 className="text-heading-4" style={{ marginBottom: 'var(--spacing-md)', color: 'var(--color-accent)' }}>
                        💻 Data Scientists
                      </h4>
                      <ul className={styles.techList} style={{ fontSize: 'var(--font-size-sm)' }}>
                        <li>Access comprehensive REST API for custom analytics</li>
                        <li>Integrate preprint data into applications</li>
                        <li>Build machine learning models on preprint metadata</li>
                        <li>Perform large-scale bibliometric analysis</li>
                      </ul>
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
                    and high-quality metadata through robust APIs with thematic consistency in life sciences.
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
                        <li><strong>bioRxiv:</strong> Robust API, JATS XML metadata, comprehensive coverage</li>
                        <li><strong>medRxiv:</strong> Consistent schema, health sciences focus, structured data</li>
                        <li><strong>arXiv (q-bio):</strong> Established platform, quantitative biology subset</li>
                      </ul>
                    </div>
                    
                    <div style={{
                      padding: 'var(--spacing-lg)',
                      background: 'var(--color-bg-secondary)',
                      borderRadius: 'var(--radius-lg)',
                      borderLeft: '4px solid var(--color-warning)'
                    }}>
                      <h4 className="text-heading-4" style={{ marginBottom: 'var(--spacing-md)', color: 'var(--color-warning)' }}>
                        ⚠ Excluded Repositories
                      </h4>
                      <ul className={styles.techList} style={{ fontSize: 'var(--font-size-sm)' }}>
                        <li><strong>ChemRxiv:</strong> Heterogeneous metadata schema</li>
                        <li><strong>OSF Preprints:</strong> Inconsistent field definitions</li>
                        <li><strong>F1000Research:</strong> Different data structure</li>
                        <li><strong>Preprints.org:</strong> Limited API access</li>
                      </ul>
                    </div>
                  </div>

                  <div style={{
                    padding: 'var(--spacing-lg)',
                    background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-accent-light))',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-primary)'
                  }}>
                    <h4 className="text-heading-4" style={{ marginBottom: 'var(--spacing-md)' }}>
                      Future Expansion Plans
                    </h4>
                    <p className="text-body-small" style={{ color: 'var(--color-text-secondary)' }}>
                      Future development will prioritize developing custom parsers and integration frameworks to include 
                      additional repositories. This requires building harmonization pipelines for each server to handle 
                      different metadata schemas and field definitions while maintaining data quality and consistency.
                    </p>
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
                        <li>Citation counts and networks</li>
                        <li>Publication status (peer-reviewed DOI)</li>
                        <li>Complete version history</li>
                        <li>JATS XML structured data</li>
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
                        <li>JATS XML parsing</li>
                        <li>LLM-based enhancement (arXiv)</li>
                      </ul>
                    </div>
                  </div>
                </Card.Content>
              </Card>

              {/* Data Quality & Updates */}
              <Card style={{ marginTop: 'var(--spacing-2xl)' }}>
                <Card.Header>
                  <h3 className="text-heading-3">Data Quality & Update Schedule</h3>
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
                      <div style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-md)' }}>🔄</div>
                      <h4 className="text-heading-4" style={{ marginBottom: 'var(--spacing-sm)' }}>Update Frequency</h4>
                      <p className="text-body-small" style={{ color: 'var(--color-text-secondary)' }}>
                        Planned <strong>quarterly updates</strong> to maintain current coverage
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
                      repositories in the life sciences, ensuring thematically focused and consistent metadata.
                    </p>
                    <div className={styles.aiProcess}>
                      <div className={styles.aiStep}>
                        <h4>Primary Data Sources</h4>
                        <p>Data programmatically retrieved via dedicated APIs from three repositories: bioRxiv (239,847 entries), 
                        medRxiv (55,695 entries), and arXiv q-bio subset (49,301 entries), totaling 344,843 preprints.</p>
                      </div>
                      <div className={styles.aiStep}>
                        <h4>Repository Selection Criteria</h4>
                        <p>Focus on repositories with structured, comprehensive metadata and robust APIs. Other repositories 
                        (ChemRxiv, OSF Preprints, F1000Research) were excluded due to heterogeneous data structures or 
                        inconsistent metadata fields.</p>
                      </div>
                      <div className={styles.aiStep}>
                        <h4>Metadata Collection</h4>
                        <p>Collected comprehensive metadata including DOI, title, authors, corresponding author, institutions, 
                        submission date, version, license, category, JATS XML, publication status, and server information. 
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
                      Multi-stage preprocessing pipeline implemented to ensure data quality, consistency, and analytical robustness.
                    </p>
                    <div className={styles.aiProcess}>
                      <div className={styles.aiStep}>
                        <h4>Data Cleaning</h4>
                        <p>Duplicate entries identified and removed, retaining only latest versions. Complete version history 
                        preserved in dedicated "Versions" table stored in structured JSON format. Dates standardized to ISO 
                        format (YYYY-MM-DD), text fields normalized for consistency.</p>
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
                        counts and networks stored in dedicated "Citations" table within database schema.</p>
                      </div>
                      <div className={styles.aiStep}>
                        <h4>Database Integration</h4>
                        <p>Metadata aligned and consolidated into unified relational architecture. Author records merged into 
                        "Authors" table, preprint metadata in "Preprints" table, version histories in "Versions" table. 
                        Automated scripts resolved inconsistencies in names, affiliations, and subject categories.</p>
                      </div>
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

                {/* LLM Processing */}
                <Card>
                  <Card.Header>
                    <h3 className="text-heading-3">LLM-Based Country Extraction Pipeline</h3>
                  </Card.Header>
                  <Card.Content>
                    <p className="text-body mb-4">
                      High-performance computing workflow utilizing NVIDIA/Nemotron-70B-Instruct-HF model deployed across 
                      8 A100-SXM4 GPUs to extract missing geographic and institutional metadata.
                    </p>
                    <div className={styles.aiProcess}>
                      <div className={styles.aiStep}>
                        <h4>Input Preparation</h4>
                        <p>Raw affiliation strings from preprints without JATS XML collated into text files and processed in 
                        parallel batches using Slurm job scheduler. Each job allocated 256 CPU cores and 8 A100 GPUs with 
                        24-hour maximum runtime.</p>
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
                        context for longer texts. Limited to first two pages due to computational constraints.</p>
                      </div>
                      <div className={styles.aiStep}>
                        <h4>Output Processing</h4>
                        <p>Model responses programmatically cleaned to extract valid JSON strings with rigorous error handling 
                        for malformed outputs. All raw LLM outputs and processed extractions systematically logged for 
                        reproducibility and error analysis.</p>
                      </div>
                    </div>
                    
                    <div style={{
                      marginTop: 'var(--spacing-lg)',
                      padding: 'var(--spacing-md)',
                      background: 'var(--color-warning)',
                      color: 'white',
                      borderRadius: 'var(--radius-md)'
                    }}>
                      <strong>Known Limitation:</strong> LLM processing limited to first two pages due to computational constraints. 
                      For preprints where affiliations are located beyond the second page, the model either returns null values or 
                      may hallucinate information. This represents a quantified limitation affecting approximately 10-15% of records.
                    </div>
                  </Card.Content>
                </Card>

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
                          desc: 'Python-based backend with 20+ RESTful endpoints, asynchronous capabilities, automatic OpenAPI documentation, and high performance',
                          color: 'var(--color-primary)'
                        },
                        { 
                          icon: '🗄️', 
                          title: 'PostgreSQL Database', 
                          desc: 'Normalized relational schema optimized for preprint data with efficient indexing, caching strategies, and connection pooling',
                          color: 'var(--color-secondary)'
                        },
                        { 
                          icon: '⚛️', 
                          title: 'React Frontend', 
                          desc: 'Modern responsive application with React Router for navigation, Chart.js for charting, and custom D3.js components for advanced visualizations',
                          color: 'var(--color-accent)'
                        },
                        {
                          icon: '🤖',
                          title: 'AI Enhancement',
                          desc: '<a href="https://huggingface.co/nvidia/Llama-3.1-Nemotron-70B-Instruct-HF" target="_blank" rel="noopener noreferrer">NVIDIA/Llama-3.1-Nemotron-70B-Instruct-HF</a> model deployed across 8 A100-SXM4 GPUs for metadata extraction and geographic classification',
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

                    <div style={{ 
                      padding: 'var(--spacing-lg)', 
                      background: 'var(--color-bg-secondary)', 
                      borderRadius: 'var(--radius-lg)' 
                    }}>
                      <h4 className="text-heading-4" style={{ marginBottom: 'var(--spacing-md)' }}>
                        Infrastructure Specifications
                      </h4>
                      <ul className={styles.techList}>
                        <li><strong>Computing Power:</strong> 8 A100-SXM4 GPUs for LLM processing, 256 CPU cores per job</li>
                        <li><strong>API Endpoints:</strong> 20+ RESTful endpoints with complex filtering, sorting, and pagination</li>
                        <li><strong>Data Processing:</strong> Asynchronous pipeline with Pandas integration and efficient caching</li>
                        <li><strong>Database:</strong> Normalized PostgreSQL schema with optimized queries and indexing</li>
                        <li><strong>Open Access:</strong> Complete dataset available via REST API and bulk download in JSON/CSV formats</li>
                      </ul>
                    </div>
                  </Card.Content>
                </Card>

                {/* Quality Control */}
                <Card>
                  <Card.Header>
                    <h3 className="text-heading-3">Quality Control and Validation</h3>
                  </Card.Header>
                  <Card.Content>
                    <p className="text-body mb-4">
                      Given the substantial volume of preprints, a random sampling approach was employed to validate 
                      LLM-extracted data, revealing quantified accuracy metrics and known limitations.
                    </p>
                    <div className={styles.qualityMetrics}>
                      <div className={styles.qualityMetric}>
                        <span className={styles.qualityNumber}>85-90%</span>
                        <span className={styles.qualityLabel}>Overall LLM extraction accuracy for country and institution data</span>
                      </div>
                      <div className={styles.qualityMetric}>
                        <span className={styles.qualityNumber}>10-15%</span>
                        <span className={styles.qualityLabel}>Error rate including missing fields and hallucinated information</span>
                      </div>
                      <div className={styles.qualityMetric}>
                        <span className={styles.qualityNumber}>344,843</span>
                        <span className={styles.qualityLabel}>Total validated records in database</span>
                      </div>
                    </div>
                    <div style={{ 
                      marginTop: 'var(--spacing-lg)',
                      padding: 'var(--spacing-lg)', 
                      background: 'var(--color-bg-secondary)', 
                      borderRadius: 'var(--radius-lg)' 
                    }}>
                      <h4 className="text-heading-4" style={{ marginBottom: 'var(--spacing-md)' }}>
                        Primary Error Sources
                      </h4>
                      <ul className={styles.techList}>
                        <li><strong>Input Truncation:</strong> Processing limited to first two pages due to computational constraints. 
                        Affiliations beyond this range result in null values or hallucinated information.</li>
                        <li><strong>LLM Hallucination:</strong> Model may generate plausible but incorrect information when context 
                        is insufficient, particularly for complex or ambiguously formatted affiliation strings.</li>
                        <li><strong>Format Variability:</strong> Highly variable affiliation string formats across repositories 
                        pose parsing challenges even when information is present.</li>
                      </ul>
                      <p className="text-body-small" style={{ marginTop: 'var(--spacing-md)', color: 'var(--color-text-secondary)' }}>
                        Future development priorities include securing resources for full-text processing, implementing advanced 
                        prompt-engineering techniques, and developing rule-based validation layers to cross-verify LLM outputs.
                      </p>
                    </div>
                  </Card.Content>
                </Card>
              </div>
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
