import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Student } from "@/Examination/model/Student";
import {
  addStudent,
  fetchStudents,
  deleteStudent,
  updateStudent,
} from "../../service/StudentService";

interface StudentState {
  students: (Student & { id: string })[];
  loading: boolean;
  error: string | null;
}

const initialState: StudentState = {
  students: [],
  loading: false,
  error: null,
};

export const fetchAllStudents = createAsyncThunk("student/fetchAll", async () => {
  return await fetchStudents();
});

export const createStudent = createAsyncThunk(
  "student/create",
  async (student: Student) => {
    return await addStudent(student);
  }
);

export const editStudent = createAsyncThunk(
  "student/edit",
  async ({ id, data }: { id: string; data: Partial<Student> }) => {
    await updateStudent(id, data);
    return { id, data };
  }
);

export const removeStudent = createAsyncThunk("student/remove", async (id: string) => {
  await deleteStudent(id);
  return id;
});

const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllStudents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllStudents.fulfilled, (state, action) => {
        state.students = action.payload;
        state.loading = false;
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.students.push(action.payload);
      })
      .addCase(editStudent.fulfilled, (state, action) => {
        const { id, data } = action.payload;
        const index = state.students.findIndex((s) => s.id === id);
        if (index !== -1) {
          state.students[index] = { ...state.students[index], ...data };
        }
      })
      .addCase(removeStudent.fulfilled, (state, action) => {
        state.students = state.students.filter((s) => s.id !== action.payload);
      });
  },
});

export default studentSlice.reducer;
