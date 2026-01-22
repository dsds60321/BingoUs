import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CaretLeft } from '../../components/Icons';
import { communityApi } from '../../api/community';
import { missionsApi } from '../../api/missions';

type PostDetailProps = {
  item: any;
  onBack: () => void;
  onUpdate?: (updatedItem: any) => void;
};

const PostDetail = ({ item, onBack, onUpdate }: PostDetailProps) => {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);

  const handleAcknowledge = () => {
    Alert.alert('Confirm', 'Do you acknowledge this reflection?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes, I understand',
        onPress: async () => {
          try {
            setLoading(true);
            await communityApi.markAsRead(item.id);
            if (onUpdate) {
              onUpdate({ ...item, status: 'Acknowledged' });
            }
          } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to acknowledge');
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const handleCompleteMission = async () => {
    try {
      setLoading(true);
      await missionsApi.completeMission(item.id);
      if (onUpdate) {
        onUpdate({ ...item, status: 'Completed' });
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to complete mission');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (item.category) {
      case 'Photos':
        return (
          <View style={styles.contentContainer}>
            <Image source={{ uri: item.image }} style={styles.heroImage} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        );
      case 'Diary':
        return (
          <View style={styles.contentContainer}>
             {item.image ? (
              <Image source={{ uri: item.image }} style={styles.heroImage} />
            ) : null}
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.date}>{item.date}</Text>
            <View style={styles.divider} />
            <Text style={styles.bodyText}>{item.description}</Text>
          </View>
        );
      case 'Missions':
        return (
          <View style={styles.contentContainer}>
            <View style={styles.missionHeader}>
              <Text style={styles.title}>{item.title}</Text>
              <View
                style={[
                  styles.statusBadge,
                  item.status === 'Completed'
                    ? styles.statusCompleted
                    : styles.statusProgress,
                ]}
              >
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
            <Text style={styles.date}>Deadline: {item.deadline || item.date}</Text>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.bodyText}>{item.description}</Text>
            </View>

            {item.betting && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Betting / Penalty</Text>
                <Text style={styles.highlightText}>{item.betting}</Text>
              </View>
            )}

            {item.status !== 'Completed' && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleCompleteMission}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.actionButtonText}>Mark as Completed</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        );
      case 'Reflections':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.categoryLabel}>Topic: {item.topic || 'General'}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.date}>{item.date}</Text>
            
            <View style={styles.paperContainer}>
              <Text style={styles.handwritingText}>{item.content || item.description}</Text>
            </View>

            <View style={styles.statusContainer}>
              <Text style={styles.statusLabel}>Partner Status:</Text>
              <Text
                style={[
                  styles.statusValue,
                  item.status === 'Acknowledged'
                    ? styles.textSuccess
                    : styles.textPending,
                ]}
              >
                {item.status || 'Pending'}
              </Text>
            </View>

            {item.status !== 'Acknowledged' && (
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleAcknowledge}
                disabled={loading}
              >
                 {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.confirmButtonText}>Acknowledge & Confirm</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <CaretLeft size={24} color="#181311" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{item.category} Details</Text>
        <View style={styles.headerRight} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderContent()}
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#181311',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#181311',
  },
  headerRight: {
    width: 60,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  contentContainer: {
    gap: 16,
  },
  heroImage: {
    width: '100%',
    height: 250,
    borderRadius: 16,
    backgroundColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#181311',
  },
  date: {
    fontSize: 14,
    color: '#896b61',
  },
  description: {
    fontSize: 16,
    color: '#4a3b32',
    lineHeight: 24,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 8,
  },
  bodyText: {
    fontSize: 16,
    color: '#181311',
    lineHeight: 26,
  },
  // Mission Styles
  missionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusProgress: {
    backgroundColor: '#e3f2fd',
  },
  statusCompleted: {
    backgroundColor: '#e8f5e9',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#181311',
  },
  section: {
    marginTop: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5d4037',
  },
  highlightText: {
    fontSize: 16,
    color: '#d32f2f',
    fontWeight: '500',
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  actionButton: {
    marginTop: 20,
    backgroundColor: '#181311',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  // Reflection Styles
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#896b61',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  paperContainer: {
    backgroundColor: '#fffcf5',
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f2e6d9',
    minHeight: 200,
  },
  handwritingText: {
    fontSize: 18,
    lineHeight: 30,
    color: '#4a3b32',
    fontStyle: 'italic', // Mimic handwriting
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    justifyContent: 'flex-end',
  },
  statusLabel: {
    fontSize: 14,
    color: '#896b61',
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  textSuccess: {
    color: '#2e7d32',
  },
  textPending: {
    color: '#ed6c02',
  },
  confirmButton: {
    marginTop: 20,
    backgroundColor: '#ed6c02',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PostDetail;