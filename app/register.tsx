import { useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ApiError } from '@/services/api';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function RegisterScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const { register } = useAuth();
    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async () => {
        if (!name.trim() || !email.trim() || !password) {
            setError('Please fill in all fields.');
            return;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }
        setError('');
        setIsLoading(true);
        try {
            await register(email.trim().toLowerCase(), password, name.trim());
            // AuthGate in _layout.tsx handles redirect
        } catch (e) {
            if (e instanceof ApiError && e.status === 409) {
                setError('An account with this email already exists.');
            } else {
                setError('Could not create account. Check your internet connection.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={[styles.container, isDark && styles.containerDark]}>
            <Stack.Screen options={{ headerShown: false }} />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <Text style={styles.logo}>🌍</Text>
                        <Text style={[styles.title, isDark && styles.textDark]}>Create Account</Text>
                        <Text style={[styles.subtitle, isDark && styles.mutedDark]}>
                            Start your impact journey today
                        </Text>
                    </View>

                    <View style={[styles.card, isDark && styles.cardDark]}>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, isDark && styles.textDark]}>Name</Text>
                            <TextInput
                                style={[styles.input, isDark && styles.inputDark]}
                                value={name}
                                onChangeText={setName}
                                placeholder="Your name"
                                placeholderTextColor={isDark ? '#555' : '#aaa'}
                                autoCorrect={false}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, isDark && styles.textDark]}>Email</Text>
                            <TextInput
                                style={[styles.input, isDark && styles.inputDark]}
                                value={email}
                                onChangeText={setEmail}
                                placeholder="you@example.com"
                                placeholderTextColor={isDark ? '#555' : '#aaa'}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, isDark && styles.textDark]}>Password</Text>
                            <TextInput
                                style={[styles.input, isDark && styles.inputDark]}
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Min. 8 characters"
                                placeholderTextColor={isDark ? '#555' : '#aaa'}
                                secureTextEntry
                            />
                        </View>

                        {error ? <Text style={styles.error}>{error}</Text> : null}

                        <TouchableOpacity
                            style={[styles.button, isLoading && styles.buttonDisabled]}
                            onPress={handleRegister}
                            disabled={isLoading}
                            activeOpacity={0.8}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Create Account</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.switchLink}
                        onPress={() => router.replace('/login')}
                    >
                        <Text style={[styles.switchText, isDark && styles.mutedDark]}>
                            Already have an account?{' '}
                            <Text style={styles.switchTextAccent}>Sign in</Text>
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F2F2F7' },
    containerDark: { backgroundColor: '#000' },
    content: { flexGrow: 1, justifyContent: 'center', padding: 24, paddingBottom: 48 },
    header: { alignItems: 'center', marginBottom: 32 },
    logo: { fontSize: 56, marginBottom: 12 },
    title: { fontSize: 28, fontWeight: '800', color: '#1C1C1E', marginBottom: 6 },
    subtitle: { fontSize: 15, color: '#8E8E93' },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
    },
    cardDark: { backgroundColor: '#1C1C1E' },
    inputGroup: { marginBottom: 16 },
    label: { fontSize: 14, fontWeight: '600', color: '#1C1C1E', marginBottom: 6 },
    input: {
        backgroundColor: '#F2F2F7',
        borderRadius: 12,
        padding: 14,
        fontSize: 15,
        color: '#1C1C1E',
    },
    inputDark: { backgroundColor: '#2C2C2E', color: '#fff' },
    error: { color: '#FF3B30', fontSize: 13, marginBottom: 12, textAlign: 'center' },
    button: {
        backgroundColor: '#3F7E44',
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonDisabled: { opacity: 0.6 },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    switchLink: { alignItems: 'center', marginTop: 24 },
    switchText: { fontSize: 14, color: '#8E8E93' },
    switchTextAccent: { color: '#3F7E44', fontWeight: '700' },
    textDark: { color: '#fff' },
    mutedDark: { color: '#636366' },
});
