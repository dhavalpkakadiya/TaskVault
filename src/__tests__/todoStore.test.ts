import todoReducer, {
  addTodo,
  deleteTodo,
  toggleComplete,
  updateTodo,
} from "../redux/todo-slice/todoSlice";

const initialState = { todos: [] };

describe("todoSlice", () => {
  describe("addTodo", () => {
    it("adds a new todo with title and description", () => {
      const state = todoReducer(
        initialState,
        addTodo({ title: "Buy groceries", description: "Milk and eggs" }),
      );

      expect(state.todos).toHaveLength(1);
      expect(state.todos[0].title).toBe("Buy groceries");
      expect(state.todos[0].description).toBe("Milk and eggs");
      expect(state.todos[0].isCompleted).toBe(false);
      expect(state.todos[0].id).toBeDefined();
      expect(state.todos[0].createdAt).toBeDefined();
    });

    it("ignores todos with empty titles", () => {
      const state = todoReducer(initialState, addTodo({ title: "   " }));

      expect(state.todos).toHaveLength(0);
    });

    it("prepends new todos to the list", () => {
      let state = todoReducer(initialState, addTodo({ title: "First" }));
      state = todoReducer(state, addTodo({ title: "Second" }));

      expect(state.todos[0].title).toBe("Second");
      expect(state.todos[1].title).toBe("First");
    });
  });

  describe("updateTodo", () => {
    it("updates title and description of an existing todo", () => {
      let state = todoReducer(
        initialState,
        addTodo({ title: "Original", description: "Old desc" }),
      );
      const id = state.todos[0].id;

      state = todoReducer(
        state,
        updateTodo({
          id,
          updates: { title: "Updated", description: "New desc" },
        }),
      );

      expect(state.todos[0].title).toBe("Updated");
      expect(state.todos[0].description).toBe("New desc");
    });

    it("does not affect other todos", () => {
      let state = todoReducer(initialState, addTodo({ title: "First" }));
      state = todoReducer(state, addTodo({ title: "Second" }));
      const secondId = state.todos[0].id;

      state = todoReducer(
        state,
        updateTodo({ id: secondId, updates: { title: "Changed" } }),
      );

      expect(state.todos[1].title).toBe("First");
    });
  });

  describe("deleteTodo", () => {
    it("removes a todo by id", () => {
      let state = todoReducer(initialState, addTodo({ title: "To delete" }));
      const id = state.todos[0].id;

      state = todoReducer(state, deleteTodo(id));

      expect(state.todos).toHaveLength(0);
    });

    it("only removes the targeted todo", () => {
      let state = todoReducer(initialState, addTodo({ title: "Keep" }));
      state = todoReducer(state, addTodo({ title: "Remove" }));
      const removeId = state.todos[0].id;

      state = todoReducer(state, deleteTodo(removeId));

      expect(state.todos).toHaveLength(1);
      expect(state.todos[0].title).toBe("Keep");
    });
  });

  describe("toggleComplete", () => {
    it("marks an incomplete todo as complete", () => {
      let state = todoReducer(initialState, addTodo({ title: "Task" }));
      const id = state.todos[0].id;

      state = todoReducer(state, toggleComplete(id));

      expect(state.todos[0].isCompleted).toBe(true);
    });

    it("marks a complete todo as incomplete", () => {
      let state = todoReducer(initialState, addTodo({ title: "Task" }));
      const id = state.todos[0].id;

      state = todoReducer(state, toggleComplete(id));
      state = todoReducer(state, toggleComplete(id));

      expect(state.todos[0].isCompleted).toBe(false);
    });
  });
});
