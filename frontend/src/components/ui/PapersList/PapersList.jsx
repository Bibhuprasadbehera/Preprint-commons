import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../Card/Card';
import { formatCitationCount, formatPublicationDate, formatAuthors } from '../../../utils/formatters';
import styles from './PapersList.module.css';

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