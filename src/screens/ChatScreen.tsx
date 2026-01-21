import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, Image, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { launchCamera, launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import { ArrowLeft, Image as ImageIcon, Camera } from '../components/Icons';

interface Message {
  id: string;
  sender: 'Liam' | 'Olivia';
  text?: string;
  image?: string;
  isMe: boolean;
  avatar?: string;
}

const ChatScreen = () => {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'Liam',
      text: "Hey, how's your day going? I'm thinking about our weekend getaway. Any ideas?",
      isMe: false,
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAG-49Bqblo9YiqiRm95ldT-VedU9-vhGuAWVvJP17Wlk9Bu4IN7oQAU8MVNWBWeopdmWfmGkiSg6QjtMk-q4QNY7Z-ud0zv1FsZSHLTHwYZbHf5HAt5AZm1pH5VVW9oNMTkfUGQV_y6xBkeNbKXXVsJkTtyBVciDXjR_eo8rsrL1N1S0rZQ-fHNNZu3SPd9Vsg49P7lrGExQae-zhnLXeNf8dRKKxFiDrEsUs6pJsUkN6v_XA7XyUye_t83tVTgV6vX4_PUHZHWHEB"
    },
    {
      id: '2',
      sender: 'Olivia',
      text: "Hi! My day's been good, just finished a big project. For the weekend, how about that hiking trail we talked about? Or maybe a cozy cabin?",
      isMe: true,
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBAL2Io6Gg9Te2wDZXUJ8VX5ivRtG90UDLRj3pGJ7LZY2Ko5UD01JHQs3X86nlRggNmLDZG49CWXIAWnPLNAzcRKzPueBDoyKyDNqvxjrbjQSCOx0oxGjw3do_7rqF9yKlre65j14nnaJPE2jLjnWBOl4C8FdnWLhP7dhK9wasLBQDLcdkzD94-vOR3pWskh29zhFGMlsin8GPPvPkHmhl0TeDizWGxEv-552mCyjeIOVDsL6-cS1XUfT8w6FaiL1VzU-p_mt2TEckM"
    },
    {
      id: '3',
      sender: 'Liam',
      text: "Hiking sounds amazing! The trail with the waterfall? And a cabin would be perfect for the evening. I'll check availability.",
      isMe: false,
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwg1yQd3Z0MB5IoEjZIdua4_-t9N3XXlVrgY8EVgSWyP6mO92Ob_r32pSUbTTFZZkItT3m_qYpLuHKYZS0Oehw1AbUntbpfXbhEii2lP42yMU5bOFbzVgMfJMVVXL2ePuV_NFnO1Np997AlU3BDFFKVKG81stczSPfD5gxGImoHxUPXiRwzXyeIrRAA_5CAyfi9d-47WEZGWWdS2s7w0P1QmFCl1hNhIcg4snG-ZSR4MsCJqAIDGn73DPMdnzgirO4oJjKAI-xLZDO"
    },
    {
      id: '4',
      sender: 'Olivia',
      text: "Yes, the waterfall trail! And if we can find a cabin with a fireplace, that would be the dream. Let me know what you find!",
      isMe: true,
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAlh2xOeSvrgPBXyivU_4GTtpPOWp9nizGhE1kjzCPAZuMXpeBCIs63AeZlSUXUiFw-1Pf9vC-l0q4jZgkIVZLICoQ9g0XC53hUFpWG2305yHs9LCOdgPx8dJ4dod7iO2BLw6JJTjKcMyn6kJQ8uZ7AFvoGoCe3VoZRJu_avQkoUExAn8MAJOBGlXVTmDPh3PvkJrl4tlPYmrextsTyVtApiMdDSjRjKw6XMkTRPIHTEJ3HceKY8SY9HiNWkofOJ28HKrPccpv5XKyz"
    }
  ]);

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    addMessage({
      id: Date.now().toString(),
      sender: 'Olivia',
      text: inputText,
      isMe: true,
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBAL2Io6Gg9Te2wDZXUJ8VX5ivRtG90UDLRj3pGJ7LZY2Ko5UD01JHQs3X86nlRggNmLDZG49CWXIAWnPLNAzcRKzPueBDoyKyDNqvxjrbjQSCOx0oxGjw3do_7rqF9yKlre65j14nnaJPE2jLjnWBOl4C8FdnWLhP7dhK9wasLBQDLcdkzD94-vOR3pWskh29zhFGMlsin8GPPvPkHmhl0TeDizWGxEv-552mCyjeIOVDsL6-cS1XUfT8w6FaiL1VzU-p_mt2TEckM"
    });
    setInputText('');
  };

  const handleImagePicker = async () => {
    const result: ImagePickerResponse = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
    });

    if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      addMessage({
        id: Date.now().toString(),
        sender: 'Olivia',
        image: asset.uri,
        isMe: true,
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBAL2Io6Gg9Te2wDZXUJ8VX5ivRtG90UDLRj3pGJ7LZY2Ko5UD01JHQs3X86nlRggNmLDZG49CWXIAWnPLNAzcRKzPueBDoyKyDNqvxjrbjQSCOx0oxGjw3do_7rqF9yKlre65j14nnaJPE2jLjnWBOl4C8FdnWLhP7dhK9wasLBQDLcdkzD94-vOR3pWskh29zhFGMlsin8GPPvPkHmhl0TeDizWGxEv-552mCyjeIOVDsL6-cS1XUfT8w6FaiL1VzU-p_mt2TEckM"
      });
    }
  };

  const handleCamera = async () => {
    const result: ImagePickerResponse = await launchCamera({
      mediaType: 'photo',
      saveToPhotos: true,
    });

    if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      addMessage({
        id: Date.now().toString(),
        sender: 'Olivia',
        image: asset.uri,
        isMe: true,
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBAL2Io6Gg9Te2wDZXUJ8VX5ivRtG90UDLRj3pGJ7LZY2Ko5UD01JHQs3X86nlRggNmLDZG49CWXIAWnPLNAzcRKzPueBDoyKyDNqvxjrbjQSCOx0oxGjw3do_7rqF9yKlre65j14nnaJPE2jLjnWBOl4C8FdnWLhP7dhK9wasLBQDLcdkzD94-vOR3pWskh29zhFGMlsin8GPPvPkHmhl0TeDizWGxEv-552mCyjeIOVDsL6-cS1XUfT8w6FaiL1VzU-p_mt2TEckM"
      });
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton}>
          <ArrowLeft size={24} color="#1b110e" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat</Text>
        <View style={styles.iconButtonPlaceholder} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg) => (
            <View key={msg.id} style={msg.isMe ? styles.messageRowRight : styles.messageRowLeft}>
              {!msg.isMe && (
                <Image source={{ uri: msg.avatar }} style={styles.avatar} />
              )}
              
              <View style={msg.isMe ? styles.bubbleRightContainer : styles.bubbleLeftContainer}>
                <Text style={msg.isMe ? styles.nameRight : styles.nameLeft}>{msg.sender}</Text>
                <View style={msg.isMe ? styles.bubbleRight : styles.bubbleLeft}>
                  {msg.text ? (
                    <Text style={styles.messageText}>{msg.text}</Text>
                  ) : (
                    <Image source={{ uri: msg.image }} style={styles.messageImage} resizeMode="cover" />
                  )}
                </View>
              </View>

              {msg.isMe && (
                <Image source={{ uri: msg.avatar }} style={styles.avatar} />
              )}
            </View>
          ))}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Write a message..."
              placeholderTextColor="#97604e"
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              returnKeyType="send"
              onSubmitEditing={handleSend}
            />
            <View style={styles.inputActions}>
              <TouchableOpacity style={styles.actionButton} onPress={handleImagePicker}>
                <ImageIcon size={20} color="#97604e" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={handleCamera}>
                <Camera size={20} color="#97604e" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcf9f8',
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
    color: '#1b110e',
    textAlign: 'center',
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
    paddingTop: 10,
  },
  messageRowLeft: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  messageRowRight: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
  bubbleLeftContainer: {
    flex: 1,
    alignItems: 'flex-start',
    gap: 4,
  },
  bubbleRightContainer: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 4,
  },
  nameLeft: {
    fontSize: 13,
    color: '#97604e',
    marginLeft: 4,
  },
  nameRight: {
    fontSize: 13,
    color: '#97604e',
    marginRight: 4,
    textAlign: 'right',
  },
  bubbleLeft: {
    backgroundColor: '#f3eae7',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    maxWidth: '80%',
  },
  bubbleRight: {
    backgroundColor: '#ed825e',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 16,
    color: '#1b110e',
    lineHeight: 24,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  inputWrapper: {
    padding: 16,
    backgroundColor: '#fcf9f8',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3eae7',
    borderRadius: 12,
    height: 48,
    paddingLeft: 16,
    paddingRight: 8,
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#1b110e',
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 6,
  },
  sendButton: {
    backgroundColor: '#ed825e',
    borderRadius: 12,
    height: 32,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  sendButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1b110e',
  },
});

export default ChatScreen;

