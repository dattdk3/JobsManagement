import React, { useEffect } from "react";
import { Layout, Text } from '@ui-kitten/components';
import { Alert, BackHandler } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';  // Import useNavigation
import { logoutUser } from "@/redux/slice/authSlice";  // Import logoutUser action
import DashboardNavigation from "@/navigation/Dashboardnavigation";

const DashboardScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();  // Sử dụng useNavigation để lấy navigation

  // Hàm xử lý sự kiện khi người dùng lướt trở lại
  const handleBackPress = () => {
    Alert.alert(
      "Bạn có chắc muốn đăng xuất?", // Tiêu đề alert
      "Bạn sẽ phải đăng nhập lại nếu tiếp tục.",
      [
        {
          text: "Hủy", // Nút hủy
          onPress: () => null, // Không làm gì
          style: "cancel"
        },
        {
          text: "Đăng xuất", // Nút đăng xuất
          onPress: async () => {
            try {
              // Gọi action logoutUser để đăng xuất
              await dispatch(logoutUser());
              // Sau khi đăng xuất, reset navigation và chuyển đến LoginScreen
              navigation.reset({
                index: 0,
                routes: [{ name: 'LoginScreen' }],
              });
            } catch (error) {
              console.error("Error logging out:", error);
            }
          },
        },
      ],
      { cancelable: false } // Không cho phép đóng alert bằng cách nhấn ngoài
    );
    return true; // Ngừng hành động mặc định (quay lại)
  };

  useEffect(() => {
    // Lắng nghe sự kiện back button
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    // Cleanup khi component unmount
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);

  return (
    <Layout style={{ flex: 1, paddingTop: 5 }}>
      <DashboardNavigation />
    </Layout>
  );
};

export default DashboardScreen;
