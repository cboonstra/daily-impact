import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { ImpactProvider } from '@/context/ImpactContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { registerForPushNotificationsAsync, scheduleDailyReminder } from '@/utils/notifications';
import { useEffect } from 'react';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    async function setupNotifications() {
      await registerForPushNotificationsAsync();
      // Schedule a daily reminder for 9:00 AM
      await scheduleDailyReminder(9, 0, "Daily Impact", "Your new daily action is ready! 🌱");
    }

    setupNotifications();
  }, []);

  return (
    <ImpactProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </ImpactProvider>
  );
}
