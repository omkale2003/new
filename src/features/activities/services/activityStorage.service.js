// Storage keys for Activity Provider portal (completely isolated from Property Owner)
const PROVIDER_TOKEN_KEY = "konkantrip_activity_provider_token";
const PROVIDER_USER_KEY = "konkantrip_activity_provider_user";
const PROVIDER_VERIFICATION_KEY = "konkantrip_activity_provider_verification";
const PROVIDER_DRAFT_KEY = "konkantrip_activity_draft";

export const activityStorageService = {
  getToken() {
    return localStorage.getItem(PROVIDER_TOKEN_KEY);
  },

  setToken(token) {
    if (!token) return;
    localStorage.setItem(PROVIDER_TOKEN_KEY, token);
  },

  removeToken() {
    localStorage.removeItem(PROVIDER_TOKEN_KEY);
  },

  getUser() {
    const raw = localStorage.getItem(PROVIDER_USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      localStorage.removeItem(PROVIDER_USER_KEY);
      return null;
    }
  },

  setUser(user) {
    if (!user) return;
    localStorage.setItem(PROVIDER_USER_KEY, JSON.stringify(user));
  },

  removeUser() {
    localStorage.removeItem(PROVIDER_USER_KEY);
  },

  getVerificationState() {
    const raw = localStorage.getItem(PROVIDER_VERIFICATION_KEY);
    if (!raw) return { mobileVerified: false, emailVerified: false };
    try {
      return JSON.parse(raw);
    } catch {
      return { mobileVerified: false, emailVerified: false };
    }
  },

  setVerificationState(state) {
    localStorage.setItem(PROVIDER_VERIFICATION_KEY, JSON.stringify(state));
  },

  getDraft() {
    const raw = localStorage.getItem(PROVIDER_DRAFT_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setDraft(draft) {
    localStorage.setItem(PROVIDER_DRAFT_KEY, JSON.stringify(draft));
  },

  clearDraft() {
    localStorage.removeItem(PROVIDER_DRAFT_KEY);
  },

  clearAll() {
    this.removeToken();
    this.removeUser();
    localStorage.removeItem(PROVIDER_VERIFICATION_KEY);
    this.clearDraft();
  },
};

export default activityStorageService;

