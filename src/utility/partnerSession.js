const PARTNER_PROFILE_KEY = "SignedUp-User-Profile";

export const getStoredPartnerProfile = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const rawProfile = window.localStorage.getItem(PARTNER_PROFILE_KEY);
  if (!rawProfile) {
    return null;
  }

  try {
    return JSON.parse(rawProfile);
  } catch (error) {
    console.error("Unable to parse stored partner profile:", error);
    return null;
  }
};

export const getPartnerSessionToken = () =>
  getStoredPartnerProfile()?.partner_session_token || "";

export const getPartnerRouteAccessState = () => {
  const profile = getStoredPartnerProfile();

  if (!profile) {
    return {
      isLoggedIn: false,
      isEmailVerified: false,
      partnerType: "",
      accountStatus: "",
      typeAndDetail: null,
    };
  }

  const {
    is_email_verified: isEmailVerified,
    partner_type: partnerType,
    account_status: accountStatus,
    partner_type_and_detail: typeAndDetail,
  } = profile;

  return {
    isLoggedIn: true,
    isEmailVerified,
    partnerType,
    accountStatus,
    typeAndDetail,
  };
};
