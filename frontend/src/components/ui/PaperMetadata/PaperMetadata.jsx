import React from 'react';
import Card from '../Card/Card';
import styles from './PaperMetadata.module.css';

const PaperMetadata = ({ paper }) => {
  const meta = [
    { k: 'preprint_doi', l: 'DOI', v: d => `<a href="https://doi.org/${d}" target="_blank" rel="noopener noreferrer" class="${styles.externalLink}">${d}</a>` },
    { k: 'preprint_submission_date', l: 'Submission Date', v: d => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
    { k: 'preprint_server', l: 'Preprint Server' },
    { k: 'submission_contact', l: 'Submission Contact' },
    { k: 'corresponding_institution', l: 'Corresponding Institution' },
    { k: 'country_name', l: 'Country' },
    { k: 'versions', l: 'Versions', v: d => {
      try {
        return JSON.parse(d).map(v => `${v.version} (${new Date(v.created).toLocaleDateString()})`).join(', ');
      } catch {
        return d;
      }
    }},
    { k: 'submission_type', l: 'Submission Type' },
    { k: 'submission_license', l: 'License' },
    { k: 'preprint_subject', l: 'Subject' },
    { k: 'published_DOI', l: 'Published DOI', v: d => `<a href="https://doi.org/${d}" target="_blank" rel="noopener noreferrer" class="${styles.externalLink}">${d}</a>` },
    { k: 'publication_date', l: 'Publication Date', v: d => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
    { k: 'total_citation', l: 'Total Citations' }
  ];

  const authors = paper.all_authors ? JSON.parse(paper.all_authors) : [];

  return (
    <div className={styles.metadataContainer}>
      <Card className={styles.metadataCard}>
        <Card.Header>
          <h3 className={styles.sectionTitle}>Paper Details</h3>
        </Card.Header>
        <Card.Content>
          <div className={styles.metadataGrid}>
            {meta.map(m => {
              if (!paper[m.k]) return null;
              let val = m.v ? m.v(paper[m.k]) : paper[m.k];
              return (
                <div key={m.k} className={styles.metadataItem}>
                  <div className={styles.metadataLabel}>
                    {m.l}
                  </div>
                  <div 
                    className={styles.metadataValue} 
                    dangerouslySetInnerHTML={{ __html: val }}
                  />
                </div>
              );
            })}
          </div>
        </Card.Content>
      </Card>
      
      {authors.length > 0 && (
        <Card className={styles.authorsCard}>
          <Card.Header>
            <h3 className={styles.sectionTitle}>Authors</h3>
          </Card.Header>
          <Card.Content>
            <div className={styles.authorsList}>
              {authors.map((author, index) => (
                <div key={index} className={styles.authorItem}>
                  <div className={styles.authorName}>
                    {author.author_name}
                  </div>
                  {author.affiliation && (
                    <div className={styles.authorAffiliation}>
                      {author.affiliation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      )}
    </div>
  );
};

export default PaperMetadata;