const PROFILE_KEY = "SignedUp-User-Profile";

export const getStoredUserProfile = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const rawProfile = window.localStorage.getItem(PROFILE_KEY);
  if (!rawProfile) {
    return null;
  }

  try {
    return JSON.parse(rawProfile);
  } catch (error) {
    console.error("Unable to parse stored user profile:", error);
    return null;
  }
};

export const getPartnerSessionToken = () => getStoredUserProfile()?.partner_session_token || "";
