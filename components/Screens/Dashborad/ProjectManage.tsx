import React, { useState } from 'react';
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
import ProjectItem from '@/components/item/ProjectItem';
import { useNavigation } from '@react-navigation/native';
import { useProject } from '@/hooks/useProject'; // ✅ dùng custom hook
import { useTask } from '@/hooks/useTask';

const ProjectManage: React.FC = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const { projects } = useProject(); // ✅ lấy dữ liệu từ hook
  const { allTasks } = useTask();

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateNew = () => {
    navigation.navigate('AddProject');
  };

  return (
    <Layout style={styles.container}>
      <Text category="h5" style={styles.title}>
        Danh sách dự án
      </Text>

      <TextInput
        placeholder="🔍 Tìm kiếm dự án..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchInput}
      />

      <TouchableOpacity onPress={handleCreateNew} style={styles.createButton}>
        <Text style={styles.createButtonText}>➕ Tạo dự án mới</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.projectList}>
        {filteredProjects.map((project) => {
          
          const taskCount = Object.values(allTasks || {}).filter(
            (task: any) => task.id_project === project.id
          ).length;
          return (
            <ProjectItem
              key={project.id}
              project={project}
              taskCount={taskCount} // ✅ truyền đúng taskCount cho từng project
              onPressDetail={() =>
                navigation.navigate('ProjectDetail', { id: project.id, taskCount })
              }
            />
          );
        })}
      </ScrollView>
    </Layout>
  );
};

export default ProjectManage;

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
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: '#3366FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  projectList: {
    gap: 12,
    paddingBottom: 16,
  },
});