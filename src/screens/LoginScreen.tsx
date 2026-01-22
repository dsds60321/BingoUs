import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { authApi } from '../api/auth';

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
      // For MVP/Demo, allow any login or valid credentials.
      // In real app: await authApi.login({ provider: 'local', email, password });
      
      // Simulate API call for now if backend isn't ready, or use the real one.
      // Since the user asked for the library, I should probably try to use it
      // but if the backend is not running, it will fail.
      // I will assume for now we call the API, but if it fails I might mock it for demo if requested.
      // However, the prompt is about "creating the library", so I should integrate it properly.
      
      // console.log("Attempting login...");
      // await authApi.login({ provider: 'local', email, password });
      
      // For now, just trigger success to show the flow, 
      // as we don't have a running backend in this environment.
      // But I will write the code to use the API.
      
      // Uncomment when backend is ready:
      await authApi.login({ provider: 'local', email, password });

      // Mock success for UI demo:
      onLoginSuccess();
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BingoUs</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#181311',
  },
  form: {
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#181311',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
