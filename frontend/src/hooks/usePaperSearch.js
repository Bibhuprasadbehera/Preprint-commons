import { useState } from 'react';
import ApiService from '../services/api';

const RESULTS_PER_PAGE = 20;
const MAX_RESULTS = 200;

export const usePaperSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (page = 1, attemptNumber = 1) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setCurrentPage(page);

    try {
      console.log(`Searching papers: "${searchQuery}" page ${page} (attempt ${attemptNumber})`);
      const data = await ApiService.searchPapers(searchQuery, page, RESULTS_PER_PAGE);
      console.log('Search results:', data);

      const results = data.papers || [];
      const total = Math.min(data.total || results.length, MAX_RESULTS);

      setSearchResults(results);
      setTotalResults(total);
      setTotalPages(Math.ceil(total / RESULTS_PER_PAGE));
      setHasSearched(true);
      setIsLoading(false);
    } catch (error) {
      console.error(`Search error (attempt ${attemptNumber}):`, error);
      
      if (attemptNumber < 3) {
        const delay = Math.pow(2, attemptNumber - 1) * 1000;
        console.log(`Retrying search in ${delay}ms...`);
        
        setTimeout(() => {
          handleSearch(page, attemptNumber + 1);
        }, delay);
      } else {
        setSearchResults([]);
        setTotalResults(0);
        setTotalPages(0);
        setHasSearched(true);
        setIsLoading(false);
      }
    }
  };

  const handlePageChange = (page) => {
    handleSearch(page);
    document.getElementById('search-results')?.scrollIntoView({ behavior: 'smooth' });
  };

  const resetSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setCurrentPage(1);
    setTotalPages(0);
    setTotalResults(0);
    setHasSearched(false);
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isLoading,
    currentPage,
    totalPages,
    totalResults,
    hasSearched,
    handleSearch,
    handlePageChange,
    resetSearch,
  };
};
