/**
 * Hook for fetching route geometry
 */
import { useState, useEffect } from 'react';
import { getRouteGeometry } from '../services/api';

export const useRouteGeometry = (routeId) => {
  const [geometry, setGeometry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!routeId) return;

    fetchGeometry();
  }, [routeId]);

  const fetchGeometry = async () => {
    try {
      setLoading(true);
      const data = await getRouteGeometry(routeId);
      setGeometry(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching route geometry:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    geometry,
    loading,
    error,
    refetch: fetchGeometry,
  };
};
