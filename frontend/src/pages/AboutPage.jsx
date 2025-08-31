import React from 'react';
import Layout from '../components/layout/Layout/Layout';
import styles from '../components/layout/Layout/Layout.module.css';

const AboutPage = () => {
  return (
    <Layout>
      <div className={styles.pageContainer}>
        {/* Hero Section with Modern Glassmorphism */}
        <div className={`${styles.contentSection} animate-fadeInUp`} style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 50%, var(--color-secondary) 100%)',
          color: 'white',
          borderRadius: 'var(--radius-2xl)',
          padding: 'var(--spacing-4xl)',
          marginBottom: 'var(--spacing-4xl)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            zIndex: 1
          }} />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h1 className="text-display-1" style={{ color: 'white', marginBottom: 'var(--spacing-xl)' }}>
              Preprint Commons
            </h1>
            <p className="text-body-large" style={{ 
              color: 'rgba(255, 255, 255, 0.95)', 
              maxWidth: '900px', 
              margin: '0 auto var(--spacing-lg)',
              lineHeight: 'var(--line-height-relaxed)',
              fontSize: 'var(--font-size-xl)'
            }}>
              The first dedicated database and analytical platform for large-scale preprint meta-analysis, 
              featuring over 344,000 curated preprints with AI-enhanced metadata extraction.
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 'var(--spacing-2xl)',
              marginTop: 'var(--spacing-2xl)',
              flexWrap: 'wrap'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 'var(--font-weight-bold)' }}>344,000+</div>
                <div style={{ fontSize: 'var(--font-size-lg)', opacity: 0.9 }}>Preprints Analyzed</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 'var(--font-weight-bold)' }}>3</div>
                <div style={{ fontSize: 'var(--font-size-lg)', opacity: 0.9 }}>Current Repositories</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 'var(--font-weight-bold)' }}>50+</div>
                <div style={{ fontSize: 'var(--font-size-lg)', opacity: 0.9 }}>Countries Covered</div>
              </div>
            </div>
          </div>
        </div>

        {/* Research Foundation Section */}
        <div className={`${styles.contentSection} animate-fadeInUp animate-delay-1`} style={{
          background: 'var(--color-bg-secondary)',
          borderRadius: 'var(--radius-2xl)',
          padding: 'var(--spacing-4xl)',
          marginBottom: 'var(--spacing-4xl)',
          border: '1px solid var(--color-neutral-200)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-3xl)' }}>
            <h2 className="text-heading-1" style={{ marginBottom: 'var(--spacing-lg)' }}>
              Academic Research Foundation
            </h2>
            <p className="text-body-large" style={{ 
              maxWidth: '800px', 
              margin: '0 auto',
              color: 'var(--color-text-secondary)'
            }}>
               </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: 'var(--spacing-2xl)'
          }}>
            <div className="card animate-fadeInUp" style={{
              animationDelay: '0.2s',
              background: 'var(--color-bg-primary)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--spacing-2xl)',
              border: '1px solid var(--color-neutral-200)',
              boxShadow: 'var(--shadow-lg)',
              transition: 'all var(--transition-normal)'
            }}>
              <div style={{
                width: '70px',
                height: '70px',
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 'var(--spacing-xl)',
                fontSize: 'var(--font-size-3xl)'
              }}>
                🎯
              </div>
              <h3 className="text-heading-3" style={{ marginBottom: 'var(--spacing-md)' }}>Research Mission</h3>
              <p className="text-body" style={{ lineHeight: 'var(--line-height-relaxed)' }}>
                To address the critical gap in preprint ecosystem analysis by providing a centralized platform 
                for large-scale meta-analysis, enabling cross-disciplinary trend analysis and comparative impact assessment.
              </p>
            </div>

            <div className="card animate-fadeInUp" style={{
              animationDelay: '0.3s',
              background: 'var(--color-bg-primary)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--spacing-2xl)',
              border: '1px solid var(--color-neutral-200)',
              boxShadow: 'var(--shadow-lg)',
              transition: 'all var(--transition-normal)'
            }}>
              <div style={{
                width: '70px',
                height: '70px',
                background: 'linear-gradient(135deg, var(--color-secondary), var(--color-accent))',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 'var(--spacing-xl)',
                fontSize: 'var(--font-size-3xl)'
              }}>
                🏛️
              </div>
              <h3 className="text-heading-3" style={{ marginBottom: 'var(--spacing-md)' }}>Institutional Backing</h3>
              <p className="text-body" style={{ lineHeight: 'var(--line-height-relaxed)' }}>
                Supported by Jawaharlal Nehru University (JNU) and Centre for Development of Advanced Computing (C-DAC), 
                with access to high-performance computing infrastructure including 8 A100-SXM4 GPUs for AI processing.
              </p>
            </div>
          </div>
        </div>

        {/* Technical Architecture Section */}
        <div className={`${styles.contentSection} animate-fadeInUp animate-delay-2`}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-3xl)' }}>
            <h2 className="text-heading-1" style={{ marginBottom: 'var(--spacing-lg)' }}>
              Advanced Technical Architecture
            </h2>
            <p className="text-body-large" style={{ 
              maxWidth: '700px', 
              margin: '0 auto',
              color: 'var(--color-text-secondary)'
            }}>
              Built with modern full-stack architecture designed for scalability, maintainability, and high performance.
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: 'var(--spacing-xl)'
          }}>
            {[
              { 
                icon: '🚀', 
                title: 'FastAPI Backend', 
                desc: 'Python-based backend with 20+ RESTful endpoints, asynchronous capabilities, and automatic OpenAPI documentation',
                gradient: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))'
              },
              { 
                icon: '🗄️', 
                title: 'PostgreSQL Database', 
                desc: 'Normalized relational schema optimized for preprint data with efficient indexing and caching strategies',
                gradient: 'linear-gradient(135deg, var(--color-secondary), var(--color-secondary-light))'
              },
              { 
                icon: '⚛️', 
                title: 'React 19 Frontend', 
                desc: 'Modern responsive application with Chart.js visualizations, D3.js components, and interactive dashboards',
                gradient: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-light))'
              },
              { 
                icon: '🤖', 
                title: 'AI Enhancement', 
                desc: 'NVIDIA/Llama-3.1-Nemotron-70B-Instruct-HF model for metadata extraction and geographic classification',
                gradient: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))'
              }
            ].map((tech, index) => (
              <div key={index} className="card animate-fadeInUp" style={{
                animationDelay: `${0.3 + index * 0.1}s`,
                background: tech.gradient,
                color: 'white',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--spacing-2xl)',
                textAlign: 'center',
                boxShadow: 'var(--shadow-xl)',
                transition: 'all var(--transition-normal)',
                transform: 'translateY(0)',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-2xl)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
              }}>
                <div style={{
                  fontSize: 'var(--font-size-4xl)',
                  marginBottom: 'var(--spacing-lg)'
                }}>
                  {tech.icon}
                </div>
                <h3 className="text-heading-3" style={{ 
                  color: 'white', 
                  marginBottom: 'var(--spacing-md)' 
                }}>
                  {tech.title}
                </h3>
                <p className="text-body" style={{ 
                  color: 'rgba(255, 255, 255, 0.95)',
                  lineHeight: 'var(--line-height-relaxed)'
                }}>
                  {tech.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Data Sources & Methodology */}
        <div className={`${styles.contentSection} animate-fadeInUp animate-delay-3`} style={{
          background: 'var(--color-bg-secondary)',
          borderRadius: 'var(--radius-2xl)',
          padding: 'var(--spacing-4xl)',
          marginBottom: 'var(--spacing-4xl)',
          marginTop: 'var(--spacing-4xl)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-3xl)' }}>
            <h2 className="text-heading-1" style={{ marginBottom: 'var(--spacing-lg)' }}>
              Comprehensive Data Sources
            </h2>
            <p className="text-body-large" style={{ 
              maxWidth: '800px', 
              margin: '0 auto',
              color: 'var(--color-text-secondary)'
            }}>
              Systematic data acquisition from major preprint repositories with focus on life sciences, 
              ensuring thematically consistent and analytically rich datasets.
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: 'var(--spacing-xl)',
            marginBottom: 'var(--spacing-3xl)'
          }}>
            {[
              { name: 'bioRxiv', count: '239,847', desc: 'Biological sciences preprints', color: '#27ae60' },
              { name: 'medRxiv', count: '55,695', desc: 'Medical and health sciences', color: '#e74c3c' },
              { name: 'arXiv (q-bio)', count: '49,301', desc: 'Quantitative biology section', color: '#3498db' }
            ].map((source, index) => (
              <div key={index} className="card animate-fadeInUp" style={{
                animationDelay: `${0.4 + index * 0.1}s`,
                background: 'var(--color-bg-primary)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--spacing-xl)',
                textAlign: 'center',
                border: '1px solid var(--color-neutral-200)',
                borderTop: `4px solid ${source.color}`,
                boxShadow: 'var(--shadow-md)',
                transition: 'all var(--transition-normal)'
              }}>
                <h3 className="text-heading-3" style={{ 
                  marginBottom: 'var(--spacing-sm)',
                  color: source.color
                }}>
                  {source.name}
                </h3>
                <div style={{
                  fontSize: 'var(--font-size-3xl)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--spacing-sm)'
                }}>
                  {source.count}
                </div>
                <p className="text-body" style={{ color: 'var(--color-text-secondary)' }}>
                  {source.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{
            background: 'var(--color-bg-primary)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--spacing-2xl)',
            border: '1px solid var(--color-neutral-200)'
          }}>
            <h3 className="text-heading-3" style={{ 
              textAlign: 'center', 
              marginBottom: 'var(--spacing-xl)',
              color: 'var(--color-text-primary)'
            }}>
              AI-Powered Data Processing Pipeline
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: 'var(--spacing-lg)'
            }}>
              {[
                { step: '01', title: 'Data Acquisition', desc: 'Programmatic retrieval via dedicated APIs' },
                { step: '02', title: 'LLM Enhancement', desc: 'NVIDIA Nemotron-70B for metadata extraction' },
                { step: '03', title: 'Quality Assurance', desc: 'Validation and deduplication processes' },
                { step: '04', title: 'Database Integration', desc: 'Structured storage with optimized indexing' }
              ].map((process, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--spacing-md)'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'var(--color-primary)',
                    color: 'white',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-bold)',
                    flexShrink: 0
                  }}>
                    {process.step}
                  </div>
                  <div>
                    <h4 className="text-heading-4" style={{ 
                      marginBottom: 'var(--spacing-xs)',
                      color: 'var(--color-text-primary)'
                    }}>
                      {process.title}
                    </h4>
                    <p className="text-body-small" style={{ color: 'var(--color-text-secondary)' }}>
                      {process.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quality & Transparency Section */}
        <div className={`${styles.contentSection} animate-fadeInUp animate-delay-4`}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-3xl)' }}>
            <h2 className="text-heading-1" style={{ marginBottom: 'var(--spacing-lg)' }}>
              Quality & Transparency
            </h2>
            <p className="text-body-large" style={{ 
              maxWidth: '700px', 
              margin: '0 auto',
              color: 'var(--color-text-secondary)'
            }}>
              We maintain transparency about our methodology limitations and continuously work to improve data quality.
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: 'var(--spacing-xl)'
          }}>
            <div className="card" style={{
              background: 'var(--color-bg-primary)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--spacing-2xl)',
              border: '1px solid var(--color-neutral-200)',
              boxShadow: 'var(--shadow-md)'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, var(--color-success), #10b981)',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 'var(--spacing-lg)',
                fontSize: 'var(--font-size-2xl)'
              }}>
                ✓
              </div>
              <h3 className="text-heading-3" style={{ marginBottom: 'var(--spacing-md)' }}>Quality Metrics</h3>
              <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
                  <span>Data Accuracy</span>
                  <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>85-90%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
                  <span>Metadata Completeness</span>
                  <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>~90%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between)' }}>
                  <span>Geographic Coverage</span>
                  <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>50+ Countries</span>
                </div>
              </div>
              <p className="text-body-small" style={{ color: 'var(--color-text-secondary)' }}>
                Random sampling validation reveals 10-15% error rate, primarily due to LLM processing constraints.
              </p>
            </div>

            <div className="card" style={{
              background: 'var(--color-bg-primary)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--spacing-2xl)',
              border: '1px solid var(--color-neutral-200)',
              boxShadow: 'var(--shadow-md)'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, var(--color-warning), #f59e0b)',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 'var(--spacing-lg)',
                fontSize: 'var(--font-size-2xl)'
              }}>
                ⚠️
              </div>
              <h3 className="text-heading-3" style={{ marginBottom: 'var(--spacing-md)' }}>Known Limitations</h3>
              <ul style={{ 
                listStyle: 'none', 
                padding: 0, 
                margin: 0,
                marginBottom: 'var(--spacing-lg)'
              }}>
                <li style={{ marginBottom: 'var(--spacing-sm)', display: 'flex', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-warning)', marginRight: 'var(--spacing-sm)' }}>•</span>
                  <span>LLM processing limited to first two pages</span>
                </li>
                <li style={{ marginBottom: 'var(--spacing-sm)', display: 'flex', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-warning)', marginRight: 'var(--spacing-sm)' }}>•</span>
                  <span>Potential hallucination in missing affiliations</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-warning)', marginRight: 'var(--spacing-sm)' }}>•</span>
                  <span>Repository coverage limited to 3 major sources</span>
                </li>
              </ul>
              <p className="text-body-small" style={{ color: 'var(--color-text-secondary)' }}>
                Future development will focus on full-text processing and expanded repository integration.
              </p>
            </div>
          </div>
        </div>

        {/* Target Audience */}
        <div className={`${styles.contentSection} animate-fadeInUp animate-delay-5`} style={{
          marginTop: 'var(--spacing-4xl)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-3xl)' }}>
            <h2 className="text-heading-1" style={{ marginBottom: 'var(--spacing-lg)' }}>
              Empowering the Research Community
            </h2>
            <p className="text-body-large" style={{ 
              maxWidth: '700px', 
              margin: '0 auto',
              color: 'var(--color-text-secondary)'
            }}>
              Designed to serve various stakeholders in the global research ecosystem with actionable insights.
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: 'var(--spacing-xl)'
          }}>
            {[
              { 
                title: 'Researchers & Scientists', 
                desc: 'Analyze disciplinary adoption rates, discover collaboration opportunities, track research impact, and identify emerging trends in your field',
                gradient: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
                icon: '🔬'
              },
              { 
                title: 'Policy Makers & Institutions', 
                desc: 'Access data-driven insights for evidence-based policy decisions, assess institutional impact, and monitor global research output patterns',
                gradient: 'linear-gradient(135deg, var(--color-secondary), var(--color-secondary-light))',
                icon: '🏛️'
              },
              { 
                title: 'Data Scientists & Librarians', 
                desc: 'Integrate preprint metrics into institutional repositories, conduct bibliometric analysis, and develop research assessment tools',
                gradient: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-light))',
                icon: '📊'
              }
            ].map((audience, index) => (
              <div key={index} className="card animate-fadeInUp" style={{
                animationDelay: `${0.6 + index * 0.1}s`,
                background: audience.gradient,
                color: 'white',
                borderRadius: 'var(--radius-2xl)',
                padding: 'var(--spacing-3xl)',
                textAlign: 'center',
                boxShadow: 'var(--shadow-xl)',
                transition: 'all var(--transition-normal)',
                transform: 'translateY(0)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                e.currentTarget.style.boxShadow = 'var(--shadow-2xl)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
              }}>
                <div style={{
                  fontSize: 'var(--font-size-5xl)',
                  marginBottom: 'var(--spacing-lg)'
                }}>
                  {audience.icon}
                </div>
                <h3 className="text-heading-2" style={{ 
                  color: 'white', 
                  marginBottom: 'var(--spacing-lg)' 
                }}>
                  {audience.title}
                </h3>
                <p className="text-body-large" style={{ 
                  color: 'rgba(255, 255, 255, 0.95)',
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