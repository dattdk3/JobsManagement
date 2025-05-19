import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Input,
  Datepicker,
  Select,
  SelectItem,
  IndexPath,
  Toggle,
  Text,
  Layout,
} from '@ui-kitten/components';

const priorityOptions = ['Thấp', 'Trung bình', 'Cao'];

interface TaskFormProps {
  task?: { // task giờ là tùy chọn
    title?: string;
    description?: string;
    start_date?: string;
    end_date?: string;
    priority?: string;
    status?: boolean;
    assigned_to?: string;
  };
  onChange?: (task: any) => void;
  editable?: boolean;
  usernames?: string[];
}

const TaskForm: React.FC<TaskFormProps> = ({
  task,
  onChange,
  editable = true,
  usernames = [],
}) => {
  // Khởi tạo state với giá trị mặc định nếu task là undefined
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [startDate, setStartDate] = useState(
    task?.start_date ? new Date(task.start_date) : new Date()
  );
  const [endDate, setEndDate] = useState(
    task?.end_date ? new Date(task.end_date) : new Date()
  );
  const [priorityIndex, setPriorityIndex] = useState<IndexPath>(
    new IndexPath(priorityOptions.indexOf(task?.priority || 'Trung bình'))
  );
  const [status, setStatus] = useState(task?.status || false);
  const [selectedUserIndex, setSelectedUserIndex] = useState<IndexPath | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Khởi tạo state ban đầu chỉ một lần khi component mount
  useEffect(() => {
    if (!isInitialized) {
      setTitle(task?.title || '');
      setDescription(task?.description || '');
      setStartDate(task?.start_date ? new Date(task.start_date) : new Date());
      setEndDate(task?.end_date ? new Date(task.end_date) : new Date());
      setPriorityIndex(
        new IndexPath(priorityOptions.indexOf(task?.priority || 'Trung bình'))
      );
      setStatus(task?.status || false);

      if (usernames.length > 0 && task?.assigned_to) {
        const idx = usernames.indexOf(task.assigned_to);
        setSelectedUserIndex(new IndexPath(idx >= 0 ? idx : 0));
      } else {
        setSelectedUserIndex(null);
      }

      setIsInitialized(true);
    }
  }, [task, usernames, isInitialized]);

  // Hàm helper để cập nhật và gọi onChange
  const updateTask = (newData: Partial<TaskFormProps['task']>) => {
    const updatedTask = {
      title,
      description,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      priority: priorityOptions[priorityIndex.row],
      status,
      assigned_to:
        selectedUserIndex && usernames.length > 0
          ? usernames[selectedUserIndex.row]
          : undefined,
      ...newData,
    };

    if (onChange) {
      onChange(updatedTask);
    }
  };

  return (
    <Layout>
      <Input
        label="Tiêu đề"
        placeholder="Nhập tiêu đề"
        value={title}
        onChangeText={(newTitle) => {
          setTitle(newTitle);
          updateTask({ title: newTitle });
        }}
        style={styles.input}
        disabled={!editable}
      />

      <Input
        label="Mô tả"
        placeholder="Chi tiết công việc"
        value={description}
        onChangeText={(newDescription) => {
          setDescription(newDescription);
          updateTask({ description: newDescription });
        }}
        multiline
        textStyle={{ minHeight: 64 }}
        style={styles.input}
        disabled={!editable}
      />

      <View style={styles.row}>
        <View style={styles.datePicker}>
          <Text category="label">Ngày bắt đầu</Text>
          <Datepicker
            date={startDate}
            onSelect={(newDate) => {
              setStartDate(newDate);
              updateTask({ start_date: newDate.toISOString().split('T')[0] });
            }}
            disabled={!editable}
            style={styles.input}
          />
        </View>
        <View style={styles.datePicker}>
          <Text category="label">Ngày kết thúc</Text>
          <Datepicker
            date={endDate}
            onSelect={(newDate) => {
              setEndDate(newDate);
              updateTask({ end_date: newDate.toISOString().split('T')[0] });
            }}
            disabled={!editable}
            style={styles.input}
          />
        </View>
      </View>

      <Select
        label="Người thực hiện"
        selectedIndex={selectedUserIndex}
        onSelect={(index) => {
          setSelectedUserIndex(index as IndexPath);
          updateTask({
            assigned_to:
              index && usernames.length > 0 ? usernames[(index as IndexPath).row] : undefined,
          });
        }}
        placeholder="Chọn người thực hiện"
        value={
          selectedUserIndex !== null && usernames.length > 0
            ? usernames[selectedUserIndex.row]
            : ''
        }
        style={styles.input}
        disabled={!editable}
      >
        {usernames.map((username, index) => (
          <SelectItem key={index} title={username} />
        ))}
      </Select>

      <Select
        label="Mức độ ưu tiên"
        selectedIndex={priorityIndex}
        onSelect={(index) => {
          setPriorityIndex(index as IndexPath);
          updateTask({ priority: priorityOptions[(index as IndexPath).row] });
        }}
        value={priorityOptions[priorityIndex.row]}
        style={styles.input}
        disabled={!editable}
      >
        {priorityOptions.map((option, i) => (
          <SelectItem key={i} title={option} />
        ))}
      </Select>

      <Toggle
        checked={status}
        onChange={(newStatus) => {
          setStatus(newStatus);
          updateTask({ status: newStatus });
        }}
        style={styles.input}
        disabled={!editable}
      >
        Đã hoàn thành
      </Toggle>
    </Layout>
  );
};

export default TaskForm;

const styles = StyleSheet.create({
  input: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  datePicker: {
    flex: 1,
  },
});