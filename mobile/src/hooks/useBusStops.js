/**
 * Hook for fetching bus stops
 */
import { useState, useEffect } from 'react';
import { getBusStops } from '../services/api';

export const useBusStops = () => {
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStops();
  }, []);

  const fetchStops = async () => {
    try {
      setLoading(true);
      const data = await getBusStops();
      setStops(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching bus stops:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    stops,
    loading,
    error,
    refetch: fetchStops,
  };
};
