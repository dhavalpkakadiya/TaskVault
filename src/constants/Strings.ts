export const AppStrings = {
  app: {
    name: "TaskVault",
  },
  splash: {
    tagline: "Your tasks, secured.",
  },
  home: {
    task: "task",
    tasks: "tasks",
    taskCount: (count: number): string =>
      `${count} ${count === 1 ? AppStrings.home.task : AppStrings.home.tasks}`,
    addNewTask: "Add new task",
    fabIcon: "+",
    taskAdded: "Task added",
    taskUpdated: "Task updated",
    taskDeleted: "Task deleted",
    editTask: "Edit Task",
    newTask: "New Task",
    titleLabel: "Title",
    titlePlaceholder: "What needs to be done?",
    descriptionLabel: "Description (optional)",
    descriptionPlaceholder: "Add more details...",
    cancel: "Cancel",
    save: "Save",
    deleteConfirmTitle: "Delete task?",
    deleteConfirmMessage: (title: string): string =>
      `Are you sure you want to delete "${title}"? This cannot be undone.`,
    deleteConfirmAction: "Delete",
  },
  todoList: {
    emptyTitle: "No tasks yet",
    emptySubtitle: "Tap the + button to add your first secure task.",
  },
  todoItem: {
    delete: "Delete",
    edit: "Edit",
    checkmark: "✓",
    deleteTask: (title: string): string => `Delete ${title}`,
    editTask: (title: string): string => `Edit ${title}`,
    markTaskAs: (title: string, isCompleted: boolean): string =>
      `Mark ${title} as ${isCompleted ? "incomplete" : "complete"}`,
  },
  auth: {
    promptMessage: "Authenticate to secure your task",
    cancelLabel: "Cancel",
    fallbackLabel: "Use device PIN",
    verifyingIdentity: "Verifying identity...",
    dismiss: "Dismiss",
    cancelled: "Authentication was cancelled.",
    lockout: "Too many failed attempts. Try again later.",
    hardwareUnavailable: "Biometric hardware is not available on this device.",
    notEnrolled: "No biometric or device passcode is configured.",
    biometricsUnavailable:
      "Biometrics unavailable. Please use your device PIN.",
    failed: "Authentication failed. Please try again.",
  },
} as const;
