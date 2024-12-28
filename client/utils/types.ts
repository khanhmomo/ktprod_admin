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

