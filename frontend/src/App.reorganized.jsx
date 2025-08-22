import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FaqPage from './pages/FaqPage';
import ExplorePage from './pages/ExplorePage';
import PaperDetailsPage from './pages/PaperDetailsPage';
import DocumentationPage from './pages/DocumentationPage';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        {/* Preview all reorganized pages */}
        <div style={{ 
          padding: 'var(--spacing-2xl)', 
          borderBottom: '2px solid var(--color-neutral-200)', 
          marginBottom: 'var(--spacing-2xl)',
          background: 'var(--color-bg-secondary)'
        }}>
          <h1 style={{ 
            color: 'var(--color-text-primary)', 
            marginBottom: 'var(--spacing-lg)',
            fontFamily: 'var(--font-family-display)',
            fontSize: 'var(--font-size-4xl)',
            fontWeight: 'var(--font-weight-bold)'
          }}>
            Reorganized Frontend Preview
          </h1>
          <p style={{ 
            color: 'var(--color-text-secondary)',
            fontSize: 'var(--font-size-lg)'
          }}>
            All pages have been reorganized with better component structure and restored original styling
          </p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3xl)' }}>
          {/* Home Page Preview */}
          <section>
            <h2 style={{ 
              color: 'var(--color-primary)', 
              marginBottom: 'var(--spacing-lg)',
              fontFamily: 'var(--font-family-display)',
              fontSize: 'var(--font-size-2xl)'
            }}>
              Home Page
            </h2>
            <div style={{ 
              border: '1px solid var(--color-neutral-200)', 
              borderRadius: 'var(--radius-xl)', 
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)'
            }}>
              <HomePage />
            </div>
          </section>

          {/* About Page Preview */}
          <section>
            <h2 style={{ 
              color: 'var(--color-primary)', 
              marginBottom: 'var(--spacing-lg)',
              fontFamily: 'var(--font-family-display)',
              fontSize: 'var(--font-size-2xl)'
            }}>
              About Page
            </h2>
            <div style={{ 
              border: '1px solid var(--color-neutral-200)', 
              borderRadius: 'var(--radius-xl)', 
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)'
            }}>
              <AboutPage />
            </div>
          </section>

          {/* Contact Page Preview */}
          <section>
            <h2 style={{ 
              color: 'var(--color-primary)', 
              marginBottom: 'var(--spacing-lg)',
              fontFamily: 'var(--font-family-display)',
              fontSize: 'var(--font-size-2xl)'
            }}>
              Contact Page
            </h2>
            <div style={{ 
              border: '1px solid var(--color-neutral-200)', 
              borderRadius: 'var(--radius-xl)', 
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)'
            }}>
              <ContactPage />
            </div>
          </section>

          {/* FAQ Page Preview */}
          <section>
            <h2 style={{ 
              color: 'var(--color-primary)', 
              marginBottom: 'var(--spacing-lg)',
              fontFamily: 'var(--font-family-display)',
              fontSize: 'var(--font-size-2xl)'
            }}>
              FAQ Page
            </h2>
            <div style={{ 
              border: '1px solid var(--color-neutral-200)', 
              borderRadius: 'var(--radius-xl)', 
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)'
            }}>
              <FaqPage />
            </div>
          </section>

          {/* Explore Page Preview */}
          <section>
            <h2 style={{ 
              color: 'var(--color-primary)', 
              marginBottom: 'var(--spacing-lg)',
              fontFamily: 'var(--font-family-display)',
              fontSize: 'var(--font-size-2xl)'
            }}>
              Explore Page
            </h2>
            <div style={{ 
              border: '1px solid var(--color-neutral-200)', 
              borderRadius: 'var(--radius-xl)', 
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)'
            }}>
              <ExplorePage />
            </div>
          </section>

          {/* Documentation Page Preview */}
          <section>
            <h2 style={{ 
              color: 'var(--color-primary)', 
              marginBottom: 'var(--spacing-lg)',
              fontFamily: 'var(--font-family-display)',
              fontSize: 'var(--font-size-2xl)'
            }}>
              Documentation Page
            </h2>
            <div style={{ 
              border: '1px solid var(--color-neutral-200)', 
              borderRadius: 'var(--radius-xl)', 
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)'
            }}>
              <DocumentationPage />
            </div>
          </section>

          {/* Paper Details Page Preview */}
          <section>
            <h2 style={{ 
              color: 'var(--color-primary)', 
              marginBottom: 'var(--spacing-lg)',
              fontFamily: 'var(--font-family-display)',
              fontSize: 'var(--font-size-2xl)'
            }}>
              Paper Details Page
            </h2>
            <div style={{ 
              border: '1px solid var(--color-neutral-200)', 
              borderRadius: 'var(--radius-xl)', 
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)'
            }}>
              <PaperDetailsPage />
            </div>
          </section>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;