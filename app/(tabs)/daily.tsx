import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DailyHabitScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Today's Action</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* SDG Badge */}
                <View style={styles.sdgBadge}>
                    <View style={styles.sdgIconContainer}>
                        <Image
                            source={require('@/assets/images/sdgs/sdg13.png')}
                            style={styles.sdgIcon}
                            contentFit="contain"
                        />
                    </View>
                    <Text style={styles.sdgText}>Climate Action</Text>
                </View>

                {/* Main Title */}
                <Text style={styles.headline}>Don't eat meat{"\n"}for the day</Text>

                {/* Description */}
                <Text style={styles.description}>
                    Eating meat negatively contributes to deforestation and loss of biodiversity.
                </Text>

                {/* Actions */}
                <View style={styles.actionContainer}>
                    <TouchableOpacity activeOpacity={0.8} style={styles.buttonWrapper}>
                        <LinearGradient
                            colors={['#A5BC89', '#86A168']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            style={styles.doneButton}
                        >
                            <View style={styles.doneIconCircle}>
                                <Ionicons name="checkmark-sharp" size={20} color="#86A168" />
                            </View>
                            <Text style={styles.doneButtonText}>Done</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.shuffleButton} activeOpacity={0.7}>
                        <Ionicons name="shuffle-sharp" size={24} color="#1A1C1E" />
                        <Text style={styles.shuffleButtonText}>
                            Shuffle <Text style={styles.shuffleCount}>(3 left)</Text>
                        </Text>
                    </TouchableOpacity>

                    <Text style={styles.footerText}>Available again tomorrow</Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        paddingTop: 60,
        paddingBottom: 15,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        flexDirection: 'row',
    },
    backButton: {
        position: 'absolute',
        left: 10,
        top: 60,
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#333',
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 30,
        paddingBottom: 40,
    },
    headline: {
        fontSize: 56,
        fontWeight: '800',
        color: '#1A1C1E',
        lineHeight: 62,
        marginBottom: 24,
        letterSpacing: -1.6,
    },
    sdgBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 14,
        paddingRight: 18,
        alignSelf: 'flex-start',
        marginBottom: 32,
        height: 60,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#f0f0f0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    sdgIconContainer: {
        width: 60,
        height: 60,
        backgroundColor: '#3F7E44',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    sdgIcon: {
        width: '100%',
        height: '100%',
    },
    sdgText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
    },
    description: {
        fontSize: 18,
        color: '#666',
        lineHeight: 26,
        marginBottom: 60,
        letterSpacing: -0.2,
    },
    actionContainer: {
        alignItems: 'center',
        gap: 16,
    },
    buttonWrapper: {
        width: '100%',
    },
    doneButton: {
        width: '100%',
        height: 72,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 6,
    },
    doneIconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    doneButtonText: {
        fontSize: 21,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: -0.4,
    },
    shuffleButton: {
        width: '100%',
        height: 72,
        backgroundColor: '#f8f9fa',
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        borderWidth: 1,
        borderColor: '#eee',
    },
    shuffleButtonText: {
        fontSize: 19,
        fontWeight: '700',
        color: '#1A1C1E',
        letterSpacing: -0.4,
    },
    shuffleCount: {
        fontWeight: '400',
        opacity: 0.7,
    },
    footerText: {
        fontSize: 15,
        color: '#999',
        marginTop: 12,
        fontWeight: '600',
    },
});
