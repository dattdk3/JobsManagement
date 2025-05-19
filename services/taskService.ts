// services/taskService.ts
import { db } from '@/firebaseConfig'; // Đường dẫn firebase của bạn
import { ref, push, get, set, update, remove, child } from 'firebase/database';
import { Task } from '@/model/Project';
const TASK_REF = 'tasks';

export const getTasksByProjectId = async (projectId: number): Promise<Task[]> => {
  const snapshot = await get(ref(db, TASK_REF));
  const data = snapshot.val();
  if (!data) return [];

  return Object.entries(data)
    .map(([id, task]) => ({ ...(task as Task), id: Number(id) }))
    .filter(task => (task.id_project) === projectId);
};

export const getTaskById = async (taskId: number): Promise<Task | null> => {
    const snapshot = await get(ref(db, `${TASK_REF}/${taskId}`));
    const data = snapshot.val();
    
    if (!data) return null;
    
    return { ...data, id: taskId }; // Trả về task với ID tương ứng
  };

  export const getAllTasks = async (): Promise<Task[]> => {
    const snapshot = await get(ref(db, TASK_REF));
    const data = snapshot.val();
    if (!data) return [];
  
    return Object.entries(data).map(([id, task]) => ({
      ...(task as Task),
      id: Number(id),
    }));
  };
  

export const addTask = async (task: Omit<Task, 'id'>): Promise<number> => {
    const taskRef = ref(db, TASK_REF);
    const snapshot = await get(taskRef);
    const data = snapshot.val();
  
    // Tạo id mới
    let newId = 1;
    if (data) {
      const ids = Object.keys(data)
        .map(id => Number(id))
        .filter(id => !isNaN(id));
      newId = Math.max(...ids) + 1;
    }
  
    // Lưu task mới với id số
    await set(child(taskRef, `${newId}`), { ...task, id: newId });
  
    return newId;
  };
  
export const updateTask = async (id: number, task: Partial<Task>): Promise<void> => {
  await update(ref(db, `${TASK_REF}/${id}`), task);
};

export const deleteTask = async (id: string): Promise<void> => {
  await remove(ref(db, `${TASK_REF}/${id}`));
};
