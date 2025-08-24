import React from 'react';
import Layout from '../components/layout/Layout/Layout';
import styles from '../components/layout/Layout/Layout.module.css';

const ContactPage = () => {
  return (
    <Layout>
      <div className={styles.pageContainer}>
        {/* Hero Section */}
        <div className={`${styles.contentSection} animate-fadeInUp`} style={{
          background: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-accent) 100%)',
          color: 'white',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--spacing-3xl)',
          marginBottom: 'var(--spacing-3xl)',
          textAlign: 'center'
        }}>
          <h1 className="text-display-2" style={{ color: 'white', marginBottom: 'var(--spacing-lg)' }}>
            Contact Us
          </h1>
          <p className="text-body-large" style={{ 
            color: 'rgba(255, 255, 255, 0.9)', 
            maxWidth: '700px', 
            margin: '0 auto',
            lineHeight: 'var(--line-height-relaxed)'
          }}>
            We'd love to hear from you! Whether you have questions about our data, 
            suggestions for improvements, or collaboration opportunities, don't hesitate to reach out.
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
              Get in Touch
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
              {[
                {
                  icon: '📧',
                  title: 'General Inquiries',
                  desc: 'For general questions about Preprint Commons',
                  email: 'contact@preprintcommons.org',
                  delay: '0.2s'
                },
                {
                  icon: '🛠️',
                  title: 'Technical Support',
                  desc: 'For technical issues or API questions',
                  email: 'support@preprintcommons.org',
                  delay: '0.3s'
                },
                {
                  icon: '🤝',
                  title: 'Partnerships',
                  desc: 'For collaboration and partnership opportunities',
                  email: 'partnerships@preprintcommons.org',
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
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-lg)' }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                      borderRadius: 'var(--radius-lg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 'var(--font-size-xl)',
                      flexShrink: 0
                    }}>
                      {contact.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 className="text-heading-4" style={{ 
                        marginBottom: 'var(--spacing-sm)',
                        color: 'var(--color-text-primary)'
                      }}>
                        {contact.title}
                      </h3>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, var(--color-secondary), var(--color-accent))',
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'var(--font-size-lg)'
                  }}>
                    🌐
                  </div>
                  <h3 className="text-heading-4" style={{ color: 'var(--color-text-primary)' }}>
                    Social Media
                  </h3>
                </div>
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
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
                color: 'white',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--spacing-xl)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                  <div style={{ fontSize: 'var(--font-size-2xl)' }}>📬</div>
                  <h3 className="text-heading-4" style={{ color: 'white' }}>Newsletter</h3>
                </div>
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
                  Subscribe to Updates
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, var(--color-accent), var(--color-secondary))',
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'var(--font-size-lg)'
                  }}>
                    👥
                  </div>
                  <h3 className="text-heading-4" style={{ color: 'var(--color-text-primary)' }}>
                    Community
                  </h3>
                </div>
                <p className="text-body" style={{ 
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--spacing-lg)'
                }}>
                  Join our community of researchers and data enthusiasts
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
        
        {/* Office Hours Section */}
        <div className={`${styles.contentSection} animate-fadeInUp animate-delay-4`}>
          <div style={{
            background: 'var(--color-bg-secondary)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--spacing-3xl)',
            textAlign: 'center',
            border: '1px solid var(--color-neutral-200)'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--spacing-xl)',
              fontSize: 'var(--font-size-3xl)'
            }}>
              🕒
            </div>
            <h2 className="text-heading-2" style={{ marginBottom: 'var(--spacing-lg)' }}>
              Office Hours
            </h2>
            <p className="text-body" style={{ 
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 'var(--line-height-relaxed)',
              color: 'var(--color-text-secondary)'
            }}>
              Our team is available Monday through Friday, 9:00 AM to 5:00 PM (UTC).
              We typically respond to emails within 24 hours during business days.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;