import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card/Card';
import styles from './Paper.module.css';

const PaperCard = ({ paper, className = '' }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <Link 
      to={`/paper/${paper.PPC_Id}`} 
      className={`${styles.paperCardLink} ${className}`}
    >
      <Card className={styles.paperCard}>
        <Card.Content>
          <div className={styles.paperHeader}>
            <h3 className={styles.paperTitle}>
              {paper.preprint_title}
            </h3>
            <div className={styles.paperMeta}>
              <span className={styles.paperDoi}>
                DOI: {paper.preprint_doi}
              </span>
              <span className={styles.paperDate}>
                {formatDate(paper.preprint_submission_date)}
              </span>
            </div>
          </div>
          
          <div className={styles.paperContent}>
            <div className={styles.paperAuthors}>
              <strong>Authors:</strong> {truncateText(paper.all_authors, 100)}
            </div>
            
            {paper.preprint_abstract && (
              <div className={styles.paperAbstract}>
                {truncateText(paper.preprint_abstract, 200)}
              </div>
            )}
          </div>
          
          <div className={styles.paperFooter}>
            <div className={styles.paperTags}>
              {paper.preprint_server && (
                <span className={styles.tag}>
                  {paper.preprint_server}
                </span>
              )}
              {paper.country_name && (
                <span className={styles.tag}>
                  {paper.country_name}
                </span>
              )}
              {paper.total_citation && (
                <span className={styles.citationTag}>
                  {paper.total_citation} citations
                </span>
              )}
            </div>
            
            <div className={styles.readMore}>
              Read more →
            </div>
          </div>
        </Card.Content>
      </Card>
    </Link>
  );
};

export default PaperCard;