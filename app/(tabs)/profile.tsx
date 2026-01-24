import { useImpactHistory } from '@/hooks/useImpactHistory';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
    const { refreshHistory, getStats } = useImpactHistory();
    const { total, streak } = getStats();
    const [profileImage, setProfileImage] = useState(DEFAULT_AVATAR);
    const [isLevelModalVisible, setIsLevelModalVisible] = useState(false);

    const currentLevelInfo = [...LEVEL_SYSTEM].reverse().find(l => total >= l.impacts) || LEVEL_SYSTEM[0];

    useFocusEffect(
        useCallback(() => {
            refreshHistory();
        }, [])
    );

    useEffect(() => {
        const loadProfileImage = async () => {
            const savedImage = await AsyncStorage.getItem(PROFILE_IMAGE_KEY);
            if (savedImage) setProfileImage(savedImage);
        };
        loadProfileImage();
    }, []);

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

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={{ width: 32 }} />
                <Text style={styles.headerTitle}>Profile</Text>
                <TouchableOpacity style={styles.settingsButton}>
                    <Ionicons name="settings-outline" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Profile Brief */}
                <View style={styles.profileBriefCard}>
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

                    <Text style={styles.profileName}>Lotte Boonstra</Text>
                    <Text style={styles.profileBio}>Making everyday impact counts. 🌍✨</Text>

                    <View style={styles.quickStatsRow}>
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
                    </View>
                </View>

                {/* Friends Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Friends</Text>
                    <TouchableOpacity>
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

                {/* Account Details Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Account Details</Text>
                </View>
                <View style={styles.detailsCard}>
                    <View style={[styles.detailItem, styles.friendDivider]}>
                        <Ionicons name="mail-outline" size={20} color="#8E8E93" style={styles.detailIcon} />
                        <View>
                            <Text style={styles.detailLabel}>Email</Text>
                            <Text style={styles.detailValue}>lotte@dailyimpact.com</Text>
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

                <TouchableOpacity style={styles.logoutButton}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
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
                                            <Text style={styles.levelRequirement}>{l.impacts} {l.impacts === 1 ? 'habit' : 'habits'} required</Text>
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
});
