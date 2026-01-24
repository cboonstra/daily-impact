import { SDG_ACTIONS, SdgAction } from '@/constants/sdgActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'daily_impact_state';
const HISTORY_KEY = 'daily_impact_history';

interface DailyState {
    date: string;
    actionId: string;
    shufflesRemaining: number;
    isDone: boolean;
}

export function useDailyImpact() {
    const [action, setAction] = useState<SdgAction | null>(null);
    const [shufflesRemaining, setShufflesRemaining] = useState(3);
    const [isDone, setIsDone] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const getTodayString = () => {
        return new Date().toISOString().split('T')[0];
    };

    const updateHistory = async (date: string, completed: boolean) => {
        try {
            const stored = await AsyncStorage.getItem(HISTORY_KEY);
            const history = stored ? JSON.parse(stored) : {};
            if (completed) {
                history[date] = true;
            } else {
                delete history[date];
            }
            await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        } catch (e) {
            console.error('Failed to update history', e);
        }
    };

    const loadState = async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            const today = getTodayString();

            if (stored) {
                const state: DailyState = JSON.parse(stored);
                if (state.date === today) {
                    const currentAction = SDG_ACTIONS.find(a => a.id === state.actionId) || SDG_ACTIONS[0];
                    setAction(currentAction);
                    setShufflesRemaining(state.shufflesRemaining);
                    setIsDone(state.isDone);
                    setIsLoading(false);
                    return;
                }
            }

            // No state for today, initialize new
            const randomAction = SDG_ACTIONS[Math.floor(Math.random() * SDG_ACTIONS.length)];
            const newState: DailyState = {
                date: today,
                actionId: randomAction.id,
                shufflesRemaining: 3,
                isDone: false,
            };

            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
            setAction(randomAction);
            setShufflesRemaining(3);
            setIsDone(false);
        } catch (e) {
            console.error('Failed to load daily state', e);
        } finally {
            setIsLoading(false);
        }
    };

    const shuffle = async () => {
        if (shufflesRemaining <= 0 || !action) return;

        const otherActions = SDG_ACTIONS.filter(a => a.id !== action.id);
        const nextAction = otherActions[Math.floor(Math.random() * otherActions.length)];
        const today = getTodayString();

        const newState: DailyState = {
            date: today,
            actionId: nextAction.id,
            shufflesRemaining: shufflesRemaining - 1,
            isDone: false,
        };

        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
            setAction(nextAction);
            setShufflesRemaining(newState.shufflesRemaining);
            setIsDone(false);
            await updateHistory(today, false);
        } catch (e) {
            console.error('Failed to shuffle', e);
        }
    };

    const markDone = async () => {
        if (!action) return;

        const today = getTodayString();
        const newState: DailyState = {
            date: today,
            actionId: action.id,
            shufflesRemaining,
            isDone: true,
        };

        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
            setIsDone(true);
            await updateHistory(today, true);
        } catch (e) {
            console.error('Failed to mark done', e);
        }
    };

    const unmarkDone = async () => {
        if (!action) return;

        const today = getTodayString();
        const newState: DailyState = {
            date: today,
            actionId: action.id,
            shufflesRemaining,
            isDone: false,
        };

        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
            setIsDone(false);
            await updateHistory(today, false);
        } catch (e) {
            console.error('Failed to unmark done', e);
        }
    };

    useEffect(() => {
        loadState();
    }, []);

    return {
        action,
        shufflesRemaining,
        isDone,
        isLoading,
        shuffle,
        markDone,
        unmarkDone,
    };
}
