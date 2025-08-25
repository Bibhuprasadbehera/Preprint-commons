import React from 'react';
import AuthorDetailsPage from './pages/AuthorDetailsPage';
import PapersList from './components/ui/PapersList/PapersList';
import Pagination from './components/ui/Pagination/Pagination';
import './styles/index.css';

// Mock data for preview
const mockPapers = [
  {
    PPC_Id: "1",
    preprint_title: "Advanced Machine Learning Techniques for Climate Change Prediction",
    all_authors: JSON.stringify([
      { author_name: "Dr. Sarah Chen", affiliation: "MIT Climate Lab" },
      { author_name: "Prof. Michael Rodriguez", affiliation: "Stanford AI Institute" },
      { author_name: "Dr. Emily Watson", affiliation: "Oxford Environmental Sciences" }
    ]),
    submission_contact: "sarah.chen@mit.edu",
    total_citation: 245,
    preprint_subject: "Environmental Science",
    publication_date: "2024-01-15",
    preprint_submission_date: "2023-12-01",
    corresponding_institution: "Massachusetts Institute of Technology",
    country_name: "United States",
    preprint_abstract: "This paper presents novel machine learning approaches for predicting climate change patterns using satellite data and atmospheric models. Our methodology combines deep learning with traditional statistical methods to achieve unprecedented accuracy in long-term climate forecasting."
  },
  {
    PPC_Id: "2",
    preprint_title: "Quantum Computing Applications in Cryptography: A Comprehensive Review",
    all_authors: JSON.stringify([
      { author_name: "Dr. Alex Kumar", affiliation: "IBM Quantum Research" },
      { author_name: "Prof. Lisa Zhang", affiliation: "University of Toronto" }
    ]),
    submission_contact: "alex.kumar@ibm.com",
    total_citation: 189,
    preprint_subject: "Computer Science",
    publication_date: "2024-02-20",
    preprint_submission_date: "2024-01-10",
    corresponding_institution: "IBM Research",
    country_name: "Canada",
    preprint_abstract: "We provide a comprehensive review of quantum computing applications in modern cryptography, examining both opportunities and threats posed by quantum algorithms to current encryption methods."
  },
  {
    PPC_Id: "3",
    preprint_title: "CRISPR-Cas9 Gene Editing for Rare Disease Treatment: Clinical Trial Results",
    all_authors: JSON.stringify([
      { author_name: "Dr. Maria Gonzalez", affiliation: "Harvard Medical School" },
      { author_name: "Dr. James Wilson", affiliation: "Johns Hopkins University" },
      { author_name: "Prof. Anna Petrov", affiliation: "University of Cambridge" }
    ]),
    submission_contact: "maria.gonzalez@harvard.edu",
    total_citation: 312,
    preprint_subject: "Medicine",
    publication_date: "2024-03-05",
    preprint_submission_date: "2024-02-15",
    corresponding_institution: "Harvard Medical School",
    country_name: "United States",
    preprint_abstract: "This study reports the results of a Phase II clinical trial using CRISPR-Cas9 gene editing technology to treat patients with rare genetic disorders. Our findings demonstrate significant therapeutic potential with minimal side effects."
  }
];

