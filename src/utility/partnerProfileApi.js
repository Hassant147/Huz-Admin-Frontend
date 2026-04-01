import { createApiClient } from "./apiConfig";

const partnerProfileApiClient = createApiClient();
const jsonConfig = {
  headers: {
    "Content-Type": "application/json",
  },
};

export const checkPartnerUsernameAvailability = async (data) => {
  try {
    const response = await partnerProfileApiClient.post(
      "/partner/check_username_exist/",
      data,
      jsonConfig
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
