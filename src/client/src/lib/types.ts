export interface Task {
  title?:string
  description?:string
  check?:boolean
}

export interface TaskList {
  id: number;
  title:string;
}

export interface User {
  user_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  task_lists: TaskList[];
}