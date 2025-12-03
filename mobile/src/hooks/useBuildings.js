/**
 * Hook for fetching buildings
 */
import { useState, useEffect } from 'react';
import { getBuildings } from '../services/api';

export const useBuildings = () => {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBuildings();
  }, []);

  const fetchBuildings = async () => {
    try {
      setLoading(true);
      const data = await getBuildings();
      setBuildings(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching buildings:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    buildings,
    loading,
    error,
    refetch: fetchBuildings,
  };
};
