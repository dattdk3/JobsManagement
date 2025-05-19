import React, { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { addNewProject } from '@/redux/slice/ProjectSlice';
import ProjectForm from '@/components/item/ProjectForm';
import { Project } from '@/model/Project';
import BackButton from '@/components/item/BackButton';
import { useUser } from '@/hooks/useUser';

const AddProject: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user: userData } = useUser();

  const [project, setProject] = useState<Omit<Project, 'id'>>({
    name: '',
    start_date: '',
    end_date: '',
    image: '',
    creator: userData?.username || 'unonymous',
    status: true,
    task: [],
    description: '',
  });

  const handleChange = (key: keyof Omit<Project, 'id'>, value: string | boolean) => {
    setProject({ ...project, [key]: value });
  };

  const handleSubmit = async () => {
    if (!project.name || !project.start_date || !project.end_date || !project.creator) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin dự án.');
      return;
    }

    try {
      await dispatch(addNewProject(project) as any);
      Alert.alert('Thành công', 'Dự án đã được tạo!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tạo dự án.');
    }
  };

  return (
    <Layout style={styles.container}>
      <BackButton />
      <Text category="h5" style={styles.title}>
        Tạo dự án mới
      </Text>
      <ProjectForm
        project={project}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isUpdate={false}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 40,
  },
  title: {
    marginBottom: 16,
  },
});

export default AddProject;
