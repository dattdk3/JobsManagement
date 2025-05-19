import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers } from '@/redux/slice/UserSlice';
import { RootState, AppDispatch } from '@/redux/store';

export const useUser = () => {
  const dispatch: AppDispatch = useDispatch();

  // Lấy danh sách tất cả user và trạng thái loading từ Redux store
  const { users, loading } = useSelector((state: RootState) => state.user);

  // Lấy user đang đăng nhập từ authSlice
  const user = useSelector((state: RootState) => state.auth.user);
  const currentUsername = user?.username;
  // Fetch users khi component mount hoặc khi dispatch thay đổi
  useEffect(() => {
    if (!users.length) { // Chỉ fetch khi danh sách users chưa có
      dispatch(fetchUsers());
    }
  }, [dispatch, users.length]);

  return {
    users,
    user,
    currentUsername,
    loading, // Trả về loading để có thể sử dụng trong component
  };
};
