// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import projectReducer from "../redux/slice/ProjectSlice";
import userReducer from "../redux/slice/UserSlice";
import taskReducer from "../redux/slice/TaskSlice";
import authReducer from "../redux/slice/authSlice";
//import notificationReducer from "../redux/slice/notificationSlice";

import studentReducer from "../Examination/redux/slice/studentSlice";

export const store = configureStore({
  reducer: {
    project: projectReducer,
    user: userReducer,
    task: taskReducer,
    auth: authReducer,
    //notification: notificationReducer,

    student: studentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;