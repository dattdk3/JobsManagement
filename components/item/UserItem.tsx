import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { User } from '@/model/User';
import { Feather } from '@expo/vector-icons'; // Dùng Feather icon đúng cách

type Props = {
  user: User;
  onEdit?: () => void;
  onDelete?: () => void;
};

const UserItem: React.FC<Props> = ({ user, onEdit, onDelete }) => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1e1e1e' : '#ffffff' }]}>
      <View style={styles.header}>
        <View style={styles.info}>
          <Text style={[styles.username, { color: isDark ? '#fff' : '#000' }]}>
            👤 {user.username}
          </Text>
          <Text style={[styles.email, { color: isDark ? '#bbb' : '#555' }]}>
            📧 {user.email}
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity onPress={onEdit} style={styles.iconButton}>
            <Feather name="edit-2" size={18} color={isDark ? '#aad4ff' : '#007bff'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} style={styles.iconButton}>
            <Feather name="trash-2" size={18} color={isDark ? '#ff6b6b' : '#dc3545'} />
          </TouchableOpacity>
        </View>
      </View>

      <Text
        style={[
          styles.role,
          user.manager_role ? styles.manager : styles.normalUser,
        ]}
      >
        {user.manager_role ? 'Quản lý' : 'Nhân viên'}
      </Text>
    </View>
  );
};

export default UserItem;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 6,
    marginVertical: 8,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOpacity: 5,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 6,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  email: {
    marginTop: 2,
    fontSize: 14,
  },
  role: {
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    color: 'white',
    fontSize: 12,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  manager: {
    backgroundColor: '#007bff',
  },
  normalUser: {
    backgroundColor: '#6c757d',
  },
  actions: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  iconButton: {
    marginLeft: 8,
    padding: 4,
  },
});
