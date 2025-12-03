/**
 * Stop card component for displaying bus stop information
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export const StopCard = ({ stop, distance, predictions = [], onPress }) => {
  const nextBus = predictions.length > 0 ? predictions[0] : null;

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(stop)}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.stopName} numberOfLines={2}>
            {stop.name}
          </Text>
          {distance && (
            <Text style={styles.distance}>{distance.toFixed(2)} mi</Text>
          )}
        </View>

        <Text style={styles.stopId}>Stop ID: {stop.stop_id}</Text>

        {nextBus ? (
          <View style={styles.predictionContainer}>
            <Text style={styles.predictionLabel}>Next bus:</Text>
            <Text style={styles.predictionTime}>
              {nextBus.minutes} min
            </Text>
          </View>
        ) : (
          <Text style={styles.noPrediction}>No predictions available</Text>
        )}
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 6,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  stopName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 10,
  },
  distance: {
    fontSize: 13,
    color: '#6200EE',
    fontWeight: '600',
  },
  stopId: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  predictionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  predictionLabel: {
    fontSize: 13,
    color: '#666',
    marginRight: 6,
  },
  predictionTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  noPrediction: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  chevron: {
    fontSize: 28,
    color: '#ccc',
    alignSelf: 'center',
    marginLeft: 10,
  },
});
