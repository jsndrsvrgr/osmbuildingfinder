/**
 * Route card component for displaying route information
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ROUTE_COLORS = {
  '201': '#996633',
  '205': '#DC143C',
  '208': '#1E90FF',
  '213': '#228B22',
};

export const RouteCard = ({ route, activeBusCount = 0, onPress }) => {
  const routeColor = ROUTE_COLORS[route.id] || '#666666';

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(route)}>
      <View style={[styles.colorBar, { backgroundColor: routeColor }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.routeNumber}>Route {route.id}</Text>
          {activeBusCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{activeBusCount} active</Text>
            </View>
          )}
        </View>
        <Text style={styles.routeName}>{route.name}</Text>
        {activeBusCount === 0 && (
          <Text style={styles.inactiveText}>No active buses</Text>
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
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  colorBar: {
    width: 6,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  routeNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  badge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 10,
  },
  badgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
  routeName: {
    fontSize: 14,
    color: '#666',
  },
  inactiveText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 4,
  },
  chevron: {
    fontSize: 28,
    color: '#ccc',
    alignSelf: 'center',
    marginRight: 15,
  },
});
