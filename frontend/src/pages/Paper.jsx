import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Chart from 'chart.js/auto';
import Layout from '../components/layout/Layout/Layout';
import styles from '../components/layout/Layout/Layout.module.css';

const Paper = () => {
  const { id } = useParams();
  const [paper, setPaper] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const chartRef = useRef(null);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/paper/${id}`)
      .then(response => response.json())
      .then(data => {
        setPaper(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching paper:', error);
        setIsLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (paper && paper.citation && chartRef.current) {
      try {
        const citations = JSON.parse(paper.citation);
        const ctx = document.createElement('canvas');
        chartRef.current.innerHTML = '';
        chartRef.current.appendChild(ctx);
        
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: citations.map(c => c.year),
            datasets: [{
              label: 'Citations per year',
              data: citations.map(c => c.value),
              backgroundColor: 'rgba(54, 162, 235, 0.7)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: { 
              legend: { display: false },
              title: {
                display: true,
                text: 'Citation History'
              }
            },
            scales: { 
              y: { 
                beginAtZero: true, 
                ticks: { precision: 0 } 
              } 
            }
          }
        });
      } catch (error) {
        console.error('Error creating chart:', error);
      }
    }
  }, [paper]);

  if (isLoading) {
    return (
      <Layout>
        <div className={styles.pageContainer}>
          <div className="flex items-center justify-center min-h-64">
            <div className="text-heading-3">Loading paper details...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!paper) {
    return (
      <Layout>
        <div className={styles.pageContainer}>
          <div className="card card-content text-center">
            <h1 className="text-heading-2 mb-4">Paper Not Found</h1>
            <p className="text-body">The requested paper could not be found.</p>
          </div>
        </div>
      </Layout>
    );
  }

  const meta = [
    { k: 'preprint_doi', l: 'DOI', v: d => `<a href="https://doi.org/${d}" target="_blank" class="text-primary hover:text-primary-dark">${d}</a>` },
    { k: 'preprint_submission_date', l: 'Submission Date', v: d => new Date(d).toLocaleDateString() },
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
    { k: 'published_DOI', l: 'Published DOI', v: d => `<a href="https://doi.org/${d}" target="_blank" class="text-primary hover:text-primary-dark">${d}</a>` },
    { k: 'publication_date', l: 'Publication Date', v: d => new Date(d).toLocaleDateString() },
    { k: 'total_citation', l: 'Total Citations' }
  ];

  const authors = paper.all_authors ? JSON.parse(paper.all_authors) : [];

  return (
    <Layout>
      <div className={styles.pageContainer}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className={styles.contentSection}>
              <h1 className="text-heading-1 mb-4">{paper.preprint_title}</h1>
              <div className="text-body-large text-neutral-600 mb-4">
                {authors.map(a => a.author_name).join(', ')}
              </div>
            </div>
            
            {paper.preprint_abstract && (
              <div className="card card-content">
                <h2 className="text-heading-3 mb-4">Abstract</h2>
                <p className="text-body leading-relaxed">{paper.preprint_abstract}</p>
              </div>
            )}
            
            {paper.citation && (
              <div className="card card-content">
                <h2 className="text-heading-3 mb-4">Citation History</h2>
                <div ref={chartRef} className="w-full h-64"></div>
              </div>
            )}
          </div>
          
          {/* Metadata Sidebar */}
          <div className="space-y-4">
            <div className="card card-content">
              <h3 className="text-heading-4 mb-4">Paper Details</h3>
              <div className="space-y-3">
                {meta.map(m => {
                  if (!paper[m.k]) return null;
                  let val = m.v ? m.v(paper[m.k]) : paper[m.k];
                  return (
                    <div key={m.k} className="border-b border-neutral-200 pb-2 last:border-b-0">
                      <div className="text-body-small font-medium text-neutral-600 mb-1">
                        {m.l}
                      </div>
                      <div 
                        className="text-body" 
                        dangerouslySetInnerHTML={{ __html: val }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            
            {authors.length > 0 && (
              <div className="card card-content">
                <h3 className="text-heading-4 mb-4">Authors</h3>
                <div className="space-y-2">
                  {authors.map((author, index) => (
                    <div key={index} className="text-body">
                      {author.author_name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Paper;