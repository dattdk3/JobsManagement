import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAllStudents,
  createStudent,
  editStudent,
  removeStudent,
} from "../Examination/redux/slice/studentSlice";
import { Student } from "@/Examination/model/Student";
import { AppDispatch, RootState } from "../redux/store";

export const useStudent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { students, loading, error } = useSelector((state: RootState) => state.student);

  // Fetch all students on mount
  useEffect(() => {
    dispatch(fetchAllStudents());
  }, [dispatch]);

  const addStudent = (student: Student) => {
    dispatch(createStudent(student));
  };

  const updateStudent = (id: string, data: Partial<Student>) => {
    dispatch(editStudent({ id, data }));
  };

  const deleteStudent = (id: string) => {
    dispatch(removeStudent(id));
  };

  return {
    students,
    loading,
    error,
    addStudent,
    updateStudent,
    deleteStudent,
    refreshStudents: () => dispatch(fetchAllStudents()),
  };
};
