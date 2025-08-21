// Comprehensive mock data for advanced analytics features
export const formatCitationVelocity = (velocity) => {
  if (velocity < 0.1) return `${(velocity * 100).toFixed(1)}% per month`;
  if (velocity < 1) return `${(velocity * 10).toFixed(1)} per year`;
  if (velocity < 10) return `${velocity.toFixed(1)} citations/year`;
  return `${Math.round(velocity)} citations/year`;
};

export const formatFieldNormalizedScore = (score) => {
  if (score < 0.5) return 'Below Average';
  if (score < 1.0) return 'Average';
  if (score < 2.0) return 'Above Average';
  if (score < 5.0) return 'High Impact';
  return 'Exceptional';
};

export const formatCollaborationStrength = (strength) => {
  if (strength < 0.3) return 'Low';
  if (strength < 0.7) return 'Moderate';
  return 'High';
};

export const formatTimeToPeak = (days) => {
  if (days < 30) return `${days} days`;
  if (days < 365) return `${Math.round(days / 30)} months`;
  return `${(days / 365).toFixed(1)} years`;
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

export const formatImpactPercentile = (percentile) => {
  if (percentile >= 99) return 'Top 1%';
  if (percentile >= 95) return 'Top 5%';
  if (percentile >= 90) return 'Top 10%';
  if (percentile >= 75) return 'Top 25%';
  return `${percentile}th percentile`;
};

// Comprehensive mock data for advanced analytics features
export const mockComprehensiveAnalytics = {
  citationTrends: {
    growthOverTime: [
      {year: "2018", total_citations: 12500, papers: 2100, avg_per_paper: 5.95},
      {year: "2019", total_citations: 18200, papers: 2800, avg_per_paper: 6.50},
      {year: "2020", total_citations: 25600, papers: 3500, avg_per_paper: 7.31},
      {year: "2021", total_citations: 34800, papers: 4200, avg_per_paper: 8.29},
      {year: "2022", total_citations: 46500, papers: 4900, avg_per_paper: 9.49},
      {year: "2023", total_citations: 58200, papers: 5600, avg_per_paper: 10.39}
    ],
    distributionBySubject: [
      {subject: "molecular biology", min: 0, q1: 3, median: 8, q3: 18, max: 156, outliers: [89, 142, 156]},
      {subject: "bioinformatics", min: 0, q1: 4, median: 12, q3: 24, max: 98, outliers: [78, 89, 98]},
      {subject: "evolutionary biology", min: 0, q1: 2, median: 6, q3: 15, max: 87, outliers: [65, 72, 87]},
      {subject: "genomics", min: 0, q1: 3, median: 9, q3: 20, max: 76, outliers: [58, 68, 76]}
    ],
    topCitedTimeline: [
      {paper_id: "PPC001", title: "CRISPR breakthrough in gene editing", date: "2020-03-15", citations: 156, subject: "molecular biology"},
      {paper_id: "PPC002", title: "AI applications in drug discovery", date: "2021-06-20", citations: 142, subject: "bioinformatics"},
      {paper_id: "PPC003", title: "Evolution patterns in primates", date: "2019-11-10", citations: 98, subject: "evolutionary biology"},
      {paper_id: "PPC004", title: "Genome-wide association study", date: "2022-01-25", citations: 87, subject: "genomics"},
      {paper_id: "PPC005", title: "Machine learning in proteomics", date: "2021-09-14", citations: 76, subject: "bioinformatics"},
      {paper_id: "PPC006", title: "Single-cell RNA sequencing", date: "2020-12-08", citations: 68, subject: "genomics"}
    ],
    citationHeatmap: [
      {year: 2023, month: 1, citations: 1200}, {year: 2023, month: 2, citations: 1350},
      {year: 2023, month: 3, citations: 1580}, {year: 2023, month: 4, citations: 1420},
      {year: 2023, month: 5, citations: 1680}, {year: 2023, month: 6, citations: 1750},
      {year: 2023, month: 7, citations: 1650}, {year: 2023, month: 8, citations: 1580},
      {year: 2023, month: 9, citations: 1720}, {year: 2023, month: 10, citations: 1820},
      {year: 2023, month: 11, citations: 1950}, {year: 2023, month: 12, citations: 1680}
    ]
  },
  authorInstitutionAnalytics: {
    prolificAuthors: [
      {author: "Smith, J.", papers: 45, citations: 1250, h_index: 18, institutions: ["Harvard", "MIT"], collaboration_score: 0.85},
      {author: "Johnson, M.", papers: 38, citations: 980, h_index: 15, institutions: ["Stanford"], collaboration_score: 0.72},
      {author: "Williams, R.", papers: 42, citations: 1100, h_index: 16, institutions: ["Oxford", "Cambridge"], collaboration_score: 0.78},
      {author: "Brown, L.", papers: 35, citations: 890, h_index: 14, institutions: ["Caltech"], collaboration_score: 0.65},
      {author: "Davis, K.", papers: 40, citations: 1050, h_index: 17, institutions: ["MIT", "Harvard"], collaboration_score: 0.82}
    ],
    institutionRankings: [
      {institution: "Harvard University", papers: 450, citations: 12500, countries: ["United States"], rank: 1, impact_score: 27.8},
      {institution: "MIT", papers: 380, citations: 11200, countries: ["United States"], rank: 2, impact_score: 29.5},
      {institution: "Stanford University", papers: 420, citations: 10800, countries: ["United States"], rank: 3, impact_score: 25.7},
      {institution: "University of Cambridge", papers: 350, citations: 9800, countries: ["United Kingdom"], rank: 4, impact_score: 28.0},
      {institution: "University of Oxford", papers: 320, citations: 8900, countries: ["United Kingdom"], rank: 5, impact_score: 27.8}
    ],
    collaborationNetworks: [
      {source: "Harvard", target: "MIT", strength: 0.85, papers: 45, type: "strong"},
      {source: "Stanford", target: "Caltech", strength: 0.72, papers: 32, type: "moderate"},
      {source: "Oxford", target: "Cambridge", strength: 0.68, papers: 28, type: "moderate"},
      {source: "Harvard", target: "Oxford", strength: 0.45, papers: 18, type: "weak"},
      {source: "MIT", target: "Stanford", strength: 0.58, papers: 24, type: "moderate"}
    ],
    internationalCollaboration: [
      {country1: "United States", country2: "United Kingdom", papers: 180, strength: 0.75},
      {country1: "United States", country2: "Germany", papers: 145, strength: 0.68},
      {country1: "United Kingdom", country2: "Germany", papers: 120, strength: 0.62},
      {country1: "United States", country2: "Canada", papers: 95, strength: 0.58},
      {country1: "Germany", country2: "France", papers: 85, strength: 0.52}
    ]
  },
  geographicTemporalInsights: {
    researchHotspots: [
      {country: "United States", lat: 39.8283, lng: -98.5795, papers: 4500, density: 1250, growth_rate: 8.5},
      {country: "United Kingdom", lat: 55.3781, lng: -3.4360, papers: 2100, density: 890, growth_rate: 6.2},
      {country: "Germany", lat: 51.1657, lng: 10.4515, papers: 1800, density: 720, growth_rate: 7.1},
      {country: "China", lat: 35.8617, lng: 104.1954, papers: 1650, density: 650, growth_rate: 12.3},
      {country: "Canada", lat: 56.1304, lng: -106.3468, papers: 1200, density: 480, growth_rate: 5.8}
    ],
    seasonalPatterns: [
      {month: "Jan", submissions: 380, angle: 0}, {month: "Feb", submissions: 420, angle: 30},
      {month: "Mar", submissions: 480, angle: 60}, {month: "Apr", submissions: 450, angle: 90},
      {month: "May", submissions: 520, angle: 120}, {month: "Jun", submissions: 490, angle: 150},
      {month: "Jul", submissions: 410, angle: 180}, {month: "Aug", submissions: 390, angle: 210},
      {month: "Sep", submissions: 540, angle: 240}, {month: "Oct", submissions: 580, angle: 270},
      {month: "Nov", submissions: 560, angle: 300}, {month: "Dec", submissions: 420, angle: 330}
    ],
    countryResearchFocus: [
      {country: "United States", subjects: [
        {subject: "molecular biology", percentage: 35, papers: 1575},
        {subject: "bioinformatics", percentage: 28, papers: 1260},
        {subject: "genomics", percentage: 22, papers: 990},
        {subject: "evolutionary biology", percentage: 15, papers: 675}
      ]},
      {country: "United Kingdom", subjects: [
        {subject: "evolutionary biology", percentage: 32, papers: 672},
        {subject: "genomics", percentage: 28, papers: 588},
        {subject: "molecular biology", percentage: 25, papers: 525},
        {subject: "bioinformatics", percentage: 15, papers: 315}
      ]}
    ]
  },
  contentSubjectAnalysis: {
    subjectEvolution: [
      {subject: "CRISPR", year: 2018, papers: 45, trend: "emerging"}, 
      {subject: "CRISPR", year: 2019, papers: 78, trend: "growing"},
      {subject: "CRISPR", year: 2020, papers: 120, trend: "accelerating"}, 
      {subject: "CRISPR", year: 2021, papers: 165, trend: "mature"},
      {subject: "CRISPR", year: 2022, papers: 195, trend: "stable"},
      {subject: "CRISPR", year: 2023, papers: 210, trend: "stable"},
      {subject: "AI in biology", year: 2019, papers: 12, trend: "emerging"}, 
      {subject: "AI in biology", year: 2020, papers: 35, trend: "growing"},
      {subject: "AI in biology", year: 2021, papers: 68, trend: "accelerating"}, 
      {subject: "AI in biology", year: 2022, papers: 95, trend: "accelerating"},
      {subject: "AI in biology", year: 2023, papers: 140, trend: "accelerating"}
    ],
    crossSubjectCitations: [
      {source: "molecular biology", target: "bioinformatics", citations: 1250, strength: 0.85},
      {source: "genomics", target: "evolutionary biology", citations: 890, strength: 0.72},
      {source: "bioinformatics", target: "molecular biology", citations: 780, strength: 0.68},
      {source: "evolutionary biology", target: "genomics", citations: 650, strength: 0.58},
      {source: "bioinformatics", target: "genomics", citations: 580, strength: 0.52}
    ],
    emergingAreas: [
      {area: "AI-driven drug discovery", growth_rate: 145.2, papers_2023: 95, trend: "exponential", impact_score: 8.5},
      {area: "Single-cell genomics", growth_rate: 89.5, papers_2023: 78, trend: "linear", impact_score: 7.2},
      {area: "Computational proteomics", growth_rate: 67.8, papers_2023: 65, trend: "accelerating", impact_score: 6.8},
      {area: "Quantum biology", growth_rate: 156.3, papers_2023: 42, trend: "exponential", impact_score: 9.1}
    ]
  },
  qualityImpactMetrics: {
    citationVelocity: [
      {paper_id: "PPC001", velocity: 12.5, time_to_peak: 180, peak_citations: 45, velocity_category: "high"},
      {paper_id: "PPC002", velocity: 8.7, time_to_peak: 240, peak_citations: 32, velocity_category: "medium"},
      {paper_id: "PPC003", velocity: 15.2, time_to_peak: 120, peak_citations: 58, velocity_category: "high"},
      {paper_id: "PPC004", velocity: 5.3, time_to_peak: 365, peak_citations: 28, velocity_category: "low"},
      {paper_id: "PPC005", velocity: 18.7, time_to_peak: 90, peak_citations: 72, velocity_category: "very_high"}
    ],
    zeroCitationAnalysis: {
      total_papers: 5600,
      zero_citation_papers: 1120,
      percentage: 20.0,
      by_subject: [
        {subject: "molecular biology", zero_rate: 15.2, papers: 1200},
        {subject: "bioinformatics", zero_rate: 18.5, papers: 950},
        {subject: "evolutionary biology", zero_rate: 22.8, papers: 800},
        {subject: "genomics", zero_rate: 19.1, papers: 750}
      ],
      trends: [
        {year: 2020, zero_rate: 22.5},
        {year: 2021, zero_rate: 21.8},
        {year: 2022, zero_rate: 20.5},
        {year: 2023, zero_rate: 20.0}
      ]
    },
    highImpactOutliers: [
      {paper_id: "PPC001", citations: 156, expected: 12, outlier_score: 13.0, category: "exceptional"},
      {paper_id: "PPC002", citations: 142, expected: 15, outlier_score: 9.5, category: "high"},
      {paper_id: "PPC003", citations: 98, expected: 8, outlier_score: 12.3, category: "exceptional"},
      {paper_id: "PPC004", citations: 87, expected: 10, outlier_score: 8.7, category: "high"},
      {paper_id: "PPC005", citations: 76, expected: 6, outlier_score: 12.7, category: "exceptional"}
    ],
    fieldNormalizedScores: [
      {paper_id: "PPC001", raw_citations: 156, field_avg: 12, normalized_score: 13.0, percentile: 99, category: "exceptional"},
      {paper_id: "PPC002", raw_citations: 142, field_avg: 15, normalized_score: 9.5, percentile: 95, category: "high_impact"},
      {paper_id: "PPC003", raw_citations: 98, field_avg: 8, normalized_score: 12.3, percentile: 98, category: "exceptional"},
      {paper_id: "PPC004", raw_citations: 87, field_avg: 10, normalized_score: 8.7, percentile: 92, category: "above_average"},
      {paper_id: "PPC005", raw_citations: 76, field_avg: 6, normalized_score: 12.7, percentile: 97, category: "exceptional"}
    ]
  },
  serverPlatformAnalytics: {
    serverGrowthTrends: [
      {server: "bioRxiv", year: 2020, papers: 2100}, {server: "bioRxiv", year: 2021, papers: 2800},
      {server: "bioRxiv", year: 2022, papers: 3200}, {server: "bioRxiv", year: 2023, papers: 3600},
      {server: "medRxiv", year: 2020, papers: 890}, {server: "medRxiv", year: 2021, papers: 1200},
      {server: "medRxiv", year: 2022, papers: 1450}, {server: "medRxiv", year: 2023, papers: 1680},
      {server: "arXiv", year: 2020, papers: 450}, {server: "arXiv", year: 2021, papers: 520},
      {server: "arXiv", year: 2022, papers: 580}, {server: "arXiv", year: 2023, papers: 620}
    ],
    serverSubjectPreferences: [
      {server: "bioRxiv", subjects: [
        {subject: "molecular biology", percentage: 45, papers: 1620},
        {subject: "evolutionary biology", percentage: 30, papers: 1080},
        {subject: "genomics", percentage: 25, papers: 900}
      ]},
      {server: "medRxiv", subjects: [
        {subject: "epidemiology", percentage: 40, papers: 672},
        {subject: "public health", percentage: 35, papers: 588},
        {subject: "clinical research", percentage: 25, papers: 420}
      ]},
      {server: "arXiv", subjects: [
        {subject: "computational biology", percentage: 60, papers: 372},
        {subject: "bioinformatics", percentage: 40, papers: 248}
      ]}
    ],
    crossPlatformCitations: [
      {server: "bioRxiv", avg_citations: 12.5, median_citations: 8, top_percentile: 156},
      {server: "medRxiv", avg_citations: 8.7, median_citations: 5, top_percentile: 89},
      {server: "arXiv", avg_citations: 15.2, median_citations: 12, top_percentile: 98}
    ]
  },
  advancedCorrelations: {
    titleLengthVsCitations: [
      {title_length: 8, avg_citations: 12.5, papers: 450, correlation: 0.15},
      {title_length: 12, avg_citations: 15.2, papers: 680, correlation: 0.28},
      {title_length: 16, avg_citations: 11.8, papers: 520, correlation: -0.12},
      {title_length: 20, avg_citations: 9.2, papers: 320, correlation: -0.35},
      {title_length: 24, avg_citations: 7.8, papers: 180, correlation: -0.48}
    ],
    authorCountVsImpact: [
      {author_count: 1, avg_citations: 8.5, papers: 890, optimal_range: false},
      {author_count: 3, avg_citations: 12.2, papers: 1200, optimal_range: true},
      {author_count: 5, avg_citations: 15.8, papers: 980, optimal_range: true},
      {author_count: 8, avg_citations: 18.5, papers: 650, optimal_range: true},
      {author_count: 12, avg_citations: 16.2, papers: 420, optimal_range: false},
      {author_count: 20, avg_citations: 12.8, papers: 180, optimal_range: false}
    ],
    submissionTimingVsSuccess: [
      {day_of_week: "Monday", avg_citations: 12.5, submissions: 680, success_score: 0.72},
      {day_of_week: "Tuesday", avg_citations: 13.8, submissions: 720, success_score: 0.78},
      {day_of_week: "Wednesday", avg_citations: 14.2, submissions: 750, success_score: 0.82},
      {day_of_week: "Thursday", avg_citations: 13.1, submissions: 690, success_score: 0.75},
      {day_of_week: "Friday", avg_citations: 11.8, submissions: 580, success_score: 0.68},
      {day_of_week: "Saturday", avg_citations: 9.5, submissions: 320, success_score: 0.52},
      {day_of_week: "Sunday", avg_citations: 8.7, submissions: 280, success_score: 0.48}
    ],
    geographicCitationBias: [
      {country: "United States", citation_advantage: 1.25, bias_score: 0.25},
      {country: "United Kingdom", citation_advantage: 1.18, bias_score: 0.18},
      {country: "Germany", citation_advantage: 1.12, bias_score: 0.12},
      {country: "China", citation_advantage: 0.85, bias_score: -0.15},
      {country: "India", citation_advantage: 0.78, bias_score: -0.22}
    ]
  }
};

// Export individual data sets for easier component usage
export const {
  citationTrends,
  authorInstitutionAnalytics,
  geographicTemporalInsights,
  contentSubjectAnalysis,
  qualityImpactMetrics,
  serverPlatformAnalytics,
  advancedCorrelations
} = mockComprehensiveAnalytics;