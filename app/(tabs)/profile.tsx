import { useImpact } from '@/context/ImpactContext';
import { useImpactHistory } from '@/hooks/useImpactHistory';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, Image, Modal, ScrollView, Share, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const FRIENDS = [
    { id: '1', name: 'Alex Rivers', impactCount: 42, avatar: 'https://i.pravatar.cc/150?u=alex' },
    { id: '2', name: 'Sarah Chen', impactCount: 128, avatar: 'https://i.pravatar.cc/150?u=sarah' },
    { id: '3', name: 'Marcus de Vries', impactCount: 15, avatar: 'https://i.pravatar.cc/150?u=marcus' },
    { id: '4', name: 'Elena Petrova', impactCount: 89, avatar: 'https://i.pravatar.cc/150?u=elena' },
];

const PROFILE_IMAGE_KEY = 'user_profile_image';
const DEFAULT_AVATAR = 'https://i.pravatar.cc/150?u=lotte';

const LEVEL_SYSTEM = [
    { level: 1, name: 'Newcomer', impacts: 0, icon: 'seedling-outline', color: '#81C784' },
    { level: 2, name: 'Conscious', impacts: 5, icon: 'leaf-outline', color: '#66BB6A' },
    { level: 3, name: 'Active', impacts: 15, icon: 'partly-sunny-outline', color: '#4CAF50' },
    { level: 4, name: 'Impact Maker', impacts: 30, icon: 'earth-outline', color: '#43A047' },
    { level: 5, name: 'Change Agent', impacts: 50, icon: 'flame-outline', color: '#388E3C' },
    { level: 6, name: 'Sustainability Hero', impacts: 100, icon: 'trophy-outline', color: '#2E7D32' },
];

