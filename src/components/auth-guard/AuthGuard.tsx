import { AppStrings } from "@/constants";
import { colors, horizontalScale, moderateScale, verticalScale } from "@/theme";
import React from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Loading overlay + auth error toast while the rest of the screen stays mounted.
interface AuthGuardProps {
  isAuthenticating: boolean;
  authError: string | null;
  onDismissError: () => void;
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = (props) => {
  const { authError, children, isAuthenticating, onDismissError } = props;
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {children}

      {isAuthenticating ? (
        <Modal transparent animationType="fade" visible={isAuthenticating}>
          <View style={styles.overlay}>
            <View style={styles.loadingCard}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>
                {AppStrings.auth.verifyingIdentity}
              </Text>
            </View>
          </View>
        </Modal>
      ) : null}

      {authError ? (
        <View
          style={[styles.toast, { bottom: verticalScale(16) + insets.bottom }]}
        >
          <Text style={styles.toastText}>{authError}</Text>
          <Pressable onPress={onDismissError} accessibilityRole="button">
            <Text style={styles.toastDismiss}>{AppStrings.auth.dismiss}</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
};

export default AuthGuard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: colors.overlayLight,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingCard: {
    backgroundColor: colors.surface,
    borderRadius: moderateScale(16),
    padding: moderateScale(28),
    alignItems: "center",
    gap: moderateScale(12),
    minWidth: horizontalScale(200),
  },
  loadingText: {
    fontSize: moderateScale(15),
    color: colors.textBody,
    fontWeight: "500",
  },
  toast: {
    position: "absolute",
    left: horizontalScale(20),
    right: horizontalScale(20),
    backgroundColor: colors.errorBackground,
    borderRadius: moderateScale(12),
    padding: moderateScale(16),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: moderateScale(1),
    borderColor: colors.errorBorder,
  },
  toastText: {
    flex: 1,
    color: colors.error,
    fontSize: moderateScale(14),
    marginRight: horizontalScale(12),
  },
  toastDismiss: {
    color: colors.error,
    fontWeight: "600",
    fontSize: moderateScale(14),
  },
});
