import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllTasks } from '@/redux/slice/TaskSlice';
import { Task } from '@/model/Project';
import { RootState, AppDispatch } from '@/redux/store';

export const useUserTasks = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: allTasks, loading } = useSelector((state: RootState) => state.task);
  const username = useSelector((state: RootState) => state.auth.user?.username);

  // Fetch tất cả task của người dùng đang đăng nhập
  useEffect(() => {
    if (!username) {
      console.log('Username không tồn tại, không thể lấy tasks');
      return;
    }
    dispatch(fetchAllTasks());
  }, [dispatch, username]);

  // Lọc task theo username (đảm bảo chỉ lấy task của người dùng hiện tại)
  const userTasks = allTasks.filter((task) => task.username === username);

  return {
    tasks: userTasks,
    loading,
  };
};