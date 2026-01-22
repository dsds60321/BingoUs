import React, { useState, useEffect } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, Plus } from '../components/Icons';
import PostDetail from './community/PostDetail';
import PostCreate from './community/PostCreate';
import { communityApi, PostCategory, Post } from '../api/community';
import { missionsApi, Mission } from '../api/missions';

const CommunityScreen = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('Photos');
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'create'>('list');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);

  const tabs = ['Photos', 'Diary', 'Missions', 'Reflections'];

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'Missions') {
        const response = await missionsApi.getMissions();
        const mappedMissions = response.data.map((m: Mission) => ({
          id: m.id,
          category: 'Missions',
          title: m.title,
          description: m.description,
          status: m.status === 'open' ? 'In Progress' : 'Completed', // Map status
          date: m.deadline,
          deadline: m.deadline,
          betting: m.reward,
          // image: '...' // Missions might not have images in this API version
        }));
        setPosts(mappedMissions);
      } else {
        const categoryMap: Record<string, PostCategory> = {
          'Photos': 'photo',
          'Diary': 'diary',
          'Reflections': 'reflection'
        };
        const apiCategory = categoryMap[activeTab];
        if (apiCategory) {
          const response = await communityApi.getPosts({ category: apiCategory });
          const mappedPosts = response.data.posts.map((p: Post) => ({
            id: p.id,
            category: activeTab,
            title: p.title,
            description: p.content, // Map content to description
            content: p.content,
            date: p.eventDate || p.createdAt.split('T')[0],
            image: p.images?.[0]?.url, // Take first image
            topic: p.topic,
            status: p.receipts?.partnerRead ? 'Acknowledged' : 'Pending',
          }));
          setPosts(mappedPosts);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
    fetchData(); // Refresh list on back
  };

  const handleCreateSubmit = async (newItem: any) => {
    // Logic moved to PostCreate, but we can refresh here
    fetchData();
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
    const key = post.id || Math.random().toString();
    const commonProps = {
      activeOpacity: 0.9,
      onPress: () => handlePostPress(post),
    };

    if (activeTab === 'Photos') {
      return (
        <TouchableOpacity key={key} {...commonProps} style={styles.postCard}>
          {post.image ? <Image source={{ uri: post.image }} style={styles.postImage} /> : null}
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
        <TouchableOpacity key={key} {...commonProps} style={styles.diaryCard}>
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
        <TouchableOpacity key={key} {...commonProps} style={styles.missionCard}>
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
        <TouchableOpacity key={key} {...commonProps} style={styles.reflectionCard}>
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
          {loading ? (
             <ActivityIndicator size="large" color="#181311" style={{ marginTop: 20 }} />
          ) : posts.length > 0 ? (
            posts.map((post) => renderItem(post))
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
