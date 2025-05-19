import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity
} from 'react-native';
import { Layout, Text, Button, useTheme  } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, deleteExistingUser } from '@/redux/slice/UserSlice';
import { RootState } from '@/redux/store';
import UserItem from '@/components/item/UserItem';// Đảm bảo đúng đường dẫn
import BackButton from '@/components/item/BackButton';

const AccountManager: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const users = useSelector((state: RootState) => state.user.users);
  const [search, setSearch] = useState('');
  const theme = useTheme();

  useEffect(() => {
    dispatch(fetchUsers() as any);
  }, [dispatch]);

  const handleDelete = (userId: string) => {
    Alert.alert(
      'Xác nhận xoá',
      'Bạn có chắc chắn muốn xoá người dùng này?',
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xoá',
          style: 'destructive',
          onPress: () => {
            dispatch(deleteExistingUser((userId)) as any);
          },
        },
      ]
    );
  };

  const handleEdit = (userId: string) => {
    navigation.navigate('UpdateUser' as never, { userId } as never); // hoặc tùy thuộc navigation
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout style={styles.container}>

        <BackButton/>

      <Text category="h5" style={styles.header}>Quản lý tài khoản</Text>

      <TextInput
        placeholder="🔍 Tìm kiếm theo tên người dùng..."
        style={styles.searchInput}
        value={search}
        onChangeText={setSearch}
      />

      <Button style={styles.addButton} onPress={() => navigation.navigate('AddAccount' as never)}>
        ➕ Thêm mới
      </Button>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <UserItem
            user={item}
            onEdit={() => handleEdit(item.id.toString())}
            onDelete={() => handleDelete(item.id.toString())}
          />
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Không tìm thấy người dùng</Text>}
      />
    </Layout>
  );
};

export default AccountManager;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 50,
  },
  header: {
    marginBottom: 16,
    textAlign: "center",
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  addButton: {
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
  },
});
