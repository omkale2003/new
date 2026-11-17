import { useState, useCallback, useEffect } from "react";
import activityStorageService from "../services/activityStorage.service.js";
import { activityAuthApi } from "../api/activityAuth.api.js";

export function useActivityAuth() {
  const [token, setTokenState] = useState(() => activityStorageService.getToken());
  const [vendor, setVendorState] = useState(() => activityStorageService.getUser());
  const [verification, setVerification] = useState(() => activityStorageService.getVerificationState());

  const isAuthenticated = Boolean(token && vendor);
  const status = vendor?.status || "Pending Verification";
  const isActive = status === "Active";
  const canPublish = isActive;

  useEffect(() => {
    const handleStorageChange = () => {
      setTokenState(activityStorageService.getToken());
      setVendorState(activityStorageService.getUser());
      setVerification(activityStorageService.getVerificationState());
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const logout = useCallback(() => {
    activityStorageService.removeToken();
    setTokenState(null);
    if (typeof window !== "undefined") {
      window.location.href = "/activity-provider/login";
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const updated = await activityAuthApi.getProfile();
      activityStorageService.setUser(updated);
      setVendorState(updated);
      return updated;
    } catch {
      // ignore
    }
  }, []);

  return {
    vendor,
    token,
    isAuthenticated,
    status,
    isActive,
    canPublish,
    verification,
    logout,
    refreshUser,
  };
}

export default useActivityAuth;

