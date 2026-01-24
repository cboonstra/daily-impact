import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const HISTORY_KEY = 'daily_impact_history';

// History is stored as an object { [dateString]: boolean }
export interface ImpactHistory {
    [date: string]: boolean;
}

export function useImpactHistory() {
    const [history, setHistory] = useState<ImpactHistory>({});
    const [isLoading, setIsLoading] = useState(true);

    const loadHistory = async () => {
        try {
            const stored = await AsyncStorage.getItem(HISTORY_KEY);
            if (stored) {
                setHistory(JSON.parse(stored));
            }
        } catch (e) {
            console.error('Failed to load history', e);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleDay = async (date: string, completed: boolean) => {
        const newHistory = { ...history };
        if (completed) {
            newHistory[date] = true;
        } else {
            delete newHistory[date];
        }

        try {
            await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
            setHistory(newHistory);
        } catch (e) {
            console.error('Failed to save history', e);
        }
    };

    const getStats = () => {
        const completedDays = Object.keys(history).sort();
        const total = completedDays.length;

        let streak = 0;
        if (total > 0) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            let checkDate = new Date(today);

            // Check if today or yesterday was completed to start the streak
            const todayStr = checkDate.toISOString().split('T')[0];
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            if (history[todayStr] || history[yesterdayStr]) {
                if (!history[todayStr]) {
                    checkDate = yesterday;
                }

                while (history[checkDate.toISOString().split('T')[0]]) {
                    streak++;
                    checkDate.setDate(checkDate.getDate() - 1);
                }
            }
        }

        return { total, streak };
    };

    useEffect(() => {
        loadHistory();
    }, []);

    return {
        history,
        isLoading,
        toggleDay,
        getStats,
        refreshHistory: loadHistory,
    };
}
