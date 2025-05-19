// redux/slices/taskSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as taskService from '@/services/taskService';
import { Task } from '@/model/Project';

interface TaskState {
  data: Task[];
  loading: boolean;
  currentTask?: Task | null;
}

const initialState: TaskState = {
  data: [],
  loading: false,
  currentTask: null,
};

// Thêm action setCurrentTask
export const setCurrentTask = (task: Task | null) => ({
    type: 'tasks/setCurrentTask',
    payload: task,
  });

// Async actions
export const fetchTasksByProject = createAsyncThunk(
  'tasks/fetchByProject',
  async (projectId: number) => {
    return await taskService.getTasksByProjectId(projectId);
  }
);

export const getTaskById = createAsyncThunk(
    'tasks/getTaskById',
    async (taskId: number) => {
      return await taskService.getTaskById(taskId);  // Gọi service ở đây
    }
  );

  export const fetchAllTasks = createAsyncThunk(
    'tasks/fetchAll',
    async () => {
      return await taskService.getAllTasks();
    }
  );  

export const addNewTask = createAsyncThunk(
  'tasks/addTask',
  async (task: Omit<Task, 'id'>) => {
    const id = await taskService.addTask(task);
    return { id, ...task };
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, task }: { id: number; task: Partial<Task> }) => {
    await taskService.updateTask(id, task);
    return { id, ...task };
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id: number) => {
    await taskService.deleteTask(id.toString());
    return id;
  }
);

// Slice
const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTasksByProject.pending, state => {
        state.loading = true;
      })
      .addCase(fetchTasksByProject.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(getTaskById.fulfilled, (state, action) => {
        state.currentTask = action.payload;  // Cập nhật task khi lấy thành công
      })
      .addCase(addNewTask.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.data.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = { ...state.data[index], ...action.payload };
        }
      })
      .addCase(fetchAllTasks.pending, state => {
        state.loading = true;
      })
      .addCase(fetchAllTasks.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.data = state.data.filter(t => t.id !== action.payload);
      });
  },
});

export default taskSlice.reducer;
