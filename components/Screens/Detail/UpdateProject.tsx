import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { updateProject } from '@/redux/slice/ProjectSlice';
import { Project } from '@/model/Project';
import BackButton from '@/components/item/BackButton';
import ProjectForm from '@/components/item/ProjectForm';
import { AppDispatch } from '@/redux/store';

const UpdateProject: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();

  const { project: passedProject } = route.params || {};

  const [project, setProject] = useState<Omit<Project, 'id'>>({
    name: '',
    start_date: '',
    end_date: '',
    image: '',
    creator: '',
    status: true,
    task: [],
    description: '',
  });

  useEffect(() => {
    if (!passedProject) {
      Alert.alert('Lỗi', 'Không tìm thấy dữ liệu dự án.');
      navigation.goBack();
      return;
    }

    setProject({
      name: passedProject.name,
      start_date: passedProject.start_date,
      end_date: passedProject.end_date,
      image: passedProject.image,
      creator: passedProject.creator,
      status: passedProject.status,
      task: passedProject.task || [],
      description: passedProject.description || '',
    });
  }, [passedProject]);

  const handleChange = (key: keyof Omit<Project, 'id'>, value: string | boolean) => {
    setProject({ ...project, [key]: value });
  };

  const handleSubmit = async () => {
    if (!project.name || !project.start_date || !project.end_date || !project.creator) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin dự án.');
      return;
    }

    try {
      await dispatch(updateProject({ id: passedProject.id, project })).unwrap();
      Alert.alert('Thành công', 'Dự án đã được cập nhật!');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi cập nhật dự án.');
      console.log('>>> Update error:', error);
    }
  };

  return (
    <Layout style={styles.container}>
      <BackButton />
      <ProjectForm project={project} onChange={handleChange} onSubmit={handleSubmit} isUpdate={true}/>
    </Layout>
  );
};

export default UpdateProject;

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
});
