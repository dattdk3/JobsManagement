import React from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Layout, Text, useTheme, Icon } from '@ui-kitten/components';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useProject } from '@/hooks/useProject';
import { useTask } from '@/hooks/useTask';
import TaskItem from '@/components/item/TaskItem';
import BackButton from '@/components/item/BackButton';

const ProjectDetail: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { id } = route.params;
  const { projects, removeProject } = useProject();
  const { tasks } = useTask(id);
  const theme = useTheme();

  const project = projects.find(p => p.id === id);

  if (!project) {
    return (
      <Layout style={styles.centered}>
        <Text category="h6" status="danger">Dự án không tồn tại</Text>
      </Layout>
    );
  }

  const checkOverdueStatus = () => {
    const currentDate = new Date();
    const endDate = new Date(project.end_date);
    
    // Check if project is active and end date is past current date
    if (project.status && endDate < currentDate) {
      return 'overdue';
    }
    return project.status ? 'active' : 'closed';
  };

  const status = checkOverdueStatus();

  const getStatusDisplay = () => {
    switch (status) {
      case 'overdue':
        return { text: '⌛ Quá hạn', color: theme['color-danger-500'] };
      case 'active':
        return { text: '✅ Hoạt động', color: theme['color-success-500'] };
      default:
        return { text: '🛑 Đã đóng', color: theme['color-danger-500'] };
    }
  };

  const statusDisplay = getStatusDisplay();

  const handleAddTask = () => {
    navigation.navigate('AddTask', { projectId: project.id });
  };

  const handleEdit = () => {
    navigation.navigate('UpdateProject', { project });
  };

  const handleDelete = () => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xoá dự án này?', [
      { text: 'Huỷ' },
      {
        text: 'Xoá',
        style: 'destructive',
        onPress: () => {
          removeProject(id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <Layout style={styles.container}>
      <BackButton />

      {/* Actions */}
      <View style={styles.actionRow}>
        <TouchableOpacity onPress={handleEdit}>
          <Icon name="edit-2-outline" fill={theme['color-primary-500']} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete}>
          <Icon name="trash-2-outline" fill={theme['color-danger-500']} style={styles.icon} />
        </TouchableOpacity>
      </View>

      {/* Thông tin dự án */}
      <View style={[styles.projectContainer, { borderColor: theme['color-basic-500'], backgroundColor: theme['background-basic-color-1'] }]}>
        <Text category="h4" style={[styles.projectName, { color: theme['text-basic-color'] }]}>
          {project.name}
        </Text>
        <Text appearance="hint" style={[styles.creator, { color: theme['text-hint-color'] }]}>
          👤 {project.creator}
        </Text>
        <Text style={[styles.info, { color: theme['text-basic-color'] }]}>📅 Ngày bắt đầu: {project.start_date}</Text>
        <Text style={[styles.info, { color: theme['text-basic-color'] }]}>📅 Ngày kết thúc: {project.end_date}</Text>
        <Text appearance="default" style={[styles.description, { color: theme['text-basic-color'] }]}>
          Mô tả: {project.description}
        </Text>
        <Text style={[styles.info, { color: theme['text-basic-color'] }]}>📋 Số lượng công việc: {tasks.length}</Text>
        <Text style={[styles.info, { color: statusDisplay.color }]}>
          ⚙️ Trạng thái: {statusDisplay.text}
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleAddTask}
        style={[styles.addTaskButton, { backgroundColor: theme['color-primary-500'] }]}
      >
        <Text style={styles.addTaskText}>+ Thêm công việc</Text>
      </TouchableOpacity>

      <Text category="h6" style={[styles.taskTitle, { color: theme['text-basic-color'] }]}>
        Danh sách công việc:
      </Text>
      <ScrollView contentContainerStyle={styles.taskList}>
        {tasks.length > 0 ? (
          tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onPressDetail={() => navigation.navigate('TaskDetail', { taskId: task.id })}
            />
          ))
        ) : (
          <Text appearance="hint" style={[styles.noTask, { color: theme['text-hint-color'] }]}>
            Chưa có công việc nào
          </Text>
        )}
      </ScrollView>
    </Layout>
  );
};

export default ProjectDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginBottom: 10,
  },
  icon: {
    width: 24,
    height: 24,
  },
  projectContainer: {
    padding: 20,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
  },
  projectName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  creator: {
    marginBottom: 6,
    fontSize: 14,
  },
  description: {
    fontSize: 15,
    marginBottom: 12,
  },
  info: {
    fontSize: 14,
    marginBottom: 4,
  },
  addTaskButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  addTaskText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  taskTitle: {
    marginBottom: 12,
  },
  taskList: {
    gap: 14,
    paddingBottom: 30,
  },
  noTask: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
});