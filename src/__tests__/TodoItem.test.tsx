import { fireEvent, render } from "@testing-library/react-native";

import { AppStrings } from "@/constants";
import { Todo } from "@/interface";
import { TodoItem } from "@/components/todo-item";

const mockTodo: Todo = {
  id: "todo-1",
  title: "Test Task",
  description: "Test description",
  isCompleted: false,
  createdAt: "2026-06-05T10:00:00.000Z",
};

describe("TodoItem", () => {
  const onToggleComplete = jest.fn();
  const onEdit = jest.fn();
  const onDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders todo title and description", () => {
    const { getByText } = render(
      <TodoItem
        todo={mockTodo}
        onToggleComplete={onToggleComplete}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    expect(getByText("Test Task")).toBeTruthy();
    expect(getByText("Test description")).toBeTruthy();
  });

  it("calls onToggleComplete when checkbox is pressed", () => {
    const { getByRole } = render(
      <TodoItem
        todo={mockTodo}
        onToggleComplete={onToggleComplete}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    fireEvent.press(getByRole("checkbox"));
    expect(onToggleComplete).toHaveBeenCalledWith("todo-1");
  });

  it("calls onDelete when delete button is pressed", () => {
    const { getByLabelText } = render(
      <TodoItem
        todo={mockTodo}
        onToggleComplete={onToggleComplete}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    fireEvent.press(
      getByLabelText(AppStrings.todoItem.deleteTask(mockTodo.title)),
    );
    expect(onDelete).toHaveBeenCalledWith("todo-1");
  });

  it("calls onEdit when edit button is pressed", () => {
    const { getAllByLabelText } = render(
      <TodoItem
        todo={mockTodo}
        onToggleComplete={onToggleComplete}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    const editButtons = getAllByLabelText(
      AppStrings.todoItem.editTask(mockTodo.title),
    );
    fireEvent.press(editButtons[0]);
    expect(onEdit).toHaveBeenCalledWith(mockTodo);
  });

  it("shows completed styling when todo is completed", () => {
    const completedTodo: Todo = { ...mockTodo, isCompleted: true };

    const { getByRole } = render(
      <TodoItem
        todo={completedTodo}
        onToggleComplete={onToggleComplete}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    const checkbox = getByRole("checkbox");
    expect(checkbox.props.accessibilityState?.checked).toBe(true);
  });
});
