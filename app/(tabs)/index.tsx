import { LEVEL_SYSTEM } from '@/constants/levels';
import { MEDALS } from '@/constants/medals';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useDailyImpact } from '@/hooks/useDailyImpact';
import { useImpactHistory } from '@/hooks/useImpactHistory';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Easing, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { captureRef } from 'react-native-view-shot';

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

export default function DailyHabitScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { action, isDone, shufflesRemaining, isLoading, shuffle, markDone, unmarkDone, completedSdgIds } = useDailyImpact();
  const { history, getStats, refreshHistory } = useImpactHistory();
  const { total, streak } = getStats();
  const cardRef = useRef<View>(null);

  useFocusEffect(
    React.useCallback(() => {
      refreshHistory();
    }, [])
  );

  // Animations
  const popAnim = useRef(new Animated.Value(0)).current;
  const burstAnim = useRef(new Animated.Value(0)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;
  const streakPulse = useRef(new Animated.Value(1)).current;
  const [showParticles, setShowParticles] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const [prevColor, setPrevColor] = useState(action?.color || '#3F7E44');
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const holdAnim = useRef(new Animated.Value(0)).current;
  const [isHolding, setIsHolding] = useState(false);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const holdTimeoutRef = useRef<any>(null);

  const getGradientColors = (baseColor: string): [string, string] => {
    return [baseColor, baseColor + 'CC'];
  };

  useEffect(() => {
    if (action?.color) {
      colorAnim.setValue(0);
      Animated.timing(colorAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }).start(() => {
        setPrevColor(action.color);
      });
    }
  }, [action?.color]);

  useEffect(() => {
    if (streak > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(streakPulse, {
            toValue: 1.2,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(streakPulse, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [streak]);

  useEffect(() => {
    // Reset pulse when done or action changes
    pulseAnim.setValue(1);
  }, [isDone, action?.id]);

  useEffect(() => {
    if (isDone) {
      // Trigger happy animation
      setShowParticles(true);
      popAnim.setValue(0);
      burstAnim.setValue(0);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      Animated.parallel([
        Animated.spring(popAnim, {
          toValue: 1,
          tension: 50,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.timing(burstAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        })
      ]).start(() => {
        setTimeout(() => setShowParticles(false), 2000);
      });
    }
  }, [isDone]);

  const handleShare = async () => {
    try {
      const uri = await captureRef(cardRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error('Failed to capture or share card', error);
    }
  };


  // No longer needed: const animatedBgColor = colorAnim.interpolate...

  const renderParticles = () => {
    if (!showParticles) return null;

    const particles = ['✨', '🌱', '❤️', '🌟', '🍃', '🔥', '🌍', '🌎', '🌏', '🦋', '🌸', '🌈', '🌱', '✨', '🌟', '❤️'];
    return (
      <View style={[StyleSheet.absoluteFill, styles.centered]} pointerEvents="none">
        {particles.map((p, i) => {
          const angle = (i / particles.length) * Math.PI * 2;
          const velocity = 150 + Math.random() * 100;
          const x = Math.cos(angle) * velocity;
          const y = Math.sin(angle) * velocity;

          const translateY = burstAnim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, y - 40, y + 20],
          });

          const translateX = burstAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, x],
          });

          const rotate = burstAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', (i % 2 === 0 ? 720 : -720) + 'deg'],
          });

          const opacity = burstAnim.interpolate({
            inputRange: [0, 0.1, 0.7, 1],
            outputRange: [0, 1, 1, 0],
          });

          const scale = burstAnim.interpolate({
            inputRange: [0, 0.2, 0.8, 1],
            outputRange: [0.3, 1.5, 1, 0.5],
          });

          return (
            <Animated.Text
              key={i}
              style={[
                styles.particle,
                {
                  transform: [{ translateX }, { translateY }, { scale }, { rotate }],
                  opacity,
                }
              ]}
            >
              {p}
            </Animated.Text>
          );
        })}
      </View>
    );
  };

  const onShufflePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    shuffle();
  };

  const onMarkDonePress = async () => {
    if (!isDone) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      markDone();
    }
  };

  const handleHoldStart = () => {
    if (isDone) return;
    setIsHolding(true);
    holdAnim.setValue(0);

    // Simplified Haptic: Just a light feedback to start
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Subtler Scale up
    Animated.timing(pulseAnim, {
      toValue: 1.02, // Very subtle growth
      duration: 1200,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();

    // Main hold timing
    Animated.timing(holdAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        onMarkDonePress();
        setIsHolding(false);
        holdAnim.setValue(0);
        pulseAnim.setValue(1);
      }
    });
  };

  const handleHoldEnd = () => {
    if (!isHolding) return;
    setIsHolding(false);
    if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);

    Animated.parallel([
      Animated.spring(holdAnim, {
        toValue: 0,
        tension: 40,
        friction: 7,
        useNativeDriver: false,
      }),
      Animated.spring(pulseAnim, {
        toValue: 1,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      })
    ]).start();
  };

  // Level & Progress logic
  const currentLevelInfo = [...LEVEL_SYSTEM].reverse().find(l => total >= l.impacts) || LEVEL_SYSTEM[0];
  const nextLevelInfo = LEVEL_SYSTEM.find(l => l.level === currentLevelInfo.level + 1);
  const progress = nextLevelInfo
    ? (total - currentLevelInfo.impacts) / (nextLevelInfo.impacts - currentLevelInfo.impacts)
    : 1;

  // Weekly logic
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    return {
      day: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
      completed: !!history[dateStr],
      isToday: i === 6
    };
  });

  if (isLoading || !action) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#3F7E44" />
      </View>
    );
  }

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

  const renderInfoModal = () => (
    <Modal
      visible={isInfoModalVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={() => setIsInfoModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, isDark && styles.modalContentDark]}>
          <TouchableOpacity
            style={styles.closeModalHeaderBtn}
            onPress={() => setIsInfoModalVisible(false)}
          >
            <Ionicons name="close" size={24} color={isDark ? '#fff' : '#333'} />
          </TouchableOpacity>

          <View style={styles.modalIconHero}>
            <View style={styles.infoHeroCircle}>
              <Ionicons name="sparkles" size={40} color="#FFD700" />
            </View>
          </View>

          <Text style={[styles.modalTitle, isDark && styles.textDark]}>About Daily Impact</Text>
          <Text style={styles.modalSubtitle}>Small steps, big change.</Text>

          <ScrollView style={styles.infoModalBody} showsVerticalScrollIndicator={false}>
            <Text style={[styles.infoParagraph, isDark && styles.textDark]}>
              The Sustainable Development Goals (SDGs) are grand, abstract, and can feel out of reach for individuals.
            </Text>
            <Text style={[styles.infoParagraph, isDark && styles.textDark]}>
              We believe that small daily actions are underestimated. When scaled by millions of people, these simple tasks become a powerful force for global impact.
            </Text>

            <View style={[styles.featureInfoRow, isDark && styles.featureInfoRowDark]}>
              <Ionicons name="card-outline" size={24} color="#3F7E44" />
              <View style={styles.featureInfoText}>
                <Text style={[styles.featureInfoTitle, isDark && styles.textDark]}>One Goal a Day</Text>
                <Text style={styles.featureInfoSub}>A single, concrete action to focus your positive energy.</Text>
              </View>
            </View>

            <View style={[styles.featureInfoRow, isDark && styles.featureInfoRowDark]}>
              <Ionicons name="shuffle-outline" size={24} color="#3F7E44" />
              <View style={styles.featureInfoText}>
                <Text style={[styles.featureInfoTitle, isDark && styles.textDark]}>Flexibility</Text>
                <Text style={styles.featureInfoSub}>Not feeling today's action? You have 3 shuffles daily to find a better fit.</Text>
              </View>
            </View>

            <View style={[styles.featureInfoRow, isDark && styles.featureInfoRowDark]}>
              <Ionicons name="stats-chart-outline" size={24} color="#3F7E44" />
              <View style={styles.featureInfoText}>
                <Text style={[styles.featureInfoTitle, isDark && styles.textDark]}>Track Progress</Text>
                <Text style={styles.featureInfoSub}>Watch your impact grow and reach new levels as you build your streak.</Text>
              </View>
            </View>

            <Text style={styles.missionNote}>
              "Together, we can make the world a more sustainable place, one day at a time."
            </Text>
          </ScrollView>

          <TouchableOpacity
            style={styles.modalPrimaryBtn}
            onPress={() => setIsInfoModalVisible(false)}
          >
            <Text style={styles.modalPrimaryBtnText}>Got it!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderCalendar = () => {
    const today = new Date();
    const viewMonth = viewDate.getMonth();
    const viewYear = viewDate.getFullYear();

    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
    const monthName = viewDate.toLocaleString('default', { month: 'long' });
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const days = [];
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(<View key={`pad-${i}`} style={styles.calendarDayEmpty} />);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isCompleted = history[dateStr];
      const isToday = d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

      days.push(
        <View key={d} style={styles.calendarDayContainer}>
          <View style={[
            styles.calendarDay,
            isDark && styles.calendarDayDark,
            isToday && styles.dayToday,
            isToday && isDark && { borderColor: '#56C02B' }
          ]}>
            <Text style={[
              styles.dayText,
              isDark && styles.textDark,
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
      <View style={[styles.calendarCard, isDark && styles.cardDark]}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={handlePrevMonth} hitSlop={15} style={styles.calendarNavBtn}>
            <Ionicons name="chevron-back" size={20} color={isDark ? '#fff' : '#333'} />
          </TouchableOpacity>
          <Text style={[styles.monthTitle, isDark && styles.textDark]}>{monthName} {viewYear}</Text>
          <TouchableOpacity onPress={handleNextMonth} hitSlop={15} style={styles.calendarNavBtn}>
            <Ionicons name="chevron-forward" size={20} color={isDark ? '#fff' : '#333'} />
          </TouchableOpacity>
        </View>

        <View style={styles.weekDays}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
            <Text key={`${day}-${index}`} style={[styles.weekDayText, isDark && styles.weekDayTextDark]}>{day}</Text>
          ))}
        </View>

        {Object.keys(history).length === 0 ? (
          <View style={styles.calendarEmptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="calendar-outline" size={32} color={isDark ? '#3A3A3C' : '#E5E5EA'} />
            </View>
            <Text style={[styles.emptyStateTitle, isDark && styles.textDark]}>Your journey begins</Text>
            <Text style={styles.emptyStateSub}>Complete your first action to start tracking your impact history.</Text>
          </View>
        ) : (
          <View style={styles.calendarGrid}>
            {days}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {/* Header */}
      <BlurView
        intensity={80}
        tint={isDark ? 'dark' : 'light'}
        style={[styles.header, isDark && styles.headerDark]}
      >
        <View style={{ width: 32 }} />
        <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>Impact Dashboard</Text>
        <TouchableOpacity
          style={styles.headerInfoButton}
          onPress={async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setIsInfoModalVisible(true);
          }}
        >
          <Ionicons name="information-circle-outline" size={24} color={isDark ? '#fff' : '#333'} />
        </TouchableOpacity>
      </BlurView>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: Platform.OS === 'ios' ? 120 : 100 } // Allowance for the glass header
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Animated.View style={{ transform: [{ scale: !isDone ? pulseAnim : 1 }] }}>
            <View style={styles.mainCardShadow}>
              {/* Previous Gradient (as base) */}
              <LinearGradient
                colors={getGradientColors(prevColor)}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.mainCard, StyleSheet.absoluteFill]}
              />

              {/* Current Gradient (fading in) */}
              <AnimatedGradient
                colors={getGradientColors(action.color)}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.mainCard,
                  StyleSheet.absoluteFill,
                  { opacity: colorAnim }
                ]}
              />

              <View style={styles.cardContent}>
                {isDone && (
                  <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 32 }]} />
                )}

                <View style={styles.cardHeader}>
                  <View style={styles.sdgBadge}>
                    <Text style={styles.sdgText} numberOfLines={1} ellipsizeMode="tail">
                      SDG {action.sdgId}: {action.sdgTitle}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={handleShare}
                    style={styles.shareButton}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="share-social-outline" size={22} color="#fff" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.headline}>{action.action}</Text>
                <Text style={styles.description}>{action.explanation}</Text>

                <View style={styles.actionContainer}>
                  {!isDone ? (
                    <>
                      <TouchableOpacity
                        style={styles.holdToDoneButton}
                        onPressIn={handleHoldStart}
                        onPressOut={handleHoldEnd}
                        activeOpacity={0.9}
                      >
                        <Animated.View
                          style={[
                            styles.holdProgressOverlay,
                            {
                              width: holdAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0%', '100%']
                              }),
                              backgroundColor: action.color + '20'
                            }
                          ]}
                        />
                        <Ionicons
                          name={isHolding ? "timer-outline" : "checkmark-circle-outline"}
                          size={24}
                          color={action.color}
                        />
                        <Text style={[styles.subtleButtonText, { color: action.color }]}>
                          {isHolding ? 'Hold tight...' : 'Hold to Complete'}
                        </Text>
                      </TouchableOpacity>

                      {shufflesRemaining > 0 && (
                        <TouchableOpacity
                          style={styles.minimalShuffle}
                          onPress={onShufflePress}
                          activeOpacity={0.6}
                        >
                          <Ionicons name="shuffle-outline" size={20} color="rgba(255,255,255,0.7)" />
                          <Text style={styles.minimalShuffleText}>Shuffle ({shufflesRemaining} left)</Text>
                        </TouchableOpacity>
                      )}
                    </>
                  ) : (
                    <View style={styles.doneMessage}>
                      <Ionicons name="sparkles" size={40} color="#FFD700" />
                      <Text style={styles.doneMessageText}>Great job!</Text>
                      <Text style={styles.availableText}>New action tomorrow</Text>

                      <TouchableOpacity
                        onPress={unmarkDone}
                        style={styles.devUndo}
                      >
                        <Text style={styles.devUndoText}>Undo (Dev)</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>

              {/* Particle Feedback */}
              {renderParticles()}
            </View>
          </Animated.View>
        </View>

        {/* Progress & Analytics Section (Below the card) */}
        <View style={styles.dashboardInfo}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, isDark && styles.textDark]}>My Progress</Text>
          </View>

          {/* Weekly Streak */}
          <View style={[styles.weeklyContainer, isDark && styles.weeklyContainerDark]}>
            <View style={styles.weeklyHeader}>
              <Text style={[styles.weeklyTitle, isDark && styles.textDark]}>Weekly Progress</Text>
              <View style={[styles.streakBadge, isDark && styles.streakBadgeDark]}>
                <Animated.View style={{ transform: [{ scale: streakPulse }] }}>
                  <Ionicons name="flame" size={14} color="#FF9500" />
                </Animated.View>
                <Text style={styles.streakBadgeText}>{streak} Day Streak</Text>
              </View>
            </View>
            <View style={styles.weeklyRow}>
              {last7Days.map((day, idx) => (
                <View key={idx} style={styles.dayContainer}>
                  <Text style={[styles.dayLabel, day.isToday && styles.todayLabel]}>{day.day}</Text>
                  <View style={[
                    styles.dayDot,
                    isDark && styles.dayDotDark,
                    day.completed && { backgroundColor: '#3F7E44' },
                    day.isToday && !day.completed && styles.todayDot,
                    day.isToday && !day.completed && isDark && { borderColor: '#56C02B' }
                  ]}>
                    {day.completed && <Ionicons name="checkmark" size={12} color="#fff" />}
                  </View>
                </View>
              ))}
            </View>
          </View>


          {/* Level Progress */}
          <View style={[styles.levelCard, isDark && styles.cardDark]}>
            <View style={styles.levelCardContent}>
              <View style={styles.levelCircularContainer}>
                <Svg width="80" height="80" viewBox="0 0 80 80">
                  <Circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke={isDark ? '#2C2C2E' : '#F2F2F7'}
                    strokeWidth="6"
                    fill="none"
                  />
                  <Circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke={currentLevelInfo.color}
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 36}`}
                    strokeDashoffset={`${2 * Math.PI * 36 * (1 - progress)}`}
                    strokeLinecap="round"
                    transform="rotate(-90 40 40)"
                  />
                </Svg>
                <View style={styles.levelIconOverlay}>
                  <Ionicons name={currentLevelInfo.icon as any} size={28} color={currentLevelInfo.color} />
                </View>
              </View>

              <View style={styles.levelMainInfo}>
                <View style={styles.levelBadgeContainer}>
                  <Text style={styles.levelBadgeText}>LEVEL {currentLevelInfo.level}</Text>
                </View>
                <Text style={[styles.levelNameLarge, isDark && styles.textDark]}>{currentLevelInfo.name}</Text>
                <Text style={styles.levelStatusText}>
                  {nextLevelInfo
                    ? `${nextLevelInfo.impacts - total} more impacts until ${nextLevelInfo.name}`
                    : 'Maximum Level Reached!'}
                </Text>
              </View>
            </View>

            <View style={[styles.levelDetailRow, isDark && styles.levelDetailRowDark]}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Daily Missions</Text>
                <Text style={[styles.detailValue, isDark && styles.textDark]}>{total}</Text>
              </View>
              <View style={styles.detailDivider} />
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Next Rank</Text>
                <Text style={[styles.detailValue, isDark && styles.textDark]}>{nextLevelInfo?.impacts || 'Max'}</Text>
              </View>
            </View>
          </View>

          {/* Medals / Achievements */}
          <View style={styles.medalsSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Achievements</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.medalsScroll}
            >
              {MEDALS.map((medal) => {
                let isEarned = false;
                if (medal.type === 'total') isEarned = total >= medal.requirement;
                if (medal.type === 'streak') isEarned = streak >= medal.requirement;
                if (medal.type === 'sdgs') isEarned = completedSdgIds.length >= medal.requirement;

                return (
                  <View key={medal.id} style={[styles.medalCard, isDark && styles.cardDark]}>
                    <View style={[
                      styles.medalIconContainer,
                      { backgroundColor: isEarned ? medal.color + '20' : isDark ? '#2C2C2E' : '#F2F2F7' }
                    ]}>
                      <Ionicons
                        name={isEarned ? (medal.icon as any) : 'lock-closed'}
                        size={28}
                        color={isEarned ? medal.color : isDark ? '#444' : '#C7C7CC'}
                      />
                    </View>
                    <Text style={[styles.medalTitleText, isDark && styles.textDark]} numberOfLines={1}>
                      {medal.title}
                    </Text>
                    <Text style={styles.medalStatusText}>
                      {isEarned ? 'Unlocked' : 'Locked'}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>

          {/* Impact Calendar */}
          <View>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Impact History</Text>
            </View>
            {renderCalendar()}
          </View>
        </View>

        {/* Footer Tag */}
        <View style={[styles.infoBox, isDark && styles.infoBoxDark]}>
          <Ionicons name="sparkles-outline" size={20} color="#FFB300" />
          <Text style={[styles.infoText, isDark && styles.infoTextDark]}>
            Consistent actions create the biggest impact. Keep it up!
          </Text>
        </View>
      </ScrollView>

      {/* HIDDEN SHAREABLE CARD - Off-screen specifically for captureRef */}
      <View style={styles.offscreenContainer} pointerEvents="none">
        <LinearGradient
          colors={getGradientColors(action.color)}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          ref={cardRef as any}
          collapsable={false}
          style={[styles.mainCard, { width: 350 }]}
        >
          {isDone && (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 32 }]} />
          )}

          <View style={styles.cardHeader}>
            <View style={styles.sdgBadge}>
              <Text style={styles.sdgText}>SDG {action.sdgId}: {action.sdgTitle}</Text>
            </View>
          </View>

          <Text style={styles.headline}>{action.action}</Text>
          <Text style={styles.description}>{action.explanation}</Text>

          <View style={styles.actionContainer}>
            {isDone && (
              <View style={styles.doneMessage}>
                <Ionicons name="checkmark-circle" size={48} color="#fff" />
                <Text style={styles.doneMessageText}>Great job!</Text>
              </View>
            )}

            <View style={styles.shareBranding}>
              <Text style={styles.shareBrandingTitle}>Daily Impact</Text>
              <Text style={styles.shareBrandingText}>Small daily actions for a better tomorrow</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
      {renderInfoModal()}
    </View>
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
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
  headerInfoButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  headerTitleDark: {
    color: '#fff',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 140,
    flexGrow: 1,
  },
  mainCardShadow: {
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    backgroundColor: 'transparent',
  },
  mainCard: {
    borderRadius: 32,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 32,
    paddingTop: 24,
    minHeight: 520,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  shareButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sdgBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    flexShrink: 1,
    marginRight: 12,
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
    letterSpacing: -0.4,
    zIndex: 1,
  },
  holdToDoneButton: {
    width: '100%',
    height: 64,
    backgroundColor: '#fff',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  holdProgressOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 0,
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
    paddingVertical: 10,
  },
  doneMessageText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginTop: 8,
    marginBottom: 2,
  },
  availableText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  dashboardInfo: {
    gap: 20,
    marginTop: 28,
  },
  weeklyContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  weeklyContainerDark: {
    backgroundColor: '#1E1E1E',
    shadowOpacity: 0.2,
  },
  weeklyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  weeklyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  streakBadgeDark: {
    backgroundColor: 'rgba(255, 149, 0, 0.15)',
  },
  streakBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF9500',
  },
  weeklyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayContainer: {
    alignItems: 'center',
    gap: 8,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8E8E93',
  },
  todayLabel: {
    color: '#3F7E44',
    fontWeight: '800',
  },
  dayDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayDotDark: {
    backgroundColor: '#2C2C2E',
  },
  todayDot: {
    borderWidth: 2,
    borderColor: '#3F7E44',
    backgroundColor: '#fff',
  },
  levelCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  levelCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 20,
  },
  levelCircularContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelIconOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelMainInfo: {
    flex: 1,
  },
  levelBadgeContainer: {
    backgroundColor: 'rgba(63, 126, 68, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  levelBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#3F7E44',
    letterSpacing: 1,
  },
  levelNameLarge: {
    fontSize: 22,
    fontWeight: '800',
    color: '#333',
    marginBottom: 4,
  },
  levelStatusText: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
  },
  levelDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  levelDetailRowDark: {
    borderTopColor: '#2C2C2E',
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '600',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  detailDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#F2F2F7',
  },
  sectionHeader: {
    marginBottom: 16,
    marginTop: 36,
  },
  sectionHeaderFirst: {
    marginBottom: 16,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  footerNote: {
    textAlign: 'center',
    color: '#8E8E93',
    fontSize: 13,
    marginTop: 20,
    fontWeight: '500',
  },
  devUndo: {
    marginTop: 20,
    padding: 10,
    alignItems: 'center',
  },
  offscreenContainer: {
    position: 'absolute',
    left: -10000,
    top: 0,
  },
  devUndoText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    textDecorationLine: 'underline',
  },
  shareBranding: {
    marginTop: 20,
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  shareBrandingTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  shareBrandingText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 4,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginTop: 32,
    marginBottom: 10,
    gap: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
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
  textLight: {
    color: '#333',
  },
  textDark: {
    color: '#F2F2F7',
  },
  tapTip: {
    textAlign: 'center',
    color: '#8E8E93',
    fontSize: 12,
    marginTop: 16,
    marginBottom: 8,
    fontWeight: '500',
    opacity: 0.8,
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
  cardDark: {
    backgroundColor: '#1E1E1E',
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
  calendarNavBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.03)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarEmptyState: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconContainer: {
    marginBottom: 12,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  emptyStateSub: {
    fontSize: 13,
    color: '#8E8E93',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 18,
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
    fontWeight: '700',
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
  completionAnimationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    width: '100%',
    marginBottom: 5,
  },
  particle: {
    position: 'absolute',
    fontSize: 24,
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
    borderRadius: 36,
    width: '100%',
    maxHeight: '85%',
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  modalContentDark: {
    backgroundColor: '#1C1C1E',
    borderColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
  },
  closeModalHeaderBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.02)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalIconHero: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  infoHeroCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    color: '#1C1C1E',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 24,
    fontWeight: '600',
  },
  infoModalBody: {
    marginBottom: 20,
  },
  infoParagraph: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    marginBottom: 16,
    textAlign: 'center',
  },
  featureInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    marginBottom: 12,
    gap: 16,
  },
  featureInfoRowDark: {
    backgroundColor: '#2C2C2E',
  },
  featureInfoText: {
    flex: 1,
  },
  featureInfoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  featureInfoSub: {
    fontSize: 13,
    color: '#8E8E93',
    lineHeight: 18,
  },
  missionNote: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#3F7E44',
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 20,
    lineHeight: 20,
    fontWeight: '600',
  },
  modalPrimaryBtn: {
    backgroundColor: '#3F7E44',
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#3F7E44',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalPrimaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  medalsSection: {
  },
  medalsScroll: {
    paddingRight: 20,
    paddingBottom: 4,
    gap: 12,
  },
  medalCard: {
    width: 120,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  medalIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  medalTitleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 2,
  },
  medalStatusText: {
    fontSize: 11,
    color: '#8E8E93',
    fontWeight: '600',
  },
});
