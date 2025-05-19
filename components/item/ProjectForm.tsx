import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Input,
  Layout,
  Text,
  Datepicker,
  Button,
  Toggle,
} from '@ui-kitten/components';
import { Project } from '@/model/Project';

interface ProjectFormProps {
  project: Omit<Project, 'id' | 'task'>;
  onChange: (key: keyof Omit<Project, 'id' | 'task'>, value: string | boolean) => void;
  onSubmit: () => void;
  isUpdate: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  project,
  onChange,
  onSubmit,
  isUpdate,
}) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    if (project.start_date) {
      setStartDate(new Date(project.start_date));
    }
    if (project.end_date) {
      setEndDate(new Date(project.end_date));
    }
  }, [project.start_date, project.end_date]);

  useEffect(() => {
    onChange('start_date', startDate.toISOString().split('T')[0]);
  }, [startDate]);

  useEffect(() => {
    onChange('end_date', endDate.toISOString().split('T')[0]);
  }, [endDate]);

  return (
    <Layout style={styles.container}>
      <Text category="h6" style={styles.title}>
        {isUpdate ? '🛠️ Cập nhật dự án' : '🆕 Tạo dự án mới'}
      </Text>

      <Input
        label="Tên dự án"
        placeholder="Nhập tên dự án"
        value={project.name}
        onChangeText={(text) => onChange('name', text)}
        style={styles.input}
      />

      <View style={styles.row}>
        <View style={styles.datePicker}>
          <Text category="label">Ngày bắt đầu</Text>
          <Datepicker
            date={startDate}
            onSelect={setStartDate}
            style={styles.input}
          />
        </View>

        <View style={styles.datePicker}>
          <Text category="label">Ngày kết thúc</Text>
          <Datepicker
            date={endDate}
            onSelect={setEndDate}
            style={styles.input}
          />
        </View>
      </View>

      <Input
        label="Ảnh đại diện"
        placeholder="URL ảnh"
        value={project.image}
        onChangeText={(text) => onChange('image', text)}
        style={styles.input}
      />

      <Input
        label="Mô tả"
        placeholder="Mô tả dự án"
        value={project.description}
        onChangeText={(text) => onChange('description', text)}
        style={styles.input}
        multiline
        textStyle={{ minHeight: 64 }}
      />

      <Toggle
        checked={project.status}
        onChange={(checked) => onChange('status', checked)}
        style={styles.input}
      >
        {project.status ? 'Đang hoạt động' : 'Không hoạt động'}
      </Toggle>

      <Button onPress={onSubmit} style={styles.submitButton}>
        {isUpdate ? '💾 Lưu thay đổi' : '📥 Tạo dự án'}
      </Button>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  datePicker: {
    flex: 1,
    marginRight: 8,
  },
  submitButton: {
    marginTop: 16,
    borderRadius: 8,
  },
});

export default ProjectForm;
