import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Project } from '@/model/Project';

interface Props {
  project: Project;
  taskCount: number;
  onPressDetail: () => void;
}

const ProjectItem: React.FC<Props> = ({ project, taskCount, onPressDetail }) => {
  const checkOverdueStatus = () => {
    const currentDate = new Date();
    const endDate = new Date(project.end_date);
    
    // Check if project is not completed and end date is past current date
    if (project.status && endDate < currentDate) {
      return 'overdue';
    }
    return project.status ? 'active' : 'closed';
  };

  const status = checkOverdueStatus();

  const getStatusDisplay = () => {
    switch (status) {
      case 'overdue':
        return { text: '⌛ Quá hạn', color: '#FF0000' };
      case 'active':
        return { text: '✅ Hoạt động', color: '#22C55E' };
      default:
        return { text: '🛑 Đã đóng', color: '#EF4444' };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{project.name}</Text>

      <View style={styles.row}>
        <Text style={styles.label}>👤 Người tạo: </Text>
        <Text style={styles.value}>{project.creator}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>📅 Thời gian: </Text>
        <Text style={styles.value}>{project.start_date} - {project.end_date}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>📝 Số công việc: </Text>
        <Text style={styles.value}>{taskCount || 0}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>📌 Trạng thái: </Text>
        <Text style={[styles.value, { color: statusDisplay.color }]}>
          {statusDisplay.text}
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={onPressDetail}>
        <Text style={styles.buttonText}>🔍 Xem chi tiết</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProjectItem;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fdfdfd',
    padding: 20,
    borderRadius: 16,
    marginBottom: 10,
    marginVertical: 8,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
    borderWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  button: {
    marginTop: 16,
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});