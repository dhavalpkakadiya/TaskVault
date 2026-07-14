import { AppStrings } from "@/constants";
import { useAuth } from "@/hooks/useAuth";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { Todo, TodoFormValues } from "@/interface";
import { addTodo, deleteTodo, updateTodo } from "@/redux";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const EMPTY_FORM: TodoFormValues = { title: "", description: "" };
const SNACKBAR_DURATION_MS = 2500;

// Add, edit, and delete require device auth before the action runs.
export const useHome = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const todos = useAppSelector((state) => state.todos.todos);

  const { authenticateAsync, isAuthenticating, authError, clearAuthError } =
    useAuth();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [formValues, setFormValues] = useState<TodoFormValues>(EMPTY_FORM);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const snackbarTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showSnackbar = useCallback((message: string) => {
    if (snackbarTimeoutRef.current) {
      clearTimeout(snackbarTimeoutRef.current);
    }
    setSnackbarMessage(message);
    snackbarTimeoutRef.current = setTimeout(() => {
      setSnackbarMessage(null);
      snackbarTimeoutRef.current = null;
    }, SNACKBAR_DURATION_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (snackbarTimeoutRef.current) {
        clearTimeout(snackbarTimeoutRef.current);
      }
    };
  }, []);

  const openModalForAdd = useCallback(async () => {
    const auth = await authenticateAsync(); // gate before showing the form
    if (!auth.success) {
      return;
    }
    setEditingTodo(null);
    setFormValues(EMPTY_FORM);
    setIsModalVisible(true);
  }, [authenticateAsync]);

  const handleEdit = useCallback(
    async (todo: Todo) => {
      const auth = await authenticateAsync(); // gate before edit
      if (!auth.success) {
        return;
      }
      setEditingTodo(todo);
      setFormValues({ title: todo.title, description: todo.description });
      setIsModalVisible(true);
    },
    [authenticateAsync],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      const auth = await authenticateAsync(); // gate before delete
      if (!auth.success) {
        return;
      }

      const todo = todos.find((item) => item.id === id);
      if (!todo) {
        return;
      }

      Alert.alert(
        AppStrings.home.deleteConfirmTitle,
        AppStrings.home.deleteConfirmMessage(todo.title),
        [
          { text: AppStrings.home.cancel, style: "cancel" },
          {
            text: AppStrings.home.deleteConfirmAction,
            style: "destructive",
            onPress: () => {
              dispatch(deleteTodo(id));
              showSnackbar(AppStrings.home.taskDeleted);
            },
          },
        ],
      );
    },
    [authenticateAsync, dispatch, showSnackbar, todos],
  );

  // Save is not re-authenticated; the modal only opens after a successful auth check.
  const handleSave = useCallback(() => {
    const trimmedTitle = formValues.title.trim();
    if (!trimmedTitle) {
      return;
    }

    if (editingTodo) {
      dispatch(
        updateTodo({
          id: editingTodo.id,
          updates: {
            title: trimmedTitle,
            description: formValues.description,
          },
        }),
      );
      showSnackbar(AppStrings.home.taskUpdated);
    } else {
      dispatch(
        addTodo({
          title: trimmedTitle,
          description: formValues.description,
        }),
      );
      showSnackbar(AppStrings.home.taskAdded);
    }

    setIsModalVisible(false);
    setEditingTodo(null);
    setFormValues(EMPTY_FORM);
  }, [dispatch, editingTodo, formValues, showSnackbar]);

  const handleCloseModal = useCallback(() => {
    setIsModalVisible(false);
    setEditingTodo(null);
    setFormValues(EMPTY_FORM);
  }, []);

  const handleChangeTitle = useCallback((text: string) => {
    setFormValues((prev) => ({ ...prev, title: text }));
  }, []);

  const handleChangeDescription = useCallback((text: string) => {
    setFormValues((prev) => ({ ...prev, description: text }));
  }, []);
  return {
    todos,
    insets,
    dispatch,
    authError,
    formValues,
    handleEdit,
    handleSave,
    editingTodo,
    handleDelete,
    isModalVisible,
    clearAuthError,
    snackbarMessage,
    openModalForAdd,
    handleCloseModal,
    isAuthenticating,
    handleChangeTitle,
    handleChangeDescription,
  };
};
