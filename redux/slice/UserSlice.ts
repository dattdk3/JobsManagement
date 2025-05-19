import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as userService from '../../services/userService';
import { User } from '@/model/User';
import { getAuth, updateEmail } from 'firebase/auth';
import { ref, update } from 'firebase/database';
import { db, auth } from '@/firebaseConfig';

interface UserState {
  users: User[];
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  user: null,
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async () => await userService.getAllUsers()
);

export const fetchUserById = createAsyncThunk(
  'user/fetchUserById',
  async (uid: string) => {
    return await userService.getUserById(uid);
  }
);

export const addNewUser = createAsyncThunk(
  'users/addNewUser',
  async (user: Omit<User, 'id'>) => {
    const id = await userService.addUser(user);
    return { id, ...user };
  }
);

export const updateExistingUser = createAsyncThunk(
'user/updateExistingUser',
  async ({ id, user }: { id: string; user: Partial<User> }, thunkAPI) => {
    try {
      // Cập nhật Realtime Database
      await update(ref(db, `users/${id}`), user);

      // Nếu là người dùng hiện tại và có cập nhật email
      const auth = getAuth();
      if (auth.currentUser?.uid === id && user.email) {
        await updateEmail(auth.currentUser, user.email);
      }

      return { id, user };
    } catch (error: any) {
      return thunkAPI.rejectWithValue({message: error.message,
        code: error.code,
    });
    }
  }
);

export const deleteExistingUser = createAsyncThunk(
  'users/deleteUser',
  async (id: string) => {
    await userService.deleteUser(id);
    return id;
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUsers.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(addNewUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })

      .addCase(updateExistingUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = { ...state.users[index], ...action.payload.user };
        }
      })

      .addCase(deleteExistingUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.id !== action.payload);
      })

      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error fetching user';
      });
  },
});

export default userSlice.reducer;
