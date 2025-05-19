import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { auth, db } from '@/firebaseConfig';

// Kiểu dữ liệu người dùng
export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  imange: string | null;
  manager_role: boolean;
  uid: string; // Thêm trường uid vào User
}

// Kiểu dữ liệu đăng nhập
export interface Credentials {
  email: string;
  password: string;
}

/**
 * Đăng nhập người dùng và trả về thông tin chi tiết từ Realtime Database
 */
export const login = async ({ email, password }: Credentials): Promise<User & { uid: string }> => {
  const response = await signInWithEmailAndPassword(auth, email, password);
  const userEmail = response.user.email;

  // Lấy dữ liệu users từ Realtime Database
  const usersRef = ref(db, 'users');
  const snapshot = await get(usersRef);
  const usersData = snapshot.val();

  if (!usersData) {
    throw new Error('Không tìm thấy thông tin người dùng trong cơ sở dữ liệu.');
  }

  // Tìm người dùng có email trùng khớp
  const matchedUserEntry = Object.entries(usersData).find(
    ([, user]: [string, unknown]) => {
      const userTyped = user as { email: string }; // Ép kiểu cho user
      return userTyped.email === userEmail;
    }
  );

  if (!matchedUserEntry) {
    throw new Error('Không tìm thấy người dùng với email này trong cơ sở dữ liệu.');
  }

  const [id, user] = matchedUserEntry;
  const userTyped = user as User; // Ép kiểu cho user

  return {
    id,
    uid: response.user.uid,
    username: userTyped.username || '',
    email: userTyped.email || '',
    first_name: userTyped.first_name || '',
    last_name: userTyped.last_name || '',
    password: userTyped.password || '',
    imange: userTyped.imange || null,
    manager_role: userTyped.manager_role || false,
  };
};

/**
 * Đăng xuất người dùng
 */
export const logout = async (): Promise<void> => {
  await signOut(auth);
};

/**
 * Lấy danh sách tất cả người dùng từ Realtime Database
 */
export const getUsers = async (): Promise<User[]> => {
  const usersRef = ref(db, 'users');
  const snapshot = await get(usersRef);
  const usersData = snapshot.val();

  if (!usersData) {
    return [];
  }

  return Object.entries(usersData).map(([id, user]: [string, unknown]) => {
    const userTyped = user as User; // Ép kiểu cho user
    return {
      id,
      uid: id,
      username: userTyped.username || '',
      email: userTyped.email || '',
      first_name: userTyped.first_name || '',
      last_name: userTyped.last_name || '',
      password: userTyped.password || '',
      imange: userTyped.imange || null,
      manager_role: userTyped.manager_role || false,
    };
  });
};
