import { colors, horizontalScale, moderateScale, verticalScale } from "@/theme";
import { StyleSheet } from "react-native";

export const FAB_WIDTH = horizontalScale(56);
export const FAB_HEIGHT = verticalScale(56);
export const FAB_BOTTOM_MARGIN = verticalScale(16);

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(16),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    fontSize: moderateScale(28),
    fontWeight: "800",
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: moderateScale(14),
    color: colors.textSecondary,
    marginTop: verticalScale(2),
  },
  fab: {
    position: "absolute",
    right: horizontalScale(24),
    width: FAB_WIDTH,
    height: FAB_HEIGHT,
    borderRadius: moderateScale(28),
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    elevation: moderateScale(6),
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: verticalScale(4) },
    shadowOpacity: 0.3,
    shadowRadius: moderateScale(8),
  },
  fabDisabled: {
    opacity: 0.6,
  },
  fabText: {
    color: colors.textOnPrimary,
    fontSize: moderateScale(28),
    fontWeight: "300",
    lineHeight: verticalScale(30),
  },
  snackbar: {
    position: "absolute",
    alignSelf: "center",
    backgroundColor: colors.snackbar,
    borderRadius: moderateScale(8),
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(12),
  },
  snackbarText: {
    color: colors.textOnPrimary,
    fontSize: moderateScale(14),
    fontWeight: "500",
  },
});
