import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchProjects,
  addNewProject,
  updateProject,
  deleteProject,
  fetchProjectById, // Thêm fetchProjectById nếu cần
} from '../redux/slice/ProjectSlice';
import { RootState, AppDispatch } from '@/redux/store';
import { Project } from '@/model/Project';

export const useProject = () => {
  const dispatch: AppDispatch = useDispatch();
  
  // Lấy danh sách các project từ state
  const projects = useSelector((state: RootState) => state.project.list);
  
  // Lấy dự án hiện tại được chọn từ state
  const selectedProject = useSelector((state: RootState) => state.project.selectedProject);

  // Lấy danh sách dự án khi component mount
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  // Thêm một project mới
  const addProject = (project: Omit<Project, 'id'>) => {
    dispatch(addNewProject(project));
  };

  // Cập nhật một project
  const editProject = (id: number, project: Partial<Project>) => {
    dispatch(updateProject({ id, project }));
  };

  // Xoá một project
  const removeProject = (projectId: number) => {
    dispatch(deleteProject(projectId));
  };

  // Fetch project theo ID
  const getProjectById = (id: number) => {
    dispatch(fetchProjectById(id));
  [dispatch, id]};

  return {
    projects,
    selectedProject,
    addProject,
    editProject,
    removeProject,
    getProjectById,
  };
};
