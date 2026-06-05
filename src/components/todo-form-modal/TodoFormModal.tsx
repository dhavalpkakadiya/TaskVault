import { FormTextInput } from "@/components/form-text-input";
import { AppStrings } from "@/constants";
import { TodoFormValues } from "@/interface";
import { colors, horizontalScale, moderateScale, verticalScale } from "@/theme";
import React from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface TodoFormModalProps {
  visible: boolean;
  isEditing: boolean;
  formValues: TodoFormValues;
  onChangeTitle: (text: string) => void;
  onChangeDescription: (text: string) => void;
  onClose: () => void;
  onSave: () => void;
}

const TodoFormModal: React.FC<TodoFormModalProps> = (props) => {
  const {
    visible,
    isEditing,
    formValues,
    onChangeTitle,
    onChangeDescription,
    onClose,
    onSave,
  } = props;

  const isSaveDisabled = !formValues.title.trim();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.overlay}
      >
        <SafeAreaView edges={["bottom"]} style={styles.content}>
          <Text style={styles.title}>
            {isEditing ? AppStrings.home.editTask : AppStrings.home.newTask}
          </Text>

          <FormTextInput
            label={AppStrings.home.titleLabel}
            value={formValues.title}
            onChangeText={onChangeTitle}
            placeholder={AppStrings.home.titlePlaceholder}
            autoFocus
          />

          <FormTextInput
            label={AppStrings.home.descriptionLabel}
            value={formValues.description}
            onChangeText={onChangeDescription}
            placeholder={AppStrings.home.descriptionPlaceholder}
            multiline
            numberOfLines={3}
          />

          <View style={styles.actions}>
            <Pressable
              style={styles.cancelButton}
              onPress={onClose}
              accessibilityRole="button"
            >
              <Text style={styles.cancelButtonText}>
                {AppStrings.home.cancel}
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.saveButton,
                isSaveDisabled && styles.saveButtonDisabled,
              ]}
              onPress={onSave}
              disabled={isSaveDisabled}
              accessibilityRole="button"
            >
              <Text style={styles.saveButtonText}>{AppStrings.home.save}</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default TodoFormModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "flex-end",
  },
  content: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    padding: moderateScale(24),
    paddingBottom: verticalScale(12),
  },
  title: {
    fontSize: moderateScale(20),
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: verticalScale(20),
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: moderateScale(12),
    marginTop: verticalScale(8),
  },
  cancelButton: {
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(10),
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: moderateScale(16),
    fontWeight: "600",
  },
  saveButton: {
    paddingHorizontal: horizontalScale(24),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(10),
    backgroundColor: colors.primary,
  },
  saveButtonDisabled: {
    backgroundColor: colors.primaryLight,
  },
  saveButtonText: {
    color: colors.textOnPrimary,
    fontSize: moderateScale(16),
    fontWeight: "600",
  },
});
