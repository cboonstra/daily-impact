import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SDGS = [
  { id: 1, title: 'Geen armoede', color: '#E5243B', description: 'Beëindig armoede in al zijn vormen wereldwijd.', icon: require('@/assets/images/sdgs/sdg1.png'), targets: 7, publications: 51, actions: 1562 },
  { id: 2, title: 'Geen honger', color: '#DDA63A', description: 'Beëindig honger, bereik voedselzekerheid en verbeterde voeding en promoot duurzame landbouw.', icon: require('@/assets/images/sdgs/sdg2.png'), targets: 8, publications: 42, actions: 1200 },
  { id: 3, title: 'Goede gezondheid en welzijn', color: '#4C9F38', description: 'Verzeker een goede gezondheid en promoot welzijn voor alle leeftijden.', icon: require('@/assets/images/sdgs/sdg3.png'), targets: 13, publications: 89, actions: 2100 },
  { id: 4, title: 'Kwaliteitsonderwijs', color: '#C5192D', description: 'Verzeker gelijke toegang tot kwaliteitsvol onderwijs en bevorder levenslang leren voor iedereen.', icon: require('@/assets/images/sdgs/sdg4.png'), targets: 10, publications: 65, actions: 1800 },
  { id: 5, title: 'Gendergelijkheid', color: '#FF3A21', description: 'Bereik gendergelijkheid en empowerment voor alle vrouwen en meisjes.', icon: require('@/assets/images/sdgs/sdg5.png'), targets: 9, publications: 38, actions: 1150 },
  { id: 6, title: 'Schoon water en sanitair', color: '#26BDE2', description: 'Verzeker toegang tot duurzaam beheer van water en sanitair voor iedereen.', icon: require('@/assets/images/sdgs/sdg6.png'), targets: 8, publications: 34, actions: 950 },
  { id: 7, title: 'Betaalbare en duurzame energie', color: '#FCC30B', description: 'Verzeker toegang tot betaalbare, betrouwbare, duurzame en moderne energie voor iedereen.', icon: require('@/assets/images/sdgs/sdg7.png'), targets: 5, publications: 28, actions: 1100 },
  { id: 8, title: 'Waardig werk en economische groei', color: '#A21942', description: 'Bevorder aanhoudende, inclusieve en duurzame economische groei, volledige en productieve tewerkstelling en waardig werk voor iedereen.', icon: require('@/assets/images/sdgs/sdg8.png'), targets: 12, publications: 55, actions: 1400 },
  { id: 9, title: 'Industrie, innovatie en infrastructuur', color: '#FD6925', description: 'Bouw veerkrachtige infrastructuur, bevorder inclusieve en duurzame industrialisering en stimuleer innovatie.', icon: require('@/assets/images/sdgs/sdg9.png'), targets: 8, publications: 40, actions: 1300 },
  { id: 10, title: 'Ongelijkheid verminderen', color: '#DD1367', description: 'Dring ongelijkheid in en tussen landen terug.', icon: require('@/assets/images/sdgs/sdg10.png'), targets: 10, publications: 45, actions: 1250 },
  { id: 11, title: 'Duurzame steden en gemeenschappen', color: '#FD9D24', description: 'Maak steden en menselijke nederzettingen inclusief, veilig, veerkrachtig en duurzaam.', icon: require('@/assets/images/sdgs/sdg11.png'), targets: 10, publications: 52, actions: 1600 },
  { id: 12, title: 'Verantwoorde consumptie en productie', color: '#BF8B2E', description: 'Verzeker duurzame consumptie- en productiepatronen.', icon: require('@/assets/images/sdgs/sdg12.png'), targets: 11, publications: 48, actions: 1450 },
  { id: 13, title: 'Klimaatactie', color: '#3F7E44', description: 'Neem dringend actie om klimaatverandering en haar impact te bestrijden.', icon: require('@/assets/images/sdgs/sdg13.png'), targets: 5, publications: 95, actions: 3200 },
  { id: 14, title: 'Leven in het water', color: '#0A97D9', description: 'Behoud en maak duurzaam gebruik van de oceanen, zeeën en maritieme hulpbronnen.', icon: require('@/assets/images/sdgs/sdg14.png'), targets: 10, publications: 42, actions: 1100 },
  { id: 15, title: 'Leven op het land', color: '#56C02B', description: 'Bescherm, herstel en bevorder het duurzaam gebruik van ecosystemen op het vasteland.', icon: require('@/assets/images/sdgs/sdg15.png'), targets: 12, publications: 35, actions: 980 },
  { id: 16, title: 'Vrede, justitie en sterke instellingen', color: '#00689D', description: 'Bevorder vreedzame en inclusieve samenlevingen met het oog op duurzame ontwikkeling.', icon: require('@/assets/images/sdgs/sdg16.png'), targets: 10, publications: 62, actions: 1450 },
  { id: 17, title: 'Partnerschap om doelstellingen te bereiken', color: '#19486A', description: 'Versterk de implementatiemiddelen en revitaliseer het wereldwijd partnerschap voor duurzame ontwikkeling.', icon: require('@/assets/images/sdgs/sdg17.png'), targets: 19, publications: 120, actions: 4500 },
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
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SDG's</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {SDGS.map(renderSdgTile)}
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
          <View style={styles.modalContent}>
            {selectedSdg && (
              <>
                <View style={[styles.detailHero, { backgroundColor: selectedSdg.color }]}>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setSelectedSdg(null)}
                  >
                    <Ionicons name="close-circle" size={32} color="rgba(255,255,255,0.8)" />
                  </TouchableOpacity>

                  <View style={styles.detailHeaderInfo}>
                    <Text style={styles.detailNumber}>{selectedSdg.id}</Text>
                    <Text style={styles.detailTitleSmall}>{selectedSdg.title}</Text>
                  </View>

                  <Text style={styles.detailTitleLarge}>{selectedSdg.title}</Text>
                  <Text style={styles.detailDescriptionWhite}>
                    {selectedSdg.description}
                  </Text>

                  <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{selectedSdg.targets || '-'}</Text>
                      <Text style={styles.statLabel}>Targets</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{selectedSdg.publications || '-'}</Text>
                      <Text style={styles.statLabel}>Publicaties</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{selectedSdg.actions || '-'}</Text>
                      <Text style={styles.statLabel}>Acties</Text>
                    </View>
                  </View>

                  <TouchableOpacity style={styles.moreInfoButtonOutline}>
                    <Text style={styles.moreInfoButtonTextWhite}>Meer info</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.detailBody}>
                  <Text style={styles.detailBodyTitle}>{selectedSdg.title}</Text>
                  <Text style={styles.detailBodyDescription}>
                    {selectedSdg.description}
                  </Text>

                  <TouchableOpacity style={styles.moreInfoButtonSolid}>
                    <Text style={styles.moreInfoButtonTextSolid}>Meer info</Text>
                  </TouchableOpacity>
                </View>
              </>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
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
    justifyContent: 'space-between',
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
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: '85%',
    overflow: 'hidden',
  },
  detailHero: {
    padding: 30,
    paddingTop: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: 20,
  },
  statItem: {
    alignItems: 'flex-start',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  statLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  moreInfoButtonOutline: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  moreInfoButtonTextWhite: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  detailBody: {
    padding: 30,
  },
  detailBodyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  detailBodyDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 30,
  },
  moreInfoButtonSolid: {
    backgroundColor: '#E5243B', // Default red, can be themed
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
  },
  moreInfoButtonTextSolid: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