const App = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedDemo, setSelectedDemo] = React.useState('papers');
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    console.log(`Changed to page ${page}`);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'var(--color-bg-primary)',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ 
          textAlign: 'center', 
          marginBottom: '3rem',
          padding: '2rem',
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
          borderRadius: 'var(--radius-2xl)',
          color: 'white'
        }}>
          <h1 className="text-display-1" style={{ margin: '0 0 1rem 0' }}>
            Enhanced Papers & Author Details
          </h1>
          <p className="text-body-large" style={{ margin: 0, opacity: 0.9 }}>
            Improved styling, pagination, and detailed paper information
          </p>
        </header>

        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '2rem',
          justifyContent: 'center'
        }}>
          <button
            onClick={() => setSelectedDemo('papers')}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: 'var(--radius-lg)',
              border: selectedDemo === 'papers' ? '2px solid var(--color-primary)' : '2px solid var(--color-neutral-300)',
              background: selectedDemo === 'papers' ? 'var(--color-primary)' : 'var(--color-bg-primary)',
              color: selectedDemo === 'papers' ? 'white' : 'var(--color-text-primary)',
              cursor: 'pointer',
              fontWeight: 'var(--font-weight-semibold)',
              transition: 'all var(--transition-fast)'
            }}
          >
            Enhanced Papers List
          </button>
          <button
            onClick={() => setSelectedDemo('author')}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: 'var(--radius-lg)',
              border: selectedDemo === 'author' ? '2px solid var(--color-primary)' : '2px solid var(--color-neutral-300)',
              background: selectedDemo === 'author' ? 'var(--color-primary)' : 'var(--color-bg-primary)',
              color: selectedDemo === 'author' ? 'white' : 'var(--color-text-primary)',
              cursor: 'pointer',
              fontWeight: 'var(--font-weight-semibold)',
              transition: 'all var(--transition-fast)'
            }}
          >
            Author Details Page
          </button>
          <button
            onClick={() => setSelectedDemo('pagination')}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: 'var(--radius-lg)',
              border: selectedDemo === 'pagination' ? '2px solid var(--color-primary)' : '2px solid var(--color-neutral-300)',
              background: selectedDemo === 'pagination' ? 'var(--color-primary)' : 'var(--color-bg-primary)',
              color: selectedDemo === 'pagination' ? 'white' : 'var(--color-text-primary)',
              cursor: 'pointer',
              fontWeight: 'var(--font-weight-semibold)',
              transition: 'all var(--transition-fast)'
            }}
          >
            Enhanced Pagination
          </button>
        </div>

        {selectedDemo === 'papers' && (
          <div>
            <h2 className="text-heading-2" style={{ marginBottom: '2rem', textAlign: 'center' }}>
              Enhanced Papers List with Detailed Information
            </h2>
            <PapersList 
              papers={mockPapers}
              loading={false}
              onPaperClick={(paper) => console.log('Paper clicked:', paper)}
            />
          </div>
        )}

        {selectedDemo === 'author' && (
          <div>
            <h2 className="text-heading-2" style={{ marginBottom: '2rem', textAlign: 'center' }}>
              Enhanced Author Details Page Preview
            </h2>
            <div style={{ 
              border: '2px solid var(--color-neutral-200)', 
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              background: 'var(--color-bg-secondary)'
            }}>
              <AuthorDetailsPage />
            </div>
          </div>
        )}

        {selectedDemo === 'pagination' && (
          <div>
            <h2 className="text-heading-2" style={{ marginBottom: '2rem', textAlign: 'center' }}>
              Enhanced Pagination Component
            </h2>
            
            <div style={{ marginBottom: '3rem' }}>
              <h3 className="text-heading-4" style={{ marginBottom: '1rem' }}>
                Enhanced Pagination (with page numbers)
              </h3>
              <Pagination
                currentPage={currentPage}
                totalPages={15}
                onPageChange={handlePageChange}
                hasNextPage={currentPage < 15}
                hasPrevPage={currentPage > 1}
                totalResults={300}
                resultsPerPage={20}
                variant="enhanced"
              />
            </div>

            <div>
              <h3 className="text-heading-4" style={{ marginBottom: '1rem' }}>
                Simple Pagination (classic style)
              </h3>
              <Pagination
                currentPage={currentPage}
                totalPages={15}
                onPageChange={handlePageChange}
                hasNextPage={currentPage < 15}
                hasPrevPage={currentPage > 1}
                totalResults={300}
                resultsPerPage={20}
                variant="simple"
              />
            </div>
          </div>
        )}

        <footer style={{ 
          textAlign: 'center', 
          marginTop: '4rem',
          padding: '2rem',
          borderTop: '1px solid var(--color-neutral-200)',
          color: 'var(--color-text-secondary)'
        }}>
          <p>Enhanced UI Components with Modern 2025 Design Principles</p>
        </footer>
      </div>
    </div>
  );
};

export default App;