import React from 'react';
import Layout from '../components/layout/Layout/Layout';
import layoutStyles from '../components/layout/Layout/Layout.module.css';
import styles from './AboutPage.module.css';

const AboutPage = () => {
  return (
    <Layout>
      <div className={layoutStyles.pageContainer}>
        {/* Hero Section - Simplified */}
        <div className={layoutStyles.contentSection} style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
          color: 'white',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--spacing-3xl)',
          marginBottom: 'var(--spacing-2xl)',
          textAlign: 'center'
        }}>
          <h1 className="text-heading-1" style={{ color: 'white', marginBottom: 'var(--spacing-lg)' }}>
            Preprint Commons
          </h1>
          <p className="text-body-large" style={{ 
            color: 'rgba(255, 255, 255, 0.95)', 
            maxWidth: '800px', 
            margin: '0 auto var(--spacing-lg)',
            lineHeight: 'var(--line-height-relaxed)'
          }}>
            A dedicated database and visualization platform for large-scale preprint meta-analysis, 
            featuring over 344,000 preprints.
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'var(--spacing-xl)',
            marginTop: 'var(--spacing-xl)',
            flexWrap: 'wrap'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)' }}>344,000+</div>
              <div style={{ fontSize: 'var(--font-size-base)', opacity: 0.9 }}>Preprints Analyzed</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)' }}>3</div>
              <div style={{ fontSize: 'var(--font-size-base)', opacity: 0.9 }}>Current Repositories</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)' }}>150+</div>
              <div style={{ fontSize: 'var(--font-size-base)', opacity: 0.9 }}>Countries Covered</div>
            </div>
          </div>
        </div>

        {/* Open Science Philosophy Section */}
        <div className={layoutStyles.contentSection}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
            <h2 className="text-heading-2" style={{ marginBottom: 'var(--spacing-md)' }}>
              Our Mission & Commitment to Open Science
            </h2>
            <p className="text-body" style={{ 
              maxWidth: '800px', 
              margin: '0 auto',
              color: 'var(--color-text-secondary)'
            }}>
              To address the critical gap in preprint ecosystem analysis by providing a centralized platform 
              for large-scale meta-analysis, enabling cross-disciplinary trend analysis and comparative impact assessment.
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: 'var(--spacing-lg)'
          }}>
            {[
              { 
                icon: '🌐', 
                title: 'Open Access', 
                desc: 'Complete dataset available via public REST API with bulk download options in JSON and CSV formats.'
              },
              { 
                icon: '🔍', 
                title: 'Transparent', 
                desc: 'Full methodology documentation with known limitations clearly stated and validation metrics publicly shared.'
              },
              { 
                icon: '📊', 
                title: 'Reproducible', 
                desc: 'Comprehensive API documentation with structured data formats and version-controlled datasets for reproducibility.'
              },
              { 
                icon: '💡', 
                title: 'Democratic', 
                desc: 'Empowering the next generation of researchers by making preprint analytics freely and openly accessible.'
              }
            ].map((principle, index) => (
              <div key={index} className={styles.principleCard}>
                <div style={{
                  fontSize: 'var(--font-size-3xl)',
                  marginBottom: 'var(--spacing-md)'
                }}>
                  {principle.icon}
                </div>
                <h3 className="text-heading-4" style={{ 
                  marginBottom: 'var(--spacing-sm)',
                  color: 'var(--color-text-primary)'
                }}>
                  {principle.title}
                </h3>
                <p className="text-body-small" style={{ 
                  color: 'var(--color-text-secondary)',
                  lineHeight: 'var(--line-height-relaxed)'
                }}>
                  {principle.desc}
                </p>
              </div>
            ))}
          </div>
        </div>


        {/* Data Sources - Brief Overview */}
        <div className={layoutStyles.contentSection} style={{
          background: 'var(--color-bg-secondary)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--spacing-2xl)',
          marginBottom: 'var(--spacing-2xl)',
          marginTop: 'var(--spacing-2xl)',
          textAlign: 'center',
          border: '1px solid var(--color-neutral-200)'
        }}>
          <h2 className="text-heading-2" style={{ marginBottom: 'var(--spacing-md)' }}>
            Data Sources
          </h2>
          <p className="text-body" style={{ 
            maxWidth: '700px', 
            margin: '0 auto var(--spacing-lg)',
            color: 'var(--color-text-secondary)'
          }}>
            Preprint-Commons used data from three major repositories: <strong>bioRxiv</strong> (239,847), 
            <strong> medRxiv</strong> (55,695), and <strong>arXiv q-bio</strong> (49,301).
          </p>
          <a 
            href="/documentation#sources" 
            style={{
              display: 'inline-block',
              color: 'var(--color-primary)',
              textDecoration: 'none',
              fontWeight: 'var(--font-weight-semibold)',
              fontSize: 'var(--font-size-base)',
              padding: 'var(--spacing-md) var(--spacing-xl)',
              background: 'var(--color-bg-primary)',
              borderRadius: 'var(--radius-md)',
              border: '2px solid var(--color-primary)',
              transition: 'all var(--transition-normal)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--color-primary)';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'var(--color-bg-primary)';
              e.target.style.color = 'var(--color-primary)';
            }}
          >
            View Detailed Methodology & Data Processing →
          </a>
        </div>


        {/* Logo & Brand Identity Section */}
        <div className={layoutStyles.contentSection} style={{
          background: 'var(--color-bg-secondary)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--spacing-2xl)',
          marginBottom: 'var(--spacing-2xl)',
          border: '1px solid var(--color-neutral-200)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
            <h2 className="text-heading-2" style={{ marginBottom: 'var(--spacing-md)' }}>
              About the logo and name of the platform
            </h2>
          </div>

          {/* Logo Display */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 'var(--spacing-2xl)'
          }}>
            <img 
              src="/images/preprint_commons_logo2.svg" 
              alt="Preprint Commons Logo" 
              style={{
                maxWidth: '400px',
                width: '100%',
                height: 'auto'
              }}
            />
          </div>

          {/* Logo Explanation */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'var(--spacing-xl)',
            marginBottom: 'var(--spacing-xl)'
          }}>
            {/* Icon Story */}
            <div className={styles.logoCard}>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: 'var(--spacing-lg)'
              }}>
                <img 
                  src="/images/preprint_commons_icon.svg" 
                  alt="Logo Icon" 
                  style={{
                    width: '100px',
                    height: 'auto'
                  }}
                />
              </div>
              <h3 className="text-heading-3" style={{ 
                marginBottom: 'var(--spacing-md)',
                textAlign: 'center',
                color: 'var(--color-primary)'
              }}>
                The Icon
              </h3>
              <p className="text-body-small" style={{ 
                color: 'var(--color-text-secondary)',
                lineHeight: 'var(--line-height-relaxed)',
                marginBottom: 'var(--spacing-md)'
              }}>
                The Preprint Commons logo icon is a visual representation of generational transition and commitment to open science. It features a stack of distinct layers, deliberately using contrasting tones to separate the established past from the ambitious future.
              </p>
              <p className="text-body-small" style={{ 
                color: 'var(--color-text-secondary)',
                lineHeight: 'var(--line-height-relaxed)',
                marginBottom: 'var(--spacing-md)'
              }}>
                The lower two layers represent the preceding generation and the established norms. Resting above is the top layer, symbolizing the new generation using the power of internet to make the fruits of science open.
              </p>
              <p className="text-body-small" style={{ 
                color: 'var(--color-text-secondary)',
                lineHeight: 'var(--line-height-relaxed)'
              }}>
                The shape looks like a stack of mortarboards, symbolizing the academic mantle being passed. 
              </p>
            </div>

            {/* Name Story */}
            <div className={styles.logoCard}>
              <h3 className="text-heading-3" style={{ 
                marginBottom: 'var(--spacing-md)',
                color: 'var(--color-primary)',
                textAlign: 'center'
              }}>
                Why "Preprint Commons"?
              </h3>
              <p className="text-body-small" style={{ 
                lineHeight: 'var(--line-height-relaxed)',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--spacing-lg)'
              }}>
                The name was chosen to communicate both our focus and the foundational mission.
              </p>
              
              <div style={{
                background: 'var(--color-bg-secondary)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--spacing-lg)',
                marginBottom: 'var(--spacing-md)',
                borderLeft: '3px solid var(--color-primary)'
              }}>
                <h4 className="text-heading-4" style={{ 
                  marginBottom: 'var(--spacing-sm)',
                  color: 'var(--color-primary)',
                  fontSize: 'var(--font-size-lg)'
                }}>
                  "Preprint"
                </h4>
                <p className="text-body-small" style={{ 
                  lineHeight: 'var(--line-height-relaxed)',
                  color: 'var(--color-text-secondary)'
                }}>
                  Clearly defines the core subject matter—rapid, open, and early communication of research. 
                </p>
              </div>

              <div style={{
                background: 'var(--color-bg-secondary)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--spacing-lg)',
                borderLeft: '3px solid var(--color-secondary)'
              }}>
                <h4 className="text-heading-4" style={{ 
                  marginBottom: 'var(--spacing-sm)',
                  color: 'var(--color-secondary)',
                  fontSize: 'var(--font-size-lg)'
                }}>
                  "Commons"
                </h4>
                <p className="text-body-small" style={{ 
                  lineHeight: 'var(--line-height-relaxed)',
                  color: 'var(--color-text-secondary)'
                }}>
                  A shared public resource.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default AboutPage;