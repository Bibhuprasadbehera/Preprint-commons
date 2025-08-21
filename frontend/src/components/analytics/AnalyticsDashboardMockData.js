// Mock data for analytics dashboard components

// Data for publication timeline chart
export const mockTimelineData = [
  { month: '2020-01', submissions: 1250 },
  { month: '2020-02', submissions: 1180 },
  { month: '2020-03', submissions: 1420 },
  { month: '2020-04', submissions: 1680 },
  { month: '2020-05', submissions: 1890 },
  { month: '2020-06', submissions: 1750 },
  { month: '2020-07', submissions: 1920 },
  { month: '2020-08', submissions: 2100 },
  { month: '2020-09', submissions: 2250 },
  { month: '2020-10', submissions: 2180 },
  { month: '2020-11', submissions: 2350 },
  { month: '2020-12', submissions: 2180 },
  { month: '2021-01', submissions: 2450 },
  { month: '2021-02', submissions: 2380 },
  { month: '2021-03', submissions: 2650 },
  { month: '2021-04', submissions: 2780 },
  { month: '2021-05', submissions: 2890 },
  { month: '2021-06', submissions: 2750 },
  { month: '2021-07', submissions: 2920 },
  { month: '2021-08', submissions: 3100 },
  { month: '2021-09', submissions: 3250 },
  { month: '2021-10', submissions: 3180 },
  { month: '2021-11', submissions: 3350 },
  { month: '2021-12', submissions: 3180 },
  { month: '2022-01', submissions: 3450 },
  { month: '2022-02', submissions: 3380 },
  { month: '2022-03', submissions: 3650 },
  { month: '2022-04', submissions: 3780 },
  { month: '2022-05', submissions: 3890 },
  { month: '2022-06', submissions: 3750 },
  { month: '2022-07', submissions: 3920 },
  { month: '2022-08', submissions: 4100 },
  { month: '2022-09', submissions: 4250 },
  { month: '2022-10', submissions: 4180 },
  { month: '2022-11', submissions: 4350 },
  { month: '2022-12', submissions: 4180 },
  { month: '2023-01', submissions: 4450 },
  { month: '2023-02', submissions: 4380 },
  { month: '2023-03', submissions: 4650 },
  { month: '2023-04', submissions: 4780 },
  { month: '2023-05', submissions: 4890 },
  { month: '2023-06', submissions: 4750 },
  { month: '2023-07', submissions: 4920 },
  { month: '2023-08', submissions: 5100 },
  { month: '2023-09', submissions: 5250 },
  { month: '2023-10', submissions: 5180 },
  { month: '2023-11', submissions: 5350 },
  { month: '2023-12', submissions: 5180 }
];

// Data for subject distribution pie chart
export const mockSubjectData = [
  { subject: 'Bioinformatics', count: 45230, percentage: 22.5 },
  { subject: 'Neuroscience', count: 38450, percentage: 19.2 },
  { subject: 'Cancer Biology', count: 32180, percentage: 16.1 },
  { subject: 'Immunology', count: 28750, percentage: 14.4 },
  { subject: 'Genetics', count: 24320, percentage: 12.2 },
  { subject: 'Cell Biology', count: 18650, percentage: 9.3 },
  { subject: 'Microbiology', count: 12450, percentage: 6.2 }
];

// Data for server distribution bar chart
export const mockServerData = [
  { server: 'bioRxiv', count: 125430, percentage: 62.7 },
  { server: 'medRxiv', count: 48250, percentage: 24.1 },
  { server: 'arXiv', count: 18750, percentage: 9.4 },
  { server: 'ChemRxiv', count: 4820, percentage: 2.4 },
  { server: 'PsyArXiv', count: 2750, percentage: 1.4 }
];

// Data for key statistics cards
export const mockStatisticsData = {
  totalPapers: 200000,
  dateRange: {
    startDate: '2019-01-01',
    endDate: '2023-12-31'
  },
  mostActivePeriod: {
    period: '2023-09',
    count: 5250
  },
  averagePapersPerMonth: 3456,
  activeSubjects: 47,
  activeServers: 12
};

// String formatters
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

export const formatDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return `${start.getFullYear()} - ${end.getFullYear()}`;
};

export const formatPercentage = (value, total) => {
  if (total === 0) return '0%';
  return ((value / total) * 100).toFixed(1) + '%';
};

export const formatMonthYear = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short' 
  });
};