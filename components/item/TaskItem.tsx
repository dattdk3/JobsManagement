import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Task } from '@/model/Project';

interface TaskItemProps {
  task: Task;
  onPressDetail: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onPressDetail }) => {
  const checkOverdueStatus = () => {
    const currentDate = new Date();
    const endDate = new Date(task.end_date);
    
    // Check if task is not completed and end date is past current date
    if (!task.status && endDate < currentDate) {
      return 'overdue';
    }
    return task.status ? 'completed' : 'pending';
  };

  const status = checkOverdueStatus();

  const getStatusDisplay = () => {
    switch (status) {
      case 'overdue':
        return { text: '⌛ Quá hạn', color: '#FF0000' };
      case 'completed':
        return { text: '✅ Hoàn thành', color: '#4CAF50' };
      default:
        return { text: '🕒 Chưa hoàn thành', color: '#FF5722' };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <TouchableOpacity style={styles.card} onPress={onPressDetail}>
      <View style={styles.header}>
        <Text style={styles.title}>{task.title}</Text>
        <Text style={[styles.status, { color: statusDisplay.color }]}>
          {statusDisplay.text}
        </Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.date}>
          📅 {task.start_date} → {task.end_date}
        </Text>
      </View>

      <Text style={styles.detailButton}>Xem chi tiết →</Text>
    </TouchableOpacity>
  );
};

export default TaskItem;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flexShrink: 1,
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
  },
  body: {
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailButton: {
    marginTop: 6,
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
});