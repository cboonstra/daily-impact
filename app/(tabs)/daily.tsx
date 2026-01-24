import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DailyHabitScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [isDone, setIsDone] = React.useState(false);

    // SDG 13 Color
    const sdgColor = '#3F7E44';
    const sdgColorDone = '#2D5A31'; // Darker/deeper green when done

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Your action for today</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <TouchableOpacity
                    activeOpacity={0.95}
                    onPress={() => isDone && setIsDone(false)}
                    style={[
                        styles.mainCard,
                        { backgroundColor: isDone ? sdgColorDone : sdgColor }
                    ]}
                >
                    {/* SDG Badge (Subtle on card) */}
                    <View style={styles.sdgBadge}>
                        <Text style={styles.sdgText}>Climate Action</Text>
                    </View>

                    {/* Main Title */}
                    <Text style={styles.headline}>Don't eat meat{"\n"}for the day</Text>

                    {/* Description */}
                    <Text style={styles.description}>
                        Eating meat negatively contributes to deforestation and loss of biodiversity.
                    </Text>

                    {/* Actions (Subtle on card) */}
                    <View style={styles.actionContainer}>
                        {!isDone ? (
                            <>
                                <TouchableOpacity
                                    style={styles.subtleButton}
                                    onPress={() => setIsDone(true)}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="checkmark-circle-outline" size={24} color="#fff" />
                                    <Text style={styles.subtleButtonText}>Mark as Done</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.minimalShuffle} activeOpacity={0.6}>
                                    <Ionicons name="shuffle-outline" size={20} color="rgba(255,255,255,0.7)" />
                                    <Text style={styles.minimalShuffleText}>Shuffle (3 left)</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <View style={styles.doneMessage}>
                                <Ionicons name="checkmark-circle" size={48} color="#fff" />
                                <Text style={styles.doneMessageText}>Great job!</Text>
                                <Text style={styles.availableText}>Available again tomorrow</Text>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>

                {!isDone && (
                    <Text style={styles.footerNote}>Tap the card to complete your daily impact</Text>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        paddingTop: 60,
        paddingBottom: 15,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#333',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    mainCard: {
        borderRadius: 32,
        padding: 32,
        minHeight: 500,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 8,
    },
    sdgBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
        alignSelf: 'flex-start',
        marginBottom: 20,
    },
    sdgText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#fff',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    headline: {
        fontSize: 42,
        fontWeight: '800',
        color: '#fff',
        lineHeight: 48,
        marginBottom: 20,
        letterSpacing: -1,
    },
    description: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.85)',
        lineHeight: 25,
        marginBottom: 48,
        letterSpacing: -0.3,
    },
    actionContainer: {
        width: '100%',
        gap: 16,
        marginTop: 'auto',
    },
    subtleButton: {
        width: '100%',
        height: 60,
        backgroundColor: 'rgba(255,255,255,1)',
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    subtleButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#3F7E44', // Match SDG color
        letterSpacing: -0.4,
    },
    minimalShuffle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        gap: 6,
    },
    minimalShuffleText: {
        fontSize: 15,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.8)',
    },
    doneMessage: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    doneMessageText: {
        fontSize: 24,
        fontWeight: '800',
        color: '#fff',
        marginTop: 12,
        marginBottom: 4,
    },
    availableText: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.7)',
        fontWeight: '500',
    },
    footerNote: {
        textAlign: 'center',
        color: '#8E8E93',
        fontSize: 13,
        marginTop: 20,
        fontWeight: '500',
    },
});
