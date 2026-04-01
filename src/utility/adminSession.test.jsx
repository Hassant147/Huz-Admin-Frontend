import React, { StrictMode } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const { apiClient } = vi.hoisted(() => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

vi.mock("./apiConfig", () => ({
  createApiClient: () => apiClient,
}));

import { AdminAuthProvider, useAdminAuth } from "./adminSession";

const SessionProbe = () => {
  const { isLoading, isAuthenticated, message } = useAdminAuth();

  return (
    <div>
      <span data-testid="loading-state">{isLoading ? "loading" : "settled"}</span>
      <span data-testid="auth-state">{isAuthenticated ? "authenticated" : "unauthenticated"}</span>
      <span data-testid="auth-message">{message}</span>
    </div>
  );
};

describe("AdminAuthProvider", () => {
  afterEach(() => {
    apiClient.get.mockReset();
    apiClient.post.mockReset();
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("settles out of loading when bootstrap fails under StrictMode", async () => {
    const pendingRejectors = [];

    apiClient.get.mockImplementation(
      () =>
        new Promise((resolve, reject) => {
          pendingRejectors.push(reject);
        })
    );

    render(
      <StrictMode>
        <AdminAuthProvider>
          <SessionProbe />
        </AdminAuthProvider>
      </StrictMode>
    );

    await waitFor(() => {
      expect(pendingRejectors.length).toBeGreaterThan(0);
    });

    pendingRejectors.forEach((reject) => reject(new Error("Network Error")));

    await waitFor(() => {
      expect(screen.getByTestId("loading-state").textContent).toBe("settled");
    });

    expect(screen.getByTestId("auth-state").textContent).toBe("unauthenticated");
    expect(screen.getByTestId("auth-message").textContent).toBe(
      "Unable to reach the admin session service."
    );
  });

  it("bootstraps authenticated admin state without consulting partner storage", async () => {
    const getItemSpy = vi.spyOn(Storage.prototype, "getItem");

    apiClient.get.mockResolvedValue({
      status: 200,
      data: {
        authenticated: true,
        user: {
          username: "session-admin",
          email: "session.admin@example.com",
        },
      },
    });

    render(
      <AdminAuthProvider>
        <SessionProbe />
      </AdminAuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading-state").textContent).toBe("settled");
    });

    expect(screen.getByTestId("auth-state").textContent).toBe("authenticated");
    expect(screen.getByTestId("auth-message").textContent).toBe("");
    expect(getItemSpy).not.toHaveBeenCalledWith("SignedUp-User-Profile");
  });
});
