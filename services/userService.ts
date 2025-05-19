// services/userService.ts
import { db, auth } from '../firebaseConfig';
import {
  ref,
  get,
  set,
  update,
  remove,
  child,
} from 'firebase/database';

import {
  createUserWithEmailAndPassword,
  updateProfile,
  updateEmail,
  updatePassword,
  deleteUser as deleteAuthUser,
} from 'firebase/auth';

import { User } from '@/model/User';

// Lấy tất cả user
export const getAllUsers = async (): Promise<User[]> => {
  const snapshot = await get(ref(db, 'users'));
  const data = snapshot.val();

  if (!data) return [];

  return Object.entries(data).map(([key, value]: [string, any]) => ({
    id: key,
    username: value.username,
    email: value.email,
    first_name: value.first_name,
    last_name: value.last_name,
    password: value.password,
    imange: value.imange || null,
    manager_role: value.manager_role,
  })) as User[];
};

// Lấy user theo ID
export const getUserById = async (id: string): Promise<User | null> => {
  const snapshot = await get(child(ref(db), `users/${id}`));
  const data = snapshot.val();
  if (!data) return null;

  return {
    id,
    username: data.username,
    email: data.email,
    first_name: data.first_name,
    last_name: data.last_name,
    password: data.password,
    imange: data.imange || null,
    manager_role: data.manager_role,
  };
};

// Thêm user mới
export const addUser = async (user: Omit<User, 'id'>): Promise<string> => {
  try {
    // Tạo tài khoản trên Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
    const uid = userCredential.user.uid;

    // Ghi thông tin user vào Realtime Database, dùng uid làm key
    await set(ref(db, `users/${uid}`), user);

    return uid;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Cập nhật user
export const updateUser = async (id: string, user: Partial<User>) => {
  const userRef = ref(db, `users/${id}`);
  await update(userRef, user); // cập nhật trong Realtime Database

  const currentUser = auth.currentUser;

  if (currentUser && currentUser.uid === id) {
    if (user.username) {
      await updateProfile(currentUser, { displayName: user.username });
    }

    if (user.email && user.email !== currentUser.email) {
      await updateEmail(currentUser, user.email);
    }

    if (user.password) {
      await updatePassword(currentUser, user.password);
    }
  }
};

// Xoá user
export const deleteUser = async (id: string) => {
  // Xoá user trong Realtime Database
  await remove(ref(db, `users/${id}`));

  // Xoá user trong Authentication nếu người hiện tại là người đó
  const currentUser = auth.currentUser;
  if (currentUser && currentUser.uid === id) {
    await deleteAuthUser(currentUser);
  }
};
