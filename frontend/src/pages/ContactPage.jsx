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
                    <div>
                      <p className="text-body" style={{ 
                        marginBottom: 'var(--spacing-md)',
                        color: 'var(--color-text-secondary)'
                      }}>
                        {contact.desc}
                      </p>
                      <a 
                        href={`mailto:${contact.email}`} 
                        style={{
                          color: 'var(--color-primary)',
                          textDecoration: 'none',
                          fontWeight: 'var(--font-weight-medium)',
                          fontSize: 'var(--font-size-lg)',
                          transition: 'color var(--transition-fast)'
                        }}
                        onMouseEnter={(e) => e.target.style.color = 'var(--color-primary-dark)'}
                        onMouseLeave={(e) => e.target.style.color = 'var(--color-primary)'}
                      >
                        {contact.email}
                      </a>
                    </div>
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
                  {['Twitter', 'GitHub', 'LinkedIn'].map((platform, index) => (
                    <a 
                      key={platform}
                      href={`https://${platform.toLowerCase()}.com/preprintcommons`} 
                      style={{
                        color: 'var(--color-primary)',
                        textDecoration: 'none',
                        fontWeight: 'var(--font-weight-medium)',
                        padding: 'var(--spacing-sm) var(--spacing-md)',
                        background: 'var(--color-bg-secondary)',
                        borderRadius: 'var(--radius-lg)',
                        transition: 'all var(--transition-normal)'
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
                      {platform}
                    </a>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="animate-slideInRight" style={{
                animationDelay: '0.3s',
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                color: 'white',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--spacing-xl)'
              }}>
                <h3 className="text-heading-4" style={{ color: 'white', marginBottom: 'var(--spacing-lg)' }}>
                  📬 Newsletter
                </h3>
                <p className="text-body" style={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: 'var(--spacing-lg)'
                }}>
                  Stay updated with the latest features and insights
                </p>
                <button style={{
                  background: 'white',
                  color: 'var(--color-primary)',
                  border: 'none',
                  padding: 'var(--spacing-md) var(--spacing-xl)',
                  borderRadius: 'var(--radius-lg)',
                  fontWeight: 'var(--font-weight-semibold)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-normal)'
                }}>
                  Subscribe to get updates
                </button>
              </div>

              {/* Community */}
              <div className="animate-slideInRight" style={{
                animationDelay: '0.4s',
                background: 'var(--color-bg-primary)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--spacing-xl)',
                border: '1px solid var(--color-neutral-200)',
                boxShadow: 'var(--shadow-md)'
              }}>
                <h3 className="text-heading-4" style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-lg)' }}>
                  👥 Community for developers
                </h3>
                <p className="text-body" style={{ 
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--spacing-lg)'
                }}>
                  Join our community of researchers and developers
                </p>
                <button style={{
                  background: 'transparent',
                  color: 'var(--color-primary)',
                  border: '2px solid var(--color-primary)',
                  padding: 'var(--spacing-md) var(--spacing-xl)',
                  borderRadius: 'var(--radius-lg)',
                  fontWeight: 'var(--font-weight-semibold)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-normal)'
                }}>
                  Join Community
                </button>
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