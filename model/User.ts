export interface User {
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    imange: string | null;
    manager_role: boolean;
    expoPushToken?: string;
  }