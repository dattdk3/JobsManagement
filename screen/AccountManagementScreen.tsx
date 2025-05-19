import React, { useState, useEffect } from 'react';
import { Alert, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { Layout, Text, Input, Button, Icon, IconElement } from '@ui-kitten/components';
import { auth, db } from '@/firebaseConfig';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  updateProfile,
} from 'firebase/auth';
import { ref, update } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserById } from '@/redux/slice/UserSlice';
import { RootState, AppDispatch } from '@/redux/store';
import { useUser } from '@/hooks/useUser';

const AccountManagementScreen: React.FC = () => {
  const user = auth.currentUser;
  const navigation = useNavigation();
  const dispatch: AppDispatch = useDispatch();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [secureOld, setSecureOld] = useState(true);
  const [secureNew, setSecureNew] = useState(true);
  const [loading, setLoading] = useState(false);

  const { user: userData, loading: userLoading } = useUser();

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchUserById(user.uid));
    }
  }, [user?.uid, dispatch]);

  const handleAccountManager = () => {
    navigation.navigate('AccountManager');
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ mật khẩu cũ và mới.');
      return;
    }

    if (!user || !user.email) {
      Alert.alert('Lỗi', 'Không tìm thấy người dùng.');
      return;
    }

    const credential = EmailAuthProvider.credential(user.email, oldPassword);
    setLoading(true);

    try {
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      const usernameRef = ref(db, 'users/' + user.uid);
      await update(usernameRef, {
        username: userData?.username || '',
      });

      await updateProfile(user, {
        displayName: userData?.username || '',
      });

      Alert.alert('Thành công', 'Mật khẩu đã được cập nhật!');
      setOldPassword('');
      setNewPassword('');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Lỗi', error.message || 'Đã xảy ra lỗi.');
    } finally {
      setLoading(false);
    }
  };

  //console.log('>> Check role: ', userData?.manager_role);

  const renderEyeIcon = (secure: boolean, toggle: () => void): IconElement => (
    <TouchableWithoutFeedback onPress={toggle}>
      <Icon name={secure ? 'eye-off' : 'eye'} />
    </TouchableWithoutFeedback>
  );

  return (
    <Layout style={{ flex: 1, padding: 20, paddingTop: 25 }}>
      {/* Hiển thị nút "Quản lý tài khoản" chỉ khi manager_role là true */}
      {userData?.manager_role ? (
        <TouchableOpacity onPress={handleAccountManager}>
          <Text style={{ textAlign: 'right', marginBottom: 20, color: '#3366FF', fontSize: 18 }}>
            Quản lý tài khoản
          </Text>
        </TouchableOpacity>
      ) : null}

      <Text category="h4" style={{ marginBottom: 20 }}>
        Thông tin người dùng
      </Text>

      <Input
        label="Tên người dùng"
        value={userData?.username || 'Đang tải...'}
        disabled
        style={{ marginBottom: 15 }}
      />

      <Input
        label="Email"
        value={user?.email || ''}
        disabled
        style={{ marginBottom: 20 }}
      />

      <Input
        label="Mật khẩu cũ"
        placeholder="Nhập mật khẩu cũ"
        secureTextEntry={secureOld}
        value={oldPassword}
        onChangeText={setOldPassword}
        accessoryRight={() => renderEyeIcon(secureOld, () => setSecureOld(!secureOld))}
        style={{
          marginBottom: 25,
          width: '100%',
          maxWidth: 400,
          alignSelf: 'center',
          height: 50,
        }}
        textContentType="password"
        autoComplete="password"
      />

      <Input
        label="Mật khẩu mới"
        placeholder="Nhập mật khẩu mới"
        secureTextEntry={secureNew}
        value={newPassword}
        onChangeText={setNewPassword}
        accessoryRight={() => renderEyeIcon(secureNew, () => setSecureNew(!secureNew))}
        style={{
          marginBottom: 25,
          width: '100%',
          maxWidth: 400,
          alignSelf: 'center',
          height: 50,
        }}
        textContentType="newPassword"
        autoComplete="password"
      />

      <Button onPress={handleChangePassword} disabled={loading}>
        {loading ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
      </Button>
    </Layout>
  );
};

export default AccountManagementScreen;