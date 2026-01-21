import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gear } from '../components/Icons';

const DashboardScreen = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Text style={styles.headerTitle}>Home</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Gear size={24} color="#141414" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image
            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBPYXHpeuxKJuuUeL-R4WuLoqd03uNUu7KPLWKE5VtVlCaMfs_BqP_M5x2B57DVbX9OqHWRN-4VmLDU-svAYZqdJqZv5qRqXDMok9-ElpF1sdyROUjF_icogjUw8x43QuPxMWJdEVk_PA5YyEp5TQJLhqJASktW7J8llJxv_XLBZ-wqN7r7uW4gbDryt84Dt8KDMmTZwVNmwTJlhiqbl40qN4TjfX714YeslsDWeA6Pfk7hBXuKZQ8xZvO3FqginTdFy3f4n7oUZT2R" }}
            style={styles.profileImage}
          />
          <View style={styles.profileTextContainer}>
            <Text style={styles.greetingText}>Hi, Alex & Sarah</Text>
            <Text style={styles.subGreetingText}>You've been together for 2 years</Text>
          </View>
        </View>

        {/* Daily Connection */}
        <Text style={styles.sectionTitle}>Daily Connection</Text>
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardSubtitle}>Today's Question</Text>
              <Text style={styles.cardTitle}>What's one thing you appreciate about our relationship?</Text>
              <Text style={styles.cardSubtitle}>Reflect and share your thoughts</Text>
            </View>
            <Image
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDierb3Xd_BNtMs4iV4uiwzNnpWssZSXGBHUR4-YMWOhERl-VxuCVN8ldj9HdzAqaJrsaX04eY37rSFf6Yh_28zdO1SQ4EtfDl2y4kljmryhaDu2GGbrW3Fcb5qHXaZQlYUBgwQC99GSeXugMe9D5EwM2rOQ80b81iU_m1h4DEjMYWZWbyVD-081N_ylhrpEQCZdUQ5nvJxOWtnFINE4DE7zrwbAUtGPKgK52Y9MJew0R2hIq7dpBp41faCr02hSWRuMLB1JX976xxp" }}
              style={styles.cardImage}
            />
          </View>
        </View>

        {/* Relationship Goals */}
        <Text style={styles.sectionTitle}>Relationship Goals</Text>
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Plan a Date Night</Text>
              <Text style={styles.cardSubtitle}>Schedule a special evening together</Text>
            </View>
            <Image
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAcu9e8vjlYxMH2qBE83QyX39zCM-Grk1M-OMYnikOwvnVnC6v_N3l1q64WhUfHzEomSO1z08JFfGnAA17ixhW7tYrWYhv_qBcAZjXkqXOl2yFsEuc4H2VV4Gh72kn9G-J1WhreL6qza7_lkCwdNEFeKJiZqDc9BeobutzIcksv8EZaMhLkpRdFdUmfz53XdRXfXeYFoXcH1dqC3EsOQVfysUnZxEYRshfsrdIwJ0RTVx7thXn90euoKDfXuekafbKJNVCZERumkoyO" }}
              style={styles.cardImage}
            />
          </View>
        </View>

        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Set a Relationship Goal</Text>
              <Text style={styles.cardSubtitle}>Define and work towards a shared objective</Text>
            </View>
            <Image
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCwcHZvRtSUvicNcW3EBaUAQZAQXS2yDGkDE5EtQ0h8zi8WjYyR64mXLDbJ2nPHCDwOYeCSGUu3x9tp8Y-sZoCqvXrqNbsyQ1F9eDGh5qZ4q0k4qkqVUhhf1x_OkFqcBELno8qRBgLJhMJzCbGYdpgEsBIZgTmSPRk4zl8cKZCiKtKHZDtGCS-XQ6q-mckf-Uc5ajXFuWEnhAaGt4kZ6WjDTkI7AgVNlxiPL8rHCrQFuM3jt_qNveMZZkeGYdFW8zuxSsGTcgg9mm8K" }}
              style={styles.cardImage}
            />
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 8,
  },
  headerSpacer: {
    width: 48,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#141414',
    textAlign: 'center',
    flex: 1,
  },
  headerButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  profileSection: {
    padding: 16,
    alignItems: 'center',
    gap: 16,
  },
  profileImage: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: '#eee',
  },
  profileTextContainer: {
    alignItems: 'center',
    gap: 4,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#141414',
    textAlign: 'center',
  },
  subGreetingText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#757575',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#141414',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  cardContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 16,
    // HTML doesn't explicitly show shadows/borders, but implies separation.
  },
  cardTextContainer: {
    flex: 2,
    gap: 4,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#141414',
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#757575',
  },
  cardImage: {
    flex: 1,
    aspectRatio: 16 / 9,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
});

export default DashboardScreen;
