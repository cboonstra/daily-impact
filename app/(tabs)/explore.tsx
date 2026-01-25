import { SDG_ACTIONS } from '@/constants/sdgActions';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Modal, PanResponder, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const SDGS = [
  { id: 1, title: 'No Poverty', color: '#E5243B', description: 'End poverty in all its forms everywhere.', icon: require('@/assets/images/sdgs/sdg1.png'), targets: 7, publications: 51, actions: 1562 },
  { id: 2, title: 'Zero Hunger', color: '#DDA63A', description: 'End hunger, achieve food security and improved nutrition and promote sustainable agriculture.', icon: require('@/assets/images/sdgs/sdg2.png'), targets: 8, publications: 42, actions: 1200 },
  { id: 3, title: 'Good Health and Well-being', color: '#4C9F38', description: 'Ensure healthy lives and promote well-being for all at all ages.', icon: require('@/assets/images/sdgs/sdg3.png'), targets: 13, publications: 89, actions: 2100 },
  { id: 4, title: 'Quality Education', color: '#C5192D', description: 'Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all.', icon: require('@/assets/images/sdgs/sdg4.png'), targets: 10, publications: 65, actions: 1800 },
  { id: 5, title: 'Gender Equality', color: '#FF3A21', description: 'Achieve gender equality and empower all women and girls.', icon: require('@/assets/images/sdgs/sdg5.png'), targets: 9, publications: 38, actions: 1150 },
  { id: 6, title: 'Clean Water and Sanitation', color: '#26BDE2', description: 'Ensure availability and sustainable management of water and sanitation for all.', icon: require('@/assets/images/sdgs/sdg6.png'), targets: 8, publications: 34, actions: 950 },
  { id: 7, title: 'Affordable and Clean Energy', color: '#FCC30B', description: 'Ensure access to affordable, reliable, sustainable and modern energy for all.', icon: require('@/assets/images/sdgs/sdg7.png'), targets: 5, publications: 28, actions: 1100 },
  { id: 8, title: 'Decent Work and Economic Growth', color: '#A21942', description: 'Promote sustained, inclusive and sustainable economic growth, full and productive employment and decent work for all.', icon: require('@/assets/images/sdgs/sdg8.png'), targets: 12, publications: 55, actions: 1400 },
  { id: 9, title: 'Industry, Innovation and Infrastructure', color: '#FD6925', description: 'Build resilient infrastructure, promote inclusive and sustainable industrialization and foster innovation.', icon: require('@/assets/images/sdgs/sdg9.png'), targets: 8, publications: 40, actions: 1300 },
  { id: 10, title: 'Reduced Inequality', color: '#DD1367', description: 'Reduce inequality within and among countries.', icon: require('@/assets/images/sdgs/sdg10.png'), targets: 10, publications: 45, actions: 1250 },
  { id: 11, title: 'Sustainable Cities and Communities', color: '#FD9D24', description: 'Make cities and human settlements inclusive, safe, resilient and sustainable.', icon: require('@/assets/images/sdgs/sdg11.png'), targets: 10, publications: 52, actions: 1600 },
  { id: 12, title: 'Responsible Consumption and Production', color: '#BF8B2E', description: 'Ensure sustainable consumption and production patterns.', icon: require('@/assets/images/sdgs/sdg12.png'), targets: 11, publications: 48, actions: 1450 },
  { id: 13, title: 'Climate Action', color: '#3F7E44', description: 'Take urgent action to combat climate change and its impacts.', icon: require('@/assets/images/sdgs/sdg13.png'), targets: 5, publications: 95, actions: 3200 },
  { id: 14, title: 'Life Below Water', color: '#0A97D9', description: 'Conserve and sustainably use the oceans, seas and marine resources for sustainable development.', icon: require('@/assets/images/sdgs/sdg14.png'), targets: 10, publications: 42, actions: 1100 },
  { id: 15, title: 'Life on Land', color: '#56C02B', description: 'Protect, restore and promote sustainable use of terrestrial ecosystems and halt biodiversity loss.', icon: require('@/assets/images/sdgs/sdg15.png'), targets: 12, publications: 35, actions: 980 },
  { id: 16, title: 'Peace, Justice and Strong Institutions', color: '#00689D', description: 'Promote peaceful and inclusive societies for sustainable development.', icon: require('@/assets/images/sdgs/sdg16.png'), targets: 10, publications: 62, actions: 1450 },
  { id: 17, title: 'Partnerships for the Goals', color: '#19486A', description: 'Strengthen the means of implementation and revitalize the Global Partnership for Sustainable Development.', icon: require('@/assets/images/sdgs/sdg17.png'), targets: 19, publications: 120, actions: 4500 },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [selectedSdg, setSelectedSdg] = useState<typeof SDGS[0] | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const handleOpen = async (sdg: typeof SDGS[0]) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedSdg(sdg);
    setIsModalVisible(true);
  };

  useEffect(() => {
    if (isModalVisible && selectedSdg) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isModalVisible, selectedSdg]);

  const handleClose = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsModalVisible(false);
      setSelectedSdg(null);
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          slideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 150 || gestureState.vy > 0.5) {
          handleClose();
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            tension: 50,
            friction: 8,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // Staggered Entry Animation
  const entryAnims = useRef(SDGS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.stagger(50,
      entryAnims.map(anim =>
        Animated.parallel([
          Animated.timing(anim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      )
    ).start();
  }, []);

  const renderSdgTile = (sdg: typeof SDGS[0], index: number) => {
    const scaleAnim = new Animated.Value(1);

    const onPressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const onPressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View
        key={sdg.id}
        style={[
          styles.tileContainer,
          {
            opacity: entryAnims[index],
            transform: [
              {
                scale: Animated.multiply(entryAnims[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1],
                }), scaleAnim)
              },
              {
                translateY: entryAnims[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                })
              }
            ]
          }
        ]}
      >
        <TouchableOpacity
          style={[styles.tile, { backgroundColor: sdg.color }]}
          onPress={() => handleOpen(sdg)}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          activeOpacity={0.9}
        >
          {sdg.icon ? (
            <Image source={sdg.icon} style={styles.tileIcon} contentFit="contain" />
          ) : (
            <View style={styles.placeholderIcon}>
              <Text style={styles.placeholderNumber}>{sdg.id}</Text>
              <Text style={styles.placeholderText} numberOfLines={2}>{sdg.title}</Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {/* Header */}
      <View style={[styles.header, isDark && styles.headerDark]}>
        <View style={{ width: 32 }} />
        <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>SDGs</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1 }}>
          <View style={styles.grid}>
            {SDGS.map((sdg, index) => renderSdgTile(sdg, index))}
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

      {/* Modal Detail View */}
      <Modal
        visible={isModalVisible}
        transparent
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlayContainer}>
          <Animated.View
            style={[
              styles.modalOverlay,
              { opacity: fadeAnim }
            ]}
          >
            <Pressable style={styles.modalDismiss} onPress={handleClose} />
          </Animated.View>

          <Animated.View
            style={[
              styles.modalContent,
              isDark && styles.modalContentDark,
              { transform: [{ translateY: slideAnim }] }
            ]}
            {...panResponder.panHandlers}
          >
            {selectedSdg && (
              <View style={styles.modalInner}>
                <View style={[styles.modalBackground, { backgroundColor: selectedSdg.color }]} />

                <View style={styles.swipeIndicator} />

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleClose}
                >
                  <Ionicons name="close-circle" size={32} color="rgba(255,255,255,0.8)" />
                </TouchableOpacity>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.modalScrollContent}
                >
                  <View style={styles.detailHero}>
                    <View style={styles.detailHeaderInfo}>
                      <Text style={styles.detailNumber}>{selectedSdg.id}</Text>
                      <View>
                        <Text style={styles.detailTitleSmall}>SUSTAINABLE DEVELOPMENT</Text>
                        <Text style={styles.detailTitleLarge}>GOAL</Text>
                      </View>
                    </View>

                    <Text style={styles.sdgMainTitle}>{selectedSdg.title}</Text>
                    <Text style={styles.detailDescriptionWhite}>
                      {selectedSdg.description}
                    </Text>

                    <View style={styles.statsRow}>
                      <View style={styles.statItem}>
                        <Text style={styles.statValue}>{selectedSdg.targets}</Text>
                        <Text style={styles.statLabel}>Targets</Text>
                      </View>
                      <View style={styles.statDivider} />
                      <View style={styles.statItem}>
                        <Text style={styles.statValue}>{selectedSdg.publications}</Text>
                        <Text style={styles.statLabel}>Pubs</Text>
                      </View>
                      <View style={styles.statDivider} />
                      <View style={styles.statItem}>
                        <Text style={styles.statValue}>{selectedSdg.actions}</Text>
                        <Text style={styles.statLabel}>Actions</Text>
                      </View>
                    </View>
                  </View>

                  <View style={[styles.actionsSection, isDark && styles.actionsSectionDark]}>
                    <Text style={[styles.actionsHeader, isDark && styles.textDark]}>What you can do</Text>
                    {SDG_ACTIONS.filter(a => a.sdgId === selectedSdg.id).map((action, index) => (
                      <Animated.View
                        key={action.id}
                        style={[
                          styles.actionCard,
                          isDark && styles.actionCardDark,
                          {
                            opacity: fadeAnim,
                            transform: [{
                              translateY: fadeAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [20 + (index * 10), 0],
                              })
                            }]
                          }
                        ]}
                      >
                        <View style={[styles.actionIconContainer, isDark && styles.actionIconContainerDark]}>
                          <Ionicons name="flash" size={20} color={selectedSdg.color} />
                        </View>
                        <View style={styles.actionContent}>
                          <Text style={[styles.actionTitle, isDark && styles.textDark]}>{action.action}</Text>
                          <Text style={[styles.actionExplanation, isDark && styles.infoTextDark]}>{action.explanation}</Text>
                        </View>
                      </Animated.View>
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    justifyContent: 'center',
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 12,
  },
  tileContainer: {
    width: '31%', // Three items per row with gap
    aspectRatio: 1,
  },
  tile: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tileIcon: {
    width: '100%',
    height: '100%',
  },
  placeholderIcon: {
    padding: 8,
    alignItems: 'center',
  },
  placeholderNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },
  placeholderText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginTop: 4,
  },
  modalOverlayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalDismiss: {
    flex: 1,
  },
  modalContent: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    height: '90%',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  modalContentDark: {
    backgroundColor: '#1E1E1E',
  },
  modalInner: {
    flex: 1,
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 400,
    opacity: 1,
  },
  modalScrollContent: {
    paddingBottom: 40,
  },
  swipeIndicator: {
    width: 40,
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 12,
    position: 'absolute',
    top: 0,
    zIndex: 10,
  },
  detailHero: {
    padding: 24,
    paddingTop: 60,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  detailHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginBottom: 10,
  },
  detailNumber: {
    fontSize: 72,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 72,
  },
  detailTitleSmall: {
    fontSize: 12,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 2,
  },
  detailTitleLarge: {
    fontSize: 40,
    fontWeight: '900',
    color: '#fff',
    lineHeight: 40,
  },
  sdgMainTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginTop: 10,
    marginBottom: 15,
  },
  detailDescriptionWhite: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    lineHeight: 24,
    marginBottom: 30,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 20,
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  actionsSection: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -20,
    padding: 24,
    minHeight: 400,
  },
  actionsSectionDark: {
    backgroundColor: '#1E1E1E',
  },
  actionsHeader: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1C1C1E',
    marginBottom: 20,
  },
  textDark: {
    color: '#F2F2F7',
  },
  actionCard: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#F1F3F5',
  },
  actionCardDark: {
    backgroundColor: '#2C2C2E',
    borderColor: '#3A3A3C',
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  actionIconContainerDark: {
    backgroundColor: '#1C1C1E',
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  actionExplanation: {
    fontSize: 14,
    color: '#636E72',
    lineHeight: 20,
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
});
