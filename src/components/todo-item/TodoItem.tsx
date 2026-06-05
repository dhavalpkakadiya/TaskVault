import { AppStrings } from "@/constants";
import { Todo } from "@/interface";
import { colors, horizontalScale, moderateScale, verticalScale } from "@/theme";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = (props) => {
  const { todo, onToggleComplete, onEdit, onDelete } = props;

  const renderRightActions = () => (
    <Pressable
      style={styles.deleteAction}
      onPress={() => onDelete(todo.id)}
      accessibilityRole="button"
      accessibilityLabel={AppStrings.todoItem.deleteTask(todo.title)}
    >
      <Text style={styles.deleteActionText}>{AppStrings.todoItem.delete}</Text>
    </Pressable>
  );

  return (
    <Swipeable renderRightActions={renderRightActions} overshootRight={false}>
      <View style={styles.container}>
        <Pressable
          style={[
            styles.checkbox,
            todo.isCompleted && styles.checkboxCompleted,
          ]}
          onPress={() => onToggleComplete(todo.id)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: todo.isCompleted }}
          accessibilityLabel={AppStrings.todoItem.markTaskAs(
            todo.title,
            todo.isCompleted,
          )}
        >
          {todo.isCompleted ? (
            <Text style={styles.checkmark}>
              {AppStrings.todoItem.checkmark}
            </Text>
          ) : null}
        </Pressable>

        <Pressable
          style={styles.content}
          onPress={() => onEdit(todo)}
          accessibilityRole="button"
          accessibilityLabel={AppStrings.todoItem.editTask(todo.title)}
        >
          <Text
            style={[styles.title, todo.isCompleted && styles.titleCompleted]}
            numberOfLines={1}
          >
            {todo.title}
          </Text>
          {todo.description ? (
            <Text
              style={[
                styles.description,
                todo.isCompleted && styles.descriptionCompleted,
              ]}
              numberOfLines={2}
            >
              {todo.description}
            </Text>
          ) : null}
        </Pressable>

        <Pressable
          style={styles.editButton}
          onPress={() => onEdit(todo)}
          accessibilityRole="button"
          accessibilityLabel={AppStrings.todoItem.editTask(todo.title)}
        >
          <Text style={styles.editButtonText}>{AppStrings.todoItem.edit}</Text>
        </Pressable>
      </View>
    </Swipeable>
  );
};

export default TodoItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(14),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  checkbox: {
    width: horizontalScale(24),
    height: verticalScale(24),
    borderRadius: moderateScale(12),
    borderWidth: moderateScale(2),
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: horizontalScale(12),
  },
  checkboxCompleted: {
    backgroundColor: colors.primary,
  },
  checkmark: {
    color: colors.textOnPrimary,
    fontSize: moderateScale(14),
    fontWeight: "700",
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: moderateScale(16),
    fontWeight: "600",
    color: colors.textPrimary,
  },
  titleCompleted: {
    textDecorationLine: "line-through",
    color: colors.textMuted,
  },
  description: {
    fontSize: moderateScale(13),
    color: colors.textSecondary,
    marginTop: verticalScale(2),
  },
  descriptionCompleted: {
    color: colors.borderLight,
  },
  editButton: {
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(8),
    backgroundColor: colors.primarySoft,
    marginLeft: horizontalScale(8),
  },
  editButtonText: {
    color: colors.primary,
    fontSize: moderateScale(13),
    fontWeight: "600",
  },
  deleteAction: {
    backgroundColor: colors.danger,
    justifyContent: "center",
    alignItems: "center",
    width: horizontalScale(80),
  },
  deleteActionText: {
    color: colors.textOnPrimary,
    fontWeight: "600",
    fontSize: moderateScale(14),
  },
});
