/**
 * API Service for Northwestern Bus Finder
 * Handles all communication with backend API
 */
import axios from 'axios';
import { API_CONFIG } from '../constants/config';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Get all buildings
 */
export const getBuildings = async () => {
  try {
    const response = await api.get('/buildings');
    return response.data;
  } catch (error) {
    console.error('Error fetching buildings:', error);
    throw error;
  }
};

/**
 * Search buildings by name
 */
export const searchBuildings = async (query) => {
  try {
    const response = await api.get('/buildings/search', {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching buildings:', error);
    throw error;
  }
};

/**
 * Get building details with nearest stops
 */
export const getBuildingDetails = async (buildingId) => {
  try {
    const response = await api.get(`/buildings/${buildingId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching building details:', error);
    throw error;
  }
};

/**
 * Get all bus stops near Northwestern
 */
export const getBusStops = async () => {
  try {
    const response = await api.get('/bus-stops');
    return response.data;
  } catch (error) {
    console.error('Error fetching bus stops:', error);
    throw error;
  }
};

/**
 * Get nearest bus stops to a location
 */
export const getNearestStops = async (lat, lon) => {
  try {
    const response = await api.get('/bus-stops/nearest', {
      params: { lat, lon },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching nearest stops:', error);
    throw error;
  }
};

/**
 * Get CTA routes near Northwestern
 */
export const getRoutes = async () => {
  try {
    const response = await api.get('/routes');
    return response.data;
  } catch (error) {
    console.error('Error fetching routes:', error);
    throw error;
  }
};

/**
 * Get live bus positions for all NU-area routes
 */
export const getLiveBuses = async () => {
  try {
    const response = await api.get('/buses/live');
    return response.data;
  } catch (error) {
    console.error('Error fetching live buses:', error);
    throw error;
  }
};

/**
 * Get live bus positions for a specific route
 */
export const getRouteBuses = async (routeId) => {
  try {
    const response = await api.get(`/routes/${routeId}/buses`);
    return response.data;
  } catch (error) {
    console.error('Error fetching route buses:', error);
    throw error;
  }
};

/**
 * Get predictions for a specific stop
 */
export const getStopPredictions = async (stopId) => {
  try {
    const response = await api.get(`/bus-stops/${stopId}/predictions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching stop predictions:', error);
    throw error;
  }
};

/**
 * Get route geometry (polyline coordinates)
 */
export const getRouteGeometry = async (routeId) => {
  try {
    const response = await api.get(`/routes/${routeId}/geometry`);
    return response.data;
  } catch (error) {
    console.error('Error fetching route geometry:', error);
    throw error;
  }
};

export default api;
