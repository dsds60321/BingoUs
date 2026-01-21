import React, { useState } from 'react';
import { View, StyleSheet, StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import DashboardScreen from './src/screens/DashboardScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import ChatScreen from './src/screens/ChatScreen';
import CommunityScreen from './src/screens/CommunityScreen';
import SettingScreen from './src/screens/SettingScreen';
import BottomNav from './src/components/BottomNav';

type TabName = 'Home' | 'Calendar' | 'Chat' | 'Community' | 'Settings';

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabName>('Home');
  const isDarkMode = useColorScheme() === 'dark';

  const renderScreen = () => {
    switch (activeTab) {
      case 'Home':
        return <DashboardScreen />;
      case 'Calendar':
        return <CalendarScreen />;
      case 'Chat':
        return <ChatScreen />;
      case 'Community':
        return <CommunityScreen />;
      case 'Settings':
        return <SettingScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="white" />
      <View style={styles.screenContainer}>
        {renderScreen()}
      </View>
      <BottomNav activeTab={activeTab} onTabPress={setActiveTab} />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  screenContainer: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
    backgroundColor: 'white',
  },
});