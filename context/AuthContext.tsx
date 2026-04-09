import { AUTH_TOKEN_KEY } from '@/constants/config';
import { api, setAuthToken } from '@/services/api';
import { AuthResponse, UserResponse } from '@/types/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
    user: UserResponse | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (user: UserResponse) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadAuth = async () => {
            try {
                const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
                if (token) {
                    setAuthToken(token);
                    const me = await api.get<UserResponse>('/api/users/me');
                    setUser(me);
                }
            } catch {
                await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
                setAuthToken(null);
            } finally {
                setIsLoading(false);
            }
        };
        loadAuth();
    }, []);

    const handleAuthResponse = async (response: AuthResponse) => {
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, response.token);
        setAuthToken(response.token);
        setUser(response.user);
    };

    const login = async (email: string, password: string) => {
        const response = await api.post<AuthResponse>('/api/auth/login', { email, password });
        await handleAuthResponse(response);
    };

    const register = async (email: string, password: string, name: string) => {
        const response = await api.post<AuthResponse>('/api/auth/register', { email, password, name });
        await handleAuthResponse(response);
    };

    const logout = async () => {
        await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
        setAuthToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            isAuthenticated: !!user,
            login,
            register,
            logout,
            updateUser: setUser,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
