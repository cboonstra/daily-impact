import { LEVEL_SYSTEM } from '@/constants/levels';
import { useImpact } from '@/context/ImpactContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useImpactHistory } from '@/hooks/useImpactHistory';
import { cancelAllNotifications, scheduleDailyReminder } from '@/utils/notifications';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, Image, Linking, Modal, Platform, ScrollView, Share, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Friend = {
    id: string;
    name: string;
    impactCount: number;
    avatar: string | null;
};

const FRIENDS: Friend[] = [
    { id: '1', name: 'Alex Rivers', impactCount: 42, avatar: null },
    { id: '2', name: 'Sarah Chen', impactCount: 128, avatar: null },
    { id: '3', name: 'Marcus de Vries', impactCount: 15, avatar: null },
    { id: '4', name: 'Elena Petrova', impactCount: 89, avatar: null },
];

const CREATOR_INITIATIVES = [
    {
        id: 'website',
        title: 'Lentil & Lime',
        description: 'Plant-based cooking guides and zero-waste tips.',
        icon: 'restaurant-outline',
        emoji: '🍋',
        url: 'https://lentil-lime.com'
    },
];

const PROFILE_IMAGE_KEY = 'user_profile_image';

// LEVEL_SYSTEM moved to constants/levels.ts


const FriendRow = ({ friend, isDark, isLast, onPress }: { friend: Friend, isDark: boolean, isLast: boolean, onPress: () => void }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handleWave = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 1.4, duration: 150, useNativeDriver: true }),
            Animated.spring(scaleAnim, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true })
        ]).start();
    };

    return (
        <View style={[
            styles.friendItem,
            !isLast && styles.friendDivider,
            !isLast && isDark && styles.friendDividerDark
        ]}>
            <TouchableOpacity
                style={styles.friendContentContainer}
                onPress={onPress}
                activeOpacity={0.7}
            >
                {friend.avatar ? (
                    <Image source={{ uri: friend.avatar }} style={styles.friendAvatar} />
                ) : (
                    <View style={[styles.friendAvatar, styles.avatarInitialsContainer]}>
                        <Text style={styles.avatarInitialsText}>
                            {friend.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </Text>
                    </View>
                )}
                <View style={styles.friendInfo}>
                    <Text style={[styles.friendName, isDark && styles.textDark]}>{friend.name}</Text>
                    <Text style={[styles.friendSubtext, isDark && styles.profileBioDark]}>
                        {friend.impactCount} {friend.impactCount === 1 ? 'impact' : 'impacts'} completed
                    </Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleWave} activeOpacity={0.6}>
                <Animated.View style={[
                    styles.waveButton,
                    isDark && styles.waveButtonDark,
                    { transform: [{ scale: scaleAnim }] }
                ]}>
                    <Text style={styles.waveEmoji}>👋</Text>
                </Animated.View>
            </TouchableOpacity>
        </View>
    );
};

