const ADMIN_USER_DATA_KEY = "user-data";
const LEGACY_ADMIN_FLAG_KEY = "isSuperAdmin";

const parseStoredJSON = (value) => {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    console.error("Unable to parse stored admin session:", error);
    return null;
  }
};

export const getAdminSessionProfile = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const profile = parseStoredJSON(window.localStorage.getItem(ADMIN_USER_DATA_KEY));
  if (profile && `${profile.user_type || ""}`.toLowerCase() === "admin") {
    return profile;
  }

  return null;
};

export const isAdminSessionActive = () => {
  if (getAdminSessionProfile()) {
    return true;
  }

  if (typeof window === "undefined") {
    return false;
  }

  // Temporary compatibility for pre-migration sessions that only have the legacy flag.
  return window.localStorage.getItem(LEGACY_ADMIN_FLAG_KEY) === "true";
};

export const clearAdminSession = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(ADMIN_USER_DATA_KEY);
  window.localStorage.removeItem(LEGACY_ADMIN_FLAG_KEY);
};

