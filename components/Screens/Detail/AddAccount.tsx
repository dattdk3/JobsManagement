import React, { useState } from 'react';
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Layout, Text, useTheme } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { addNewUser } from '@/redux/slice/UserSlice';
import { User } from '@/model/User';
import BackButton from '@/components/item/BackButton';

const AddAccount: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const theme = useTheme();

  const [user, setUser] = useState<Omit<User, 'id'>>({
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: '',
    imange: '',
    manager_role: false,
  });

  const handleChange = (key: keyof Omit<User, 'id'>, value: string | boolean) => {
    setUser({ ...user, [key]: value });
  };

  const handleSubmit = async () => {
    if (!user.username || !user.password || !user.email) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin tài khoản.');
      return;
    }

    try {
      await dispatch(addNewUser(user) as any);
      Alert.alert('Thành công', 'Tài khoản đã được tạo!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tạo tài khoản.');
    }
  };

  return (
    <Layout style={styles.container}>
      <BackButton/>


      <Text category="h5" style={styles.title}>Tạo tài khoản mới</Text>

      <ScrollView contentContainerStyle={styles.form}>
        {[
          { key: 'username', placeholder: 'Tên người dùng' },
          { key: 'password', placeholder: 'Mật khẩu', secure: true },
          { key: 'email', placeholder: 'Email', keyboardType: 'email-address' },
          { key: 'first_name', placeholder: 'Họ' },
          { key: 'last_name', placeholder: 'Tên' },
          { key: 'imange', placeholder: 'URL ảnh đại diện' },
        ].map((item, idx) => (
          <TextInput
            key={idx}
            placeholder={item.placeholder}
            placeholderTextColor={theme['text-hint-color']}
            style={[styles.input, { backgroundColor: theme['background-basic-color-2'], color: theme['text-basic-color'] }]}
            secureTextEntry={item.secure || false}
            keyboardType={item.keyboardType as any}
            value={user[item.key as keyof Omit<User, 'id'>] as string}
            onChangeText={(text) => handleChange(item.key as keyof Omit<User, 'id'>, text)}
          />
        ))}

        <TouchableOpacity
          style={[
            styles.roleToggle,
            {
              backgroundColor: user.manager_role
                ? theme['color-primary-default']
                : theme['background-basic-color-3'],
            },
          ]}
          onPress={() => handleChange('manager_role', !user.manager_role)}
        >
          <Text style={styles.roleToggleText}>
            {user.manager_role ? '👑 Quản lý' : '👤 Người dùng thường'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: theme['color-success-default'] },
          ]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>💾 Tạo tài khoản</Text>
        </TouchableOpacity>
      </ScrollView>
    </Layout>
  );
};

export default AddAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 50,
  },
  title: {
    marginBottom: 16,
    textAlign: "center",
  },
  form: {
    gap: 12,
    paddingBottom: 32,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  roleToggle: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  roleToggleText: {
    color: 'white',
    fontWeight: 'bold',
  },
  submitButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
