import { db } from "@/firebaseConfig"; 
import { ref, push, set, get, remove, update } from "firebase/database";
import { Student } from "../model/Student";

// CREATE
export const addStudent = async (student: Student) => {
  const studentRef = ref(db, "students");
  const newRef = push(studentRef);
  await set(newRef, student);
  return { id: newRef.key, ...student };
};

// READ
export const fetchStudents = async () => {
  const snapshot = await get(ref(db, "students"));
  const students: any[] = [];
  snapshot.forEach((child) => {
    students.push({ id: child.key, ...child.val() });
  });
  return students;
};

// UPDATE
export const updateStudent = async (id: string, student: Partial<Student>) => {
  await update(ref(db, `students/${id}`), student);
};

// DELETE
export const deleteStudent = async (id: string) => {
  await remove(ref(db, `students/${id}`));
};
