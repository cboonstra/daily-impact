import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useDailyImpact } from '@/hooks/useDailyImpact';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isDone } = useDailyImpact();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="explore"
        options={{
          title: 'SDG\'s',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="apps" color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Daily Impact',
          tabBarIcon: ({ color }) => <Ionicons size={24} name={isDone ? "ellipse" : "ellipse-outline"} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="person" color={color} />,
        }}
      />
    </Tabs>
  );
}
