import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import DashboardScreen from './src/screens/DashboardScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import ChatScreen from './src/screens/ChatScreen';
import CommunityScreen from './src/screens/CommunityScreen';
import SettingScreen from './src/screens/SettingScreen';
import LoginScreen from './src/screens/LoginScreen';
import BottomNav from './src/components/BottomNav';
import { GlobalDialog } from './src/components/GlobalDialog';
import { setUnauthorizedCallback } from './src/api';

type TabName = 'Home' | 'Calendar' | 'Chat' | 'Community' | 'Settings';

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Default to false (show login first)
  const [activeTab, setActiveTab] = useState<TabName>('Home');
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    // Register the callback to handle 401 Unauthorized responses
    setUnauthorizedCallback(() => {
      setIsLoggedIn(false);
    });
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

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

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="white" />
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      </View>
    );
  }

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
      <GlobalDialog />
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