import React, { useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { Layout, Input, Button, Text, useTheme } from '@ui-kitten/components';
import { useDispatch } from 'react-redux';
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, updateEmail } from 'firebase/auth';
import { updateExistingUser } from '@/redux/slice/UserSlice';
import { RootState, AppDispatch } from '@/redux/store';

const VerifyPasswordScreen = ({ route, navigation }) => {
  const { currentEmail, newEmail, updatedUser, userId } = route.params;
  const [password, setPassword] = useState('');
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const theme = useTheme();

  const handleVerify = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!password || !currentUser || !currentEmail) {
      Alert.alert('Thiếu thông tin');
      return;
    }

    const credential = EmailAuthProvider.credential(currentEmail, password);

    try {
      await reauthenticateWithCredential(currentUser, credential);
      await updateEmail(currentUser, newEmail);

      const result = await dispatch(updateExistingUser({ id: userId, user: updatedUser }));
      if (updateExistingUser.fulfilled.match(result)) {
        Alert.alert('Thành công', 'Đã cập nhật email!');
        navigation.goBack();
      } else {
        Alert.alert('Lỗi', 'Cập nhật DB thất bại!');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Lỗi xác thực', 'Sai mật khẩu hoặc không thể xác minh!');
    }
  };

  return (
    <Layout style={styles.container}>
      <Text category="h5" style={styles.title}>Xác minh mật khẩu</Text>
      <Input
        placeholder="Nhập mật khẩu"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <Button onPress={handleVerify}>Xác minh và cập nhật</Button>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
});

export default VerifyPasswordScreen;
