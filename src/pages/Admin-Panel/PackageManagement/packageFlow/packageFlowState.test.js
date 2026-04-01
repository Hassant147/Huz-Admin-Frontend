import { describe, expect, it } from "vitest";

import {
  PACKAGE_FLOW_TABS,
  buildPackageFlowCompletedTabs,
  buildPackageFlowDraft,
  buildPackageFlowEntryPath,
  getFirstIncompletePackageFlowIndex,
} from "./packageFlowState";

const packageDetail = {
  huz_token: "pkg-123",
  package_stage: 3,
  package_type: "Umrah",
  package_name: "Spring Umrah",
  package_base_cost: 125000,
  cost_for_child: 80000,
  cost_for_infants: 25000,
  cost_for_sharing: 10000,
  cost_for_quad: 15000,
  cost_for_triple: 20000,
  cost_for_double: 30000,
  cost_for_single: 45000,
  mecca_nights: 4,
  madinah_nights: 3,
  start_date: "2026-10-01T00:00:00Z",
  end_date: "2026-10-08T00:00:00Z",
  package_validity: "2026-09-15T00:00:00Z",
  description: "Seven night stay",
  is_package_open_for_other_date: true,
  is_visa_included: true,
  is_breakfast_included: true,
  airline_detail: [
    {
      airline_name: "Saudia",
      ticket_type: "Economy",
      is_return_flight_included: true,
      flight_from: "Karachi",
      flight_to: "Jeddah",
    },
  ],
  transport_detail: [
    {
      transport_name: "Bus",
      transport_type: "Shared",
      routes: "Jeddah to Mecca, Mecca to Madinah",
    },
  ],
  ziyarah_detail: [
    {
      ziyarah_list: "Masjid al-Haram, Quba Mosque",
    },
  ],
  hotel_detail: [
    {
      hotel_id: "makkah-1",
      hotel_city: "Mecca",
      hotel_name: "Makkah Suites",
      hotel_rating: "5",
      room_sharing_type: "Double",
      hotel_distance: 450,
      distance_type: "m",
      is_shuttle_services_included: true,
      is_wifi: true,
    },
  ],
};

describe("packageFlowState", () => {
  it("builds completed tabs and next incomplete tab from package detail", () => {
    const completedTabs = buildPackageFlowCompletedTabs(packageDetail);

    expect(completedTabs).toEqual([
      "Basic Information",
      "Airline",
      "Transport",
      "Ziyarah",
      "Makkah Hotel",
    ]);
    expect(getFirstIncompletePackageFlowIndex(completedTabs)).toBe(
      PACKAGE_FLOW_TABS.indexOf("Madina Hotel")
    );
  });

  it("normalizes package detail into draft step data", () => {
    const draft = buildPackageFlowDraft(packageDetail);

    expect(draft.basicDetails.packageName).toBe("Spring Umrah");
    expect(draft.basicDetails.packageBaseCost).toBe("125000");
    expect(draft.basicDetails.services).toEqual(["Visa", "Breakfast"]);
    expect(draft.flightDetails).toEqual({
      airline: "Saudia",
      ticketType: "Economy",
      returnFlightIncluded: true,
      originCity: "Karachi",
      returnCity: "Jeddah",
    });
    expect(draft.transportDetails.routes).toEqual([
      "Jeddah to Mecca",
      "Mecca to Madinah",
    ]);
    expect(draft.ziyarahDetails.includedSites).toEqual({
      Makkah: ["Masjid al-Haram"],
      Madinah: ["Quba Mosque"],
    });
    expect(draft.makkahHotelDetails).toEqual({
      hotelName: "Makkah Suites",
      roomSharingType: "Double",
      amenities: ["Shuttle service", "WiFi"],
      hotel_rating: "5",
      hotel_distance: "450 m",
    });
    expect(draft.madinahHotelDetails.hotelName).toBe("");
    expect(draft.meccaHotelId).toBe("makkah-1");
    expect(draft.activeTab).toBe(PACKAGE_FLOW_TABS.indexOf("Madina Hotel"));
  });

  it("builds the continue/edit entry path from package stage", () => {
    expect(buildPackageFlowEntryPath(packageDetail, "partner-1", "pkg-123")).toBe(
      "/company/continue-existing-package-creation?partnerSessionToken=partner-1&huzToken=pkg-123"
    );

    expect(
      buildPackageFlowEntryPath(
        { ...packageDetail, package_stage: PACKAGE_FLOW_TABS.length },
        "partner-1",
        "pkg-123"
      )
    ).toBe("/edit-package?partnerSessionToken=partner-1&huzToken=pkg-123");
  });
});
