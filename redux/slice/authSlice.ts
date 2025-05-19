import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as authService from '../../services/authService';
// Định nghĩa kiểu User (có thể thay bằng kiểu từ model/User.ts nếu cần)
interface User {
  id: string;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  manager_role?: boolean;
  imange?: string;
}

interface AuthState {
  user: User | null;
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  users: [],
  loading: false,
  error: null,
};

// Thunk để đăng nhập
export const login = createAsyncThunk<
  User,
  { username: string; password: string },
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    // Gọi service để đăng nhập (sẽ viết sau)
    const response = await authService.login(credentials);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Đăng nhập thất bại');
  }
});

// Thunk để đăng xuất
export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Đăng xuất thất bại');
    }
  }
);

// Thunk để lấy danh sách users
export const fetchUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
  'auth/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getUsers();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Không thể lấy danh sách người dùng');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Xử lý login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Đăng nhập thất bại';
      });

    // Xử lý logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.users = [];
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Đăng xuất thất bại';
      });

    // Xử lý fetch users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Không thể lấy danh sách người dùng';
      });
  },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;