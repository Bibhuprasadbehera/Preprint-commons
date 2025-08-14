// Enhanced analytics mock data for Phase 1 features
export const formatAuthorName = (authorString) => {
  if (!authorString) return 'Unknown Author';
  try {
    const authors = JSON.parse(authorString);
    if (Array.isArray(authors) && authors.length > 0) {
      return authors[0].author_name || 'Unknown Author';
    }
  } catch {
    // Fallback for non-JSON format
    return authorString.split(',')[0].trim();
  }
  return 'Unknown Author';
};

export const formatCitationVelocity = (citationData, submissionDate) => {
  try {
    const citations = JSON.parse(citationData);
    const submission = new Date(submissionDate);
    const currentYear = new Date().getFullYear();
    const submissionYear = submission.getFullYear();
    const yearsSinceSubmission = Math.max(1, currentYear - submissionYear);
    
    const totalCitations = citations.reduce((sum, item) => sum + (item.value || 0), 0);
    return totalCitations / yearsSinceSubmission;
  } catch {
    return 0;
  }
};

export const formatCollaborationIndex = (authorsString) => {
  try {
    const authors = JSON.parse(authorsString);
    return Array.isArray(authors) ? authors.filter(a => a.author_name).length : 1;
  } catch {
    return authorsString.split(',').length;
  }
};

export const formatGrowthRate = (rate) => {
  const sign = rate >= 0 ? '+' : '';
  return `${sign}${rate.toFixed(1)}%`;
};

