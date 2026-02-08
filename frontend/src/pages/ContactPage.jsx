import React from 'react';
import Layout from '../components/layout/Layout/Layout';
import styles from '../components/layout/Layout/Layout.module.css';

const ContactPage = () => {
  return (
    <Layout>
      <div className={styles.pageContainer}>
        {/* Hero Section */}
        <div className={`${styles.contentSection} animate-fadeInUp`} style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
          color: 'white',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--spacing-3xl)',
          marginBottom: 'var(--spacing-3xl)',
          textAlign: 'center'
        }}>
          <h1 className="text-display-2" style={{ color: 'white', marginBottom: 'var(--spacing-lg)' }}>
            Connect with our research team
          </h1>
          <p className="text-body-large" style={{ 
            color: 'rgba(255, 255, 255, 0.9)', 
            maxWidth: '800px', 
            margin: '0 auto',
            lineHeight: 'var(--line-height-relaxed)'
          }}>
            </p>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
          gap: 'var(--spacing-3xl)',
          marginBottom: 'var(--spacing-3xl)'
        }}>
          {/* Get in Touch Section */}
          <div className={`animate-fadeInUp animate-delay-1`}>
            <h2 className="text-heading-2" style={{ 
              marginBottom: 'var(--spacing-xl)',
              color: 'var(--color-text-primary)'
            }}>
              Get in Touch with the relevant topic in the subject line
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
              {[
                {
                  icon: '🔬',
                  title: 'Research Inquiries',
                  desc: 'Questions about methodology, data quality, and research applications',
                  delay: '0.2s'
                },
                {
                  icon: '🤖',
                  title: 'Technical & API Support',
                  desc: 'API access, technical implementation, and data integration support',
                  delay: '0.3s'
                },
                {
                  icon: '🤝',
                  title: 'Academic Collaborations',
                  desc: 'Research partnerships, institutional collaborations, and joint projects',
                  delay: '0.4s'
                }
              ].map((contact, index) => (
                <div key={index} className="animate-slideInLeft" style={{
                  animationDelay: contact.delay,
                  background: 'var(--color-bg-primary)',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--spacing-xl)',
                  border: '1px solid var(--color-neutral-200)',
                  boxShadow: 'var(--shadow-md)',
                  transition: 'all var(--transition-normal)'
                }}>
                  <div>
                    <h3 className="text-heading-4" style={{ 
                      marginBottom: 'var(--spacing-sm)',
                      color: 'var(--color-text-primary)'
                    }}>
                      {contact.icon} {contact.title}
                    </h3>
                    <p className="text-body" style={{ 
                      color: 'var(--color-text-secondary)'
                    }}>
                      {contact.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Connect With Us Section */}
          <div className={`animate-fadeInUp animate-delay-1`}>
            <h2 className="text-heading-2" style={{ 
              marginBottom: 'var(--spacing-xl)',
              color: 'var(--color-text-primary)'
            }}>
              Connect With Us
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
              {/* Social Media */}
              <div className="animate-slideInRight" style={{
                animationDelay: '0.2s',
                background: 'var(--color-bg-primary)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--spacing-xl)',
                border: '1px solid var(--color-neutral-200)',
                boxShadow: 'var(--shadow-md)'
              }}>
                <h3 className="text-heading-4" style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-lg)' }}>
                  🌐 Social Media
                </h3>
                <div style={{ display: 'flex', gap: 'var(--spacing-lg)', flexWrap: 'wrap' }}>
                  {[
                    { 
                      name: 'X', 
                      url: 'https://x.com/ganitlabs',
                      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>`
                    },
                    { 
                      name: 'GitHub', 
                      url: 'https://github.com/binaypanda/Preprint-commons',
                      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>`
                    }
                  ].map((platform, index) => (
                    <a 
                      key={platform.name}
                      href={platform.url} 
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: 'var(--color-primary)',
                        textDecoration: 'none',
                        fontWeight: 'var(--font-weight-medium)',
                        padding: 'var(--spacing-sm) var(--spacing-md)',
                        background: 'var(--color-bg-secondary)',
                        borderRadius: 'var(--radius-lg)',
                        transition: 'all var(--transition-normal)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-sm)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'var(--color-primary)';
                        e.target.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'var(--color-bg-secondary)';
                        e.target.style.color = 'var(--color-primary)';
                      }}
                    >
                      <span dangerouslySetInnerHTML={{ __html: platform.icon }} />
                      {platform.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Research Team Section */}
        <div className={`${styles.contentSection} animate-fadeInUp animate-delay-4`}>
          <div style={{
            background: 'var(--color-bg-secondary)',
            borderRadius: 'var(--radius-2xl)',
            padding: 'var(--spacing-4xl)',
            textAlign: 'center',
            border: '1px solid var(--color-neutral-200)'
          }}>
            <h2 className="text-heading-2" style={{ marginBottom: 'var(--spacing-lg)' }}>
              👥 Citations
            </h2>
            <p className="text-body" style={{ 
              maxWidth: '700px',
              margin: '0 auto var(--spacing-xl)',
              lineHeight: 'var(--line-height-relaxed)',
              color: 'var(--color-text-secondary)'
            }}>
                </p>
            
            <div style={{ 
            }}>
              <div>
                
              </div>
              
              <div style={{
              }}>
              </div>
            </div>
            
            <div style={{
              marginTop: 'var(--spacing-2xl)',
              padding: 'var(--spacing-xl)',
              background: 'var(--color-bg-primary)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--color-neutral-200)'
            }}>
              <h3 className="text-heading-4" style={{ marginBottom: 'var(--spacing-md)' }}>
                </h3>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: 'var(--spacing-2xl)', 
                flexWrap: 'wrap',
                alignItems: 'center'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--spacing-xs)' }}>
                  </div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--spacing-xs)' }}>
                  </div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-body-small" style={{ 
              marginTop: 'var(--spacing-xl)',
              color: 'var(--color-text-secondary)'
            }}></p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;