export default function ProfileScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const router = useRouter();
    const { history, refreshHistory, getStats } = useImpactHistory();
    const { profile, updateProfile } = useImpact();
    const { total, streak } = getStats();
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [isLevelModalVisible, setIsLevelModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
    const [viewDate, setViewDate] = useState(new Date());

    // Form state
    const [editName, setEditName] = useState(profile.name);
    const [editBio, setEditBio] = useState(profile.bio);
    const [editEmail, setEditEmail] = useState(profile.email);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const toggleNotifications = async (value: boolean) => {
        setNotificationsEnabled(value);
        if (value) {
            await scheduleDailyReminder(9, 0, "Daily Impact", "Your new daily action is ready! 🌱");
            if (Platform.OS !== 'web') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
        } else {
            await cancelAllNotifications();
            if (Platform.OS !== 'web') {
                Haptics.selectionAsync();
            }
        }
    };

    const currentLevelInfo = [...LEVEL_SYSTEM].reverse().find(l => total >= l.impacts) || LEVEL_SYSTEM[0];

    // Animations
    const fadeAnims = useRef([
        new Animated.Value(0), // Profile Brief
        new Animated.Value(0), // Stats Row (New)
        new Animated.Value(0), // Friends
        new Animated.Value(0), // Support
        new Animated.Value(0), // Details
    ]).current;

    const avatarScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(avatarScale, { toValue: 1.05, duration: 3000, useNativeDriver: true }),
                Animated.timing(avatarScale, { toValue: 1, duration: 3000, useNativeDriver: true })
            ])
        ).start();
    }, []);

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
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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

    return (
        <View style={[styles.container, isDark && styles.containerDark]}>
            <BlurView
                intensity={80}
                tint={isDark ? 'dark' : 'light'}
                style={[styles.header, isDark && styles.headerDark]}
            >
                <View style={{ width: 32 }} />
                <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>Profile</Text>
                <TouchableOpacity
                    style={styles.settingsButton}
                    onPress={async () => {
                        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setEditName(profile.name);
                        setEditBio(profile.bio);
                        setEditEmail(profile.email);
                        setIsEditModalVisible(true);
                    }}
                >
                    <Ionicons name="settings-outline" size={24} color={isDark ? '#fff' : '#333'} />
                </TouchableOpacity>
            </BlurView>

            <ScrollView
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingTop: Platform.OS === 'ios' ? 120 : 100 }
                ]}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.profileContent}>
                    {/* Profile Brief */}
                    <Animated.View style={[
                        styles.profileBriefCard,
                        isDark && styles.cardDark,
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
                            <Animated.View style={{ transform: [{ scale: avatarScale }] }}>
                                {profileImage ? (
                                    <Image source={{ uri: profileImage }} style={styles.avatar} />
                                ) : (
                                    <View style={[styles.avatar, styles.avatarInitialsContainer, isDark && styles.avatarInitialsContainerDark]}>
                                        <Text style={[styles.avatarInitialsText, styles.avatarInitialsTextLarge]}>
                                            {profile.name
                                                ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                                                : '?'}
                                        </Text>
                                    </View>
                                )}
                                <View style={[styles.editAvatarBadge, isDark && styles.editAvatarBadgeDark]}>
                                    <Ionicons name="camera" size={16} color="#fff" />
                                </View>
                            </Animated.View>
                        </TouchableOpacity>

                        <Text style={[styles.profileName, isDark && styles.textDark]}>{profile.name}</Text>
                        <Text style={[styles.profileBio, isDark && styles.profileBioDark]}>{profile.bio}</Text>
                    </Animated.View>

                    {/* New Stats Grid */}
                    <Animated.View style={[
                        styles.statsGrid,
                        {
                            opacity: fadeAnims[1],
                            transform: [{
                                translateY: fadeAnims[1].interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [20, 0],
                                })
                            }]
                        }
                    ]}>
                        <View style={[styles.statCard, isDark && styles.cardDark]}>
                            <View style={[styles.statIconContainer, { backgroundColor: '#E8F5E9' }]}>
                                <Ionicons name="leaf" size={20} color="#3F7E44" />
                            </View>
                            <Text style={[styles.statValue, isDark && styles.textDark]}>{total}</Text>
                            <Text style={styles.statLabel}>Impacts</Text>
                        </View>

                        <View style={[styles.statCard, isDark && styles.cardDark]}>
                            <View style={[styles.statIconContainer, { backgroundColor: '#FFF3E0' }]}>
                                <Ionicons name="flame" size={20} color="#F57C00" />
                            </View>
                            <Text style={[styles.statValue, isDark && styles.textDark]}>{streak}</Text>
                            <Text style={styles.statLabel}>Day Streak</Text>
                        </View>

                        <TouchableOpacity
                            style={[styles.statCard, isDark && styles.cardDark]}
                            onPress={() => setIsLevelModalVisible(true)}
                        >
                            <View style={styles.statCardInner}>
                                <View style={[styles.statIconContainer, { backgroundColor: currentLevelInfo.color + '20' }]}>
                                    <Ionicons name={currentLevelInfo.icon as any} size={20} color={currentLevelInfo.color} />
                                </View>
                                <Ionicons name="chevron-forward" size={16} color={isDark ? '#666' : '#C7C7CC'} style={styles.statArrow} />
                            </View>
                            <Text style={[styles.statValue, isDark && styles.textDark]}>{currentLevelInfo.level}</Text>
                            <Text style={styles.statLabel}>Current Level</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Friends Section */}
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
                            <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Friends</Text>
                            <TouchableOpacity onPress={handleInviteFriend}>
                                <Text style={styles.seeAllText}>Add Friend</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.friendsCard, isDark && styles.cardDark]}>
                            {FRIENDS.length > 0 ? (
                                FRIENDS.map((friend, index) => (
                                    <FriendRow
                                        key={friend.id}
                                        friend={friend}
                                        isDark={isDark}
                                        isLast={index === FRIENDS.length - 1}
                                        onPress={() => setSelectedFriend(friend)}
                                    />
                                ))
                            ) : (
                                <View style={styles.emptyStateContainer}>
                                    <View style={styles.emptyCircle}>
                                        <Ionicons name="people-outline" size={32} color={isDark ? '#3A3A3C' : '#E5E5EA'} />
                                    </View>
                                    <Text style={[styles.emptyStateTitle, isDark && styles.textDark]}>No friends yet</Text>
                                    <Text style={styles.emptyStateSub}>Impact is better together. Invite friends to start your journey!</Text>
                                </View>
                            )}
                        </View>
                    </Animated.View>
                    {/* Support our Mission Section */}
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
                            <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Support the Mission</Text>
                        </View>
                        <View style={[styles.supportCard, isDark && styles.supportCardDark]}>
                            <View style={styles.supportContentWrapper}>
                                <View style={styles.supportIconContainer}>
                                    <Text style={styles.supportEmoji}>☕</Text>
                                </View>
                                <View style={styles.supportTextContent}>
                                    <Text style={[styles.supportTitle, isDark && styles.textDark]}>Fuel Our Work</Text>
                                    <Text style={styles.supportDescription}>
                                        Daily Impact is free & ad-free. Consider supporting our mission.
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={styles.donateButton}
                                onPress={() => Linking.openURL('https://ko-fi.com/dailyimpact')}
                            >
                                <Ionicons name="heart" size={16} color="#fff" style={{ marginRight: 6 }} />
                                <Text style={styles.donateButtonText}>Support the Mission</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>

                    {/* Creator's Initiatives Section */}
                    <Animated.View style={{
                        opacity: fadeAnims[3], // Reuse same animation timing or add a new one
                        transform: [{
                            translateY: fadeAnims[3].interpolate({
                                inputRange: [0, 1],
                                outputRange: [20, 0],
                            })
                        }],
                        marginTop: 10 // Extra spacing
                    }}>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, isDark && styles.textDark]}>More from Charlotte</Text>
                        </View>
                        <View style={[styles.initiativesCard, isDark && styles.initiativesCardDark]}>
                            {CREATOR_INITIATIVES.map((item, index) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[
                                        styles.initiativeRow,
                                        index !== CREATOR_INITIATIVES.length - 1 && styles.initiativeDivider,
                                        index !== CREATOR_INITIATIVES.length - 1 && isDark && styles.initiativeDividerDark
                                    ]}
                                    onPress={() => Linking.openURL(item.url)}
                                >
                                    <View style={[styles.initiativeIconBox, { backgroundColor: isDark ? '#3A3A3C' : '#F0F2F5' }]}>
                                        <Text style={{ fontSize: 20 }}>{item.emoji}</Text>
                                    </View>
                                    <View style={styles.initiativeInfo}>
                                        <Text style={[styles.initiativeTitle, isDark && styles.textDark]}>{item.title}</Text>
                                        <Text style={styles.initiativeDesc} numberOfLines={1}>{item.description}</Text>
                                    </View>
                                    <Ionicons name="open-outline" size={16} color={isDark ? '#8E8E93' : '#C7C7CC'} />
                                </TouchableOpacity>
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
                            <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Account Details</Text>
                        </View>
                        <View style={[styles.detailsCard, isDark && styles.cardDark]}>
                            <View style={[styles.detailItem, styles.friendDivider, isDark && styles.friendDividerDark]}>
                                <Ionicons name="mail-outline" size={20} color="#8E8E93" style={styles.detailIcon} />
                                <View>
                                    <Text style={styles.detailLabel}>Email</Text>
                                    <Text style={[styles.detailValue, isDark && styles.textDark]}>{profile.email}</Text>
                                </View>
                            </View>
                            <View style={[styles.detailItem, styles.friendDivider, isDark && styles.friendDividerDark]}>
                                <Ionicons name="notifications-outline" size={20} color="#8E8E93" style={styles.detailIcon} />
                                <View style={{ flex: 1, paddingRight: 10 }}>
                                    <Text style={styles.detailLabel}>Daily Reminders</Text>
                                    <Text style={[styles.detailValue, isDark && styles.textDark]}>{notificationsEnabled ? 'On' : 'Off'}</Text>
                                </View>
                                <Switch
                                    value={notificationsEnabled}
                                    onValueChange={toggleNotifications}
                                    trackColor={{ false: '#767577', true: '#3F7E44' }}
                                    thumbColor={'#f4f3f4'}
                                    ios_backgroundColor="#3e3e3e"
                                />
                            </View>
                            <View style={[styles.detailItem, styles.friendDivider, isDark && styles.friendDividerDark]}>
                                <Ionicons name="calendar-outline" size={20} color="#8E8E93" style={styles.detailIcon} />
                                <View>
                                    <Text style={styles.detailLabel}>Joined</Text>
                                    <Text style={[styles.detailValue, isDark && styles.textDark]}>January 24, 2026</Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={styles.detailItem}
                                onPress={() => router.push('/privacy-policy')}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="shield-checkmark-outline" size={20} color="#8E8E93" style={styles.detailIcon} />
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.detailLabel}>Privacy Policy</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={16} color={isDark ? '#636366' : '#C7C7CC'} />
                            </TouchableOpacity>
                        </View>
                    </Animated.View>

                    <TouchableOpacity style={styles.logoutButton}>
                        <Text style={styles.logoutText}>Log Out</Text>
                    </TouchableOpacity>

                    {/* Footer Tag */}
                    <View style={[styles.infoBox, isDark && styles.infoBoxDark]}>
                        <Ionicons name="sparkles-outline" size={20} color="#FFB300" />
                        <Text style={[styles.infoText, isDark && styles.infoTextDark]}>
                            Consistent actions create the biggest impact. Keep it up!
                        </Text>
                    </View>
                </View>
            </ScrollView >

            {/* Level Modal */}
            < Modal
                visible={isLevelModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setIsLevelModalVisible(false)
                }
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setIsLevelModalVisible(false)}
                >
                    <View
                        style={[styles.modalContent, isDark && styles.modalContentDark]}
                        onStartShouldSetResponder={() => true}
                    >
                        <View style={styles.modalHeader}>
                            <View style={[styles.modalIconContainer, { backgroundColor: currentLevelInfo.color + '20' }]}>
                                <Ionicons name={currentLevelInfo.icon as any} size={32} color={currentLevelInfo.color} />
                            </View>
                            <Text style={[styles.modalTitle, isDark && styles.textDark]}>{currentLevelInfo.name}</Text>
                            <View style={styles.progressBarContainer}>
                                <View style={styles.progressBarBackground}>
                                    <View style={[styles.progressBarFillWrapper, {
                                        width: `${(() => {
                                            const nextLevel = LEVEL_SYSTEM.find(l => l.level === currentLevelInfo.level + 1);
                                            if (!nextLevel) return 100;
                                            const progress = (total - currentLevelInfo.impacts) / (nextLevel.impacts - currentLevelInfo.impacts);
                                            return Math.min(Math.max(progress * 100, 5), 100);
                                        })()}%`,
                                    }]}>
                                        <View style={[styles.progressBarFill, { backgroundColor: currentLevelInfo.color }]} />
                                    </View>
                                </View>
                                <Text style={styles.progressText}>
                                    {(() => {
                                        const nextLevel = LEVEL_SYSTEM.find(l => l.level === currentLevelInfo.level + 1);
                                        if (!nextLevel) return 'Max level reached! 🎉';
                                        const remaining = nextLevel.impacts - total;
                                        return `${remaining} more ${remaining === 1 ? 'impact' : 'impacts'} to reach ${nextLevel.name}`;
                                    })()}
                                </Text>
                            </View>
                        </View>

                        <ScrollView style={styles.levelsList} showsVerticalScrollIndicator={false}>
                            <View style={styles.timelineContainer}>
                                {LEVEL_SYSTEM.map((l, index) => {
                                    if (index === LEVEL_SYSTEM.length - 1) return null;
                                    return (
                                        <View
                                            key={`line-${l.level}`}
                                            style={[
                                                styles.timelineSegment,
                                                {
                                                    backgroundColor: l.color,
                                                    top: 30 + (index * 88), // Approximate spacing based on item height
                                                    height: 88
                                                }
                                            ]}
                                        />
                                    );
                                })}
                            </View>
                            {LEVEL_SYSTEM.map((l, index) => {
                                const isReached = total >= l.impacts;
                                const isCurrent = currentLevelInfo.level === l.level;
                                const isLocked = !isReached;

                                return (
                                    <View key={l.level} style={[
                                        styles.levelRow,
                                        index === LEVEL_SYSTEM.length - 1 && { paddingBottom: 0 }
                                    ]}>
                                        <View style={[
                                            styles.timelineNode,
                                            isReached ? { backgroundColor: l.color, borderColor: l.color } : { backgroundColor: isDark ? '#222' : '#F0F0F0', borderColor: isDark ? '#333' : '#E0E0E0' },
                                            isCurrent && {
                                                transform: [{ scale: 1.3 }],
                                                borderWidth: 3,
                                                borderColor: '#fff',
                                                backgroundColor: l.color // Ensure current node is colored
                                            }
                                        ]}>
                                            <Ionicons
                                                name={isLocked ? "lock-closed" : "checkmark"}
                                                size={isCurrent ? 16 : 14}
                                                color={isReached ? '#fff' : (isDark ? '#555' : '#AAA')}
                                            />
                                        </View>

                                        <View style={[
                                            styles.levelCard,
                                            isDark && styles.levelCardDark,
                                            isCurrent && {
                                                borderColor: l.color,
                                                borderWidth: 1.5,
                                                backgroundColor: isDark ? '#2C2C2E' : '#fff' // Pop out current card
                                            },
                                            isLocked && { opacity: 0.7 } // Slightly dim locked cards
                                        ]}>
                                            <View style={[
                                                styles.levelIconBox,
                                                {
                                                    backgroundColor: isReached ? l.color + '20' : (isDark ? '#3A3A3C' : '#F5F5F5'),
                                                    // Give locked items a hint of their future color
                                                    borderColor: isLocked ? l.color + '10' : 'transparent',
                                                    borderWidth: isLocked ? 1 : 0
                                                }
                                            ]}>
                                                <Ionicons
                                                    name={l.icon as any}
                                                    size={22}
                                                    color={isReached ? l.color : (isLocked ? l.color + '60' : (isDark ? '#555' : '#AAA'))}
                                                />
                                            </View>
                                            <View style={styles.levelInfo}>
                                                <Text style={[
                                                    styles.levelName,
                                                    isDark && styles.textDark,
                                                    isLocked && { color: isDark ? '#888' : '#999' }
                                                ]}>{l.name}</Text>
                                                <Text style={[
                                                    styles.levelRequirement,
                                                    isCurrent && { color: l.color, fontWeight: '700' }
                                                ]}>
                                                    {l.impacts} Impacts
                                                </Text>
                                            </View>
                                            {isCurrent && (
                                                <View style={styles.currentBadge}>
                                                    <Text style={[styles.currentBadgeText, { color: l.color }]}>Current</Text>
                                                </View>
                                            )}
                                        </View>
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
            </Modal >

            {/* Edit Profile Modal */}
            < Modal
                visible={isEditModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setIsEditModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, isDark && styles.modalContentDark]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, isDark && styles.textDark]}>Edit Profile</Text>
                            <Text style={styles.modalSubtitle}>Update your information</Text>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, isDark && styles.textDark]}>Name</Text>
                                <TextInput
                                    style={[styles.input, isDark && styles.inputDark]}
                                    value={editName}
                                    onChangeText={setEditName}
                                    placeholder="Your Name"
                                    placeholderTextColor={isDark ? '#666' : '#8E8E93'}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, isDark && styles.textDark]}>Bio</Text>
                                <TextInput
                                    style={[styles.input, styles.textArea, isDark && styles.inputDark]}
                                    value={editBio}
                                    onChangeText={setEditBio}
                                    placeholder="A little bit about you"
                                    placeholderTextColor={isDark ? '#666' : '#8E8E93'}
                                    multiline
                                    numberOfLines={3}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, isDark && styles.textDark]}>Email</Text>
                                <TextInput
                                    style={[styles.input, isDark && styles.inputDark]}
                                    value={editEmail}
                                    onChangeText={setEditEmail}
                                    placeholder="Your Email"
                                    placeholderTextColor={isDark ? '#666' : '#8E8E93'}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        </ScrollView>

                        <View style={[styles.modalFooter, isDark && styles.modalFooterDark]}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton, isDark && styles.cancelButtonDark]}
                                onPress={() => setIsEditModalVisible(false)}
                            >
                                <Text style={[styles.cancelButtonText, isDark && styles.cancelButtonTextDark]}>Cancel</Text>
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
            </Modal >


            {/* Friend Profile Modal */}
            <Modal
                visible={!!selectedFriend}
                transparent
                animationType="fade"
                onRequestClose={() => setSelectedFriend(null)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setSelectedFriend(null)}
                >
                    <View style={[styles.modalContent, isDark && styles.modalContentDark, { alignItems: 'center' }]}>
                        {selectedFriend && (
                            <>
                                <View style={styles.modalHeader}>
                                    {selectedFriend.avatar ? (
                                        <Image source={{ uri: selectedFriend.avatar }} style={styles.avatar} />
                                    ) : (
                                        <View style={[styles.avatar, styles.avatarInitialsContainer]}>
                                            <Text style={[styles.avatarInitialsText, styles.avatarInitialsTextLarge]}>
                                                {selectedFriend.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                            </Text>
                                        </View>
                                    )}
                                </View>

                                <Text style={[styles.profileName, isDark && styles.textDark, { marginBottom: 8 }]}>
                                    {selectedFriend.name}
                                </Text>

                                <Text style={[styles.profileBio, isDark && styles.profileBioDark, { marginBottom: 24 }]}>
                                    Making an impact one day at a time. 🌱
                                </Text>

                                <View style={[styles.statsGrid, { marginBottom: 24 }]}>
                                    <View style={[styles.statCard, isDark && styles.statCardDark, { backgroundColor: isDark ? '#2C2C2E' : '#F8F9FA', elevation: 0, shadowOpacity: 0 }]}>
                                        <View style={[styles.statIconContainer, { backgroundColor: '#E8F5E9' }]}>
                                            <Ionicons name="leaf" size={20} color="#3F7E44" />
                                        </View>
                                        <Text style={[styles.statValue, isDark && styles.textDark]}>{selectedFriend.impactCount}</Text>
                                        <Text style={styles.statLabel}>Impacts</Text>
                                    </View>

                                    <View style={[styles.statCard, isDark && styles.statCardDark, { backgroundColor: isDark ? '#2C2C2E' : '#F8F9FA', elevation: 0, shadowOpacity: 0 }]}>
                                        <View style={[styles.statIconContainer, { backgroundColor: '#FFF3E0' }]}>
                                            <Ionicons name="flame" size={20} color="#F57C00" />
                                        </View>
                                        <Text style={[styles.statValue, isDark && styles.textDark]}>{Math.floor(selectedFriend.impactCount / 1.5)}</Text>
                                        <Text style={styles.statLabel}>Streak</Text>
                                    </View>

                                    {(() => {
                                        const friendLevel = [...LEVEL_SYSTEM].reverse().find(l => selectedFriend.impactCount >= l.impacts) || LEVEL_SYSTEM[0];
                                        return (
                                            <View style={[styles.statCard, isDark && styles.statCardDark, { backgroundColor: isDark ? '#2C2C2E' : '#F8F9FA', elevation: 0, shadowOpacity: 0 }]}>
                                                <View style={[styles.statIconContainer, { backgroundColor: friendLevel.color + '20' }]}>
                                                    <Ionicons name={friendLevel.icon as any} size={20} color={friendLevel.color} />
                                                </View>
                                                <Text style={[styles.statValue, isDark && styles.textDark]}>{friendLevel.level}</Text>
                                                <Text style={styles.statLabel}>Level</Text>
                                            </View>
                                        );
                                    })()}
                                </View>

                                <TouchableOpacity
                                    style={[styles.waveButton, isDark && styles.waveButtonDark, { width: 140, height: 44, borderRadius: 22, flexDirection: 'row', gap: 8 }]}
                                    onPress={async () => {
                                        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                        // Close modal after wave? Or just give feedback? 
                                        // Let's just give feedback for now
                                        Alert.alert("Waved!", `You waved at ${selectedFriend.name} 👋`);
                                    }}
                                >
                                    <Text style={styles.waveEmoji}>👋</Text>
                                    <Text style={[styles.detailValue, isDark && styles.textDark, { marginTop: 0 }]}>Wave</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </TouchableOpacity>
            </Modal>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    containerDark: {
        backgroundColor: '#121212',
    },
    header: {
        paddingTop: 60,
        paddingBottom: 15,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    headerDark: {
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#333',
    },
    headerTitleDark: {
        color: '#fff',
    },
    settingsButton: {
        padding: 4,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 120,
        flexGrow: 1,
    },
    profileBriefCard: {
        backgroundColor: '#fff',
        borderRadius: 32,
        padding: 24,
        alignItems: 'center',
        shadowColor: 'rgba(0,0,0,0.08)',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 4,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'rgba(0,0,0,0.05)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 2,
    },
    statCardDark: {
        backgroundColor: '#1C1C1E',
    },
    statIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '800',
        color: '#333',
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 11,
        color: '#8E8E93',
        fontWeight: '500',
    },
    profileContent: {
        gap: 20,
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
    editAvatarBadgeDark: {
        borderColor: '#1E1E1E',
    },
    profileName: {
        fontSize: 24,
        fontWeight: '800',
        color: '#333',
        marginBottom: 4,
    },
    textDark: {
        color: '#F2F2F7',
    },
    profileBio: {
        fontSize: 15,
        color: '#8E8E93',
        marginBottom: 24,
        textAlign: 'center',
    },
    profileBioDark: {
        color: '#AEA9A6',
    },

    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 36,
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
    },
    cardDark: {
        backgroundColor: '#1C1C1E',
        borderColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
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
    friendDividerDark: {
        borderBottomColor: '#2C2C2E',
    },
    friendContentContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    friendAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
    },
    avatarInitialsContainer: {
        backgroundColor: '#3F7E44',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInitialsContainerDark: {
        backgroundColor: '#2A5C2E',
    },
    avatarInitialsText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
    avatarInitialsTextLarge: {
        fontSize: 32,
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
    waveButtonDark: {
        backgroundColor: '#3A3A3C',
    },
    waveEmoji: {
        fontSize: 16,
    },
    emptyStateContainer: {
        paddingVertical: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(0,0,0,0.02)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    emptyStateTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1C1C1E',
        marginBottom: 8,
    },
    emptyStateSub: {
        fontSize: 14,
        color: '#8E8E93',
        textAlign: 'center',
        paddingHorizontal: 40,
        lineHeight: 20,
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
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        gap: 16,
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
    modalContentDark: {
        backgroundColor: '#1E1E1E',
    },
    modalHeader: {
        alignItems: 'center',
        marginBottom: 32,
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
    statCardInner: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    statArrow: {
        position: 'absolute',
        right: -8,
        top: -8,
        opacity: 0.6,
    },
    progressBarContainer: {
        width: '100%',
        marginTop: 16,
        paddingHorizontal: 8,
    },
    progressBarBackground: {
        height: 6,
        backgroundColor: '#F0F0F0',
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressBarFillWrapper: {
        height: '100%',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        flex: 1,
    },
    progressText: {
        fontSize: 13,
        color: '#8E8E93',
        textAlign: 'center',
        fontWeight: '500',
    },
    levelsList: {
        marginBottom: 24,
        position: 'relative',
        paddingLeft: 10,
    },
    timelineContainer: {
        position: 'absolute',
        left: 23,
        top: 0,
        bottom: 0,
        width: 4,
        zIndex: -1,
        alignItems: 'center',
    },
    timelineSegment: {
        position: 'absolute',
        width: 3,
        borderRadius: 1.5,
        opacity: 0.3,
    },
    levelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    timelineNode: {
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        marginRight: 16,
        zIndex: 1,
    },
    levelCard: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        padding: 12,
        borderRadius: 16,
    },
    levelCardDark: {
        backgroundColor: '#2C2C2E',
    },
    levelIconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
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
        color: '#333',
        marginBottom: 2,
    },
    levelRequirement: {
        fontSize: 12,
        color: '#8E8E93',
    },
    currentBadge: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginLeft: 8,
    },
    currentBadgeText: {
        fontSize: 10,
        fontWeight: '800',
        textTransform: 'uppercase',
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
    weekDayTextDark: {
        color: '#8E8E93',
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
    calendarDayDark: {
        backgroundColor: '#2C2C2E',
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
    infoBoxDark: {
        backgroundColor: '#1E1E1E',
        borderColor: '#2C2C2E',
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        color: '#8E8E93',
        lineHeight: 20,
    },
    infoTextDark: {
        color: '#AEA9A6',
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
    inputDark: {
        backgroundColor: '#2C2C2E',
        borderColor: '#3A3A3C',
        color: '#fff',
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
    modalFooterDark: {
        borderTopColor: '#2C2C2E',
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
    cancelButtonDark: {
        backgroundColor: '#2C2C2E',
        borderColor: '#3A3A3C',
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
    cancelButtonTextDark: {
        color: '#AEA9A6',
    },
    supportCard: {
        backgroundColor: '#FFFBF5', // Premium warm tint
        borderRadius: 28,
        padding: 20,
        shadowColor: '#F57C00',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'rgba(245, 124, 0, 0.1)',
        overflow: 'hidden',
    },
    supportCardDark: {
        backgroundColor: '#251E16',
        borderColor: 'rgba(245, 124, 0, 0.2)',
        shadowColor: '#000',
    },
    supportContentWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 16,
    },
    supportIconContainer: {
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 179, 0, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    supportEmoji: {
        fontSize: 24,
    },
    supportTextContent: {
        flex: 1,
    },
    supportTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#4A3B22',
        marginBottom: 4,
    },
    supportDescription: {
        fontSize: 13,
        color: '#8E8E93',
        lineHeight: 18,
        fontWeight: '500',
    },
    donateButton: {
        backgroundColor: '#FF9500',
        width: '100%',
        paddingVertical: 14,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#FF9500',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    donateButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '700',
    },
    initiativesCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 20,
        shadowColor: 'rgba(0,0,0,0.05)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 2,
    },
    initiativesCardDark: {
        backgroundColor: '#1C1C1E',
    },
    initiativeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    initiativeDivider: {
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F7',
    },
    initiativeDividerDark: {
        borderBottomColor: '#2C2C2E',
    },
    initiativeIconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    initiativeInfo: {
        flex: 1,
        marginRight: 12,
    },
    initiativeTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    initiativeDesc: {
        fontSize: 13,
        color: '#8E8E93',
    },
});
