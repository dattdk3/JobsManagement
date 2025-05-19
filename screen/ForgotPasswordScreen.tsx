import React, { useState } from 'react';
import {
  Layout,
  Text,
  Input,
  Button,
} from '@ui-kitten/components';
import { Alert } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/firebaseConfig';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Lỗi', 'Vui lòng nhập email');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        'Thành công',
        'Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('LoginScreen'), // Quay lại trang đăng nhập
          },
        ]
      );
    } catch (error) {
      console.error("Gửi email thất bại:", error.message);
      let errorMessage = 'Có lỗi xảy ra khi gửi email';
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Email không hợp lệ';
          break;
        case 'auth/user-not-found':
          errorMessage = 'Không tìm thấy tài khoản với email này';
          break;
        default:
          errorMessage = error.message;
      }
      Alert.alert('Lỗi', errorMessage);
    }
  };

  return (
    <Layout style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text category="h4" style={{ textAlign: 'center', marginBottom: 20 }}>
        Quên Mật Khẩu
      </Text>

      <Text style={{ textAlign: 'center', marginBottom: 20 }}>
        Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
      </Text>

      <Input
        label="Email"
        placeholder="Nhập email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={{ marginBottom: 16 }}
      />

      <Button onPress={handleResetPassword}>Gửi Email Đặt Lại</Button>

      <Button
        appearance="ghost"
        style={{ marginTop: 16 }}
        onPress={() => navigation.navigate('LoginScreen')}
      >
        Quay lại Đăng Nhập
      </Button>
    </Layout>
  );
};

export default ForgotPasswordScreen;