export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// Feasible analytics mock data based on available CSV structure
export const mockEnhancedAnalytics = {
  authorAnalytics: [
    {
      author_name: "Duccio Cavalieri",
      total_citations: 156,
      paper_count: 8,
      collaboration_index: 18,
      avg_citations_per_paper: 19.5,
      first_publication: "2014-01-17",
      latest_publication: "2023-12-15",
      primary_subjects: ["evolutionary biology", "molecular biology"],
      countries: ["Azerbaijan", "Italy"]
    },
    {
      author_name: "Carlotta De Filippo", 
      total_citations: 142,
      paper_count: 12,
      collaboration_index: 15,
      avg_citations_per_paper: 11.8,
      first_publication: "2014-01-17",
      latest_publication: "2024-01-20",
      primary_subjects: ["evolutionary biology", "genomics"],
      countries: ["Italy", "Spain"]
    },
    {
      author_name: "Monica Di Paola",
      total_citations: 98,
      paper_count: 6,
      collaboration_index: 12,
      avg_citations_per_paper: 16.3,
      first_publication: "2015-03-22",
      latest_publication: "2023-11-08",
      primary_subjects: ["molecular biology", "bioinformatics"],
      countries: ["Italy"]
    },
    {
      author_name: "Irene Stefanini",
      total_citations: 87,
      paper_count: 9,
      collaboration_index: 14,
      avg_citations_per_paper: 9.7,
      first_publication: "2014-01-17",
      latest_publication: "2023-09-15",
      primary_subjects: ["evolutionary biology", "genomics"],
      countries: ["Italy", "France"]
    }
  ],
  enhancedSubjectAnalysis: [
    {
      subject: "evolutionary biology",
      paper_count: 1250,
      total_citations: 15600,
      growth_rate: 12.5,
      avg_citations_per_paper: 12.5,
      yearly_distribution: [
        {year: "2020", papers: 180, citations: 2100},
        {year: "2021", papers: 220, citations: 2800},
        {year: "2022", papers: 280, citations: 3500},
        {year: "2023", papers: 320, citations: 4200}
      ],
      top_countries: ["United States", "United Kingdom", "Germany"]
    },
    {
      subject: "molecular biology",
      paper_count: 980,
      total_citations: 12400,
      growth_rate: 8.3,
      avg_citations_per_paper: 12.7,
      yearly_distribution: [
        {year: "2020", papers: 150, citations: 1800},
        {year: "2021", papers: 190, citations: 2400},
        {year: "2022", papers: 240, citations: 3100},
        {year: "2023", papers: 280, citations: 3600}
      ],
      top_countries: ["United States", "China", "United Kingdom"]
    },
    {
      subject: "bioinformatics",
      paper_count: 750,
      total_citations: 9800,
      growth_rate: 15.2,
      avg_citations_per_paper: 13.1,
      yearly_distribution: [
        {year: "2020", papers: 120, citations: 1500},
        {year: "2021", papers: 160, citations: 2100},
        {year: "2022", papers: 200, citations: 2700},
        {year: "2023", papers: 270, citations: 3500}
      ],
      top_countries: ["United States", "United Kingdom", "Canada"]
    },
    {
      subject: "genomics",
      paper_count: 650,
      total_citations: 8200,
      growth_rate: 10.8,
      avg_citations_per_paper: 12.6,
      yearly_distribution: [
        {year: "2020", papers: 100, citations: 1200},
        {year: "2021", papers: 140, citations: 1800},
        {year: "2022", papers: 180, citations: 2400},
        {year: "2023", papers: 230, citations: 2800}
      ],
      top_countries: ["United States", "United Kingdom", "Australia"]
    }
  ],
  geographicAnalytics: [
    {
      country: "United States",
      paper_count: 4500,
      total_citations: 58000,
      avg_citations_per_paper: 12.9,
      collaboration_papers: 1200,
      collaboration_percentage: 26.7,
      top_subjects: ["molecular biology", "neuroscience", "bioinformatics"],
      yearly_growth: 8.5,
      top_institutions: ["Harvard University", "MIT", "Stanford University"]
    },
    {
      country: "United Kingdom", 
      paper_count: 2100,
      total_citations: 28500,
      avg_citations_per_paper: 13.6,
      collaboration_papers: 890,
      collaboration_percentage: 42.4,
      top_subjects: ["genomics", "evolutionary biology", "computational biology"],
      yearly_growth: 6.2,
      top_institutions: ["University of Cambridge", "University of Oxford", "Imperial College London"]
    },
    {
      country: "Germany",
      paper_count: 1800,
      total_citations: 22400,
      avg_citations_per_paper: 12.4,
      collaboration_papers: 720,
      collaboration_percentage: 40.0,
      top_subjects: ["molecular biology", "bioinformatics", "genomics"],
      yearly_growth: 7.1,
      top_institutions: ["Max Planck Institute", "University of Munich", "Heidelberg University"]
    },
    {
      country: "China",
      paper_count: 1650,
      total_citations: 18200,
      avg_citations_per_paper: 11.0,
      collaboration_papers: 495,
      collaboration_percentage: 30.0,
      top_subjects: ["molecular biology", "genomics", "bioinformatics"],
      yearly_growth: 12.3,
      top_institutions: ["Tsinghua University", "Peking University", "Chinese Academy of Sciences"]
    },
    {
      country: "Canada",
      paper_count: 1200,
      total_citations: 16800,
      avg_citations_per_paper: 14.0,
      collaboration_papers: 480,
      collaboration_percentage: 40.0,
      top_subjects: ["bioinformatics", "genomics", "evolutionary biology"],
      yearly_growth: 5.8,
      top_institutions: ["University of Toronto", "McGill University", "University of British Columbia"]
    }
  ],
  citationVelocityAnalysis: [
    {
      paper_id: "PPC00000001",
      title: "Population genomics of Saccharomyces cerevisiae",
      submission_date: "2014-01-17",
      total_citations: 3,
      citation_timeline: [
        {year: "2016", value: 1},
        {year: "2017", value: 2},
        {year: "2018", value: 0}
      ],
      time_to_first_citation: 730, // days
      peak_citation_year: "2017",
      velocity_score: 0.3,
      subject: "evolutionary biology"
    },
    {
      paper_id: "PPC00000002",
      title: "CRISPR applications in molecular biology",
      submission_date: "2018-06-15",
      total_citations: 45,
      citation_timeline: [
        {year: "2018", value: 2},
        {year: "2019", value: 8},
        {year: "2020", value: 12},
        {year: "2021", value: 15},
        {year: "2022", value: 8}
      ],
      time_to_first_citation: 120,
      peak_citation_year: "2021",
      velocity_score: 7.5,
      subject: "molecular biology"
    },
    {
      paper_id: "PPC00000003",
      title: "Machine learning in genomics research",
      submission_date: "2020-03-10",
      total_citations: 28,
      citation_timeline: [
        {year: "2020", value: 3},
        {year: "2021", value: 10},
        {year: "2022", value: 12},
        {year: "2023", value: 3}
      ],
      time_to_first_citation: 90,
      peak_citation_year: "2022",
      velocity_score: 7.0,
      subject: "bioinformatics"
    }
  ]
};

// Export individual data sets for easier component usage
export const {
  authorAnalytics,
  enhancedSubjectAnalysis,
  geographicAnalytics,
  citationVelocityAnalysis
} = mockEnhancedAnalytics;