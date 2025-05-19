import React, { useContext,  useState } from 'react';
import { Layout, Text, Toggle, Icon, Avatar, Button, useTheme } from '@ui-kitten/components';
import { ThemeContext } from '@/components/Theme/Theme';
import { View, StyleSheet, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '@/hooks/useUser';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { logoutUser } from '@/redux/slice/authSlice';

// const DEFAULT_AVATAR = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

const DEFAULT_AVATAR = 'https://static.wikia.nocookie.net/brainrotnew/images/1/10/Bombardiro_Crocodilo.jpg/revision/latest?cb=20250417102447';
const SettingScreen: React.FC = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const dispatch: AppDispatch = useDispatch();
  const { user: userData } = useUser();
  const uiTheme = useTheme();

  const [avatarUrl, setAvatarUrl] = useState(userData?.imange || DEFAULT_AVATAR);


  const handleLogout = async () => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn đăng xuất?', [
      { text: 'Hủy' },
      {
        text: 'Đăng xuất',
        onPress: async () => {
          try {
            await dispatch(logoutUser()).unwrap();
            Alert.alert('Thành công', 'Bạn đã đăng xuất thành công.');
            navigation.reset({
              index: 0,
              routes: [{ name: 'LoginScreen' }],
            });
          } catch (error: any) {
            Alert.alert('Lỗi', error || 'Đăng xuất thất bại.');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const MenuItem = ({ iconName, text, onPress }: any) => (
    <Button
      appearance="ghost"
      accessoryLeft={<Icon name={iconName} style={[styles.icon, { tintColor: uiTheme['text-basic-color'] }]} />}
      style={styles.menuItem}
      onPress={onPress}
    >
      {text}
    </Button>
  );

  return (
    <Layout style={[StyleSheet.absoluteFillObject, { backgroundColor: uiTheme['background-basic-color-1'] }]}>
      <Layout style={styles.container}>
        <View style={styles.header}>
          <Image
            source={{ uri: avatarUrl }}
            onError={() => setAvatarUrl(DEFAULT_AVATAR)}
            style={styles.avatar}
          />
          <Text category="h6" style={styles.username}>
            {userData?.first_name || 'Xin chào'} {userData?.last_name || 'Người dùng'}
          </Text>
          <Text appearance="hint" category="s2">
            {userData?.email || 'example@gmail.com'}
          </Text>
        </View>

        <Layout style={styles.menuContainer} level="2">
          <View style={styles.toggleRow}>
            <Icon name="moon-outline" style={styles.icon} />
            <Text category="s1" style={styles.toggleLabel}>
              Chế độ {theme === 'dark' ? 'Tối' : 'Sáng'}
            </Text>
            <Toggle checked={theme === 'dark'} onChange={toggleTheme} />
          </View>

          <MenuItem iconName="bell-outline" text="Thông báo" onPress={() => navigation.navigate('NotificationScreen')} />
          <MenuItem
            iconName="edit-outline"
            text="Sửa thông tin"
            onPress={() => navigation.navigate('UpdateUser', { userId: userData?.id })}
          />
          <MenuItem iconName="info-outline" text="Giới thiệu" onPress={() => navigation.navigate('AboutScreen')} />
          <MenuItem iconName="log-out-outline" text="Đăng xuất" onPress={handleLogout} />
        </Layout>
      </Layout>
    </Layout>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 80,
    marginBottom: 16,
    backgroundColor: '#ccc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,

  },
  menuContainer: {
    paddingTop: 10,
    paddingBottom: 29,
    paddingHorizontal: 20,
    //backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 24,
  },
  
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginVertical: 6,
    borderRadius: 14,
    //backgroundColor: '#00fffc',
  },
  
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
    marginBottom: 12,
  },
  toggleLabel: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
});
