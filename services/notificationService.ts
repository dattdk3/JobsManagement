import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { db } from '@/firebaseConfig';
import { ref, push } from 'firebase/database';

// Hàm đăng ký thiết bị nhận thông báo
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (!Device.isDevice) {
    alert('Phải dùng thiết bị thật để nhận thông báo!');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Không có quyền gửi thông báo!');
    return null;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log('Expo Push Token:', token);
  return token;
}

// Gửi thông báo đến thiết bị người dùng qua Expo push service
export async function sendPushNotification(expoPushToken: string, title: string, body: string) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title,
    body,
    data: { title, body },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-Encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

// Lưu thông báo vào Firebase Realtime Database
export async function saveNotificationToHistory(userId: string, title: string, body: string) {
  const notificationRef = ref(db, `notifications/${userId}`);
  await push(notificationRef, {
    title,
    body,
    timestamp: Date.now(),
  });
}
