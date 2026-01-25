import { useDailyImpact } from '@/hooks/useDailyImpact';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Easing, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';

export default function DailyHabitScreen() {
  const { action, isDone, shufflesRemaining, isLoading, shuffle, markDone, unmarkDone } = useDailyImpact();
  const cardRef = useRef<View>(null);

  // Animations
  const popAnim = useRef(new Animated.Value(0)).current;
  const burstAnim = useRef(new Animated.Value(0)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;
  const [showParticles, setShowParticles] = useState(false);
  const [prevColor, setPrevColor] = useState(action?.color || '#3F7E44');

  useEffect(() => {
    if (action?.color) {
      colorAnim.setValue(0);
      Animated.timing(colorAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false, // Colors need false
      }).start(() => {
        setPrevColor(action.color);
      });
    }
  }, [action?.color]);

  useEffect(() => {
    if (isDone) {
      // Trigger happy animation
      setShowParticles(true);
      popAnim.setValue(0);
      burstAnim.setValue(0);

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

  if (isLoading || !action) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#3F7E44" />
      </View>
    );
  }

  const animatedBgColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [prevColor, action.color],
  });

  const renderParticles = () => {
    if (!showParticles) return null;

    const particles = ['✨', '🌱', '❤️', '🌟', '🍃', '🔥', '🌍', '🌎', '🌏', '🦋', '🌸', '🌈'];
    return particles.map((p, i) => {
      const angle = (i / particles.length) * Math.PI * 2;
      const x = Math.cos(angle) * 200;
      const y = Math.sin(angle) * 200;

      const translateY = burstAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, y - 60],
      });

      const translateX = burstAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, x],
      });

      const rotate = burstAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', (i % 2 === 0 ? 360 : -360) + 'deg'],
      });

      const opacity = burstAnim.interpolate({
        inputRange: [0, 0.1, 0.8, 1],
        outputRange: [0, 1, 1, 0],
      });

      const scale = burstAnim.interpolate({
        inputRange: [0, 0.2, 1],
        outputRange: [0.3, 1.8, 0.8],
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
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your action for today</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1 }}>
          <Animated.View style={[styles.mainCard, { backgroundColor: animatedBgColor }]}>
            <TouchableOpacity
              activeOpacity={0.95}
              onPress={() => !isDone && markDone()}
              style={StyleSheet.absoluteFill}
            />

            {isDone && (
              <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 32 }]} />
            )}

            <View style={styles.cardHeader}>
              <View style={styles.sdgBadge}>
                <Text style={styles.sdgText}>SDG {action.sdgId}: {action.sdgTitle}</Text>
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
                      onPress={shuffle}
                      activeOpacity={0.6}
                    >
                      <Ionicons name="shuffle-outline" size={20} color="rgba(255,255,255,0.7)" />
                      <Text style={styles.minimalShuffleText}>Shuffle ({shufflesRemaining} left)</Text>
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                <View style={styles.doneMessage}>
                  <View style={styles.completionAnimationContainer}>
                    {renderParticles()}
                    <Animated.View style={{ transform: [{ scale: popAnim }] }}>
                      <Ionicons name="checkmark-circle" size={80} color="#fff" />
                    </Animated.View>
                  </View>
                  <Animated.Text style={[styles.doneMessageText, { opacity: popAnim }]}>Great job!</Animated.Text>
                  <Animated.Text style={[styles.availableText, { opacity: popAnim }]}>Available again tomorrow</Animated.Text>
                </View>
              )}

              {isDone && (
                <TouchableOpacity
                  onPress={unmarkDone}
                  style={styles.devUndo}
                  activeOpacity={0.5}
                >
                  <Text style={styles.devUndoText}>Undo (dev)</Text>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>

          {!isDone && (
            <Text style={styles.footerNote}>Tap the card to complete your daily impact</Text>
          )}
        </View>

        {/* Footer Tag */}
        <View style={styles.infoBox}>
          <Ionicons name="sparkles-outline" size={20} color="#FFB300" />
          <Text style={styles.infoText}>
            Consistent actions create the biggest impact. Keep it up!
          </Text>
        </View>
      </ScrollView>

      {/* HIDDEN SHAREABLE CARD - Off-screen specifically for captureRef */}
      <View style={styles.offscreenContainer} pointerEvents="none">
        <View
          ref={cardRef}
          collapsable={false}
          style={[styles.mainCard, { backgroundColor: action.color, width: 350 }]}
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
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingBottom: 120,
    flexGrow: 1,
  },
  mainCard: {
    borderRadius: 32,
    padding: 32,
    paddingTop: 24,
    height: 560,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
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
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
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


