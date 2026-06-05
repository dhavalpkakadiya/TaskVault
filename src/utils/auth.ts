import { AppStrings } from "@/constants";
import * as LocalAuthentication from "expo-local-authentication";

export async function isAuthenticationAvailable(): Promise<boolean> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  return hasHardware && isEnrolled;
}

// Biometrics when available; device PIN/passcode as fallback (disableDeviceFallback: false).
export async function authenticateUser(): Promise<LocalAuthentication.LocalAuthenticationResult> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();

  if (!hasHardware) {
    return {
      success: false,
      error: "not_available",
    };
  }

  const securityLevel = await LocalAuthentication.getEnrolledLevelAsync();
  if (securityLevel === LocalAuthentication.SecurityLevel.NONE) {
    return {
      success: false,
      error: "not_enrolled",
    };
  }

  return LocalAuthentication.authenticateAsync({
    promptMessage: AppStrings.auth.promptMessage,
    cancelLabel: AppStrings.auth.cancelLabel,
    fallbackLabel: AppStrings.auth.fallbackLabel,
    disableDeviceFallback: false,
  });
}

// Maps expo-local-authentication error codes to user-facing copy.
export function getAuthErrorMessage(
  result: LocalAuthentication.LocalAuthenticationResult,
  biometricsAvailable: boolean,
): string {
  if (result.success) {
    return "";
  }

  if (result.error === "user_cancel") {
    return AppStrings.auth.cancelled;
  }

  if (result.error === "lockout") {
    return AppStrings.auth.lockout;
  }

  if (result.error === "not_available") {
    return AppStrings.auth.hardwareUnavailable;
  }

  if (result.error === "not_enrolled") {
    return AppStrings.auth.notEnrolled;
  }

  if (!biometricsAvailable) {
    return AppStrings.auth.biometricsUnavailable;
  }

  return AppStrings.auth.failed;
}
