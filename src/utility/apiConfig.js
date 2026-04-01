import axios from "axios";

export const DEFAULT_API_BASE_URL = "https://hajjumrah.org";

export const resolveApiBaseURL = () => {
  const configuredURL = `${process.env.REACT_APP_API_BASE_URL || ""}`.trim();
  return (configuredURL || DEFAULT_API_BASE_URL).replace(/\/+$/, "");
};

export const API_BASE_URL = resolveApiBaseURL();

export const DEFAULT_AXIOS_CONFIG = {
  baseURL: API_BASE_URL,
  withCredentials: true,
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
  headers: {
    "Content-Type": "application/json",
  },
};

export const createApiClient = (overrides = {}) =>
  axios.create({
    ...DEFAULT_AXIOS_CONFIG,
    ...overrides,
    headers: {
      ...DEFAULT_AXIOS_CONFIG.headers,
      ...(overrides.headers || {}),
    },
  });

export const isManagementRequest = (url = "") => `${url || ""}`.startsWith("/management/");
