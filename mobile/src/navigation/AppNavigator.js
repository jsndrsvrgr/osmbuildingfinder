/**
 * Main app navigation configuration
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MapScreen from '../screens/MapScreen';
import BuildingDetailModal from '../screens/BuildingDetailModal';
import RoutesListScreen from '../screens/RoutesListScreen';
import StopsListScreen from '../screens/StopsListScreen';
import StopDetailModal from '../screens/StopDetailModal';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Map"
          component={MapScreen}
          options={{
            title: 'NU Bus Finder',
          }}
        />
        <Stack.Screen
          name="BuildingDetail"
          component={BuildingDetailModal}
          options={{
            presentation: 'modal',
            title: 'Building Details',
          }}
        />
        <Stack.Screen
          name="RoutesList"
          component={RoutesListScreen}
          options={{
            title: 'Routes',
          }}
        />
        <Stack.Screen
          name="StopsList"
          component={StopsListScreen}
          options={{
            title: 'Stops',
          }}
        />
        <Stack.Screen
          name="StopDetail"
          component={StopDetailModal}
          options={{
            presentation: 'modal',
            title: 'Stop Details',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
