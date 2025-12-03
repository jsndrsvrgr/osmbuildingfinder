/**
 * Live bus marker component for the map
 */
import React from 'react';
import { Marker } from 'react-native-maps';
import { View, Text, StyleSheet } from 'react-native';

const ROUTE_COLORS = {
  '201': '#996633',  // Brown
  '205': '#DC143C',  // Red
  '208': '#1E90FF',  // Blue
  '213': '#228B22',  // Green
};

export const BusMarker = ({ bus, isSelected = false, onPress }) => {
  const routeColor = ROUTE_COLORS[bus.route] || '#FF6B00';

  return (
    <Marker
      coordinate={{
        latitude: bus.lat,
        longitude: bus.lon,
      }}
      rotation={bus.heading}
      anchor={{ x: 0.5, y: 0.5 }}
      flat
      onPress={onPress}
    >
      <View style={[
        styles.busIcon,
        { backgroundColor: routeColor },
        isSelected && styles.busIconSelected
      ]}>
        <Text style={styles.busText}>{bus.route}</Text>
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  busIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  busText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  busIconSelected: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#6200EE',
    transform: [{ scale: 1.2 }],
  },
});
