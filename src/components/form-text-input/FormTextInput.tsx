import { colors, horizontalScale, moderateScale, verticalScale } from "@/theme";
import React from "react";
import { StyleSheet, Text, TextInput, TextInputProps } from "react-native";

interface FormTextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  multiline?: boolean;
  numberOfLines?: number;
  autoFocus?: boolean;
}

const FormTextInput: React.FC<FormTextInputProps> = (props) => {
  const {
    label,
    value,
    onChangeText,
    placeholder,
    multiline = false,
    numberOfLines,
    autoFocus = false,
  } = props;

  const inputProps: TextInputProps = {
    style: [styles.input, multiline && styles.textArea],
    value,
    onChangeText,
    placeholder,
    placeholderTextColor: colors.textMuted,
    multiline,
    numberOfLines,
    autoFocus,
  };

  if (multiline) {
    inputProps.textAlignVertical = "top";
  }

  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput {...inputProps} />
    </>
  );
};

export default FormTextInput;

const styles = StyleSheet.create({
  label: {
    fontSize: moderateScale(13),
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: verticalScale(6),
  },
  input: {
    borderWidth: moderateScale(1),
    borderColor: colors.border,
    borderRadius: moderateScale(10),
    paddingHorizontal: horizontalScale(14),
    paddingVertical: verticalScale(12),
    fontSize: moderateScale(16),
    color: colors.textPrimary,
    backgroundColor: colors.backgroundAlt,
    marginBottom: verticalScale(16),
  },
  textArea: {
    minHeight: verticalScale(80),
  },
});
