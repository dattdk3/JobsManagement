// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// export interface Notification {
//   title: string;
//   body: string;
// }

// interface NotificationState {
//   fcmToken: string | null;
//   notifications: Notification[];
// }

// const initialState: NotificationState = {
//   fcmToken: null,
//   notifications: [],
// };

// const notificationSlice = createSlice({
//   name: 'notification',
//   initialState,
//   reducers: {
//     setFcmToken: (state, action: PayloadAction<string>) => {
//       state.fcmToken = action.payload;
//     },
//     addNotification: (state, action: PayloadAction<Notification>) => {
//       state.notifications.push(action.payload);
//     },
//     clearNotifications: (state) => {
//       state.notifications = [];
//     },
//   },
// });

// export const { setFcmToken, addNotification, clearNotifications } = notificationSlice.actions;
// export default notificationSlice.reducer;