import { db } from '../firebaseConfig';
import { ref, get, set, update, remove, child } from 'firebase/database';
import { Project } from '@/model/Project';

const PROJECT_REF = 'projects';

// Lấy tất cả project
export const getAllProjects = async (): Promise<Project[]> => {
  const snapshot = await get(ref(db, PROJECT_REF));
  const data = snapshot.val();

  if (!data) return [];

  return Object.entries(data).map(([id, project]) => ({
    ...(project as Project),
    id: Number(id), // Lấy id từ key và đảm bảo là number
  }));
};

// Lấy project theo ID
export const getProjectById = async (projectId: number): Promise<Project | null> => {
  console.log('>>> getProjectById: Fetching project with id:', projectId);
  const snapshot = await get(ref(db, `${PROJECT_REF}/${projectId}`));
  const data = snapshot.val();

  console.log('>>> getProjectById: Data received:', data);

  if (!data) return null;

  return { ...data, id: projectId }; // Trả về project với ID tương ứng
};

// Thêm mới project với ID số
export const addProject = async (project: Omit<Project, 'id'>): Promise<number> => {
  const projectRef = ref(db, PROJECT_REF);
  const snapshot = await get(projectRef);
  const data = snapshot.val();

  // Tạo id mới
  let newId = 1;
  if (data) {
    const ids = Object.keys(data)
      .map((id) => Number(id))
      .filter((id) => !isNaN(id));
    newId = Math.max(...ids) + 1;
  }

  console.log('>>> addProject: Adding project with id:', newId);
  // Lưu project mới với id số trong dữ liệu
  await set(child(projectRef, `${newId}`), { ...project, id: newId });

  return newId;
};

// Cập nhật project
export const updateProject = async (id: number, project: Partial<Project>): Promise<void> => {
  console.log('>>> updateProject: Updating project with id:', id, 'data:', project);
  // Đảm bảo id không bị cập nhật trong dữ liệu
  const { id: _id, ...updateData } = project;
  await update(ref(db, `${PROJECT_REF}/${id}`), { ...updateData, id });
};

// Xóa project
export const deleteProject = async (id: number): Promise<void> => {
  console.log('>>> deleteProject: Deleting project with id:', id);
  await remove(ref(db, `${PROJECT_REF}/${id}`));
};