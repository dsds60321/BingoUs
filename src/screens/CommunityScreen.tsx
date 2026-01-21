import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, Plus } from '../components/Icons';
import PostDetail from './community/PostDetail';
import PostCreate from './community/PostCreate';

const CommunityScreen = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('Photos');
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'create'>('list');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const tabs = ['Photos', 'Diary', 'Missions', 'Reflections'];

  const [posts, setPosts] = useState([
    // Photos
    {
      id: 'p1',
      category: 'Photos',
      title: 'Our trip to the beach',
      description:
        'We had so much fun at the beach today! We built sandcastles, swam in the ocean, and ate ice cream. I love spending time with you.',
      date: '2024-01-20',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA4yHeE0e6Vy2qvkwCkVn_gJBrB7T0GFrz5iJtHgr7egokvtpX3U1Zu4cpSiMblxKIYIC0Av-baLJ_dollZFhEO6zcJy_eNACitCA-moNz0Ej8CkLj1CDjX_X9iGFethKl7A_ljGoUUOjdESbGy17dS_93_Ngjx4CD2H1dwJ6cXz4QCFUgzqojtypirq5xdckop6VMJNROqXA92SUdx3jDJFI2_tLtGKcor24WTumXDeTOS-uVSjM8cjspU_4K9oDREOVpfJ9gj1YP1',
    },
    {
      id: 'p2',
      category: 'Photos',
      title: 'Dinner date',
      description: 'We went to a fancy restaurant for dinner tonight.',
      date: '2024-01-19',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDID8prVKdr4VBIx5Rpj_kBfyIry04hDeExyMLnOHKPQSiUp9yuYcenPqtBFpWd_QIeA-JJJCqLEnvmc4831mI70AD6LHOEfmOCrNREy8mBMXEYuO4a5YQOETgwYfQCacFCghCzdOq5CZrR0tgV87QwoCIntwBJ5bMIpiMPnB8-zAG3nW22E6j0rxq8sh89bkjZJUfbWwZLleXAG46I_H_7MA91dJClZmjcN5isJbaIIyCdQdxb3QVFWdC-wrjM7lazdHOwZK9phaAy',
    },
    // Diary
    {
      id: 'd1',
      category: 'Diary',
      title: 'A quiet evening',
      description:
        'We sat by the window watching the rain fall. It was such a peaceful moment, just the two of us enjoying the silence and the sound of raindrops against the glass.',
      date: '2024-07-10',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBmc14yu1Mnc-9XY-yhFGCBW_-IjKCJyOH5Yj_czAlH_5xMHmKhthmpWlPOcGVu8Q-qysJCTKqzjb3au9tPX1p6Ls-nPdikcR-GH4zzH6CBk3e0rfZms_j_8CCg7G_SHlDXYDcRsoL2WCFOyb9OFo3tn2zz8UCgXDgxlcG63J_rBdroqv6FYhQTT9ww1Omj_1Qg6ovtSaz6a2jljNMsjsrFjhBqWoShsoONqldAHoGKlYGP-UHtnlIW5tVOBLxdBwHKJe3DK0w8o3ji',
    },
    {
      id: 'd2',
      category: 'Diary',
      title: 'Morning Coffee',
      description:
        'The smell of fresh coffee in the morning is the best way to start the day. We talked about our plans for the upcoming trip.',
      date: '2024-07-12',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAcu9e8vjlYxMH2qBE83QyX39zCM-Grk1M-OMYnikOwvnVnC6v_N3l1q64WhUfHzEomSO1z08JFfGnAA17ixhW7tYrWYhv_qBcAZjXkqXOl2yFsEuc4H2VV4Gh72kn9G-J1WhreL6qza7_lkCwdNEFeKJiZqDc9BeobutzIcksv8EZaMhLkpRdFdUmfz53XdRXfXeYFoXcH1dqC3EsOQVfysUnZxEYRshfsrdIwJ0RTVx7thXn90euoKDfXuekafbKJNVCZERumkoyO',
    },
    // Missions
    {
      id: 'm1',
      category: 'Missions',
      title: 'Cook a new recipe',
      description: 'Make pasta from scratch together.',
      status: 'In Progress',
      date: '2024-07-15',
      deadline: '2024-07-20',
      betting: 'Loser does dishes',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCwcHZvRtSUvicNcW3EBaUAQZAQXS2yDGkDE5EtQ0h8zi8WjYyR64mXLDbJ2nPHCDwOYeCSGUu3x9tp8Y-sZoCqvXrqNbsyQ1F9eDGh5qZ4q0k4qkqVUhhf1x_OkFqcBELno8qRBgLJhMJzCbGYdpgEsBIZgTmSPRk4zl8cKZCiKtKHZDtGCS-XQ6q-mckf-Uc5ajXFuWEnhAaGt4kZ6WjDTkI7AgVNlxiPL8rHCrQFuM3jt_qNveMZZkeGYdFW8zuxSsGTcgg9mm8K',
    },
    {
      id: 'm2',
      category: 'Missions',
      title: 'Visit a museum',
      description: 'Go to the modern art museum downtown.',
      status: 'Completed',
      date: '2024-07-01',
      deadline: '2024-07-05',
      betting: 'Winner picks dinner',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDierb3Xd_BNtMs4iV4uiwzNnpWssZSXGBHUR4-YMWOhERl-VxuCVN8ldj9HdzAqaJrsaX04eY37rSFf6Yh_28zdO1SQ4EtfDl2y4kljmryhaDu2GGbrW3Fcb5qHXaZQlYUBgwQC99GSeXugMe9D5EwM2rOQ80b81iU_m1h4DEjMYWZWbyVD-081N_ylhrpEQCZdUQ5nvJxOWtnFINE4DE7zrwbAUtGPKgK52Y9MJew0R2hIq7dpBp41faCr02hSWRuMLB1JX976xxp',
    },
    // Reflections
    {
      id: 'r1',
      category: 'Reflections',
      title: 'I realized my mistake',
      topic: 'Communication',
      content:
        'I feel so grateful when we spend time just talking without any distractions. It makes me feel heard and loved. I am sorry for checking my phone too much.',
      date: '2024-07-12',
      status: 'Acknowledged',
    },
    {
      id: 'r2',
      category: 'Reflections',
      title: 'Sorry about yesterday',
      topic: 'Arguments',
      content:
        'Today I realized how much we have grown together. Looking back at our old photos, we have come such a long way. I should have been more patient.',
      date: '2024-07-10',
      status: 'Pending',
    },
  ]);

  const filteredPosts = posts.filter(post => post.category === activeTab);

  const handleAddPress = () => {
    setViewMode('create');
  };

  const handlePostPress = (post: any) => {
    setSelectedItem(post);
    setViewMode('detail');
  };

  const handleBack = () => {
    setViewMode('list');
    setSelectedItem(null);
  };

  const handleCreateSubmit = (newItem: any) => {
    setPosts([newItem, ...posts]);
    setViewMode('list');
  };

  const handleUpdateItem = (updatedItem: any) => {
    setPosts(posts.map(p => (p.id === updatedItem.id ? updatedItem : p)));
    setSelectedItem(updatedItem); // Update current view
  };

  if (viewMode === 'detail' && selectedItem) {
    return (
      <PostDetail
        item={selectedItem}
        onBack={handleBack}
        onUpdate={handleUpdateItem}
      />
    );
  }

  if (viewMode === 'create') {
    return (
      <PostCreate
        category={activeTab}
        onBack={handleBack}
        onSubmit={handleCreateSubmit}
      />
    );
  }

  const renderItem = (post: any) => {
    const commonProps = {
      key: post.id || Math.random().toString(), // Fallback key
      activeOpacity: 0.9,
      onPress: () => handlePostPress(post),
    };

    if (activeTab === 'Photos') {
      return (
        <TouchableOpacity {...commonProps} style={styles.postCard}>
          <Image source={{ uri: post.image }} style={styles.postImage} />
          <View style={styles.postContent}>
            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.postDescription}>{post.description}</Text>
            <Text style={styles.postDate}>{post.date}</Text>
          </View>
        </TouchableOpacity>
      );
    }

    if (activeTab === 'Diary') {
      return (
        <TouchableOpacity {...commonProps} style={styles.diaryCard}>
          {post.image ? (
            <Image source={{ uri: post.image }} style={styles.diaryImage} />
          ) : null}
          <View style={styles.diaryContent}>
            <Text style={styles.diaryTitle}>{post.title}</Text>
            <Text style={styles.diaryPreview} numberOfLines={2}>
              {post.description}
            </Text>
            <Text style={styles.diaryDate}>{post.date}</Text>
          </View>
        </TouchableOpacity>
      );
    }

    if (activeTab === 'Missions') {
      return (
        <TouchableOpacity {...commonProps} style={styles.missionCard}>
          {post.image ? <Image source={{ uri: post.image }} style={styles.missionImage} /> : null}
          <View style={styles.missionOverlay}>
            <View style={styles.missionContent}>
              <View style={styles.missionHeader}>
                <Text style={styles.missionTitle}>{post.title}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    post.status === 'Completed'
                      ? styles.statusCompleted
                      : styles.statusProgress,
                  ]}
                >
                  <Text style={styles.statusText}>{post.status}</Text>
                </View>
              </View>
              <Text style={styles.missionDescription}>{post.description}</Text>
              <Text style={styles.missionDate}>Deadline: {post.deadline || post.date}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    if (activeTab === 'Reflections') {
      return (
        <TouchableOpacity {...commonProps} style={styles.reflectionCard}>
           <View style={styles.reflectionHeader}>
              <Text style={styles.reflectionTopic}>{post.topic || 'Reflection'}</Text>
              {post.status === 'Acknowledged' && <Text style={styles.reflectionStatus}>✓ Confirmed</Text>}
           </View>
          <Text style={styles.reflectionTitle}>{post.title}</Text>
          <Text style={styles.reflectionPreview} numberOfLines={3}>{post.content || post.description}</Text>
          <Text style={styles.reflectionDate}>{post.date}</Text>
        </TouchableOpacity>
      );
    }

    return null;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Text style={styles.headerTitle}>{activeTab}</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Bell size={24} color="#181311" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Filter Tabs */}
        <View style={styles.tabsContainer}>
          <View style={styles.tabsWrapper}>
            {tabs.map(tab => {
              const isActive = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tab, isActive && styles.activeTab]}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text
                    style={[styles.tabText, isActive && styles.activeTabText]}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Feed List */}
        <View style={styles.feedList}>
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => renderItem(post))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No {activeTab.toLowerCase()} yet.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, styles.fabPosition]}
        onPress={handleAddPress}
        activeOpacity={0.8}
      >
        <Plus size={32} color="white" />
      </TouchableOpacity>
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
  headerSpacer: {
    width: 48,
  },
  iconButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#181311',
    textAlign: 'center',
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80, // Added padding for FAB
  },
  tabsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tabsWrapper: {
    flexDirection: 'row',
    backgroundColor: '#f4f1f0',
    borderRadius: 12,
    padding: 4,
    height: 40,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#896b61',
  },
  activeTabText: {
    color: '#181311',
  },
  feedList: {
    paddingHorizontal: 16,
    gap: 16,
  },
  // Photos Style
  postCard: {
    gap: 8,
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
  postContent: {
    gap: 4,
    paddingVertical: 8,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#181311',
  },
  postDescription: {
    fontSize: 16,
    fontWeight: '400',
    color: '#896b61',
    lineHeight: 24,
  },
  postDate: {
    fontSize: 14,
    fontWeight: '400',
    color: '#896b61',
    marginTop: 4,
  },
  
  // Diary Style
  diaryCard: {
    backgroundColor: '#fdfbf9', // Slightly warmer background for diary
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#f0ece9',
  },
  diaryImage: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
  diaryContent: {
    gap: 6,
  },
  diaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#181311',
  },
  diaryPreview: {
    fontSize: 15,
    fontWeight: '400',
    color: '#5d4037',
    lineHeight: 22,
  },
  diaryDate: {
    fontSize: 13,
    fontWeight: '500',
    color: '#896b61',
    marginTop: 4,
  },

  // Missions Style
  missionCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  missionImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#eee',
  },
  missionOverlay: {
    padding: 16,
  },
  missionContent: {
    gap: 8,
  },
  missionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  missionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#181311',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusProgress: {
    backgroundColor: '#e3f2fd',
  },
  statusCompleted: {
    backgroundColor: '#e8f5e9',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#181311',
  },
  missionDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: '#5d4037',
  },
  missionDate: {
    fontSize: 12,
    fontWeight: '400',
    color: '#896b61',
  },

  // Reflections Style
  reflectionCard: {
    backgroundColor: '#fffcf5', // Very light cream
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#f2e6d9',
    gap: 12,
  },
  reflectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reflectionTopic: {
    fontSize: 12,
    fontWeight: '700',
    color: '#896b61',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  reflectionStatus: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2e7d32',
  },
  reflectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#181311',
  },
  reflectionPreview: {
    fontSize: 15,
    fontWeight: '400',
    color: '#4a3b32',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  reflectionDate: {
    fontSize: 13,
    fontWeight: '500',
    color: '#896b61',
    textAlign: 'right',
    marginTop: 8,
  },

  emptyState: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#896b61',
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#181311',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  fabPosition: {
    bottom: 20,
  },
});


export default CommunityScreen;
