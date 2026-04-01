import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const apiMocks = vi.hoisted(() => ({
  getWithdrawRequest: vi.fn(),
}));

const sessionMocks = vi.hoisted(() => ({
  getPartnerSessionToken: vi.fn(),
}));

vi.mock("../../../../utility/Api", () => ({
  getWithdrawRequest: apiMocks.getWithdrawRequest,
}));

vi.mock("../../../../utility/partnerSession", () => ({
  getPartnerSessionToken: sessionMocks.getPartnerSessionToken,
}));

vi.mock("../../../../components/layout/AdminPanelLayout", () => ({
  default: ({ title, subtitle, children }) => (
    <div>
      {title ? <h1>{title}</h1> : null}
      {subtitle ? <p>{subtitle}</p> : null}
      {children}
    </div>
  ),
}));

vi.mock("../../../../components/loader", () => ({
  default: () => <div>Loading...</div>,
}));

vi.mock("../../../../assets/DeleteIcon.svg", () => ({
  default: "delete-icon.svg",
}));

vi.mock("../../../../assets/AccountsStatement.svg", () => ({
  default: "account-statement.svg",
}));

import WithdrawHistory from "./WithdrawHistory";

describe("withdraw history smoke coverage", () => {
  beforeEach(() => {
    apiMocks.getWithdrawRequest.mockReset();
    sessionMocks.getPartnerSessionToken.mockReset();
  });

  it("loads withdraw history for the active partner session token", async () => {
    sessionMocks.getPartnerSessionToken.mockReturnValue("partner-token-123");

    apiMocks.getWithdrawRequest.mockResolvedValue([
      {
        account_title: "Acme Travel",
        account_number: "1234567890",
        request_time: "2026-04-01 10:00",
        withdraw_amount: "25000",
        process_time: "2026-04-01 14:00",
        withdraw_status: "Pending",
      },
    ]);

    render(<WithdrawHistory />);

    expect(await screen.findByText("Acme Travel")).toBeTruthy();
    await waitFor(() => {
      expect(apiMocks.getWithdrawRequest).toHaveBeenCalledWith("partner-token-123");
    });
    expect(screen.getByText("1234567890")).toBeTruthy();
    expect(screen.getByText("25000")).toBeTruthy();
    expect(screen.getByText("Pending")).toBeTruthy();
  });

  it("renders the empty state when no withdraw requests are returned", async () => {
    sessionMocks.getPartnerSessionToken.mockReturnValue("partner-token-123");

    apiMocks.getWithdrawRequest.mockResolvedValue([]);

    render(<WithdrawHistory />);

    expect(await screen.findByText("No data yet")).toBeTruthy();
  });
});
