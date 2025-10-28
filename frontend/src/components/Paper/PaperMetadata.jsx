import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card/Card';
import styles from './Paper.module.css';

const PaperMetadata = ({ paper }) => {
  const navigate = useNavigate();
  const metadataRef = useRef(null);

  const handleAuthorClick = (authorName) => {
    if (authorName && authorName.trim()) {
      navigate(`/author/${encodeURIComponent(authorName)}`);
    }
  };

  useEffect(() => {
    const handleClick = (e) => {
      const target = e.target;
      if (target.classList.contains(styles.authorLink) && target.dataset.author) {
        e.preventDefault();
        handleAuthorClick(target.dataset.author);
      }
    };

    const metadataElement = metadataRef.current;
    if (metadataElement) {
      metadataElement.addEventListener('click', handleClick);
      return () => metadataElement.removeEventListener('click', handleClick);
    }
  }, [navigate]);

  const meta = [
    { k: 'preprint_doi', l: 'DOI', v: d => `<a href="https://doi.org/${d}" target="_blank" rel="noopener noreferrer" class="${styles.externalLink}">${d}</a>` },
    { k: 'preprint_submission_date', l: 'Submission Date', v: d => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
    { k: 'preprint_server', l: 'Preprint Server' },
    {
      k: 'submission_contact',
      l: 'Submission Contact',
      v: (d) => `<span class="${styles.authorLink}" data-author="${d}" title="View papers by ${d}">${d}</span>`
    },
    { k: 'corresponding_institution', l: 'Corresponding Institution' },
    { k: 'country_name', l: 'Country' },
    { k: 'versions', l: 'Versions', v: d => {
      try {
        // Handle malformed JSON with single quotes by replacing them with double quotes
        const fixedVersions = d.replace(/'/g, '"');
        return JSON.parse(fixedVersions).map(v => `${v.version} (${new Date(v.created).toLocaleDateString()})`).join(', ');
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

  let authors = [];
  try {
    if (paper.all_authors) {
      // Handle malformed JSON with single quotes by replacing them with double quotes
      const fixedAuthors = paper.all_authors.replace(/'/g, '"');
      authors = JSON.parse(fixedAuthors);
    }
  } catch (error) {
    console.error('Error parsing authors JSON in PaperMetadata:', error);
    console.error('Raw authors data:', paper.all_authors);
    authors = [];
  }

  return (
    <div className={styles.metadataContainer} ref={metadataRef}>
      <Card className={styles.metadataCard}>
        <Card.Header>
          <h3 className={styles.sectionTitle}>Preprint Details</h3>
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
