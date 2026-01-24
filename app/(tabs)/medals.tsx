import { useImpactHistory } from '@/hooks/useImpactHistory';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MedalsScreen() {
    const { history, refreshHistory, getStats } = useImpactHistory();
    const { total, streak } = getStats();
    const [viewDate, setViewDate] = useState(new Date());

    // Refresh history when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            refreshHistory();
        }, [])
    );

    const handlePrevMonth = () => {
        const newDate = new Date(viewDate);
        newDate.setMonth(newDate.getMonth() - 1);
        setViewDate(newDate);
    };

    const handleNextMonth = () => {
        const newDate = new Date(viewDate);
        newDate.setMonth(newDate.getMonth() + 1);
        setViewDate(newDate);
    };

    const renderCalendar = () => {
        const today = new Date();
        const viewMonth = viewDate.getMonth();
        const viewYear = viewDate.getFullYear();

        const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
        const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();

        const monthName = viewDate.toLocaleString('default', { month: 'long' });

        // Adjusted for Monday start (0=Sun, 1=Mon... -> 0=Mon, 1=Tue... 6=Sun)
        const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

        const days = [];
        // Padding for first week
        for (let i = 0; i < adjustedFirstDay; i++) {
            days.push(<View key={`pad-${i}`} style={styles.calendarDayEmpty} />);
        }

        // Days of the month
        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const isCompleted = history[dateStr];
            const isToday = d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

            days.push(
                <View key={d} style={styles.calendarDayContainer}>
                    <View style={[
                        styles.calendarDay,
                        isToday && styles.dayToday
                    ]}>
                        <Text style={[
                            styles.dayText,
                            isToday && styles.dayTextToday
                        ]}>
                            {d}
                        </Text>
                        {isCompleted && <View style={styles.completionDot} />}
                    </View>
                </View>
            );
        }

        return (
            <View style={styles.calendarCard}>
                <View style={styles.calendarHeader}>
                    <TouchableOpacity onPress={handlePrevMonth} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <Ionicons name="chevron-back" size={20} color="#333" />
                    </TouchableOpacity>

                    <Text style={styles.monthTitle}>{monthName} {viewYear}</Text>

                    <TouchableOpacity onPress={handleNextMonth} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <Ionicons name="chevron-forward" size={20} color="#333" />
                    </TouchableOpacity>
                </View>

                <View style={styles.weekDays}>
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                        <Text key={`${day}-${index}`} style={styles.weekDayText}>{day}</Text>
                    ))}
                </View>

                <View style={styles.calendarGrid}>
                    {days}
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Progress</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Stats Section */}
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <View style={[styles.statIconContainer, { backgroundColor: '#E8F5E9' }]}>
                            <Ionicons name="checkmark-done" size={24} color="#3F7E44" />
                        </View>
                        <Text style={styles.statValue}>{total}</Text>
                        <Text style={styles.statLabel}>{total === 1 ? 'Impact' : 'Impacts'}</Text>
                    </View>

                    <View style={styles.statCard}>
                        <View style={[styles.statIconContainer, { backgroundColor: '#FFF8E1' }]}>
                            <Ionicons name="flame" size={24} color="#FFB300" />
                        </View>
                        <Text style={styles.statValue}>{streak}</Text>
                        <Text style={styles.statLabel}>Day Streak</Text>
                    </View>
                </View>

                {/* Calendar Section */}
                <Text style={styles.sectionTitle}>Habit Calendar</Text>
                {renderCalendar()}

                <View style={styles.infoBox}>
                    <Ionicons name="sparkles-outline" size={20} color="#FFB300" />
                    <Text style={styles.infoText}>
                        Consistent actions create the biggest impact. Keep it up!
                    </Text>
                </View>
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
    statsGrid: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 32,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    statIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    statValue: {
        fontSize: 28,
        fontWeight: '800',
        color: '#333',
    },
    statLabel: {
        fontSize: 14,
        color: '#8E8E93',
        fontWeight: '600',
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 16,
    },
    calendarCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    monthTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
    },
    weekDays: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 12,
    },
    weekDayText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#C7C7CC',
        width: 40,
        textAlign: 'center',
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    calendarDayContainer: {
        width: '14.28%', // 7 days
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
    },
    calendarDayEmpty: {
        width: '14.28%',
        aspectRatio: 1,
    },
    calendarDay: {
        width: '100%',
        height: '100%',
        borderRadius: 999,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayCompleted: {
        backgroundColor: '#3F7E44',
    },
    dayToday: {
        borderWidth: 2,
        borderColor: '#3F7E44',
    },
    dayText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    dayTextCompleted: {
        color: '#fff',
    },
    dayTextToday: {
        color: '#3F7E44',
        fontWeight: '800',
    },
    completionDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#3F7E44',
        marginTop: 2,
        position: 'absolute',
        bottom: 6,
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginTop: 32,
        gap: 12,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        color: '#8E8E93',
        lineHeight: 20,
    },
});
