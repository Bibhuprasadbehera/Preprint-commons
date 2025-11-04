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
              A dedicated database and visualization platform for large-scale preprint meta-analysis, 
              featuring over 344,000 preprints.
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
                <div style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 'var(--font-weight-bold)' }}>150+</div>
                <div style={{ fontSize: 'var(--font-size-lg)', opacity: 0.9 }}>Countries Covered</div>
              </div>
            </div>
          </div>
        </div>

        {/* Logo & Brand Identity Section */}
        <div className={`${styles.contentSection} animate-fadeInUp animate-delay-1`} style={{
          background: 'var(--color-bg-secondary)',
          borderRadius: 'var(--radius-2xl)',
          padding: 'var(--spacing-4xl)',
          marginBottom: 'var(--spacing-4xl)',
          border: '1px solid var(--color-neutral-200)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-3xl)' }}>
            <h2 className="text-heading-1" style={{ marginBottom: 'var(--spacing-lg)' }}>
              About the logo and name of the platform
            </h2>
          </div>

          {/* Logo Display */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 'var(--spacing-4xl)'
          }}>
            <img 
              src="/images/preprint_commons_logo2.svg" 
              alt="Preprint Commons Logo" 
              style={{
                maxWidth: '500px',
                width: '100%',
                height: 'auto'
              }}
            />
          </div>

          {/* Logo Explanation */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: 'var(--spacing-3xl)',
            marginBottom: 'var(--spacing-2xl)'
          }}>
            {/* Icon Story */}
            <div className="card" style={{
              background: 'linear-gradient(135deg, #5599ff 0%, #3737c8 100%)',
              color: 'white',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--spacing-2xl)',
              boxShadow: 'var(--shadow-xl)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: 'var(--spacing-xl)'
              }}>
                <img 
                  src="/images/preprint_commons_icon.svg" 
                  alt="Logo Icon" 
                  style={{
                    width: '120px',
                    height: 'auto',
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                  }}
                />
              </div>
              <h3 className="text-heading-3" style={{ 
                color: 'white', 
                marginBottom: 'var(--spacing-lg)',
                textAlign: 'center'
              }}>
                The Icon
              </h3>
              <p className="text-body" style={{ 
                color: 'rgba(255, 255, 255, 0.95)',
                lineHeight: 'var(--line-height-relaxed)',
                textAlign: 'left'
              }}>
                The Preprint Commons logo icon is a visual representation of generational transition and commitment to open science. It features a stack of distinct layers, deliberately using contrasting tones to separate the established past from the ambitious future.
              </p>
              <p className="text-body" style={{ 
                color: 'rgba(255, 255, 255, 0.95)',
                lineHeight: 'var(--line-height-relaxed)',
                marginTop: 'var(--spacing-md)',
                textAlign: 'left'
              }}>
                The lower layer represents the preceding generation and its established methods. Resting above it is a brighter layer, symbolizing the new generation of scientists and graduates which has not settled yet. This visual contrast underscores a crucial paradigm shift, ready to challenge existing norms by wholeheartedly embracing new ideas, specifically the use of preprints.
              </p>
              <p className="text-body" style={{ 
                color: 'rgba(255, 255, 255, 0.95)',
                lineHeight: 'var(--line-height-relaxed)',
                marginTop: 'var(--spacing-md)',
                textAlign: 'left'
              }}>
                The shape of the stacked sheets subtly evokes graduation caps, symbolizing the academic mantle being passed. This entire structure signifies the platform's core mission: empowering the new generation to drive the democratization of science and build a truly accessible "Commons" for research.
              </p>
            </div>

            {/* Name Story */}
            <div className="card" style={{
              background: 'var(--color-bg-primary)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--spacing-2xl)',
              border: '1px solid var(--color-neutral-200)',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <h3 className="text-heading-3" style={{ 
                marginBottom: 'var(--spacing-lg)',
                color: 'var(--color-text-primary)',
                textAlign: 'center'
              }}>
                Why "Preprint Commons"?
              </h3>
              <p className="text-body" style={{ 
                lineHeight: 'var(--line-height-relaxed)',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--spacing-xl)'
              }}>
                The name was chosen to communicate both our focus and our foundational mission.
              </p>
              
              <div style={{
                background: 'var(--color-bg-secondary)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--spacing-xl)',
                marginBottom: 'var(--spacing-lg)',
                borderLeft: '4px solid var(--color-primary)'
              }}>
                <h4 className="text-heading-4" style={{ 
                  marginBottom: 'var(--spacing-md)',
                  color: 'var(--color-primary)'
                }}>
                  "Preprint"
                </h4>
                <p className="text-body" style={{ 
                  lineHeight: 'var(--line-height-relaxed)',
                  color: 'var(--color-text-secondary)'
                }}>
                  Clearly defines the core subject matter—rapid, open, and early communication of research. This signals our commitment to advancing the modern scientific publishing workflow and accelerating the pace of discovery.
                </p>
              </div>

              <div style={{
                background: 'var(--color-bg-secondary)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--spacing-xl)',
                borderLeft: '4px solid var(--color-secondary)'
              }}>
                <h4 className="text-heading-4" style={{ 
                  marginBottom: 'var(--spacing-md)',
                  color: 'var(--color-secondary)'
                }}>
                  "Commons"
                </h4>
                <p className="text-body" style={{ 
                  lineHeight: 'var(--line-height-relaxed)',
                  color: 'var(--color-text-secondary)'
                }}>
                  A deliberate choice rooted in the concept of a shared public resource, historically lands or resources accessible to all members of a community. In the digital age, it signifies a shared, accessible, and democratized space for knowledge.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Open Science Philosophy Section */}
        <div className={`${styles.contentSection} animate-fadeInUp animate-delay-3`}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-3xl)' }}>
            <h2 className="text-heading-1" style={{ marginBottom: 'var(--spacing-lg)' }}>
              Our Mission & Commitment to Open Science
            </h2>
            <p className="text-body-large" style={{ 
              maxWidth: '900px', 
              margin: '0 auto var(--spacing-md)',
              color: 'var(--color-text-secondary)'
            }}>
              To address the critical gap in preprint ecosystem analysis by providing a centralized platform 
              for large-scale meta-analysis, enabling cross-disciplinary trend analysis and comparative impact assessment.
            </p>
            <p className="text-body-large" style={{ 
              maxWidth: '900px', 
              margin: '0 auto',
              color: 'var(--color-text-secondary)'
            }}>
              At Preprint Commons, we believe that knowledge should be freely accessible to all. 
              Our commitment to open science is reflected in every aspect of our platform.
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: 'var(--spacing-xl)'
          }}>
            {[
              { 
                icon: '🌐', 
                title: 'Open Access', 
                desc: 'Complete dataset available via public REST API with bulk download options in JSON and CSV formats. No paywalls, no registration barriers.',
                gradient: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-light))'
              },
              { 
                icon: '🔍', 
                title: 'Transparency', 
                desc: 'Full methodology documentation with known limitations clearly stated and validation metrics publicly shared.',
                gradient: 'linear-gradient(135deg, var(--color-secondary), var(--color-secondary-light))'
              },
              { 
                icon: '🤝', 
                title: 'Community-Driven', 
                desc: 'Built by researchers, for researchers with feedback-driven development and a collaborative approach to data quality.',
                gradient: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))'
              },
              { 
                icon: '📊', 
                title: 'Reproducible Research', 
                desc: 'Comprehensive API documentation with structured data formats and version-controlled datasets for reproducibility.',
                gradient: 'linear-gradient(135deg, #f59e0b, #f97316)'
              },
              { 
                icon: '💡', 
                title: 'Democratizing Science', 
                desc: 'Empowering the next generation of researchers, breaking down barriers to research insights, and making preprint analytics accessible globally.',
                gradient: 'linear-gradient(135deg, var(--color-success), #10b981)'
              },
              { 
                icon: '🚀', 
                title: 'Accelerating Discovery', 
                desc: 'Supporting rapid dissemination of research findings and enabling faster scientific progress through open preprint data.',
                gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)'
              }
            ].map((principle, index) => (
              <div key={index} className="card animate-fadeInUp" style={{
                animationDelay: `${0.3 + index * 0.1}s`,
                background: principle.gradient,
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
                  {principle.icon}
                </div>
                <h3 className="text-heading-3" style={{ 
                  color: 'white', 
                  marginBottom: 'var(--spacing-md)' 
                }}>
                  {principle.title}
                </h3>
                <p className="text-body" style={{ 
                  color: 'rgba(255, 255, 255, 0.95)',
                  lineHeight: 'var(--line-height-relaxed)'
                }}>
                  {principle.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Data Sources - Brief Overview */}
        <div className={`${styles.contentSection} animate-fadeInUp animate-delay-4`} style={{
          background: 'var(--color-bg-secondary)',
          borderRadius: 'var(--radius-2xl)',
          padding: 'var(--spacing-3xl)',
          marginBottom: 'var(--spacing-4xl)',
          marginTop: 'var(--spacing-4xl)',
          textAlign: 'center'
        }}>
          <h2 className="text-heading-2" style={{ marginBottom: 'var(--spacing-lg)' }}>
            Data Sources
          </h2>
          <p className="text-body-large" style={{ 
            maxWidth: '700px', 
            margin: '0 auto var(--spacing-xl)',
            color: 'var(--color-text-secondary)'
          }}>
            We aggregate preprints from three major repositories: <strong>bioRxiv</strong> (239,847), 
            <strong> medRxiv</strong> (55,695), and <strong>arXiv q-bio</strong> (49,301).
          </p>
          <a 
            href="/documentation#sources" 
            style={{
              display: 'inline-block',
              color: 'var(--color-primary)',
              textDecoration: 'none',
              fontWeight: 'var(--font-weight-semibold)',
              fontSize: 'var(--font-size-lg)',
              padding: 'var(--spacing-md) var(--spacing-xl)',
              background: 'var(--color-bg-primary)',
              borderRadius: 'var(--radius-lg)',
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: 'var(--spacing-xl)'
          }}>
            {[
              { 
                title: 'Researchers & Scientists', 
                desc: 'Analyze disciplinary adoption rates, discover collaboration opportunities, track research impact, and identify emerging trends in your field',
                gradient: 'linear-gradient(135deg, #f0b95aff, #fbbf24)',
                icon: '🔬'
              },
              { 
                title: 'Graduate Students & Early Career Researchers', 
                desc: 'Explore research landscapes, identify trending topics, discover potential collaborators, and understand publication patterns in your field',
                gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                icon: '🎓'
              },
              { 
                title: 'Data Scientists & Developers', 
                desc: 'Access comprehensive APIs for custom analytics, integrate preprint data into applications, and build innovative research tools',
                gradient: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-light))',
                icon: '💻'
              },
              { 
                title: 'Academic Publishers & Editors', 
                desc: 'Monitor research trends, assess publication patterns, understand preprint adoption, and support open science initiatives',
                gradient: 'linear-gradient(135deg, var(--color-secondary), var(--color-secondary-light))',
                icon: '📖'
              },
              { 
                title: 'International Research Organizations', 
                desc: 'Monitor global research trends, identify regional strengths, track collaborative networks, and assess worldwide scientific output',
                gradient: 'linear-gradient(135deg, #10b981, #34d399)',
                icon: '🌍'
              },
              { 
                title: 'Open Science Advocates & Communities', 
                desc: 'Support preprint adoption, promote research transparency, track open science growth, and advocate for accessible knowledge',
                gradient: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
                icon: '🤝'
              }
            ].map((audience, index) => (
              <div key={index} className="card animate-fadeInUp" style={{
                animationDelay: `${0.6 + index * 0.1}s`,
                background: audience.gradient,
                color: 'white',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--spacing-2xl)',
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
                  fontSize: 'var(--font-size-4xl)',
                  marginBottom: 'var(--spacing-lg)'
                }}>
                  {audience.icon}
                </div>
                <h3 className="text-heading-3" style={{ 
                  color: 'white', 
                  marginBottom: 'var(--spacing-md)' 
                }}>
                  {audience.title}
                </h3>
                <p className="text-body" style={{ 
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