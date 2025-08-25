import { useState, useEffect } from 'react';
import ApiService from '../services/api';
import { API_BASE_URL } from '../utils/api';

export const useSubjectAnalysis = (activeTab) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedSubject2, setSelectedSubject2] = useState(null);
  const [subjectOptions, setSubjectOptions] = useState([{ value: '', label: 'All Subjects' }]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [subjectsError, setSubjectsError] = useState(null);
  const [subjectAnalysis, setSubjectAnalysis] = useState({
    evolutionData: [],
    citationRanking: [],
    versionDistribution: [],
    versionDistributionBySubject: [],
    versionSummary: null,
    metadata: {}
  });
  const [subjectLoadingLocal, setSubjectLoadingLocal] = useState(false);
  const [subjectErrorLocal, setSubjectErrorLocal] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (activeTab === 'subjects' && subjectOptions.length <= 1 && !subjectsLoading) {
      setSubjectsLoading(true);
      ApiService.getSubjects()
        .then((res) => {
          const opts = [
            { value: '', label: 'All Subjects' },
            ...((res?.data || []).map((s) => ({ value: s, label: s.split(' ').map(w => w.charAt(0).toUpperCase()+w.slice(1)).join(' ') })))
          ];
          setSubjectOptions(opts);
        })
        .catch((e) => setSubjectsError(String(e)))
        .finally(() => setSubjectsLoading(false));
    }
  }, [activeTab, subjectsLoading, subjectOptions.length]);

  const handleSubjectSearchClickLocal = async () => {
    setIsSearching(true);
    setSubjectErrorLocal(null);
    setSubjectLoadingLocal(true);
    try {
      const params = new URLSearchParams();
      if (selectedTimeRange) params.append('time_range', selectedTimeRange);
      const subjectsList = [selectedSubject, selectedSubject2].filter(Boolean);
      if (subjectsList.length > 0) {
        params.append('subjects', subjectsList.join(','));
      } else if (selectedSubject) {
        params.append('subject', selectedSubject);
      }
      params.append('top', '10');
      const res = await fetch(`${API_BASE_URL}/api/subjects/analysis?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setSubjectAnalysis(json);
    } catch (e) {
      setSubjectErrorLocal(String(e));
      setSubjectAnalysis({ evolutionData: [], citationRanking: [], versionDistribution: [], versionDistributionBySubject: [], versionSummary: null, metadata: {} });
    } finally {
      setSubjectLoadingLocal(false);
      setIsSearching(false);
    }
  };

  const handleExportData = () => {
    const exportData = {
      filters: { timeRange: selectedTimeRange, subjects: [selectedSubject, selectedSubject2].filter(Boolean) },
      subjectAnalysis
    };
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `subject-analysis-${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return {
    selectedTimeRange,
    setSelectedTimeRange,
    selectedSubject,
    setSelectedSubject,
    selectedSubject2,
    setSelectedSubject2,
    subjectOptions,
    subjectsLoading,
    subjectsError,
    subjectAnalysis,
    subjectLoadingLocal,
    subjectErrorLocal,
    isSearching,
    handleSubjectSearchClickLocal,
    handleExportData,
  };
};
