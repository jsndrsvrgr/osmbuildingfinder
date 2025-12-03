/**
 * Main map screen displaying NU campus, buildings, and live buses
 */
import React, { useState, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity, TextInput } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useLocation } from '../hooks/useLocation';
import { useBuildings } from '../hooks/useBuildings';
import { useLiveBuses } from '../hooks/useLiveBuses';
import { useBusStops } from '../hooks/useBusStops';
import { BuildingMarker } from '../components/BuildingMarker';
import { BusMarker } from '../components/BusMarker';
import { NU_CAMPUS_CENTER } from '../constants/config';

export default function MapScreen({ navigation }) {
  const { latitude, longitude, permissionGranted, errorMsg } = useLocation();
  const { buildings, loading: buildingsLoading } = useBuildings();
  const { buses, loading: busesLoading } = useLiveBuses();
  const { stops, loading: stopsLoading } = useBusStops();

  const mapRef = useRef(null);
  const [showBuildings, setShowBuildings] = useState(true);
  const [showBuses, setShowBuses] = useState(true);
  const [showLegend, setShowLegend] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBus, setSelectedBus] = useState(null);
  const [showStopsForRoute, setShowStopsForRoute] = useState(null);

  const handleBuildingPress = (building) => {
    navigation.navigate('BuildingDetail', { buildingId: building.id });
  };

  const handleBusPress = (bus) => {
    setSelectedBus(bus);
    setShowStopsForRoute(null); // Reset stops when selecting a new bus
  };

  const toggleRouteStops = () => {
    if (showStopsForRoute === selectedBus?.route) {
      setShowStopsForRoute(null);
    } else {
      setShowStopsForRoute(selectedBus?.route);
    }
  };

  // Filter stops for the selected route
  const routeStops = showStopsForRoute
    ? stops.filter((stop) => stop.route === showStopsForRoute)
    : [];

  const centerOnUserLocation = () => {
    if (latitude && longitude && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  };

  const filteredBuildings = buildings.filter((building) =>
    building.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!permissionGranted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          {errorMsg || 'Please grant location permission to use this app'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={NU_CAMPUS_CENTER}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={true}
        loadingEnabled={true}
      >
        {/* Building Markers */}
        {showBuildings &&
          filteredBuildings.map((building) => (
            <BuildingMarker
              key={building.id}
              building={building}
              onPress={handleBuildingPress}
            />
          ))}

        {/* Live Bus Markers */}
        {showBuses &&
          buses.map((bus) => (
            <BusMarker
              key={bus.vehicle_id}
              bus={bus}
              isSelected={selectedBus?.vehicle_id === bus.vehicle_id}
              onPress={() => handleBusPress(bus)}
            />
          ))}

        {/* Route Stops */}
        {routeStops.map((stop) => (
          <Marker
            key={`${stop.id}-${stop.route}-${stop.direction}`}
            coordinate={{
              latitude: stop.lat,
              longitude: stop.lon,
            }}
          >
            <View style={styles.stopMarker}>
              <View style={styles.stopMarkerInner} />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search buildings..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setSearchQuery('')}
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Control Buttons */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, !showBuildings && styles.buttonInactive]}
          onPress={() => setShowBuildings(!showBuildings)}
        >
          <Text style={styles.buttonText}>
            {showBuildings ? '🏢 Hide' : '🏢 Show'} Buildings
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, !showBuses && styles.buttonInactive]}
          onPress={() => setShowBuses(!showBuses)}
        >
          <Text style={styles.buttonText}>
            {showBuses ? '🚌 Hide' : '🚌 Show'} Buses
          </Text>
        </TouchableOpacity>
      </View>

      {/* Selected Bus Info */}
      {selectedBus && (
        <View style={styles.busInfoCard}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedBus(null)}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.busInfoTitle}>Route {selectedBus.route}</Text>
          <Text style={styles.busInfoText}>To: {selectedBus.destination}</Text>
          <Text style={styles.busInfoText}>Heading: {selectedBus.heading}°</Text>
          <TouchableOpacity
            style={styles.viewRouteButton}
            onPress={toggleRouteStops}
          >
            <Text style={styles.viewRouteButtonText}>
              {showStopsForRoute === selectedBus.route ? 'Hide Stops' : 'Show Stops'}
            </Text>
          </TouchableOpacity>
          {showStopsForRoute && (
            <Text style={styles.stopsCountText}>
              Showing {routeStops.length} stops
            </Text>
          )}
        </View>
      )}

      {/* Routes List Button */}
      <TouchableOpacity
        style={styles.routesListButton}
        onPress={() => navigation.navigate('RoutesList')}
      >
        <Text style={styles.routesListButtonText}>📋 View Routes</Text>
      </TouchableOpacity>

      {/* Floating Action Buttons */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fab}
          onPress={centerOnUserLocation}
        >
          <Text style={styles.fabText}>📍</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setShowLegend(!showLegend)}
        >
          <Text style={styles.fabText}>ℹ️</Text>
        </TouchableOpacity>
      </View>

      {/* Legend */}
      {showLegend && (
        <View style={styles.legend}>
          <View style={styles.legendHeader}>
            <Text style={styles.legendTitle}>Route Colors</Text>
            <TouchableOpacity onPress={() => setShowLegend(false)}>
              <Text style={styles.legendClose}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#996633' }]} />
            <Text style={styles.legendText}>Route 201</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#DC143C' }]} />
            <Text style={styles.legendText}>Route 205</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#1E90FF' }]} />
            <Text style={styles.legendText}>Route 208</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#228B22' }]} />
            <Text style={styles.legendText}>Route 213</Text>
          </View>
        </View>
      )}

      {/* Loading Indicator */}
      {(buildingsLoading || busesLoading) && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200EE" />
          <Text style={styles.loadingText}>
            Loading {buildingsLoading ? 'buildings' : 'buses'}...
          </Text>
        </View>
      )}

      {/* Info Badge */}
      <View style={styles.infoBadge}>
        <Text style={styles.infoText}>
          📍 {searchQuery ? `${filteredBuildings.length}/${buildings.length}` : buildings.length} Buildings | 🚌 {buses.length} Live Buses
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#D32F2F',
    textAlign: 'center',
  },
  controls: {
    position: 'absolute',
    top: 60,
    right: 10,
    gap: 10,
  },
  button: {
    backgroundColor: '#6200EE',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonInactive: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  infoBadge: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  infoText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  routesListButton: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    backgroundColor: '#6200EE',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  routesListButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  searchContainer: {
    position: 'absolute',
    top: 60,
    left: 10,
    right: 120,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    paddingRight: 15,
  },
  clearButtonText: {
    fontSize: 20,
    color: '#999',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 150,
    right: 15,
    gap: 10,
  },
  fab: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabText: {
    fontSize: 24,
  },
  legend: {
    position: 'absolute',
    top: 120,
    left: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minWidth: 150,
  },
  legendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  legendClose: {
    fontSize: 20,
    color: '#999',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  legendText: {
    fontSize: 14,
    color: '#666',
  },
  busInfoCard: {
    position: 'absolute',
    bottom: 150,
    left: 15,
    right: 15,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#999',
  },
  busInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6200EE',
    marginBottom: 8,
  },
  busInfoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  viewRouteButton: {
    marginTop: 10,
    backgroundColor: '#6200EE',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewRouteButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  stopsCountText: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  stopMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(98, 0, 238, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6200EE',
  },
  stopMarkerInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6200EE',
  },
});
