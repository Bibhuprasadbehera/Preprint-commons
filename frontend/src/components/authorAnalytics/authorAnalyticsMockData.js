// Mock data for author analytics charts

// Mock data for scatter chart (Citation vs Publications)
export const mockScatterData = [
  { author: "Dr. Sarah Chen", papers: 15, citations: 450, maxCitations: 89 },
  { author: "Prof. Michael Rodriguez", papers: 23, citations: 680, maxCitations: 156 },
  { author: "Dr. Emily Watson", papers: 8, citations: 120, maxCitations: 45 },
  { author: "Dr. Alex Kumar", papers: 31, citations: 920, maxCitations: 203 },
  { author: "Prof. Lisa Zhang", papers: 19, citations: 540, maxCitations: 112 },
  { author: "Dr. Maria Gonzalez", papers: 12, citations: 280, maxCitations: 67 },
  { author: "Dr. James Wilson", papers: 27, citations: 750, maxCitations: 178 },
  { author: "Prof. Anna Petrov", papers: 6, citations: 95, maxCitations: 32 },
  { author: "Dr. Robert Kim", papers: 41, citations: 1250, maxCitations: 287 },
  { author: "Dr. Sophie Martin", papers: 16, citations: 380, maxCitations: 94 }
];

// Mock data for line chart (Publications over time)
export const mockTimelineData = [
  { year: 2020, count: 45 },
  { year: 2021, count: 67 },
  { year: 2022, count: 89 },
  { year: 2023, count: 123 },
  { year: 2024, count: 156 }
];

// Mock data for doughnut chart (Subject distribution)
export const mockSubjectData = [
  { subject: "Physics", count: 145, color: "#3B82F6" },
  { subject: "Biology", count: 98, color: "#10B981" },
  { subject: "Chemistry", count: 76, color: "#F59E0B" },
  { subject: "Mathematics", count: 54, color: "#EF4444" },
  { subject: "Computer Science", count: 123, color: "#8B5CF6" },
  { subject: "Medicine", count: 87, color: "#06B6D4" }
];

// Props data for the component
export const mockRootProps = {
  authorQuery: "",
  authorResults: [
    { author_name: "Dr. Sarah Chen", paper_count: 15, max_citations: 89 },
    { author_name: "Prof. Michael Rodriguez", paper_count: 23, max_citations: 156 },
    { author_name: "Dr. Emily Watson", paper_count: 8, max_citations: 45 }
  ],
  showAnalytics: true
};