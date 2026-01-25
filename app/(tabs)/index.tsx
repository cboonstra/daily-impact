import { LEVEL_SYSTEM } from '@/constants/levels';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useDailyImpact } from '@/hooks/useDailyImpact';
import { useImpactHistory } from '@/hooks/useImpactHistory';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Easing, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

export default function DailyHabitScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { action, isDone, shufflesRemaining, isLoading, shuffle, markDone, unmarkDone } = useDailyImpact();
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
          <TouchableOpacity onPress={handlePrevMonth} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="chevron-back" size={20} color={isDark ? '#fff' : '#333'} />
          </TouchableOpacity>
          <Text style={[styles.monthTitle, isDark && styles.textDark]}>{monthName} {viewYear}</Text>
          <TouchableOpacity onPress={handleNextMonth} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="chevron-forward" size={20} color={isDark ? '#fff' : '#333'} />
          </TouchableOpacity>
        </View>
        <View style={styles.weekDays}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
            <Text key={`${day}-${index}`} style={[styles.weekDayText, isDark && styles.weekDayTextDark]}>{day}</Text>
          ))}
        </View>
        <View style={styles.calendarGrid}>
          {days}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {/* Header */}
      <View style={[styles.header, isDark && styles.headerDark]}>
        <View style={{ width: 32 }} />
        <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>Impact Dashboard</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View>
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
              <TouchableOpacity
                activeOpacity={0.95}
                onPress={onMarkDonePress}
                style={StyleSheet.absoluteFill}
              />

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
                      style={styles.subtleButton}
                      onPress={markDone}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="checkmark-circle-outline" size={24} color={action.color} />
                      <Text style={[styles.subtleButtonText, { color: action.color }]}>Mark as Done</Text>
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
          <Text style={styles.tapTip}>Tap the card to complete your daily impact</Text>
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
          <View style={[styles.levelContainer, isDark && styles.levelContainerDark]}>
            <View style={styles.levelHeader}>
              <View style={styles.levelInfo}>
                <Text style={styles.levelLabel}>Level {currentLevelInfo.level}</Text>
                <Text style={[styles.levelNameText, isDark && styles.textDark]}>{currentLevelInfo.name}</Text>
              </View>
              <Text style={styles.progressText}>
                {nextLevelInfo ? `${total} / ${nextLevelInfo.impacts} impacts` : 'Max Level Reach!'}
              </Text>
            </View>
            <View style={[styles.progressBarBg, isDark && styles.progressBarBgDark]}>
              <Animated.View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${progress * 100}%`,
                    backgroundColor: currentLevelInfo.color
                  }
                ]}
              />
            </View>
          </View>

          {/* Impact Calendar */}
          <View style={{ marginTop: 8 }}>
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
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerDark: {
    backgroundColor: '#1E1E1E',
    borderBottomColor: '#2C2C2E',
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
    gap: 16,
    marginBottom: 40,
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
  levelContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  levelContainerDark: {
    backgroundColor: '#1E1E1E',
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  levelInfo: {
    gap: 2,
  },
  levelLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8E8E93',
    textTransform: 'uppercase',
  },
  levelNameText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#333',
  },
  progressText: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '600',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#F2F2F7',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarBgDark: {
    backgroundColor: '#2C2C2E',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  sectionHeader: {
    marginBottom: 12,
    marginTop: 32,
  },
  sectionHeaderFirst: {
    marginTop: 0,
    marginBottom: 16,
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
    borderRadius: 16,
    padding: 16,
    marginTop: 32,
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
    marginBottom: 20,
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
});
