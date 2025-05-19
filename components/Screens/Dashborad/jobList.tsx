import React, { useEffect, useState } from 'react';
import { FlatList, View, TextInput, StyleSheet } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
import TaskItem from '@/components/item/TaskItem';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '@/hooks/useUser';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllTasks } from '@/redux/slice/TaskSlice';
import { RootState, AppDispatch } from '@/redux/store';

const JobList: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const [searchQuery, setSearchQuery] = useState('');
  const { currentUsername, loading: userLoading } = useUser();
  const { data: allTasks, loading: taskLoading } = useSelector((state: RootState) => state.task);

  // Fetch tất cả task khi component mount
  useEffect(() => {
      dispatch(fetchAllTasks());
  }, [dispatch]);

  const filteredTasks = allTasks.filter((task) =>
    task.assigned_to === currentUsername
  );

  const handleDetail = (id: number) => {
    navigation.navigate('TaskDetail', { id });
  };

  const handleAddTask = () => {
    navigation.navigate('ProjectManage');
  };

  return (
    <Layout style={styles.container}>
      {taskLoading && <Text style={styles.loadingText}>Đang tải công việc...</Text>}
      <TextInput
        placeholder="🔍 Tìm kiếm công việc..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchInput}
      />

      <Text category="h1" style={styles.title}>
        Danh sách công việc
      </Text>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onPressDetail={() => navigation.navigate('TaskDetail', { taskId: item.id })}
          />
        )}
        ListEmptyComponent={() => (
          <View style={styles.noTaskContainer}>
            <Text style={styles.noTaskText}>Chưa có công việc nào</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </Layout>
  );
};

export default JobList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  separator: {
    height: 12,
  },
  noTaskContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  noTaskText: {
    fontSize: 16,
    color: '#888',
  },
  loadingText: {
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 16,
    color: '#888',
  },
});