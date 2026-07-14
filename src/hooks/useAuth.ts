import { useCallback, useRef, useState } from "react";

import { AppStrings } from "@/constants";
import { AuthResult } from "@/interface";
import {
  authenticateUser,
  getAuthErrorMessage,
  isAuthenticationAvailable,
} from "../utils/auth";

// Wraps expo-local-authentication for the add/edit/delete flow in useHome.
export function useAuth() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const isAuthenticatingRef = useRef(false);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  const authenticateAsync = useCallback(async (): Promise<AuthResult> => {
    // Ignore re-entrant taps while a biometric/PIN prompt is already open.
    if (isAuthenticatingRef.current) {
      return { success: false };
    }

    isAuthenticatingRef.current = true;
    setIsAuthenticating(true);
    setAuthError(null);

    try {
      const biometricsAvailable = await isAuthenticationAvailable();
      const result = await authenticateUser();

      if (result.success) {
        return { success: true };
      }

      const errorMessage = getAuthErrorMessage(result, biometricsAvailable);
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    } catch {
      const errorMessage = AppStrings.auth.failed;
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      isAuthenticatingRef.current = false;
      setIsAuthenticating(false);
    }
  }, []);

  return {
    authenticateAsync,
    isAuthenticating,
    authError,
    clearAuthError,
  };
}
