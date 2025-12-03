/**
 * Hook for fetching building details with nearest bus stops
 */
import { useState, useEffect } from 'react';
import { getBuildingDetails } from '../services/api';

export const useBuildingDetails = (buildingId) => {
  const [buildingDetails, setBuildingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!buildingId) return;

    fetchBuildingDetails();

    // Refresh predictions every 30 seconds
    const interval = setInterval(() => {
      fetchBuildingDetails();
    }, 30000);

    return () => clearInterval(interval);
  }, [buildingId]);

  const fetchBuildingDetails = async () => {
    try {
      setLoading(true);
      const data = await getBuildingDetails(buildingId);
      setBuildingDetails(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching building details:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    buildingDetails,
    loading,
    error,
    refetch: fetchBuildingDetails,
  };
};
