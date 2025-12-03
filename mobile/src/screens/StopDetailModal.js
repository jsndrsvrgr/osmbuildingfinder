/**
 * Stop detail modal showing predictions and nearby buildings
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Platform,
  SafeAreaView,
} from 'react-native';
import { getStopPredictions, getNearestStops } from '../services/api';

export default function StopDetailModal({ route, navigation }) {
  const { stopId, stopName } = route.params;
  const [predictions, setPredictions] = useState([]);
  const [stopDetails, setStopDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStopData();

    // Refresh predictions every 30 seconds
    const interval = setInterval(() => {
      fetchPredictions();
    }, 30000);

    return () => clearInterval(interval);
  }, [stopId]);

  const fetchStopData = async () => {
    setLoading(true);
    await Promise.all([fetchPredictions(), fetchStopDetails()]);
    setLoading(false);
  };

  const fetchPredictions = async () => {
    try {
      const data = await getStopPredictions(stopId);
      setPredictions(data);
    } catch (error) {
      console.error('Error fetching predictions:', error);
    }
  };

  const fetchStopDetails = async () => {
    try {
      // For now, we'll use the stopId and stopName from params
      // In a full implementation, you might want a dedicated endpoint
      setStopDetails({
        stop_id: stopId,
        name: stopName,
      });
    } catch (error) {
      console.error('Error fetching stop details:', error);
    }
  };

  const openDirections = () => {
    if (!stopDetails) return;

    const scheme = Platform.select({
      ios: 'maps://',
      android: 'geo:',
    });

    const url = Platform.select({
      ios: `${scheme}?daddr=${stopDetails.lat},${stopDetails.lon}&q=${encodeURIComponent(
        stopDetails.name
      )}`,
      android: `${scheme}${stopDetails.lat},${stopDetails.lon}?q=${encodeURIComponent(
        stopDetails.name
      )}`,
    });

    Linking.openURL(url).catch((err) =>
      console.error('Error opening maps:', err)
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#6200EE" />
          <Text style={styles.loadingText}>Loading stop details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{stopName}</Text>
          <Text style={styles.stopId}>Stop ID: {stopId}</Text>
        </View>

        {/* Predictions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Buses</Text>
          {predictions.length > 0 ? (
            predictions.map((prediction, index) => (
              <View key={index} style={styles.predictionCard}>
                <View style={styles.predictionHeader}>
                  <Text style={styles.routeNumber}>
                    Route {prediction.route}
                  </Text>
                  <Text style={styles.arrivalTime}>{prediction.minutes} min</Text>
                </View>
                <Text style={styles.destination}>
                  To: {prediction.destination}
                </Text>
                {prediction.delayed && (
                  <Text style={styles.delayedText}>Delayed</Text>
                )}
              </View>
            ))
          ) : (
            <View style={styles.noPredictions}>
              <Text style={styles.noPredictionsText}>
                No upcoming buses at this time
              </Text>
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={openDirections}
          >
            <Text style={styles.actionButtonText}>Get Directions</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => navigation.navigate('Map')}
          >
            <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
              View on Map
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
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
  header: {
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 5,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  stopId: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: 'white',
    marginTop: 10,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  predictionCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  predictionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  routeNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  arrivalTime: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  destination: {
    fontSize: 14,
    color: '#666',
  },
  delayedText: {
    fontSize: 12,
    color: '#F44336',
    fontStyle: 'italic',
    marginTop: 4,
  },
  noPredictions: {
    padding: 20,
    alignItems: 'center',
  },
  noPredictionsText: {
    fontSize: 14,
    color: '#999',
  },
  actionsSection: {
    padding: 20,
    gap: 10,
  },
  actionButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#6200EE',
  },
  secondaryButtonText: {
    color: '#6200EE',
  },
});
