import React from 'react';
import Layout from '../components/layout/Layout/Layout';
import styles from '../components/layout/Layout/Layout.module.css';

const AboutPage = () => {
  return (
    <Layout>
      <div className={styles.pageContainer}>
        {/* Hero Section */}
        <div className={`${styles.contentSection} animate-fadeInUp`} style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
          color: 'white',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--spacing-3xl)',
          marginBottom: 'var(--spacing-3xl)',
          textAlign: 'center'
        }}>
          <h1 className="text-display-2" style={{ color: 'white', marginBottom: 'var(--spacing-lg)' }}>
            About Preprint Commons
          </h1>
          <p className="text-body-large" style={{ 
            color: 'rgba(255, 255, 255, 0.9)', 
            maxWidth: '800px', 
            margin: '0 auto',
            lineHeight: 'var(--line-height-relaxed)'
          }}>
            Democratizing access to preprint analytics and fostering a deeper understanding 
            of how open science is shaping the future of research collaboration.
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
          gap: 'var(--spacing-2xl)',
          marginBottom: 'var(--spacing-3xl)'
        }}>
          <div className="card animate-fadeInUp animate-delay-1" style={{
            background: 'var(--color-bg-primary)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--spacing-2xl)',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--color-neutral-200)'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--spacing-lg)',
              fontSize: 'var(--font-size-2xl)'
            }}>
              🎯
            </div>
            <h2 className="text-heading-2" style={{ marginBottom: 'var(--spacing-md)' }}>Our Mission</h2>
            <p className="text-body" style={{ lineHeight: 'var(--line-height-relaxed)' }}>
              To democratize access to preprint analytics and foster a deeper understanding 
              of how open science is shaping the future of research collaboration and knowledge sharing.
            </p>
          </div>

          <div className="card animate-fadeInUp animate-delay-2" style={{
            background: 'var(--color-bg-primary)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--spacing-2xl)',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--color-neutral-200)'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, var(--color-secondary), var(--color-accent))',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--spacing-lg)',
              fontSize: 'var(--font-size-2xl)'
            }}>
              🔬
            </div>
            <h2 className="text-heading-2" style={{ marginBottom: 'var(--spacing-md)' }}>What We Do</h2>
            <p className="text-body" style={{ lineHeight: 'var(--line-height-relaxed)' }}>
              We track, analyze, and visualize preprint data from major repositories to help researchers 
              understand trends, collaborations, and the impact of open science worldwide.
            </p>
          </div>
        </div>

        {/* Platform Description */}
        <div className={`${styles.contentSection} animate-fadeInUp animate-delay-3`} style={{
          background: 'var(--color-bg-secondary)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--spacing-3xl)',
          marginBottom: 'var(--spacing-3xl)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
            <h2 className="text-heading-1" style={{ marginBottom: 'var(--spacing-lg)' }}>
              Comprehensive Research Analytics
            </h2>
            <p className="text-body-large" style={{ 
              maxWidth: '700px', 
              margin: '0 auto',
              color: 'var(--color-text-secondary)'
            }}>
              Our platform aggregates data from leading preprint servers including medRxiv, 
              bioRxiv, and arXiv, using advanced AI to enrich metadata and provide meaningful 
              insights into the research ecosystem.
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: 'var(--spacing-xl)'
          }}>
            {[
              { icon: '🌍', title: 'Global Coverage', desc: 'Comprehensive data from major preprint repositories worldwide' },
              { icon: '🤖', title: 'AI-Enhanced Metadata', desc: 'Advanced language models extract and enrich missing information' },
              { icon: '📊', title: 'Interactive Visualizations', desc: 'Dynamic charts, maps, and dashboards for data exploration' },
              { icon: '⚡', title: 'Real-time Updates', desc: 'Continuously updated data ensuring the latest insights' }
            ].map((feature, index) => (
              <div key={index} className="card animate-fadeInUp" style={{
                animationDelay: `${0.4 + index * 0.1}s`,
                background: 'var(--color-bg-primary)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--spacing-xl)',
                textAlign: 'center',
                border: '1px solid var(--color-neutral-200)',
                transition: 'all var(--transition-normal)'
              }}>
                <div style={{
                  fontSize: 'var(--font-size-4xl)',
                  marginBottom: 'var(--spacing-md)'
                }}>
                  {feature.icon}
                </div>
                <h3 className="text-heading-4" style={{ marginBottom: 'var(--spacing-sm)' }}>
                  {feature.title}
                </h3>
                <p className="text-body" style={{ color: 'var(--color-text-secondary)' }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Target Audience */}
        <div className={`${styles.contentSection} animate-fadeInUp animate-delay-4`}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
            <h2 className="text-heading-1" style={{ marginBottom: 'var(--spacing-lg)' }}>
              Who We Serve
            </h2>
            <p className="text-body-large" style={{ 
              maxWidth: '600px', 
              margin: '0 auto',
              color: 'var(--color-text-secondary)'
            }}>
              Preprint Commons provides tools and insights for various stakeholders in the research ecosystem.
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: 'var(--spacing-xl)'
          }}>
            {[
              { 
                title: 'Researchers', 
                desc: 'Understand field trends, discover collaboration opportunities, and track research impact',
                gradient: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))'
              },
              { 
                title: 'Policy Makers', 
                desc: 'Access data-driven insights for evidence-based policy decisions in science and research',
                gradient: 'linear-gradient(135deg, var(--color-secondary), var(--color-secondary-light))'
              },
              { 
                title: 'Institutions', 
                desc: 'Track research output, monitor collaboration networks, and assess institutional impact',
                gradient: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-light))'
              }
            ].map((audience, index) => (
              <div key={index} className="card animate-fadeInUp" style={{
                animationDelay: `${0.5 + index * 0.1}s`,
                background: audience.gradient,
                color: 'white',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--spacing-2xl)',
                textAlign: 'center',
                boxShadow: 'var(--shadow-lg)',
                transition: 'all var(--transition-normal)'
              }}>
                <h3 className="text-heading-3" style={{ 
                  color: 'white', 
                  marginBottom: 'var(--spacing-md)' 
                }}>
                  {audience.title}
                </h3>
                <p className="text-body" style={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  lineHeight: 'var(--line-height-relaxed)'
                }}>
                  {audience.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;