import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../Card/Card';
import styles from './PapersList.module.css';

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

const formatAuthors = (authorsArray) => {
  if (!authorsArray || authorsArray.length === 0) return 'Unknown authors';
  
  try {
    const authors = typeof authorsArray === 'string' 
      ? JSON.parse(authorsArray) 
      : authorsArray;
    
    const authorNames = authors
      .filter(author => author.author_name && author.author_name.trim())
      .map(author => author.author_name.trim());
    
    if (authorNames.length === 0) return 'Unknown authors';
    if (authorNames.length === 1) return authorNames[0];
    if (authorNames.length === 2) return `${authorNames[0]} and ${authorNames[1]}`;
    if (authorNames.length <= 3) return `${authorNames.slice(0, -1).join(', ')}, and ${authorNames[authorNames.length - 1]}`;
    
    return `${authorNames[0]} et al.`;
  } catch (error) {
    return 'Unknown authors';
  }
};

const PapersList = ({ papers, loading = false, onPaperClick }) => {
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
              <div className={styles.rankBadge}>#{index + 1}</div>
              <div className={styles.citationCount}>
                {formatCitationCount(paper.total_citation)}
              </div>
            </div>
            
            <h3 className={styles.paperTitle}>
              {paper.preprint_title}
            </h3>
            
            <div className={styles.paperMeta}>
              <p className={styles.authors}>
                {formatAuthors(paper.all_authors)}
              </p>
              <div className={styles.metaRow}>
                <span className={styles.subject}>
                  {paper.preprint_subject}
                </span>
                <span className={styles.date}>
                  {formatPublicationDate(paper.publication_date)}
                </span>
              </div>
            </div>
          </Card.Content>
        </Card>
      ))}
    </div>
  );
};

export default PapersList;