import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Layout, Text, Spinner, Button } from '@ui-kitten/components';
import { useRoute, useNavigation } from '@react-navigation/native';
import TaskForm from '@/components/item/TaskForm';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { getTaskById, updateTask, deleteTask } from '@/redux/slice/TaskSlice';
import BackButton from '@/components/item/BackButton';
import { Task } from '@/model/Project';
import { useUser } from '@/hooks/useUser';
import { useProject } from '@/hooks/useProject';

const TaskDetail: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { taskId } = route.params as { taskId: number };
  const dispatch = useAppDispatch();
  const { users, loading: usersLoading } = useUser();
  const { projects, removeProject } = useProject();

  const currentTask = useAppSelector((state) => state.task.currentTask);
  const taskLoading = useAppSelector((state) => state.task.loading);
  const [initialTask, setInitialTask] = useState<Task | null>(null);
  const [editedTask, setEditedTask] = useState<Task | null>(null);

  // Lấy thông tin task khi component được mount
  useEffect(() => {
    dispatch(getTaskById(taskId));
  }, [dispatch, taskId]);

  // Cập nhật task ban đầu khi currentTask thay đổi
  useEffect(() => {
    if (currentTask && currentTask.id === taskId) {
      setInitialTask(currentTask);
      setEditedTask({ ...currentTask, id: taskId });
    }
  }, [currentTask, taskId]);
  const project = projects.find(p => p.id === currentTask?.id_project);

  useEffect(() => {
    setEditedTask(null); // Reset state khi chuyển trang
  }, [taskId]);
  // Lưu task đã chỉnh sửa
  const handleSave = async () => {
    if (editedTask) {
      const updatedTask = { ...editedTask, id: taskId };
      console.log('Task data to update:', updatedTask);
      const response = await dispatch(updateTask({ id: updatedTask.id, task: updatedTask }));
      if (response.error) {
        Alert.alert('Lỗi', 'Không thể cập nhật công việc.');
      } else {
        Alert.alert('Cập nhật thành công', `Task ${updatedTask.id} đã được lưu.`);
        navigation.goBack();
      }
    } else {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin công việc.');
    }
  };

  // Xoá task
  const handleDelete = () => {
    Alert.alert('Xác nhận xoá', 'Bạn có chắc muốn xoá task này?', [
      { text: 'Huỷ' },
      {
        text: 'Xoá',
        style: 'destructive',
        onPress: async () => {
          await dispatch(deleteTask(taskId));
          Alert.alert('Đã xoá', `Task ${taskId} đã bị xoá.`);
          navigation.goBack();
        },
      },
    ]);
  };

  // Nếu đang loading hoặc không có task, hiển thị spinner
  if (taskLoading || !initialTask || usersLoading || !users) {
    return (
      <Layout style={styles.center}>
        <Spinner size="giant" />
      </Layout>
    );
  }

  return (
    <Layout style={styles.container}>
      <BackButton />
      <View style={styles.projectBox}>
  <Text style={styles.projectLabel}>Dự án:</Text>
  <Text style={styles.projectName}>{project?.name || 'Không xác định'}</Text>
</View>
      <Text category="h5" style={styles.title}>
        Chi tiết công việc
      </Text>

      {/* Hiển thị form chỉnh sửa task */}
      <TaskForm
        task={initialTask} // Truyền task ban đầu, không thay đổi liên tục
        onChange={(t) => setEditedTask(t)}
        usernames={users.map((u) => u.username).filter(Boolean)}
        editable={true} // Đảm bảo form có thể chỉnh sửa
      />

      <View style={styles.footer}>
        <Button style={styles.button} onPress={handleSave}>
          Cập nhật
        </Button>
        <Button style={styles.button} status="danger" onPress={handleDelete}>
          Xoá
        </Button>
      </View>
    </Layout>
  );
};

export default TaskDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 40,
  },
  projectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcdcdc',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    marginBottom: 16,
  },
  projectLabel: {
    fontWeight: 'bold',
    marginRight: 8,
    fontSize: 16,
    color: '#3366FF',
  },
  projectName: {
    fontSize: 16,
    color: '#222B45',
    fontWeight: 'bold',
    paddingLeft: 30,
  },
  
  title: {
    marginBottom: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
  },
});