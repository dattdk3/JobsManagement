import React, { useEffect } from 'react';
import { StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Layout, Text, useTheme } from '@ui-kitten/components';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserById, updateExistingUser } from '@/redux/slice/UserSlice';
import { RootState, AppDispatch } from '@/redux/store';
import UserDetailItem from '@/components/item/UserDetailItem';
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updateEmail } from 'firebase/auth';
import BackButton from '@/components/item/BackButton';

const UpdateUser: React.FC = () => {
  const navigation = useNavigation();
  const dispatch: AppDispatch = useDispatch();
  const route = useRoute();
  const { userId } = route.params as { userId: string };
  const theme = useTheme();

  const user = useSelector((state: RootState) => state.user.user);
  const loading = useSelector((state: RootState) => state.user.loading);

  useEffect(() => {
    dispatch(fetchUserById(userId));
  }, [dispatch, userId]);

  const handleSaveUser = async (updatedData: Partial<typeof user> | null | undefined) => {
    if (!user || !updatedData ) return;
  
    const updatedUser = { ...user, ...updatedData };
    const auth = getAuth();
    const currentUser = auth.currentUser;
  
    const isEmailChanged = updatedData.email && updatedData.email !== user.email;
  
    try {
      if (isEmailChanged) {
        // Thay vì dùng Alert.prompt, bạn chuyển sang màn hình xác minh mật khẩu
        navigation.navigate('VerifyPasswordScreen', {
          currentEmail: currentUser?.email,
          newEmail: updatedData.email,
          updatedUser,
          userId: user.id,
        });
      } else {
        const resultAction = await dispatch(updateExistingUser({ id: user.id, user: updatedUser }));
        if (updateExistingUser.fulfilled.match(resultAction)) {
          Alert.alert('Thành công', 'Cập nhật thành công!');
          navigation.goBack();
        } else {
          Alert.alert('Lỗi', 'Có lỗi xảy ra khi cập nhật!');
        }
      }
    } catch (error) {
      console.error('Lỗi xử lý cập nhật:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra!');
    }
  };  
  
  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!user) {
    return (
      <Layout style={styles.container}>
        <Text>Không tìm thấy thông tin người dùng.</Text>
      </Layout>
    );
  }

  return (
    <Layout style={styles.container}>
      <BackButton/>

      <Text category="h5" style={styles.header}>
        Chỉnh sửa thông tin người dùng
      </Text>

      <UserDetailItem user={user} onSave={handleSaveUser} />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 50,
  },
  header: {
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default UpdateUser;
