import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8000';

export const useSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`${API_BASE_URL}/subjects`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('✅ Subjects data received:', result);
        
        // Transform subjects into options format
        const subjectOptions = [
          { value: '', label: 'All Subjects' },
          ...result.data.map(subject => ({
            value: subject,
            label: subject.split(' ').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')
          }))
        ];
        
        setSubjects(subjectOptions);
      } catch (err) {
        console.error('💥 Subjects fetch error:', err);
        setError(err.message);
        
        // Fallback to hardcoded subjects if API fails
        const fallbackSubjects = [
          { value: '', label: 'All Subjects' },
          { value: 'bioinformatics', label: 'Bioinformatics' },
          { value: 'molecular biology', label: 'Molecular Biology' },
          { value: 'neuroscience', label: 'Neuroscience' },
          { value: 'genomics', label: 'Genomics' },
          { value: 'immunology', label: 'Immunology' }
        ];
        setSubjects(fallbackSubjects);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  return { subjects, loading, error };
};