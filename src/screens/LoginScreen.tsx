import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { authApi } from '../api/auth';
import { Envelope, Lock, AppleLogo, GoogleLogo } from '../components/Icons';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    try {
      setLoading(true);
      await authApi.login({ provider: 'local', email, password });
      onLoginSuccess();
    } catch (error: any) {
      console.error(error);
      Alert.alert('Login Failed', error.response?.data?.error?.message || error.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <View style={styles.logoWrapper}>
            <Image 
              source={require('../assets/images/logo.png')} 
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>BingoUs</Text>
          <Text style={styles.sloganKr}>다시, 우리를 잇는 시간</Text>
          <Text style={styles.sloganEn}>Nurturing your connection, one day at a time</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Envelope size={20} color="#9CA3AF" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="이메일 주소"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Lock size={20} color="#9CA3AF" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="비밀번호"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity 
              style={styles.loginButton} 
              onPress={handleLogin} 
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>{loading ? '로그인 중...' : '로그인'}</Text>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>또는</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity style={styles.socialButtonApple} activeOpacity={0.8}>
              <AppleLogo size={20} color="white" weight="fill" />
              <Text style={styles.socialButtonTextApple}>Apple로 계속하기</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButtonGoogle} activeOpacity={0.8}>
              <GoogleLogo size={20} color="#333" weight="fill" />
              <Text style={styles.socialButtonTextGoogle}>Google로 계속하기</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>계정이 없으신가요?</Text>
              <TouchableOpacity>
                <Text style={styles.signupText}>회원가입</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBF7', // Warm Ivory/Beige like the image
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
  },
  logoWrapper: {
    width: 100,
    height: 100,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  logoImage: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#333333',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  sloganKr: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
    marginBottom: 4,
  },
  sloganEn: {
    fontSize: 13,
    color: '#999999',
    fontWeight: '400',
  },
  card: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    paddingVertical: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333333',
    height: '100%',
  },
  loginButton: {
    backgroundColor: '#FFCCAA', // Soft Orange/Peach like the image button
    borderRadius: 30, // Fully rounded
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#FFCCAA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#EEEEEE',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 13,
    color: '#999999',
  },
  socialButtonApple: {
    flexDirection: 'row',
    backgroundColor: '#333333',
    borderRadius: 30,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  socialButtonTextApple: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  socialButtonGoogle: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 30,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialButtonTextGoogle: {
    color: '#333333',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 6,
  },
  footerText: {
    color: '#888888',
    fontSize: 14,
  },
  signupText: {
    color: '#7FB77E', // Soft Green matching the sprout color in logo
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginScreen;