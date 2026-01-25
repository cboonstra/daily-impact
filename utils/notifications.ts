
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior directly
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.log('Permission not granted for notifications');
            return;
        }
    } else {
        // console.log('Must use physical device for Push Notifications');
    }

    return token;
}

export async function scheduleDailyReminder(hour: number, minute: number, title: string, body: string) {
    // First, clear all existing notifications to avoid duplicates
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Schedule morning notification
    await Notifications.scheduleNotificationAsync({
        content: {
            title: title || "Good morning! ☀️",
            body: body || "Your daily impact action is ready for you.",
        },
        trigger: {
            hour: hour,
            minute: minute,
            type: Notifications.SchedulableTriggerInputTypes.DAILY
        },
    });

    console.log(`Notification scheduled for ${hour}:${minute}`);
}

export async function cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
}
