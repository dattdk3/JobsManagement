import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Input, Button, Layout, Text } from "@ui-kitten/components";
import { User } from "@/model/User";

interface Props {
  user: User;
  onSave: (updatedUser: Partial<User>) => void;
}

const UserDetailItem: React.FC<Props> = ({ user, onSave }) => {
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [image, setImage] = useState(user.imange || '');
  const [managerRole, setManagerRole] = useState(user.manager_role);

  useEffect(() => {
    // Cập nhật dữ liệu khi user thay đổi
    setUsername(user.username);
    setEmail(user.email);
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setImage(user.imange || '');
    setManagerRole(user.manager_role);
  }, [user]);

  const handleSave = () => {
    const updatedUser: Partial<User> = {
      username,
      email,
      first_name: firstName,
      last_name: lastName,
      imange: image,
      manager_role: managerRole,
    };

    onSave(updatedUser);
  };

  return (
    <Layout style={styles.container}>
      <Input
        label="Tên người dùng"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />

      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />

      <Input
        label="Họ"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />

      <Input
        label="Tên"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />

      <Input
        label="Ảnh đại diện (URL)"
        value={image}
        onChangeText={setImage}
        style={styles.input}
      />

      {/* Nếu bạn muốn thêm một toggle switch cho manager_role thì có thể dùng @ui-kitten's Toggle */}
      {/* Hoặc đơn giản chỉ hiển thị/không cho sửa: */}
      <Input
        label="Vai trò quản lý"
        value={managerRole ? "Quản lý" : "Nhân viên"}
        disabled
        style={styles.input}
      />

      <Button onPress={handleSave} style={styles.button}>
        Lưu thay đổi
      </Button>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 20,
  },
});

export default UserDetailItem;
