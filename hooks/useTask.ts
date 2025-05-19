import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllTasks,
  addNewTask,
  updateTask,
  deleteTask
} from '@/redux/slice/TaskSlice';
import { Task } from '@/model/Project';
import { RootState, AppDispatch } from '@/redux/store';

export const useTask = (projectId?: number) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: allTasks, loading } = useSelector((state: RootState) => state.task);

  // Fetch tất cả task 1 lần
  useEffect(() => {
    dispatch(fetchAllTasks());
  }, [dispatch]);
  // Thêm task
  const addTask = (task: Omit<Task, 'id'>) => {
    return dispatch(addNewTask(task));
  };

  // Cập nhật task
  const updateTaskById = (id: number, task: Partial<Task>) => {
    return dispatch(updateTask({ id, task }));
  };

  // Xóa task
  const deleteTaskById = (id: number) => {
    return dispatch(deleteTask(id));
  };

  return {
    tasks: allTasks.filter(task => task.id_project === projectId), // giữ nguyên
    allTasks, // thêm cái này để chỗ khác dùng nếu cần
    loading,
    addTask,
    updateTaskById,
    deleteTaskById,
  };
};
