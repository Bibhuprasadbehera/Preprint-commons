import { useState, useCallback } from 'react';
import { retryWithBackoff } from '../utils/api';

// This hook targets the modular API route mounted at /api/subjects/analysis via the frontend's service base
const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api/subjects/analysis'
  : 'http://localhost:8000/api/subjects/analysis';

export const useSubjectAnalysisData = () => {
  const [data, setData] = useState({
    evolutionData: [],
    citationRanking: [],
    versionDistribution: [],
    versionSummary: null,
    metadata: {}
  });

  const [loading, setLoading] = useState({
    evolutionData: false,
    citationRanking: false,
    versionDistribution: false,
    versionSummary: false
  });

  const [error, setError] = useState({
    evolutionData: null,
    citationRanking: null,
    versionDistribution: null,
    versionSummary: null
  });

  const [retryCount, setRetryCount] = useState(0);

  const fetchAll = useCallback(async (timeRange = 'all', subject = null, top = 10) => {
    // Reset state
    setLoading({
      evolutionData: true,
      citationRanking: true,
      versionDistribution: true,
      versionSummary: true
    });
    setError({
      evolutionData: null,
      citationRanking: null,
      versionDistribution: null,
      versionSummary: null
    });
    setData({
      evolutionData: [],
      citationRanking: [],
      versionDistribution: [],
      versionSummary: null,
      metadata: {}
    });
    setRetryCount(0);

    const fetchFn = async () => {
      const params = new URLSearchParams();
      if (timeRange) params.append('time_range', timeRange);
      if (subject) params.append('subject', subject);
      params.append('top', String(top));

      const url = `${API_URL}?${params.toString()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      return res.json();
    };

    try {
      const result = await retryWithBackoff(fetchFn, 3, 1000);
      setData({
        evolutionData: result.evolutionData || [],
        citationRanking: result.citationRanking || [],
        versionDistribution: result.versionDistribution || [],
        versionSummary: result.versionSummary || null,
        metadata: result.metadata || {}
      });
      setError({
        evolutionData: null,
        citationRanking: null,
        versionDistribution: null,
        versionSummary: null
      });
    } catch (err) {
      const msg = err.message || 'Failed to fetch subject analysis data';
      setError({
        evolutionData: msg,
        citationRanking: msg,
        versionDistribution: msg,
        versionSummary: msg
      });
      setData({
        evolutionData: [],
        citationRanking: [],
        versionDistribution: [],
        versionSummary: null,
        metadata: {}
      });
      setRetryCount((c) => c + 1);
    } finally {
      setLoading({
        evolutionData: false,
        citationRanking: false,
        versionDistribution: false,
        versionSummary: false
      });
    }
  }, []);

  const clear = useCallback(() => {
    setData({
      evolutionData: [],
      citationRanking: [],
      versionDistribution: [],
      versionSummary: null,
      metadata: {}
    });
    setError({
      evolutionData: null,
      citationRanking: null,
      versionDistribution: null,
      versionSummary: null
    });
    setRetryCount(0);
  }, []);

  return { data, loading, error, fetchAll, clear, retryCount };
};
