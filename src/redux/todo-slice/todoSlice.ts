import { Todo } from "@/interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TodoState {
  todos: Todo[];
}

const initialState: TodoState = {
  todos: [],
};

function createTodoId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// Auth is enforced in the UI before dispatching write actions; toggleComplete is read-only from a security standpoint.
const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: (
      state,
      action: PayloadAction<{ title: string; description?: string }>,
    ) => {
      const trimmedTitle = action.payload.title.trim();
      if (!trimmedTitle) {
        return;
      }

      const newTodo: Todo = {
        id: createTodoId(),
        title: trimmedTitle,
        description: (action.payload.description ?? "").trim(),
        isCompleted: false,
        createdAt: new Date().toISOString(),
      };

      state.todos.unshift(newTodo);
    },

    updateTodo: (
      state,
      action: PayloadAction<{
        id: string;
        updates: Partial<Pick<Todo, "title" | "description">>;
      }>,
    ) => {
      const { id, updates } = action.payload;
      const todo = state.todos.find((item) => item.id === id);
      if (!todo) {
        return;
      }

      if (updates.title !== undefined) {
        todo.title = updates.title.trim();
      }
      if (updates.description !== undefined) {
        todo.description = updates.description.trim();
      }
    },

    deleteTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
    },

    toggleComplete: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find((item) => item.id === action.payload);
      if (todo) {
        todo.isCompleted = !todo.isCompleted;
      }
    },
  },
});

export const { addTodo, updateTodo, deleteTodo, toggleComplete } =
  todoSlice.actions;

export default todoSlice.reducer;
