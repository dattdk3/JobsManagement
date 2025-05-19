export interface Project{
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    image: string;
    task: Task[];
    creator: string;
    status: boolean;
    description: string;
}

export interface Task{
    id: number;
    title: string;
    start_date: string;
    end_date: string;
    status: boolean;
    id_project: number;
    creator: string;
    description: string;
    priority: string;
    username: string;
    assigned_to: string;
}