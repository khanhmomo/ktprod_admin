interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  completed: boolean;
  dueDate: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  user: object;
  link: string;
}

export type { Task };

export interface User {
  _id: string;
  name: string;
  role: string;
  bio: string;
  email: string;
  // Add any other fields you expect on a User object
}