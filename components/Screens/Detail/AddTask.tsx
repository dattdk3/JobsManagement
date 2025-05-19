import BackButton from '@/components/item/BackButton';
import TaskForm from '@/components/item/TaskForm';
import { useUser } from '@/hooks/useUser';
import { addNewTask } from '@/redux/slice/TaskSlice';
import { AppDispatch } from '@/redux/store';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button, Layout, Text } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { saveNotificationToHistory, sendPushNotification } from '../../../services/notificationService';

const AddTask: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { projectId } = route.params;

  const [formData, setFormData] = useState<any>({});
  const { user, users } = useUser();

  const creatorUsername = user?.username || 'anonymous';

  const [userList, setUserList] = useState<string[]>([]);

  useEffect(() => {
    if (users && users.length > 0) {
      const filteredUserList = users
        .map((u: { username: string }) => u.username)
        .filter((username) => username);
      setUserList(filteredUserList);
    }
  }, [users]);

  const handleSubmit = async () => {
    const newTask = {
      ...formData,
      id_project: projectId,
      creator: creatorUsername,
      username: formData.username || 'anonymous',
    };

    // Tìm người dùng được giao task
    const assignedUser = users.find((u: any) => u.username === formData.username);

    if (assignedUser) {
      const userId = assignedUser.id;
      const userToken = assignedUser.expoPushToken;

      if (userToken) {
        await sendPushNotification(
          userToken,
          'Công việc mới',
          'Bạn vừa được giao một công việc mới'
        );
      }

      await saveNotificationToHistory(
        userId,
        'Công việc mới',
        'Bạn vừa được giao một công việc mới'
      );
    }

    await dispatch(addNewTask(newTask));
    navigation.goBack();
  };

  return (
    <Layout style={styles.container}>
      <BackButton />
      <Text category="h5" style={styles.title}>
        Thêm công việc mới
      </Text>

      <TaskForm onChange={setFormData} usernames={userList} />

      <View style={styles.footer}>
        <Button onPress={handleSubmit}>Lưu</Button>
      </View>
    </Layout>
  );
};

export default AddTask;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  footer: {
    marginTop: 20,
  },
});
