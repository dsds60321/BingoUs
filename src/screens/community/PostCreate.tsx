import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type PostCreateProps = {
  category: string;
  onBack: () => void;
  onSubmit: (newItem: any) => void;
};

const PostCreate = ({ category, onBack, onSubmit }: PostCreateProps) => {
  const insets = useSafeAreaInsets();
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState(''); // Used for Content too
  const [topic, setTopic] = useState(''); // For Reflections
  const [betting, setBetting] = useState(''); // For Missions
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [image, setImage] = useState('');

  const handleRandomImage = () => {
    // Random picsum image
    const randomId = Math.floor(Math.random() * 1000);
    setImage(`https://picsum.photos/seed/${randomId}/400/300`);
  };

  const handleSubmit = () => {
    if (!title) {
      Alert.alert('Missing Field', 'Please enter a title.');
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      category,
      title,
      description, // or content mapped later
      date,
      image,
      topic,
      betting,
      status: category === 'Missions' ? 'In Progress' : (category === 'Reflections' ? 'Pending' : undefined),
      content: category === 'Reflections' ? description : undefined, // Map description to content for Reflections
    };

    onSubmit(newItem);
  };

  const renderFields = () => {
    switch (category) {
      case 'Photos':
      case 'Diary':
        return (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter title"
                value={title}
                onChangeText={setTitle}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.input}
                placeholder="2024-01-01"
                value={date}
                onChangeText={setDate}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Image</Text>
              <View style={styles.imageInputRow}>
                <TextInput
                  style={[styles.input, styles.flex1]}
                  placeholder="Image URL"
                  value={image}
                  onChangeText={setImage}
                />
                <TouchableOpacity style={styles.randomBtn} onPress={handleRandomImage}>
                  <Text style={styles.randomBtnText}>Random</Text>
                </TouchableOpacity>
              </View>
              {image ? (
                <Image source={{ uri: image }} style={styles.previewImage} />
              ) : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{category === 'Diary' ? 'Content' : 'Description'}</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Write here..."
                value={description}
                onChangeText={setDescription}
                multiline
                textAlignVertical="top"
              />
            </View>
          </>
        );

      case 'Missions':
        return (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mission Title</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Run 5km"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Deadline (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.input}
                placeholder="2024-01-01"
                value={date}
                onChangeText={setDate}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Details about the mission..."
                value={description}
                onChangeText={setDescription}
                multiline
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Betting / Penalty</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Winner gets a massage"
                value={betting}
                onChangeText={setBetting}
              />
            </View>
          </>
        );

      case 'Reflections':
        return (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Topic</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Lateness"
                value={topic}
                onChangeText={setTopic}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title (Summary)</Text>
              <TextInput
                style={styles.input}
                placeholder="I'm sorry for..."
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date of Incident</Text>
              <TextInput
                style={styles.input}
                placeholder="2024-01-01"
                value={date}
                onChangeText={setDate}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Why I was wrong (Content)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Write sincerely..."
                value={description}
                onChangeText={setDescription}
                multiline
                textAlignVertical="top"
              />
            </View>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New {category}</Text>
        <TouchableOpacity onPress={handleSubmit} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.formContainer}>
        {renderFields()}
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
    color: '#896b61',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#181311',
  },
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#181311',
    fontWeight: '700',
  },
  formContainer: {
    padding: 20,
    gap: 20,
    paddingBottom: 40,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5d4037',
  },
  flex1: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#181311',
    backgroundColor: '#fafafa',
  },
  textArea: {
    height: 120,
  },
  imageInputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  randomBtn: {
    backgroundColor: '#eee',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 12,
  },
  randomBtnText: {
    fontSize: 14,
    color: '#333',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginTop: 8,
    backgroundColor: '#f0f0f0',
  },
});

export default PostCreate;
