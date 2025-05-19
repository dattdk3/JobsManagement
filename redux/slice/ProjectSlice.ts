import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as projectService from '../../services/projectService';
import { Project } from '@/model/Project';

// Định nghĩa kiểu cho state
type ProjectState = {
  list: Project[]; // Danh sách tất cả các dự án
  selectedProject: Project | null; // Dự án hiện tại được chọn
  loading: boolean; // Trạng thái tải
  error: string | null; // Lưu lỗi nếu có
};

// Khởi tạo state
const initialState: ProjectState = {
  list: [],
  selectedProject: null,
  loading: false,
  error: null,
};

// Lấy toàn bộ dự án
export const fetchProjects = createAsyncThunk<Project[], void, { rejectValue: string }>(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      return await projectService.getAllProjects();
    } catch (error) {
      return rejectWithValue('Không thể lấy danh sách dự án');
    }
  }
);

// Lấy project theo ID
export const fetchProjectById = createAsyncThunk<Project, number, { rejectValue: string }>(
  'projects/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await projectService.getProjectById(id);
      if (!response) {
        return rejectWithValue('Dự án không tồn tại');
      }
      return response;
    } catch (error) {
      return rejectWithValue('Không thể lấy dự án');
    }
  }
);

// Thêm dự án mới
export const addNewProject = createAsyncThunk<Project, Omit<Project, 'id'>, { rejectValue: string }>(
  'projects/addNewProject',
  async (project, { rejectWithValue }) => {
    try {
      const id = await projectService.addProject(project);
      return { id, ...project };
    } catch (error) {
      return rejectWithValue('Không thể thêm dự án');
    }
  }
);

// Cập nhật dự án
export const updateProject = createAsyncThunk<
  Project,
  { id: number; project: Partial<Project> },
  { rejectValue: string }
>(
  'projects/updateProject',
  async ({ id, project }, { rejectWithValue }) => {
    try {
      await projectService.updateProject(id, project);
      const updated = await projectService.getProjectById(id);
      if (!updated) {
        return rejectWithValue('Không tìm thấy dự án sau khi cập nhật');
      }
      return updated;
    } catch (error) {
      return rejectWithValue('Cập nhật dự án thất bại');
    }
  }
);

// Xóa dự án
export const deleteProject = createAsyncThunk<number, number, { rejectValue: string }>(
  'projects/deleteProject',
  async (projectId, { rejectWithValue }) => {
    try {
      await projectService.deleteProject(projectId);
      return projectId;
    } catch (error) {
      return rejectWithValue('Không thể xóa dự án');
    }
  }
);

// Slice
const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearSelectedProject(state) {
      state.selectedProject = null;
    },
  },
  extraReducers: (builder) => {
    // fetchProjects
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lỗi không xác định';
      })
      // fetchProject   fetchProjectById
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.selectedProject = action.payload;
        state.loading = false;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lỗi không xác định';
        state.selectedProject = null;
      })
      // addNewProject
      .addCase(addNewProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewProject.fulfilled, (state, action) => {
        state.list.push(action.payload);
        state.loading = false;
      })
      .addCase(addNewProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lỗi không xác định';
      })
      // updateProject
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.list.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        state.selectedProject = action.payload; // Cập nhật selectedProject
        state.loading = false;
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lỗi không xác định';
      })
      // deleteProject
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p.id !== action.payload);
        if (state.selectedProject?.id === action.payload) {
          state.selectedProject = null;
        }
        state.loading = false;
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lỗi không xác định';
      });
  },
});

export const { clearSelectedProject } = projectSlice.actions;
export default projectSlice.reducer;