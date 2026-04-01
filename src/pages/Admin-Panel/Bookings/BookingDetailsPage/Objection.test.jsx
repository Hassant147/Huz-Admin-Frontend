import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Objection from "./Objection";

describe("Objection", () => {
  it("shows traveler issue copy for reported traveler issue states", () => {
    render(
      <Objection
        booking={{
          open_traveler_issues: [{ id: "issue-1" }, { id: "issue-2" }],
          reported_travelers: [{ id: "traveler-1" }],
        }}
      />
    );

    expect(screen.getByRole("heading", { name: "Traveler issues" })).toBeTruthy();
    expect(screen.getByText("Reported travelers")).toBeTruthy();
    expect(screen.getByText("2 open traveler issues require action.")).toBeTruthy();
  });

  it("keeps operator objection copy when the booking is explicitly objected", () => {
    render(
      <Objection
        booking={{
          issue_status: "OPERATOR_OBJECTION",
          open_traveler_issues: [{ id: "issue-1" }],
          reported_travelers: [{ id: "traveler-1" }],
          booking_objections: [
            {
              objection_id: "obj-1",
              remarks_or_reason: "Passport copy is unreadable.",
            },
          ],
        }}
      />
    );

    expect(screen.getByRole("heading", { name: "Operator objection" })).toBeTruthy();
    expect(screen.getByText("Latest objection")).toBeTruthy();
    expect(screen.getByText("Passport copy is unreadable.")).toBeTruthy();
  });
});
