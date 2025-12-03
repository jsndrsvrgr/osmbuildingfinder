/**
 * Route Polyline Component
 * Renders bus route paths on the map
 */
import React from 'react';
import { Polyline } from 'react-native-maps';

const ROUTE_COLORS = {
  '201': '#996633',  // Brown
  '205': '#DC143C',  // Red
  '208': '#1E90FF',  // Blue
  '213': '#228B22',  // Green
};

export const RoutePolyline = ({ route, geometry, opacity = 0.7 }) => {
  if (!geometry || !geometry.geometry) {
    return null;
  }

  // Get all direction geometries (northbound, southbound, etc.)
  const directions = Object.keys(geometry.geometry);

  return (
    <>
      {directions.map((direction) => {
        const coordinates = geometry.geometry[direction];

        if (!coordinates || coordinates.length === 0) {
          return null;
        }

        // Convert from {lat, lon} to {latitude, longitude}
        const formattedCoords = coordinates.map((coord) => ({
          latitude: coord.lat,
          longitude: coord.lon,
        }));

        return (
          <Polyline
            key={`${route.id}-${direction}`}
            coordinates={formattedCoords}
            strokeColor={ROUTE_COLORS[route.id] || '#666666'}
            strokeWidth={4}
            lineJoin="round"
            lineCap="round"
            geodesic
            zIndex={1}
            tappable={false}
          />
        );
      })}
    </>
  );
};
