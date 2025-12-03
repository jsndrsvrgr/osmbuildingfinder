/**
 * Hook for live bus tracking with automatic updates
 */
import { useState, useEffect } from 'react';
import { getLiveBuses } from '../services/api';
import { BUS_UPDATE_INTERVAL } from '../constants/config';

export const useLiveBuses = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch immediately
    fetchBuses();

    // Set up interval for updates
    const interval = setInterval(() => {
      fetchBuses();
    }, BUS_UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const fetchBuses = async () => {
    try {
      const data = await getLiveBuses();
      setBuses(data);
      setError(null);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching live buses:', err);
      setLoading(false);
    }
  };

  return {
    buses,
    loading,
    error,
    refetch: fetchBuses,
  };
};
