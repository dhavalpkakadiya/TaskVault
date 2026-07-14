import { AuthGuard, TodoFormModal, TodoList } from "@/components";
import { AppStrings } from "@/constants";
import { toggleComplete } from "@/redux";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FAB_BOTTOM_MARGIN, FAB_HEIGHT, styles } from "./styles";
import { useHome } from "./useHome";

const HomeScreen: React.FC = () => {
  const {
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
  } = useHome();

  return (
    <AuthGuard
      isAuthenticating={isAuthenticating}
      authError={authError}
      onDismissError={clearAuthError}
    >
      <SafeAreaView style={styles.container} edges={["top"]}>
        <StatusBar style="dark" />

        <View style={styles.header}>
          <Text style={styles.headerTitle}>{AppStrings.app.name}</Text>
          <Text style={styles.headerSubtitle}>
            {AppStrings.home.taskCount(todos.length)}
          </Text>
        </View>

        <TodoList
          todos={todos}
          onToggleComplete={(id) => dispatch(toggleComplete(id))}
          onEdit={handleEdit}
          onDelete={handleDelete}
          listBottomPadding={FAB_HEIGHT + FAB_BOTTOM_MARGIN * 2 + insets.bottom}
        />

        <Pressable
          style={[
            styles.fab,
            { bottom: FAB_BOTTOM_MARGIN + insets.bottom },
            isAuthenticating && styles.fabDisabled,
          ]}
          onPress={openModalForAdd}
          disabled={isAuthenticating}
          accessibilityRole="button"
          accessibilityLabel={AppStrings.home.addNewTask}
          accessibilityState={{ disabled: isAuthenticating }}
        >
          <Text style={styles.fabText}>{AppStrings.home.fabIcon}</Text>
        </Pressable>

        {snackbarMessage ? (
          <View
            style={[
              styles.snackbar,
              {
                bottom:
                  FAB_BOTTOM_MARGIN +
                  insets.bottom +
                  FAB_HEIGHT +
                  FAB_BOTTOM_MARGIN,
              },
            ]}
          >
            <Text style={styles.snackbarText}>{snackbarMessage}</Text>
          </View>
        ) : null}

        <TodoFormModal
          visible={isModalVisible}
          isEditing={editingTodo !== null}
          formValues={formValues}
          onChangeTitle={handleChangeTitle}
          onChangeDescription={handleChangeDescription}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      </SafeAreaView>
    </AuthGuard>
  );
};

export default HomeScreen;
