export interface TodoFormValues {
  title: string;
  description: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
}

export interface Todo {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: string;
}
