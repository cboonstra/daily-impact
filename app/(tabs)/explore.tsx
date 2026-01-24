import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
  const [selectedSdg, setSelectedSdg] = useState<typeof SDGS[0] | null>(null);

  const renderSdgTile = (sdg: typeof SDGS[0]) => (
    <TouchableOpacity
      key={sdg.id}
      style={[styles.tile, { backgroundColor: sdg.color }]}
      onPress={() => setSelectedSdg(sdg)}
      activeOpacity={0.8}
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
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SDGs</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {SDGS.map(renderSdgTile)}
        </View>

        {/* Footer Tag */}
        <View style={styles.infoBox}>
          <Ionicons name="sparkles-outline" size={20} color="#FFB300" />
          <Text style={styles.infoText}>
            Consistent actions create the biggest impact. Keep it up!
          </Text>
        </View>
      </ScrollView>

      {/* Modal Detail View */}
      <Modal
        visible={!!selectedSdg}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedSdg(null)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalDismiss} onPress={() => setSelectedSdg(null)} />
          <View style={[styles.modalContent, selectedSdg ? { backgroundColor: selectedSdg.color } : null]}>
            {selectedSdg && (
              <View style={styles.detailHero}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setSelectedSdg(null)}
                >
                  <Ionicons name="close-circle" size={32} color="rgba(255,255,255,0.8)" />
                </TouchableOpacity>

                <View style={styles.detailHeaderInfo}>
                  <Text style={styles.detailNumber}>{selectedSdg.id}</Text>
                  <Text style={styles.detailTitleSmall}>SDG</Text>
                </View>

                <Text style={styles.detailTitleLarge}>{selectedSdg.title}</Text>
                <Text style={styles.detailDescriptionWhite}>
                  {selectedSdg.description}
                </Text>
              </View>
            )}
          </View>
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
  header: {
    paddingTop: 60,
    paddingBottom: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 12,
  },
  tile: {
    width: '31%', // Three items per row with gap
    aspectRatio: 1,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalDismiss: {
    flex: 1,
  },
  modalContent: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: '85%',
    overflow: 'hidden',
  },
  detailHero: {
    padding: 30,
    paddingTop: 20,
    flex: 1,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  detailHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  detailNumber: {
    fontSize: 48,
    fontWeight: '800',
    color: '#fff',
  },
  detailTitleSmall: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    flexShrink: 1,
  },
  detailTitleLarge: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 15,
  },
  detailDescriptionWhite: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    lineHeight: 24,
    marginBottom: 25,
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
});
