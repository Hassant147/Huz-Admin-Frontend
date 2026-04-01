import { describe, expect, it } from "vitest";

import { createApiClient, DEFAULT_AXIOS_CONFIG } from "./apiConfig";

describe("apiConfig", () => {
  it("enables XSRF header forwarding for credentialed cross-origin requests", () => {
    expect(DEFAULT_AXIOS_CONFIG.withCredentials).toBe(true);
    expect(DEFAULT_AXIOS_CONFIG.withXSRFToken).toBe(true);
    expect(DEFAULT_AXIOS_CONFIG.xsrfCookieName).toBe("csrftoken");
    expect(DEFAULT_AXIOS_CONFIG.xsrfHeaderName).toBe("X-CSRFToken");
  });

  it("propagates the XSRF setting to created clients", () => {
    const client = createApiClient();

    expect(client.defaults.withCredentials).toBe(true);
    expect(client.defaults.withXSRFToken).toBe(true);
    expect(client.defaults.xsrfCookieName).toBe("csrftoken");
    expect(client.defaults.xsrfHeaderName).toBe("X-CSRFToken");
  });
});
