import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../Card/Card';
import styles from './PapersList.module.css';
import Button from '../Button/Button';

// Icon components
const ContactIcon = () => (
  <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const InstitutionIcon = () => (
  <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 21h18"></path>
    <path d="M5 21V7l8-4v18"></path>
    <path d="M19 21V11l-6-4"></path>
    <path d="M9 9v.01"></path>
    <path d="M9 12v.01"></path>
    <path d="M9 15v.01"></path>
    <path d="M9 18v.01"></path>
  </svg>
);

const CalendarIcon = () => (
  <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const TagIcon = () => (
  <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
    <line x1="7" y1="7" x2="7.01" y2="7"></line>
  </svg>
);

// Formatter functions moved here since they're only used in this component
const formatCitationCount = (count) => {
  if (count === 0) return '0 citations';
  if (count === 1) return '1 citation';
  if (count < 1000) return `${count} citations`;
  if (count < 1000000) return `${(count / 1000).toFixed(1)}K citations`;
  return `${(count / 1000000).toFixed(1)}M citations`;
};

const formatPublicationDate = (dateString) => {
  if (!dateString) return 'Unknown date';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

const formatAuthors = (authorsArray, submissionContact, navigate) => {
  if (!authorsArray || authorsArray.length === 0) return 'Unknown authors';

  try {
    let authors;
    if (typeof authorsArray === 'string') {
      // Handle malformed JSON with single quotes by replacing them with double quotes
      const fixedAuthors = authorsArray.replace(/'/g, '"');
      authors = JSON.parse(fixedAuthors);
    } else {
      authors = authorsArray;
    }

    const validAuthors = authors
      .filter(author => author.author_name && author.author_name.trim());

    if (validAuthors.length === 0) return 'Unknown authors';

    const handleAuthorClick = (e, authorName) => {
      e.stopPropagation(); // Prevent paper click
      // Use submission_contact for navigation if available, otherwise use the clicked author name
      const contactToUse = submissionContact || authorName;
      if (contactToUse) {
        navigate(`/author/${encodeURIComponent(contactToUse)}`);
      }
    };

    const authorElements = validAuthors.map((author, index) => (
      <span key={index}>
        <span
          className={styles.authorLink}
          onClick={(e) => handleAuthorClick(e, author.author_name)}
          title={`View papers by ${author.author_name}`}
        >
          {author.author_name.trim()}
        </span>
        {index < validAuthors.length - 2 && ', '}
        {index === validAuthors.length - 2 && ' and '}
      </span>
    ));

    if (validAuthors.length > 3) {
      return (
        <>
          <span
            className={styles.authorLink}
            onClick={(e) => handleAuthorClick(e, validAuthors[0].author_name)}
            title={`View papers by ${validAuthors[0].author_name}`}
          >
            {validAuthors[0].author_name.trim()}
          </span>
          {' et al.'}
        </>
      );
    }

    return <span>{authorElements}</span>;
  } catch (error) {
    return 'Unknown authors';
  }
};

const formatSubmissionContact = (contact, navigate) => {
  if (!contact || !contact.trim()) return null;
  
  const handleContactClick = (e) => {
    e.stopPropagation(); // Prevent paper click
    navigate(`/author/${encodeURIComponent(contact)}`);
  };

  return (
    <span
      className={styles.contactLink}
      onClick={handleContactClick}
      title={`View papers by ${contact}`}
    >
      {contact.trim()}
    </span>
  );
};

const PapersList = ({ papers, loading = false, onPaperClick, currentPage = 1, resultsPerPage = 20 }) => {
  const navigate = useNavigate();
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading top cited papers...</p>
      </div>
    );
  }

  const handlePaperClick = (paper) => {
    // Call the provided onPaperClick if it exists
    if (onPaperClick) {
      onPaperClick(paper);
    }
    
    // Navigate to the individual paper page
    navigate(`/paper/${paper.PPC_Id}`);
  };

  if (!papers || papers.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No papers found for the selected filters.</p>
        <p className={styles.emptyHint}>Try adjusting your search criteria.</p>
      </div>
    );
  }

  return (
    <div className={styles.papersList}>
      {papers.map((paper, index) => (
        <Card 
          key={paper.PPC_Id} 
          className={styles.paperCard}
          onClick={() => handlePaperClick(paper)}
        >
          <Card.Content>
            <div className={styles.paperHeader}>
              <div className={styles.rankBadge}>#{(currentPage - 1) * resultsPerPage + index + 1}</div>
              <div className={styles.citationCount}>
                {formatCitationCount(paper.total_citation)}
              </div>
            </div>
            
            <h3 className={styles.paperTitle}>
              {paper.preprint_title}
            </h3>
            
            <div className={styles.paperMeta}>
              <div className={styles.authorsSection}>
                <div className={styles.authorsRow}>
                
                </div>
                {paper.submission_contact && (
                  <div className={styles.contactRow}>
                    <span className={styles.label}>Contact:</span>
                    <span className={styles.contactInfo}>
                      <ContactIcon />
                      {formatSubmissionContact(paper.submission_contact, navigate)}
                    </span>
                  </div>
                )}
              </div>
              
              <div className={styles.paperDetails}>
                <div className={styles.detailItem}>
                  <TagIcon />
                  <span className={styles.subject}>
                    {paper.preprint_subject || 'General'}
                  </span>
                </div>
                
                <div className={styles.detailItem}>
                  <CalendarIcon />
                  <span className={styles.date}>
                    {formatPublicationDate(paper.publication_date || paper.preprint_submission_date)}
                  </span>
                </div>
                
                {paper.corresponding_institution && (
                  <div className={styles.detailItem}>
                    <InstitutionIcon />
                    <span className={styles.institution}>
                      {paper.corresponding_institution}
                    </span>
                  </div>
                )}
                
                {paper.country_name && (
                  <div className={styles.detailItem}>
                    <span className={styles.countryFlag}>🌍</span>
                    <span className={styles.country}>
                      {paper.country_name}
                    </span>
                  </div>
                )}
              </div>
              
              {paper.preprint_abstract && (
                <div className={styles.abstractPreview}>
                  <p className={styles.abstract}>
                    {paper.preprint_abstract.length > 200 
                      ? `${paper.preprint_abstract.substring(0, 200)}...` 
                      : paper.preprint_abstract
                    }
                  </p>
                </div>
              )}
            </div>
          </Card.Content>
        </Card>
      ))}
    </div>
  );
};

export default PapersList;
