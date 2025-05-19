// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { requestUserPermission, getFcmToken, listenForNotifications, NotificationPayload } from '../services/notificationService';
// import { setFcmToken, addNotification } from '../redux/slice/notificationSlice';
// import { RootState } from '../redux/store';
// import { ref, set } from 'firebase/database';
// import { db } from '../firebaseConfig';

// export default function useNotification() {
//   const dispatch = useDispatch();
//   const username = useSelector((state: RootState) => state.user.username);

//   useEffect(() => {
//     if (!username) {
//       console.log('Username không tồn tại, không thể gửi FCM token');
//       return;
//     }

//     // Xin quyền thông báo
//     requestUserPermission().then((granted) => {
//       if (granted) {
//         // Lấy FCM token và lưu vào Redux
//         getFcmToken().then(token => {
//           if (token) {
//             dispatch(setFcmToken(token));
//             // Gửi token lên server
//             sendFcmTokenToServer(token, username);
//           }
//         });
//       }
//     });

//     // Lắng nghe thông báo và thêm vào Redux
//     listenForNotifications((payload: NotificationPayload) => {
//       dispatch(
//         addNotification({
//           title: payload.notification?.title || 'Thông báo mới',
//           body: payload.notification?.body || 'Bạn có công việc mới!',
//         })
//       );
//     });
//   }, [dispatch, username]);

//   // Hàm gửi FCM token lên server (Realtime Database)
//   async function sendFcmTokenToServer(token: string, username: string): Promise<void> {
//     try {
//       const userRef = ref(db, `users/${username}`);
//       await set(userRef, { username, fcmToken: token });
//       console.log('Đã lưu FCM token lên server:', token);
//     } catch (err) {
//       console.log('Lỗi lưu FCM token:', err);
//     }
//   }
// }