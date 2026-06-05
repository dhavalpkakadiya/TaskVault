import { TodoItem } from "@/components/todo-item";
import { AppStrings } from "@/constants";
import { Todo } from "@/interface";
import { colors, horizontalScale, moderateScale, verticalScale } from "@/theme";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

interface TodoListProps {
  todos: Todo[];
  onToggleComplete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  listBottomPadding?: number;
}

const TodoList: React.FC<TodoListProps> = (props) => {
  const {
    todos,
    onToggleComplete,
    onEdit,
    onDelete,
    listBottomPadding = verticalScale(100),
  } = props;

  if (todos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>{AppStrings.todoList.emptyTitle}</Text>
        <Text style={styles.emptySubtitle}>
          {AppStrings.todoList.emptySubtitle}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={todos}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TodoItem
          todo={item}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
      contentContainerStyle={[
        styles.listContent,
        { paddingBottom: listBottomPadding },
      ]}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default TodoList;

const styles = StyleSheet.create({
  listContent: {},
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: horizontalScale(32),
  },
  emptyTitle: {
    fontSize: moderateScale(20),
    fontWeight: "700",
    color: colors.textBody,
    marginBottom: verticalScale(8),
  },
  emptySubtitle: {
    fontSize: moderateScale(15),
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: verticalScale(22),
  },
});