export default function ProfileScreen() {
    const { history, refreshHistory, getStats } = useImpactHistory();
    const { profile, updateProfile } = useImpact();
    const { total, streak } = getStats();
    const [profileImage, setProfileImage] = useState(DEFAULT_AVATAR);
    const [isLevelModalVisible, setIsLevelModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [viewDate, setViewDate] = useState(new Date());

    // Form state
    const [editName, setEditName] = useState(profile.name);
    const [editBio, setEditBio] = useState(profile.bio);
    const [editEmail, setEditEmail] = useState(profile.email);

    const currentLevelInfo = [...LEVEL_SYSTEM].reverse().find(l => total >= l.impacts) || LEVEL_SYSTEM[0];

    // Animations
    const fadeAnims = useRef([
        new Animated.Value(0), // Profile Brief
        new Animated.Value(0), // Stats
        new Animated.Value(0), // Calendar
        new Animated.Value(0), // Friends
        new Animated.Value(0), // Details
    ]).current;

    useFocusEffect(
        useCallback(() => {
            refreshHistory();

            // Trigger staggered entry
            Animated.stagger(100,
                fadeAnims.map(anim =>
                    Animated.timing(anim, {
                        toValue: 1,
                        duration: 600,
                        useNativeDriver: true,
                    })
                )
            ).start();
        }, [])
    );

    useEffect(() => {
        const loadProfileImage = async () => {
            const savedImage = await AsyncStorage.getItem(PROFILE_IMAGE_KEY);
            if (savedImage) setProfileImage(savedImage);
        };
        loadProfileImage();
    }, []);

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

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setProfileImage(uri);
            await AsyncStorage.setItem(PROFILE_IMAGE_KEY, uri);
        }
    };

    const handleEditSave = async () => {
        await updateProfile({
            name: editName,
            bio: editBio,
            email: editEmail,
        });
        setIsEditModalVisible(false);
    };

    const handleInviteFriend = async () => {
        try {
            const result = await Share.share({
                message: `Join me on Daily Impact! I'm making everyday sustainable choices and I'd love to have you in my impact circle. Download here: [Link]`,
                title: 'Invite to Daily Impact',
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // Shared with activity type
                } else {
                    // Shared
                    Alert.alert('Invitation Sent!', 'Your friend has been invited to join Daily Impact.');
                }
            } else if (result.action === Share.dismissedAction) {
                // Dismissed
            }
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
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
                <View style={{ width: 32 }} />
                <Text style={styles.headerTitle}>Profile</Text>
                <TouchableOpacity
                    style={styles.settingsButton}
                    onPress={() => {
                        setEditName(profile.name);
                        setEditBio(profile.bio);
                        setEditEmail(profile.email);
                        setIsEditModalVisible(true);
                    }}
                >
                    <Ionicons name="settings-outline" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={{ flex: 1 }}>
                    {/* Profile Brief */}
                    <Animated.View style={[
                        styles.profileBriefCard,
                        {
                            opacity: fadeAnims[0],
                            transform: [{
                                translateY: fadeAnims[0].interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [20, 0],
                                })
                            }]
                        }
                    ]}>
                        <TouchableOpacity
                            onPress={pickImage}
                            activeOpacity={0.8}
                            style={styles.avatarContainer}
                        >
                            <Image
                                source={{ uri: profileImage }}
                                style={styles.avatar}
                            />
                            <View style={styles.editAvatarBadge}>
                                <Ionicons name="camera" size={16} color="#fff" />
                            </View>
                        </TouchableOpacity>

                        <Text style={styles.profileName}>{profile.name}</Text>
                        <Text style={styles.profileBio}>{profile.bio}</Text>

                        <Animated.View style={[
                            styles.quickStatsRow,
                            {
                                opacity: fadeAnims[1],
                                transform: [{
                                    scale: fadeAnims[1].interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.95, 1],
                                    })
                                }]
                            }
                        ]}>
                            <View style={styles.quickStat}>
                                <Text style={styles.quickStatValue}>{total}</Text>
                                <Text style={styles.quickStatLabel}>{total === 1 ? 'Impact' : 'Impacts'}</Text>
                            </View>
                            <View style={styles.statsDivider} />
                            <View style={styles.quickStat}>
                                <Text style={styles.quickStatValue}>{streak}</Text>
                                <Text style={styles.quickStatLabel}>Days Streak</Text>
                            </View>
                            <View style={styles.statsDivider} />
                            <TouchableOpacity
                                style={styles.quickStat}
                                onPress={() => setIsLevelModalVisible(true)}
                            >
                                <Text style={[styles.quickStatValue, { color: currentLevelInfo.color }]}>Level {currentLevelInfo.level}</Text>
                                <Text style={styles.quickStatLabel}>Impact Level</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </Animated.View>

                    {/* Habit Calendar Section */}
                    <Animated.View style={{
                        opacity: fadeAnims[2],
                        transform: [{
                            translateY: fadeAnims[2].interpolate({
                                inputRange: [0, 1],
                                outputRange: [20, 0],
                            })
                        }]
                    }}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Impact Calendar</Text>
                        </View>
                        {renderCalendar()}
                    </Animated.View>

                    <View style={{ height: 32 }} />

                    {/* Friends Section */}
                    <Animated.View style={{
                        opacity: fadeAnims[3],
                        transform: [{
                            translateY: fadeAnims[3].interpolate({
                                inputRange: [0, 1],
                                outputRange: [20, 0],
                            })
                        }]
                    }}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Friends</Text>
                            <TouchableOpacity onPress={handleInviteFriend}>
                                <Text style={styles.seeAllText}>Add Friend</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.friendsCard}>
                            {FRIENDS.map((friend, index) => (
                                <View key={friend.id} style={[
                                    styles.friendItem,
                                    index !== FRIENDS.length - 1 && styles.friendDivider
                                ]}>
                                    <Image source={{ uri: friend.avatar }} style={styles.friendAvatar} />
                                    <View style={styles.friendInfo}>
                                        <Text style={styles.friendName}>{friend.name}</Text>
                                        <Text style={styles.friendSubtext}>{friend.impactCount} {friend.impactCount === 1 ? 'impact' : 'impacts'} completed</Text>
                                    </View>
                                    <TouchableOpacity style={styles.waveButton}>
                                        <Text style={styles.waveEmoji}>👋</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </Animated.View>

                    {/* Account Details Section */}
                    <Animated.View style={{
                        opacity: fadeAnims[4],
                        transform: [{
                            translateY: fadeAnims[4].interpolate({
                                inputRange: [0, 1],
                                outputRange: [20, 0],
                            })
                        }]
                    }}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Account Details</Text>
                        </View>
                        <View style={styles.detailsCard}>
                            <View style={[styles.detailItem, styles.friendDivider]}>
                                <Ionicons name="mail-outline" size={20} color="#8E8E93" style={styles.detailIcon} />
                                <View>
                                    <Text style={styles.detailLabel}>Email</Text>
                                    <Text style={styles.detailValue}>{profile.email}</Text>
                                </View>
                            </View>
                            <View style={styles.detailItem}>
                                <Ionicons name="calendar-outline" size={20} color="#8E8E93" style={styles.detailIcon} />
                                <View>
                                    <Text style={styles.detailLabel}>Joined</Text>
                                    <Text style={styles.detailValue}>January 24, 2026</Text>
                                </View>
                            </View>
                        </View>
                    </Animated.View>

                    <TouchableOpacity style={styles.logoutButton}>
                        <Text style={styles.logoutText}>Log Out</Text>
                    </TouchableOpacity>
                </View>

                {/* Footer Tag */}
                <View style={styles.infoBox}>
                    <Ionicons name="sparkles-outline" size={20} color="#FFB300" />
                    <Text style={styles.infoText}>
                        Consistent actions create the biggest impact. Keep it up!
                    </Text>
                </View>
            </ScrollView>

            {/* Level Modal */}
            <Modal
                visible={isLevelModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setIsLevelModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setIsLevelModalVisible(false)}
                >
                    <View
                        style={styles.modalContent}
                        onStartShouldSetResponder={() => true}
                    >
                        <View style={styles.modalHeader}>
                            <View style={[styles.modalIconContainer, { backgroundColor: currentLevelInfo.color + '20' }]}>
                                <Ionicons name={currentLevelInfo.icon as any} size={32} color={currentLevelInfo.color} />
                            </View>
                            <Text style={styles.modalTitle}>Impact Levels</Text>
                            <Text style={styles.modalSubtitle}>Current progress: {total} {total === 1 ? 'impact' : 'impacts'}</Text>
                        </View>

                        <ScrollView style={styles.levelsList} showsVerticalScrollIndicator={false}>
                            {LEVEL_SYSTEM.map((l) => {
                                const isReached = total >= l.impacts;
                                const isCurrent = currentLevelInfo.level === l.level;

                                return (
                                    <View key={l.level} style={[
                                        styles.levelItem,
                                        isReached && styles.levelItemReached,
                                        isCurrent && { borderColor: l.color, borderWidth: 2 }
                                    ]}>
                                        <View style={[styles.levelIconBox, { backgroundColor: isReached ? l.color : '#F0F0F0' }]}>
                                            <Ionicons name={l.icon as any} size={20} color={isReached ? '#fff' : '#8E8E93'} />
                                        </View>
                                        <View style={styles.levelInfo}>
                                            <Text style={[styles.levelName, isReached && { color: '#333' }]}>{l.name}</Text>
                                            <Text style={styles.levelRequirement}>{l.impacts} {l.impacts === 1 ? 'impact' : 'impacts'} required</Text>
                                        </View>
                                        {isReached && (
                                            <Ionicons name="checkmark-circle" size={24} color={l.color} />
                                        )}
                                    </View>
                                );
                            })}
                        </ScrollView>

                        <TouchableOpacity
                            style={styles.closeModalButton}
                            onPress={() => setIsLevelModalVisible(false)}
                        >
                            <Text style={styles.closeModalText}>Got it!</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Edit Profile Modal */}
            <Modal
                visible={isEditModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setIsEditModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Edit Profile</Text>
                            <Text style={styles.modalSubtitle}>Update your information</Text>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Name</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editName}
                                    onChangeText={setEditName}
                                    placeholder="Your Name"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Bio</Text>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    value={editBio}
                                    onChangeText={setEditBio}
                                    placeholder="A little bit about you"
                                    multiline
                                    numberOfLines={3}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Email</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editEmail}
                                    onChangeText={setEditEmail}
                                    placeholder="Your Email"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        </ScrollView>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setIsEditModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={handleEditSave}
                            >
                                <Text style={styles.saveButtonText}>Save Changes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#333',
    },
    settingsButton: {
        padding: 4,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
        flexGrow: 1,
    },
    profileBriefCard: {
        backgroundColor: '#fff',
        borderRadius: 32,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        marginBottom: 32,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: '#E8F5E9',
    },
    editAvatarBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#3F7E44',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
    },
    profileName: {
        fontSize: 24,
        fontWeight: '800',
        color: '#333',
        marginBottom: 4,
    },
    profileBio: {
        fontSize: 15,
        color: '#8E8E93',
        marginBottom: 24,
        textAlign: 'center',
    },
    quickStatsRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#f5f5f5',
    },
    quickStat: {
        flex: 1,
        alignItems: 'center',
    },
    quickStatValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
    },
    quickStatLabel: {
        fontSize: 12,
        color: '#8E8E93',
        marginTop: 2,
    },
    statsDivider: {
        width: 1,
        height: '60%',
        backgroundColor: '#f0f0f0',
        alignSelf: 'center',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
    },
    seeAllText: {
        fontSize: 14,
        color: '#3F7E44',
        fontWeight: '600',
    },
    friendsCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        marginBottom: 32,
    },
    friendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    friendDivider: {
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    friendAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
    },
    friendInfo: {
        flex: 1,
    },
    friendName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },
    friendSubtext: {
        fontSize: 13,
        color: '#8E8E93',
        marginTop: 2,
    },
    waveButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F8F9FA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    waveEmoji: {
        fontSize: 16,
    },
    detailsCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        marginBottom: 32,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    detailIcon: {
        marginRight: 16,
    },
    detailLabel: {
        fontSize: 12,
        color: '#8E8E93',
        fontWeight: '500',
    },
    detailValue: {
        fontSize: 15,
        color: '#333',
        fontWeight: '600',
        marginTop: 2,
    },
    logoutButton: {
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 20,
    },
    logoutText: {
        color: '#FF3B30',
        fontSize: 16,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 32,
        width: '100%',
        maxHeight: Dimensions.get('window').height * 0.8,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
    },
    modalHeader: {
        alignItems: 'center',
        marginBottom: 24,
    },
    modalIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#333',
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#8E8E93',
        marginTop: 4,
    },
    levelsList: {
        marginBottom: 24,
    },
    levelItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        backgroundColor: '#F8F9FA',
        marginBottom: 12,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    levelItemReached: {
        backgroundColor: '#fff',
        borderColor: '#f0f0f0',
    },
    levelIconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    levelInfo: {
        flex: 1,
    },
    levelName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#8E8E93',
    },
    levelRequirement: {
        fontSize: 12,
        color: '#8E8E93',
        marginTop: 2,
    },
    closeModalButton: {
        backgroundColor: '#3F7E44',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    closeModalText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
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
        width: '14.28%',
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
    dayToday: {
        borderWidth: 2,
        borderColor: '#3F7E44',
    },
    dayText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
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
        marginTop: 20,
        marginBottom: 10,
        gap: 12,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        color: '#8E8E93',
        lineHeight: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        color: '#333',
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    modalFooter: {
        flexDirection: 'row',
        gap: 12,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        marginTop: 10,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: '#3F7E44',
    },
    cancelButton: {
        backgroundColor: '#F8F9FA',
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 15,
    },
    cancelButtonText: {
        color: '#8E8E93',
        fontWeight: '700',
        fontSize: 15,
    },
});
