import React, { useState, useEffect } from 'react';
import {
  Layout,
  Text,
  Input,
  Button,
  Icon,
  IconElement,
  CheckBox,
} from '@ui-kitten/components';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '@/services/authService';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/slice/authSlice';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadSavedLogin = async () => {
      const savedEmail = await AsyncStorage.getItem('email');
      const savedPassword = await AsyncStorage.getItem('password');
      const keepLogin = await AsyncStorage.getItem('keepLoggedIn');
      if (keepLogin === 'true' && savedEmail && savedPassword) {
        setEmail(savedEmail);
        setPassword(savedPassword);
        setKeepLoggedIn(true);
      }
    };
    loadSavedLogin();
  }, []);

  const handleLogin = async () => {
    try {
      const userData = await login({ email, password });
      if (keepLoggedIn) {
        await AsyncStorage.setItem('email', email);
        await AsyncStorage.setItem('password', password);
        await AsyncStorage.setItem('keepLoggedIn', 'true');
      } else {
        await AsyncStorage.removeItem('email');
        await AsyncStorage.removeItem('password');
        await AsyncStorage.setItem('keepLoggedIn', 'false');
      }
      dispatch(setUser(userData));
      console.log('Đăng nhập thành công:', userData.email || userData.username);
      navigation.navigate('DashboardScreen');
    } catch (error) {
      console.error('Đăng nhập thất bại:', error.message);
      Alert.alert('Đăng nhập thất bại', 'Email hoặc mật khẩu không đúng');
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPasswordScreen');
  };

  const renderEyeIcon = (): IconElement => (
    <TouchableWithoutFeedback onPress={() => setSecureTextEntry(!secureTextEntry)}>
      <Icon name={secureTextEntry ? 'eye-off' : 'eye'} />
    </TouchableWithoutFeedback>
  );

  return (
    <ImageBackground
      source={{ uri: 'https://i1.sndcdn.com/artworks-YDQOy2Pru5CA2rhs-x1uzgA-t500x500.jpg' }}
      style={styles.background}
    >
      <Layout style={styles.container}>
        <Text category="h4" style={{ textAlign: 'center', marginBottom: 20 }}>
          Đăng Nhập
        </Text>

        <Input
          label="Email"
          placeholder="Nhập email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={{ marginBottom: 16 }}
        />

        <Input
          label="Mật khẩu"
          placeholder="Nhập mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={secureTextEntry}
          accessoryRight={renderEyeIcon}
          style={{
            marginBottom: 15,
            width: '100%',
            maxWidth: 400,
            alignSelf: 'center',
            height: 45,
          }}
        />

        <CheckBox
          checked={keepLoggedIn}
          onChange={checked => setKeepLoggedIn(checked)}
          style={{ marginBottom: 5, marginTop: 20 }}
        >
          Ghi nhớ đăng nhập
        </CheckBox>

        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={{ textAlign: 'right', marginBottom: 20, color: '#3366FF' }}>
            Quên mật khẩu?
          </Text>
        </TouchableOpacity>

        <Button onPress={handleLogin}>Đăng Nhập</Button>
      </Layout>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // Ensure the image covers the entire background
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: Add a semi-transparent overlay for better text readability
  },
});

export default LoginScreen;