/**
 * Building Detail Modal
 * Shows detailed information about a building including nearest bus stops
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Linking,
} from 'react-native';
import { useBuildingDetails } from '../hooks/useBuildingDetails';
import { useLocation } from '../hooks/useLocation';

export default function BuildingDetailModal({ route, navigation }) {
  const { buildingId } = route.params;
  const { buildingDetails, loading, error } = useBuildingDetails(buildingId);
  const { latitude: userLat, longitude: userLon } = useLocation();

  const openDirections = (lat, lon, label) => {
    const scheme = Platform.select({
      ios: 'maps://',
      android: 'geo:',
    });
    const url = Platform.select({
      ios: `${scheme}?daddr=${lat},${lon}&q=${encodeURIComponent(label)}`,
      android: `${scheme}${lat},${lon}?q=${encodeURIComponent(label)}`,
    });
    Linking.openURL(url);
  };

  if (loading && !buildingDetails) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6200EE" />
        <Text style={styles.loadingText}>Loading building details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const building = buildingDetails?.building;
  const nearestStops = buildingDetails?.nearest_stops;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.buildingName}>{building?.name}</Text>
          {building?.address && (
            <Text style={styles.address}>{building.address}</Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Building Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 Location</Text>
          <Text style={styles.infoText}>
            Coordinates: {building?.lat.toFixed(5)}, {building?.lon.toFixed(5)}
          </Text>
          <Text style={styles.infoText}>
            Perimeter Nodes: {building?.node_count}
          </Text>
        </View>

        {/* Nearest Bus Stops */}
        {nearestStops && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🚌 Nearest Bus Stops</Text>

            {/* Northbound Stop */}
            {nearestStops.northbound && (
              <View style={styles.stopCard}>
                <View style={styles.stopHeader}>
                  <Text style={styles.stopDirection}>↑ Northbound</Text>
                  <Text style={styles.stopRoute}>
                    Route {nearestStops.northbound.stop.route}
                  </Text>
                </View>
                <Text style={styles.stopName}>
                  {nearestStops.northbound.stop.name}
                </Text>
                <Text style={styles.stopLocation}>
                  {nearestStops.northbound.stop.location}
                </Text>
                <Text style={styles.stopDistance}>
                  📏 {nearestStops.northbound.stop.distance?.toFixed(2)} miles away
                </Text>

                {/* Predictions */}
                {nearestStops.northbound.predictions?.length > 0 && (
                  <View style={styles.predictions}>
                    <Text style={styles.predictionsTitle}>Next Buses:</Text>
                    {nearestStops.northbound.predictions.map((pred, idx) => (
                      <Text key={idx} style={styles.predictionText}>
                        🚌 Route {pred.route} - {pred.minutes} min
                      </Text>
                    ))}
                  </View>
                )}

                <TouchableOpacity
                  style={styles.directionsButton}
                  onPress={() =>
                    openDirections(
                      nearestStops.northbound.stop.lat,
                      nearestStops.northbound.stop.lon,
                      nearestStops.northbound.stop.name
                    )
                  }
                >
                  <Text style={styles.directionsButtonText}>
                    Get Directions →
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Southbound Stop */}
            {nearestStops.southbound && (
              <View style={styles.stopCard}>
                <View style={styles.stopHeader}>
                  <Text style={styles.stopDirection}>↓ Southbound</Text>
                  <Text style={styles.stopRoute}>
                    Route {nearestStops.southbound.stop.route}
                  </Text>
                </View>
                <Text style={styles.stopName}>
                  {nearestStops.southbound.stop.name}
                </Text>
                <Text style={styles.stopLocation}>
                  {nearestStops.southbound.stop.location}
                </Text>
                <Text style={styles.stopDistance}>
                  📏 {nearestStops.southbound.stop.distance?.toFixed(2)} miles away
                </Text>

                {/* Predictions */}
                {nearestStops.southbound.predictions?.length > 0 && (
                  <View style={styles.predictions}>
                    <Text style={styles.predictionsTitle}>Next Buses:</Text>
                    {nearestStops.southbound.predictions.map((pred, idx) => (
                      <Text key={idx} style={styles.predictionText}>
                        🚌 Route {pred.route} - {pred.minutes} min
                      </Text>
                    ))}
                  </View>
                )}

                <TouchableOpacity
                  style={styles.directionsButton}
                  onPress={() =>
                    openDirections(
                      nearestStops.southbound.stop.lat,
                      nearestStops.southbound.stop.lon,
                      nearestStops.southbound.stop.name
                    )
                  }
                >
                  <Text style={styles.directionsButtonText}>
                    Get Directions →
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#6200EE',
  },
  headerContent: {
    flex: 1,
  },
  buildingName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  address: {
    fontSize: 16,
    color: '#E0E0E0',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  stopCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  stopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stopDirection: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6200EE',
  },
  stopRoute: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  stopName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  stopLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  stopDistance: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
  },
  predictions: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  predictionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  predictionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  directionsButton: {
    backgroundColor: '#6200EE',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  directionsButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#6200EE',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
