import { useState } from 'react';
import ApiService from '../services/api';

const RESULTS_PER_PAGE = 20;
const MAX_RESULTS = 200;

export const useAuthorSearch = () => {
  const [authorQuery, setAuthorQuery] = useState('');
  const [authorResults, setAuthorResults] = useState([]);
  const [isAuthorLoading, setIsAuthorLoading] = useState(false);
  const [authorCurrentPage, setAuthorCurrentPage] = useState(1);
  const [authorTotalPages, setAuthorTotalPages] = useState(0);
  const [authorTotalResults, setAuthorTotalResults] = useState(0);
  const [hasAuthorSearched, setHasAuthorSearched] = useState(false);

  const handleAuthorSearch = async (page = 1, attemptNumber = 1) => {
    if (!authorQuery.trim()) return;

    setIsAuthorLoading(true);
    setAuthorCurrentPage(page);

    try {
      console.log(`Searching authors: "${authorQuery}" page ${page} (attempt ${attemptNumber})`);
      const data = await ApiService.searchAuthors(authorQuery, page, RESULTS_PER_PAGE);
      console.log('Author search results:', data);

      const results = data.papers || [];
      const total = Math.min(data.total || results.length, MAX_RESULTS);

      setAuthorResults(results);
      setAuthorTotalResults(total);
      setAuthorTotalPages(Math.ceil(total / RESULTS_PER_PAGE));
      setHasAuthorSearched(true);
      setIsAuthorLoading(false);
    } catch (error) {
      console.error(`Author search error (attempt ${attemptNumber}):`, error);
      
      if (attemptNumber < 3) {
        const delay = Math.pow(2, attemptNumber - 1) * 1000;
        console.log(`Retrying author search in ${delay}ms...`);
        
        setTimeout(() => {
          handleAuthorSearch(page, attemptNumber + 1);
        }, delay);
      } else {
        setAuthorResults([]);
        setAuthorTotalResults(0);
        setAuthorTotalPages(0);
        setHasAuthorSearched(true);
        setIsAuthorLoading(false);
      }
    }
  };

  const handleAuthorPageChange = (page) => {
    handleAuthorSearch(page);
    document.getElementById('author-search-results')?.scrollIntoView({ behavior: 'smooth' });
  };

  const resetAuthorSearch = () => {
    setAuthorQuery('');
    setAuthorResults([]);
    setAuthorCurrentPage(1);
    setAuthorTotalPages(0);
    setAuthorTotalResults(0);
    setHasAuthorSearched(false);
  };

  return {
    authorQuery,
    setAuthorQuery,
    authorResults,
    isAuthorLoading,
    authorCurrentPage,
    authorTotalPages,
    authorTotalResults,
    hasAuthorSearched,
    handleAuthorSearch,
    handleAuthorPageChange,
    resetAuthorSearch,
  };
};
