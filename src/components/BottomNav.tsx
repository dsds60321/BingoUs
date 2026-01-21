import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { House, Calendar, ChatCircleDots, Users, Gear, IconProps } from './Icons';

type TabName = 'Home' | 'Calendar' | 'Chat' | 'Community' | 'Settings';

interface BottomNavProps {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabPress }) => {
  const insets = useSafeAreaInsets();
  const tabs: { name: TabName; Icon: React.FC<IconProps> }[] = [
    { name: 'Home', Icon: House },
    { name: 'Calendar', Icon: Calendar },
    { name: 'Chat', Icon: ChatCircleDots },
    { name: 'Community', Icon: Users },
    { name: 'Settings', Icon: Gear },
  ];

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.name;
          const color = isActive ? '#181410' : '#8d755e';

          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tab}
              onPress={() => onTabPress(tab.name)}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <tab.Icon
                  size={24}
                  color={color}
                  weight={isActive ? 'fill' : 'regular'}
                />
              </View>
              <Text style={[styles.label, { color }]}>{tab.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f5f2f0',
  },
  content: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4, // Reduced since paddingBottom is handled by container + insets
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  iconContainer: {
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.015 * 12,
    fontFamily: 'System',
  },
});

export default BottomNav;
