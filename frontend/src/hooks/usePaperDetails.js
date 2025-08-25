import { useState, useEffect } from 'react';
import ApiService from '../services/api';

export const usePaperDetails = (id) => {
  const [paper, setPaper] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchPaper = async (attemptNumber = 1) => {
    try {
      console.log(`Fetching paper with ID: ${id} (attempt ${attemptNumber})`);
      setError(null);
      
      const data = await ApiService.getPaper(id);
      console.log('Paper data received:', data);
      
      if (!data) {
        throw new Error('No paper data received');
      }
      
      setPaper(data);
      setIsLoading(false);
      setRetryCount(0);
    } catch (error) {
      console.error(`Error fetching paper (attempt ${attemptNumber}):`, error);
      
      if (attemptNumber < 3) {
        const delay = Math.pow(2, attemptNumber - 1) * 1000;
        console.log(`Retrying in ${delay}ms...`);
        
        setTimeout(() => {
          fetchPaper(attemptNumber + 1);
        }, delay);
      } else {
        setError('Failed to load paper information');
        setIsLoading(false);
        setRetryCount(attemptNumber - 1);
      }
    }
  };

  const handleManualRetry = () => {
    setIsLoading(true);
    setPaper(null);
    setError(null);
    fetchPaper(1);
  };

  useEffect(() => {
    setIsLoading(true);
    setPaper(null);
    setError(null);
    fetchPaper(1);
  }, [id]);

  return {
    paper,
    isLoading,
    error,
    retryCount,
    handleManualRetry,
  };
};
