/**
 * Building marker component for the map
 */
import React from 'react';
import { Marker, Callout } from 'react-native-maps';
import { View, Text, StyleSheet } from 'react-native';

export const BuildingMarker = ({ building, onPress }) => {
  return (
    <Marker
      coordinate={{
        latitude: building.lat,
        longitude: building.lon,
      }}
      pinColor="#6200EE"
      onPress={() => onPress && onPress(building)}
    >
      <Callout>
        <View style={styles.callout}>
          <Text style={styles.buildingName}>{building.name}</Text>
          {building.address && (
            <Text style={styles.address}>{building.address}</Text>
          )}
        </View>
      </Callout>
    </Marker>
  );
};

const styles = StyleSheet.create({
  callout: {
    width: 200,
    padding: 5,
  },
  buildingName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  address: {
    fontSize: 12,
    color: '#666',
  },
});
