import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, User, Gear, Bell, Calendar, Palette } from '../components/Icons';

const SettingScreen = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton}>
          <ArrowLeft size={24} color="#151314" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.iconButtonPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.listItem}>
          <View style={styles.listIconContainer}>
            <User size={24} color="#151314" />
          </View>
          <View style={styles.listTextContainer}>
            <Text style={styles.listTitle}>Profile</Text>
            <Text style={styles.listSubtitle}>Manage your profile</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.listItem}>
          <View style={styles.listIconContainer}>
            <Gear size={24} color="#151314" />
          </View>
          <View style={styles.listTextContainer}>
            <Text style={styles.listTitle}>Account Settings</Text>
            <Text style={styles.listSubtitle}>Manage your account settings</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Notifications</Text>
        <TouchableOpacity style={styles.listItem}>
          <View style={styles.listIconContainer}>
            <Bell size={24} color="#151314" />
          </View>
          <View style={styles.listTextContainer}>
            <Text style={styles.listTitle}>Notifications</Text>
            <Text style={styles.listSubtitle}>Manage your notification preferences</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Couple Connection</Text>
        <TouchableOpacity style={styles.listItem}>
          <View style={styles.listIconContainer}>
            <Calendar size={24} color="#151314" />
          </View>
          <View style={styles.listTextContainer}>
            <Text style={styles.listTitle}>D-Day</Text>
            <Text style={styles.listSubtitle}>Set your special day</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>App Theme</Text>
        <TouchableOpacity style={styles.listItem}>
          <View style={styles.listIconContainer}>
            <Palette size={24} color="#151314" />
          </View>
          <View style={styles.listTextContainer}>
            <Text style={styles.listTitle}>Theme</Text>
            <Text style={styles.listSubtitle}>Customize the app's appearance</Text>
          </View>
        </TouchableOpacity>
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
    paddingVertical: 8,
  },
  iconButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonPlaceholder: {
    width: 48,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#151314',
    textAlign: 'center',
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#151314',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 16,
    minHeight: 72,
    paddingVertical: 8,
  },
  listIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#f3f2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#151314',
  },
  listSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#7b6f73',
    marginTop: 2,
  },
});

export default SettingScreen;
