import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import React from 'react';
import { Dimensions, Platform, StyleSheet } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

import { HapticTab } from '@/components/haptic-tab';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useDailyImpact } from '@/hooks/useDailyImpact';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isDone } = useDailyImpact();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDark ? '#fff' : '#3F7E44',
        tabBarInactiveTintColor: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 40 : 32,
          marginHorizontal: 24,
          width: SCREEN_WIDTH - 48,
          height: 64,
          borderRadius: 32,
          backgroundColor: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.85)',
          borderTopWidth: 0,
          elevation: 8,
          borderWidth: 1,
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          paddingBottom: 0,
          overflow: 'hidden',
          alignSelf: 'center',
        },
        tabBarBackground: () => (
          <BlurView
            intensity={Platform.OS === 'ios' ? 40 : 80}
            tint={isDark ? 'dark' : 'light'}
            style={StyleSheet.absoluteFill}
          />
        ),
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          marginBottom: 10,
        },
        tabBarIconStyle: {
          marginTop: 8,
        }
      }}>
      <Tabs.Screen
        name="explore"
        options={{
          title: 'SDGs',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={24}
              name={focused ? "apps" : "apps-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Daily Action',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={28}
              name={focused ? "sparkles" : "sparkles-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={24}
              name={focused ? "person" : "person-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
