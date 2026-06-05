import { act, renderHook } from "@testing-library/react-native";
import * as LocalAuthentication from "expo-local-authentication";

import { AppStrings } from "@/constants";
import { useAuth } from "../hooks/useAuth";

jest.mock("expo-local-authentication", () => ({
  hasHardwareAsync: jest.fn(),
  isEnrolledAsync: jest.fn(),
  getEnrolledLevelAsync: jest.fn(),
  authenticateAsync: jest.fn(),
  SecurityLevel: {
    NONE: 0,
    SECRET: 1,
    BIOMETRIC_WEAK: 2,
    BIOMETRIC_STRONG: 3,
  },
}));

const mockLocalAuth = LocalAuthentication as jest.Mocked<
  typeof LocalAuthentication
>;

describe("useAuth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalAuth.hasHardwareAsync.mockResolvedValue(true);
    mockLocalAuth.isEnrolledAsync.mockResolvedValue(true);
    mockLocalAuth.getEnrolledLevelAsync.mockResolvedValue(
      LocalAuthentication.SecurityLevel.BIOMETRIC_STRONG,
    );
  });

  it("returns success when authentication succeeds", async () => {
    mockLocalAuth.authenticateAsync.mockResolvedValue({ success: true });

    const { result } = renderHook(() => useAuth());

    let authResult: { success: boolean; error?: string } | undefined;
    await act(async () => {
      authResult = await result.current.authenticateAsync();
    });

    expect(authResult).toEqual({ success: true });
    expect(result.current.authError).toBeNull();
    expect(result.current.isAuthenticating).toBe(false);
  });

  it("returns failure and sets error when authentication fails", async () => {
    mockLocalAuth.authenticateAsync.mockResolvedValue({
      success: false,
      error: "user_cancel",
    });

    const { result } = renderHook(() => useAuth());

    let authResult: { success: boolean; error?: string } | undefined;
    await act(async () => {
      authResult = await result.current.authenticateAsync();
    });

    expect(authResult?.success).toBe(false);
    expect(authResult?.error).toBe(AppStrings.auth.cancelled);
    expect(result.current.authError).toBe(AppStrings.auth.cancelled);
  });

  it("handles unavailable biometric hardware", async () => {
    mockLocalAuth.hasHardwareAsync.mockResolvedValue(false);
    mockLocalAuth.isEnrolledAsync.mockResolvedValue(false);

    const { result } = renderHook(() => useAuth());

    let authResult: { success: boolean; error?: string } | undefined;
    await act(async () => {
      authResult = await result.current.authenticateAsync();
    });

    expect(authResult?.success).toBe(false);
    expect(authResult?.error).toBe(AppStrings.auth.hardwareUnavailable);
    expect(mockLocalAuth.authenticateAsync).not.toHaveBeenCalled();
  });

  it("clears auth error via clearAuthError", async () => {
    mockLocalAuth.authenticateAsync.mockResolvedValue({
      success: false,
      error: "authentication_failed",
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.authenticateAsync();
    });

    expect(result.current.authError).not.toBeNull();

    act(() => {
      result.current.clearAuthError();
    });

    expect(result.current.authError).toBeNull();
  });
});
