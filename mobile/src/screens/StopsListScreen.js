/**
 * Stops list screen displaying bus stops for a specific route
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { StopCard } from '../components/StopCard';
import { useBusStops } from '../hooks/useBusStops';
import { useLocation } from '../hooks/useLocation';
import { getStopPredictions } from '../services/api';
import { calculateDistance } from '../utils/distance';

export default function StopsListScreen({ route, navigation }) {
  const { routeId, routeName } = route.params;
  const { stops, loading } = useBusStops();
  const { latitude, longitude } = useLocation();

  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [predictions, setPredictions] = useState({});
  const [directionFilter, setDirectionFilter] = useState('all');

  // Filter stops for this route
  const routeStops = stops.filter((stop) => stop.route === routeId);

  useEffect(() => {
    if (routeStops.length > 0) {
      fetchPredictions();
    }
  }, [routeStops]);

  const fetchPredictions = async () => {
    const newPredictions = {};
    for (const stop of routeStops) {
      try {
        const preds = await getStopPredictions(stop.id);
        newPredictions[stop.id] = preds;
      } catch (error) {
        console.error(`Error fetching predictions for stop ${stop.id}:`, error);
      }
    }
    setPredictions(newPredictions);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPredictions();
    setRefreshing(false);
  };

  const handleStopPress = (stop) => {
    navigation.navigate('StopDetail', {
      stopId: stop.id,
      stopName: stop.name,
    });
  };

  const getStopDistance = (stop) => {
    if (!latitude || !longitude) return null;
    return calculateDistance(latitude, longitude, stop.lat, stop.lon);
  };

  const filteredStops = routeStops
    .filter((stop) => {
      const matchesSearch = stop.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesDirection =
        directionFilter === 'all' ||
        (stop.direction && stop.direction.toLowerCase().includes(directionFilter.toLowerCase()));

      return matchesSearch && matchesDirection;
    })
    .sort((a, b) => {
      const distA = getStopDistance(a);
      const distB = getStopDistance(b);
      if (distA === null || distB === null) return 0;
      return distA - distB;
    });

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Route {routeId}</Text>
      <Text style={styles.subtitle}>{routeName}</Text>
      <Text style={styles.stopCount}>{filteredStops.length} stops</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search stops..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.directionFilters}>
        <TouchableOpacity
          style={[
            styles.directionButton,
            directionFilter === 'all' && styles.directionButtonActive,
          ]}
          onPress={() => setDirectionFilter('all')}
        >
          <Text
            style={[
              styles.directionButtonText,
              directionFilter === 'all' && styles.directionButtonTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.directionButton,
            directionFilter === 'north' && styles.directionButtonActive,
          ]}
          onPress={() => setDirectionFilter('north')}
        >
          <Text
            style={[
              styles.directionButtonText,
              directionFilter === 'north' && styles.directionButtonTextActive,
            ]}
          >
            Northbound
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.directionButton,
            directionFilter === 'south' && styles.directionButtonActive,
          ]}
          onPress={() => setDirectionFilter('south')}
        >
          <Text
            style={[
              styles.directionButtonText,
              directionFilter === 'south' && styles.directionButtonTextActive,
            ]}
          >
            Southbound
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {searchQuery || directionFilter !== 'all'
          ? 'No stops found matching your criteria'
          : 'No stops available for this route'}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#6200EE" />
          <Text style={styles.loadingText}>Loading stops...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>‹ Back to Routes</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredStops}
        keyExtractor={(item) => `${item.id}-${item.route}-${item.direction}`}
        renderItem={({ item }) => (
          <StopCard
            stop={item}
            distance={getStopDistance(item)}
            predictions={predictions[item.id] || []}
            onPress={handleStopPress}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  backButtonContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    paddingVertical: 5,
  },
  backButtonText: {
    fontSize: 16,
    color: '#6200EE',
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  stopCount: {
    fontSize: 14,
    color: '#999',
    marginBottom: 20,
  },
  searchContainer: {
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 16,
    color: '#333',
  },
  directionFilters: {
    flexDirection: 'row',
    gap: 10,
  },
  directionButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  directionButtonActive: {
    backgroundColor: '#6200EE',
  },
  directionButtonText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
  directionButtonTextActive: {
    color: 'white',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});
