import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import FaqPage from '../pages/FaqPage';
import ExplorePage from '../pages/ExplorePage';
import PaperDetailsPage from '../pages/PaperDetailsPage';
import DocumentationPage from '../pages/DocumentationPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/faq" element={<FaqPage />} />
      <Route path="/explore" element={<ExplorePage />} />
      <Route path="/paper/:id" element={<PaperDetailsPage />} />
      <Route path="/documentation" element={<DocumentationPage />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}

export default App;