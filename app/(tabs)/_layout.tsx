import { Tabs } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1a0a1e',
          borderTopColor: '#2d1133',
          borderTopWidth: 1,
          height: 65,
          paddingBottom: 8,
          paddingTop: 5,
        },
        tabBarActiveTintColor: '#ff6b9d',
        tabBarInactiveTintColor: '#6b4a6e',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>💝</Text>,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'For You',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>💌</Text>,
        }}
      />
    </Tabs>
  );
}
