import { act, renderHook } from "@testing-library/react-native";
import { Alert } from "react-native";
import React, { PropsWithChildren } from "react";
import { Provider } from "react-redux";

import { AppStrings } from "@/constants";
import { useAuth } from "@/hooks/useAuth";
import { Todo } from "@/interface";
import todoReducer, { addTodo } from "@/redux/todo-slice/todoSlice";
import { useHome } from "@/screens/home/useHome";
import { configureStore } from "@reduxjs/toolkit";

jest.mock("@/hooks/useAuth");

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockAuthenticateAsync = jest.fn();

const sampleTodo: Todo = {
  id: "todo-1",
  title: "Buy milk",
  description: "2%",
  isCompleted: false,
  createdAt: "2026-01-01T00:00:00.000Z",
};

function createTestStore() {
  const store = configureStore({
    reducer: { todos: todoReducer },
  });
  store.dispatch(
    addTodo({ title: sampleTodo.title, description: sampleTodo.description }),
  );
  return store;
}

function createWrapper(store: ReturnType<typeof createTestStore>) {
  return function Wrapper({ children }: PropsWithChildren) {
    return <Provider store={store}>{children}</Provider>;
  };
}

describe("useHome auth gating", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    jest.spyOn(Alert, "alert").mockImplementation(jest.fn());

    mockUseAuth.mockReturnValue({
      authenticateAsync: mockAuthenticateAsync,
      isAuthenticating: false,
      authError: null,
      clearAuthError: jest.fn(),
    });
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("does not open the add modal when authentication fails", async () => {
    mockAuthenticateAsync.mockResolvedValue({
      success: false,
      error: "cancelled",
    });
    const store = createTestStore();

    const { result } = renderHook(() => useHome(), {
      wrapper: createWrapper(store),
    });

    await act(async () => {
      await result.current.openModalForAdd();
    });

    expect(result.current.isModalVisible).toBe(false);
    expect(result.current.editingTodo).toBeNull();
  });

  it("opens the add modal when authentication succeeds", async () => {
    mockAuthenticateAsync.mockResolvedValue({ success: true });
    const store = createTestStore();

    const { result } = renderHook(() => useHome(), {
      wrapper: createWrapper(store),
    });

    await act(async () => {
      await result.current.openModalForAdd();
    });

    expect(result.current.isModalVisible).toBe(true);
    expect(result.current.editingTodo).toBeNull();
  });

  it("does not open the edit modal when authentication fails", async () => {
    mockAuthenticateAsync.mockResolvedValue({
      success: false,
      error: "cancelled",
    });
    const store = createTestStore();
    const todo = store.getState().todos.todos[0];

    const { result } = renderHook(() => useHome(), {
      wrapper: createWrapper(store),
    });

    await act(async () => {
      await result.current.handleEdit(todo);
    });

    expect(result.current.isModalVisible).toBe(false);
    expect(result.current.editingTodo).toBeNull();
  });

  it("opens the edit modal when authentication succeeds", async () => {
    mockAuthenticateAsync.mockResolvedValue({ success: true });
    const store = createTestStore();
    const todo = store.getState().todos.todos[0];

    const { result } = renderHook(() => useHome(), {
      wrapper: createWrapper(store),
    });

    await act(async () => {
      await result.current.handleEdit(todo);
    });

    expect(result.current.isModalVisible).toBe(true);
    expect(result.current.editingTodo).toEqual(todo);
  });

  it("does not delete a todo when authentication fails", async () => {
    mockAuthenticateAsync.mockResolvedValue({
      success: false,
      error: "cancelled",
    });
    const store = createTestStore();
    const todoId = store.getState().todos.todos[0].id;

    const { result } = renderHook(() => useHome(), {
      wrapper: createWrapper(store),
    });

    await act(async () => {
      await result.current.handleDelete(todoId);
    });

    expect(store.getState().todos.todos).toHaveLength(1);
    expect(Alert.alert).not.toHaveBeenCalled();
  });

  it("shows a confirmation dialog after successful auth before deleting", async () => {
    mockAuthenticateAsync.mockResolvedValue({ success: true });
    const store = createTestStore();
    const todo = store.getState().todos.todos[0];

    const { result } = renderHook(() => useHome(), {
      wrapper: createWrapper(store),
    });

    await act(async () => {
      await result.current.handleDelete(todo.id);
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      AppStrings.home.deleteConfirmTitle,
      AppStrings.home.deleteConfirmMessage(todo.title),
      expect.any(Array),
    );
    expect(store.getState().todos.todos).toHaveLength(1);
  });

  it("deletes a todo when the user confirms the alert", async () => {
    mockAuthenticateAsync.mockResolvedValue({ success: true });
    const store = createTestStore();
    const todo = store.getState().todos.todos[0];

    jest.spyOn(Alert, "alert").mockImplementation((_title, _message, buttons) => {
      const deleteButton = buttons?.find(
        (button) => button.style === "destructive",
      );
      deleteButton?.onPress?.();
    });

    const { result } = renderHook(() => useHome(), {
      wrapper: createWrapper(store),
    });

    await act(async () => {
      await result.current.handleDelete(todo.id);
    });

    expect(store.getState().todos.todos).toHaveLength(0);
    expect(result.current.snackbarMessage).toBe(AppStrings.home.taskDeleted);
  });

  it("keeps the todo when the user cancels the delete confirmation", async () => {
    mockAuthenticateAsync.mockResolvedValue({ success: true });
    const store = createTestStore();
    const todo = store.getState().todos.todos[0];

    jest.spyOn(Alert, "alert").mockImplementation((_title, _message, buttons) => {
      const cancelButton = buttons?.find((button) => button.style === "cancel");
      cancelButton?.onPress?.();
    });

    const { result } = renderHook(() => useHome(), {
      wrapper: createWrapper(store),
    });

    await act(async () => {
      await result.current.handleDelete(todo.id);
    });

    expect(store.getState().todos.todos).toHaveLength(1);
    expect(result.current.snackbarMessage).toBeNull();
  });
});
