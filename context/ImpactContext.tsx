import { SDG_ACTIONS, SdgAction } from '@/constants/sdgActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'daily_impact_state';
const HISTORY_KEY = 'daily_impact_history';
const PROFILE_KEY = 'daily_impact_profile';
const COMPLETED_SDGS_KEY = 'completed_sdg_ids';

interface DailyState {
    date: string;
    actionId: string;
    shufflesRemaining: number;
    isDone: boolean;
}

interface ProfileData {
    name: string;
    bio: string;
    email: string;
}

interface ImpactContextType {
    action: SdgAction | null;
    shufflesRemaining: number;
    isDone: boolean;
    isLoading: boolean;
    history: { [key: string]: boolean };
    profile: ProfileData;
    completedSdgIds: number[];
    shuffle: () => Promise<void>;
    markDone: () => Promise<void>;
    unmarkDone: () => Promise<void>;
    refreshHistory: () => Promise<void>;
    getStats: () => { total: number; streak: number };
    updateProfile: (data: Partial<ProfileData>) => Promise<void>;
}

const ImpactContext = createContext<ImpactContextType | undefined>(undefined);

const DEFAULT_PROFILE = {
    name: 'Lotte Boonstra',
    bio: 'Making everyday impact counts. 🌍✨',
    email: 'lotte@dailyimpact.com',
};

export function ImpactProvider({ children }: { children: React.ReactNode }) {
    const [action, setAction] = useState<SdgAction | null>(null);
    const [shufflesRemaining, setShufflesRemaining] = useState(3);
    const [isDone, setIsDone] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [history, setHistory] = useState<{ [key: string]: boolean }>({});
    const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
    const [completedSdgIds, setCompletedSdgIds] = useState<number[]>([]);

    const getTodayString = () => {
        return new Date().toISOString().split('T')[0];
    };

    const loadData = async () => {
        try {
            // Load Daily Action
            const storedDaily = await AsyncStorage.getItem(STORAGE_KEY);
            const today = getTodayString();

            if (storedDaily) {
                const state: DailyState = JSON.parse(storedDaily);
                if (state.date === today) {
                    setAction(SDG_ACTIONS.find(a => a.id === state.actionId) || SDG_ACTIONS[0]);
                    setShufflesRemaining(state.shufflesRemaining);
                    setIsDone(state.isDone);
                } else {
                    createNewDaily(today);
                }
            } else {
                createNewDaily(today);
            }

            // Load History
            const storedHistory = await AsyncStorage.getItem(HISTORY_KEY);
            if (storedHistory) {
                setHistory(JSON.parse(storedHistory));
            }

            // Load Profile
            const storedProfile = await AsyncStorage.getItem(PROFILE_KEY);
            if (storedProfile) {
                setProfile(JSON.parse(storedProfile));
            }

            // Load Completed SDGs
            const storedSdgs = await AsyncStorage.getItem(COMPLETED_SDGS_KEY);
            if (storedSdgs) {
                setCompletedSdgIds(JSON.parse(storedSdgs));
            }
        } catch (e) {
            console.error('Failed to load impact data', e);
        } finally {
            setIsLoading(false);
        }
    };

    const createNewDaily = async (today: string) => {
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
    };

    const updateHistory = async (date: string, completed: boolean) => {
        const newHistory = { ...history };
        if (completed) {
            newHistory[date] = true;
        } else {
            delete newHistory[date];
        }
        await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
        setHistory(newHistory);
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
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
        setAction(nextAction);
        setShufflesRemaining(newState.shufflesRemaining);
        setIsDone(false);
        await updateHistory(today, false);
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
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
        setIsDone(true);
        await updateHistory(today, true);

        // Track completed SDGs
        if (!completedSdgIds.includes(action.sdgId)) {
            const newSdgs = [...completedSdgIds, action.sdgId];
            setCompletedSdgIds(newSdgs);
            await AsyncStorage.setItem(COMPLETED_SDGS_KEY, JSON.stringify(newSdgs));
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
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
        setIsDone(false);
        await updateHistory(today, false);
    };

    const updateProfile = async (data: Partial<ProfileData>) => {
        const newProfile = { ...profile, ...data };
        await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(newProfile));
        setProfile(newProfile);
    };

    const getStats = () => {
        const completedDays = Object.keys(history).sort();
        const total = completedDays.length;
        let streak = 0;
        if (total > 0) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            let checkDate = new Date(today);
            const todayStr = checkDate.toISOString().split('T')[0];
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            if (history[todayStr] || history[yesterdayStr]) {
                if (!history[todayStr]) checkDate = yesterday;
                while (history[checkDate.toISOString().split('T')[0]]) {
                    streak++;
                    checkDate.setDate(checkDate.getDate() - 1);
                }
            }
        }
        return { total, streak };
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <ImpactContext.Provider value={{
            action, shufflesRemaining, isDone, isLoading, history, profile, completedSdgIds,
            shuffle, markDone, unmarkDone, refreshHistory: loadData, getStats, updateProfile
        }}>
            {children}
        </ImpactContext.Provider>
    );
}

export function useImpact() {
    const context = useContext(ImpactContext);
    if (context === undefined) {
        throw new Error('useImpact must be used within an ImpactProvider');
    }
    return context;
}
