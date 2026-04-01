export const PACKAGE_FLOW_TABS = [
  "Basic Information",
  "Airline",
  "Transport",
  "Ziyarah",
  "Makkah Hotel",
  "Madina Hotel",
];

export const PACKAGE_FLOW_STAGE_COUNT = PACKAGE_FLOW_TABS.length;

export const PACKAGE_FLOW_STORAGE_KEYS = {
  activeTab: "activeTab",
  completedTabs: "completedTabs",
  formData: "formData",
  packageDetail: "packageDetail",
  huzToken: "huz_token",
  basicDetails: "basicDetails",
  flightDetails: "flightDetails",
  transportDetails: "transportDetails",
  ziyarahDetails: "ziyarahDetails",
  makkahHotelDetails: "MakkahHotelDetails",
  madinahHotelDetails: "MadinahHotelDetails",
  meccaHotelId: "Mecca_hotel_id",
  madinahHotelId: "Madinah_hotel_id",
  meccaImagesApiResponse: "Mecca_imagesApiResponse",
  madinahImagesApiResponse: "Madinah_imagesApiResponse",
};

const INCLUDED_SERVICE_FLAGS = [
  ["Visa", "is_visa_included"],
  ["Airport Reception", "is_airport_reception_included"],
  ["Tour Guide", "is_tour_guide_included"],
  ["Insurance", "is_insurance_included"],
  ["Breakfast", "is_breakfast_included"],
  ["Lunch", "is_lunch_included"],
  ["Dinner", "is_dinner_included"],
];

const HOTEL_AMENITY_FLAGS = [
  ["Shuttle service", "is_shuttle_services_included"],
  ["Air Conditioning", "is_air_condition"],
  ["Television", "is_television"],
  ["WiFi", "is_wifi"],
  ["Elevator", "is_elevator"],
  ["Attached Bathroom", "is_attach_bathroom"],
  ["Washroom Amenities", "is_washroom_amenities"],
  ["English Toilet", "is_english_toilet"],
  ["Indian Toilet", "is_indian_toilet"],
  ["Laundry", "is_laundry"],
];

const splitCsv = (value) =>
  typeof value === "string"
    ? value
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean)
    : [];

const toInputDate = (value) =>
  typeof value === "string" && value.includes("T") ? value.split("T")[0] : value || "";

const toStorageJson = (key, value) => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(key, JSON.stringify(value));
};

const toStorageString = (key, value) => {
  if (typeof window === "undefined") {
    return;
  }

  if (value === undefined || value === null || value === "") {
    localStorage.removeItem(key);
    return;
  }

  localStorage.setItem(key, String(value));
};

const buildServiceList = (packageDetail = {}) =>
  INCLUDED_SERVICE_FLAGS.filter(([, flag]) => Boolean(packageDetail?.[flag])).map(([label]) => label);

const buildHotelAmenities = (hotel = {}) =>
  HOTEL_AMENITY_FLAGS.filter(([, flag]) => Boolean(hotel?.[flag]) || Boolean(hotel?.[flag.replace("is_television", "is_Television")]))
    .map(([label]) => label);

const findHotelByCity = (packageDetail = {}, city) =>
  (Array.isArray(packageDetail?.hotel_detail) ? packageDetail.hotel_detail : []).find(
    (hotel) => hotel?.hotel_city?.toLowerCase() === city.toLowerCase()
  ) || null;

const buildBasicDetails = (packageDetail = {}) => ({
  packageName: packageDetail?.package_name || "",
  packageBaseCost:
    packageDetail?.package_base_cost !== undefined && packageDetail?.package_base_cost !== null
      ? String(packageDetail.package_base_cost)
      : "",
  packageCostForChild:
    packageDetail?.cost_for_child !== undefined && packageDetail?.cost_for_child !== null
      ? String(packageDetail.cost_for_child)
      : "",
  packageCostForInfants:
    packageDetail?.cost_for_infants !== undefined && packageDetail?.cost_for_infants !== null
      ? String(packageDetail.cost_for_infants)
      : "",
  packageCostForSharing:
    packageDetail?.cost_for_sharing !== undefined && packageDetail?.cost_for_sharing !== null
      ? String(packageDetail.cost_for_sharing)
      : "",
  packageCostForQuad:
    packageDetail?.cost_for_quad !== undefined && packageDetail?.cost_for_quad !== null
      ? String(packageDetail.cost_for_quad)
      : "",
  packageCostForTriple:
    packageDetail?.cost_for_triple !== undefined && packageDetail?.cost_for_triple !== null
      ? String(packageDetail.cost_for_triple)
      : "",
  packageCostForDouble:
    packageDetail?.cost_for_double !== undefined && packageDetail?.cost_for_double !== null
      ? String(packageDetail.cost_for_double)
      : "",
  packageCostForSingle:
    packageDetail?.cost_for_single !== undefined && packageDetail?.cost_for_single !== null
      ? String(packageDetail.cost_for_single)
      : "",
  nightsInMecca:
    packageDetail?.mecca_nights !== undefined && packageDetail?.mecca_nights !== null
      ? String(packageDetail.mecca_nights)
      : "",
  nightsInMadinah:
    packageDetail?.madinah_nights !== undefined && packageDetail?.madinah_nights !== null
      ? String(packageDetail.madinah_nights)
      : "",
  startDate: toInputDate(packageDetail?.start_date),
  endDate: toInputDate(packageDetail?.end_date),
  packageDescription: packageDetail?.description || "",
  flexibleDates: Boolean(packageDetail?.is_package_open_for_other_date),
  packageValidity: toInputDate(packageDetail?.package_validity),
  services: buildServiceList(packageDetail),
});

const buildFlightDetails = (packageDetail = {}) => {
  const detail = Array.isArray(packageDetail?.airline_detail)
    ? packageDetail.airline_detail[0]
    : null;

  return {
    airline: detail?.airline_name || "",
    ticketType: detail?.ticket_type || "",
    returnFlightIncluded: Boolean(detail?.is_return_flight_included),
    originCity: detail?.flight_from || detail?.origin_city || "",
    returnCity: detail?.flight_to || detail?.return_city || "",
  };
};

const buildTransportDetails = (packageDetail = {}) => {
  const detail = Array.isArray(packageDetail?.transport_detail)
    ? packageDetail.transport_detail[0]
    : null;

  return {
    transport: detail?.transport_name || "",
    type: detail?.transport_type || "",
    routes: splitCsv(detail?.routes),
  };
};

const buildZiyarahDetails = (packageDetail = {}) => {
  const detail = Array.isArray(packageDetail?.ziyarah_detail)
    ? packageDetail.ziyarah_detail[0]
    : null;

  const includedSites = { Makkah: [], Madinah: [] };

  splitCsv(detail?.ziyarah_list).forEach((site) => {
    if (site.includes("Madinah") || site.includes("Nabwi") || site.includes("Quba") || site.includes("Uhud")) {
      includedSites.Madinah.push(site);
      return;
    }

    includedSites.Makkah.push(site);
  });

  return { includedSites };
};

const buildHotelDetails = (packageDetail = {}, city) => {
  const hotel = findHotelByCity(packageDetail, city);

  return {
    hotelName: hotel?.hotel_name || "",
    roomSharingType: hotel?.room_sharing_type || "",
    amenities: buildHotelAmenities(hotel),
    hotel_rating: hotel?.hotel_rating || "",
    hotel_distance:
      hotel?.hotel_distance !== undefined && hotel?.distance_type
        ? `${hotel.hotel_distance} ${hotel.distance_type}`
        : "",
  };
};

export const buildPackageFlowCompletedTabs = (packageDetail = {}) => {
  if (!packageDetail || typeof packageDetail !== "object") {
    return [];
  }

  const completedTabs = [PACKAGE_FLOW_TABS[0]];

  if (Array.isArray(packageDetail?.airline_detail) && packageDetail.airline_detail.length > 0) {
    completedTabs.push(PACKAGE_FLOW_TABS[1]);
  }

  if (Array.isArray(packageDetail?.transport_detail) && packageDetail.transport_detail.length > 0) {
    completedTabs.push(PACKAGE_FLOW_TABS[2]);
  }

  if (Array.isArray(packageDetail?.ziyarah_detail) && packageDetail.ziyarah_detail.length > 0) {
    completedTabs.push(PACKAGE_FLOW_TABS[3]);
  }

  if (findHotelByCity(packageDetail, "Mecca")) {
    completedTabs.push(PACKAGE_FLOW_TABS[4]);
  }

  if (findHotelByCity(packageDetail, "Madinah")) {
    completedTabs.push(PACKAGE_FLOW_TABS[5]);
  }

  return completedTabs;
};

export const getFirstIncompletePackageFlowIndex = (completedTabs = []) => {
  const completedSet = new Set(completedTabs);
  const firstIncomplete = PACKAGE_FLOW_TABS.findIndex((label) => !completedSet.has(label));
  return firstIncomplete === -1 ? PACKAGE_FLOW_TABS.length - 1 : firstIncomplete;
};

export const buildPackageFlowDraft = (packageDetail = {}) => {
  const completedTabs = buildPackageFlowCompletedTabs(packageDetail);
  const makkahHotel = findHotelByCity(packageDetail, "Mecca");
  const madinahHotel = findHotelByCity(packageDetail, "Madinah");

  return {
    basicDetails: buildBasicDetails(packageDetail),
    flightDetails: buildFlightDetails(packageDetail),
    transportDetails: buildTransportDetails(packageDetail),
    ziyarahDetails: buildZiyarahDetails(packageDetail),
    makkahHotelDetails: buildHotelDetails(packageDetail, "Mecca"),
    madinahHotelDetails: buildHotelDetails(packageDetail, "Madinah"),
    completedTabs,
    activeTab: getFirstIncompletePackageFlowIndex(completedTabs),
    meccaHotelId: makkahHotel?.hotel_id || "",
    madinahHotelId: madinahHotel?.hotel_id || "",
  };
};

export const readPackageFlowJson = (key, fallbackValue) => {
  if (typeof window === "undefined") {
    return fallbackValue;
  }

  const rawValue = localStorage.getItem(key);
  if (!rawValue) {
    return fallbackValue;
  }

  try {
    return JSON.parse(rawValue);
  } catch (error) {
    console.error(`Unable to parse package flow storage for ${key}:`, error);
    return fallbackValue;
  }
};

export const readPackageFlowCompletedTabs = () =>
  readPackageFlowJson(PACKAGE_FLOW_STORAGE_KEYS.completedTabs, []);

export const readPackageFlowActiveTab = () => {
  const storedValue = readPackageFlowJson(PACKAGE_FLOW_STORAGE_KEYS.activeTab, 0);
  const normalizedValue = Number.isInteger(storedValue) ? storedValue : 0;
  return Math.min(Math.max(normalizedValue, 0), PACKAGE_FLOW_TABS.length - 1);
};

export const resetPackageFlowDraft = () => {
  if (typeof window === "undefined") {
    return;
  }

  Object.values(PACKAGE_FLOW_STORAGE_KEYS).forEach((storageKey) => {
    localStorage.removeItem(storageKey);
  });
};

export const resolvePackageFlowMode = (packageDetail = {}) =>
  packageDetail?.package_stage < PACKAGE_FLOW_STAGE_COUNT ? "continue" : "edit";

export const buildPackageFlowEntryPath = (
  packageDetail,
  partnerSessionToken = "",
  huzToken = ""
) => {
  const mode = resolvePackageFlowMode(packageDetail);
  const basePath =
    mode === "continue"
      ? "/company/continue-existing-package-creation"
      : "/edit-package";
  const query = new URLSearchParams();

  if (partnerSessionToken) {
    query.set("partnerSessionToken", partnerSessionToken);
  }

  if (huzToken) {
    query.set("huzToken", huzToken);
  }

  const queryString = query.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
};

export const writePackageFlowDraftToStorage = (
  packageDetail,
  { mode = "continue", force = false } = {}
) => {
  if (!packageDetail || typeof window === "undefined") {
    return;
  }

  const draft = buildPackageFlowDraft(packageDetail);
  const storedHuzToken = localStorage.getItem(PACKAGE_FLOW_STORAGE_KEYS.huzToken);
  const samePackage =
    !force &&
    Boolean(storedHuzToken) &&
    Boolean(packageDetail?.huz_token) &&
    storedHuzToken === String(packageDetail.huz_token);

  toStorageJson(PACKAGE_FLOW_STORAGE_KEYS.packageDetail, packageDetail);
  toStorageString(PACKAGE_FLOW_STORAGE_KEYS.huzToken, packageDetail?.huz_token);
  toStorageString("package_type", packageDetail?.package_type);

  if (!samePackage || !localStorage.getItem(PACKAGE_FLOW_STORAGE_KEYS.basicDetails)) {
    toStorageJson(PACKAGE_FLOW_STORAGE_KEYS.basicDetails, draft.basicDetails);
  }

  if (!samePackage || !localStorage.getItem(PACKAGE_FLOW_STORAGE_KEYS.flightDetails)) {
    toStorageJson(PACKAGE_FLOW_STORAGE_KEYS.flightDetails, draft.flightDetails);
  }

  if (!samePackage || !localStorage.getItem(PACKAGE_FLOW_STORAGE_KEYS.transportDetails)) {
    toStorageJson(PACKAGE_FLOW_STORAGE_KEYS.transportDetails, draft.transportDetails);
  }

  if (!samePackage || !localStorage.getItem(PACKAGE_FLOW_STORAGE_KEYS.ziyarahDetails)) {
    toStorageJson(PACKAGE_FLOW_STORAGE_KEYS.ziyarahDetails, draft.ziyarahDetails);
  }

  if (!samePackage || !localStorage.getItem(PACKAGE_FLOW_STORAGE_KEYS.makkahHotelDetails)) {
    toStorageJson(PACKAGE_FLOW_STORAGE_KEYS.makkahHotelDetails, draft.makkahHotelDetails);
  }

  if (!samePackage || !localStorage.getItem(PACKAGE_FLOW_STORAGE_KEYS.madinahHotelDetails)) {
    toStorageJson(PACKAGE_FLOW_STORAGE_KEYS.madinahHotelDetails, draft.madinahHotelDetails);
  }

  toStorageString(PACKAGE_FLOW_STORAGE_KEYS.meccaHotelId, draft.meccaHotelId);
  toStorageString(PACKAGE_FLOW_STORAGE_KEYS.madinahHotelId, draft.madinahHotelId);

  if (!samePackage || force || !localStorage.getItem(PACKAGE_FLOW_STORAGE_KEYS.completedTabs)) {
    toStorageJson(PACKAGE_FLOW_STORAGE_KEYS.completedTabs, draft.completedTabs);
  }

  if (!samePackage || force || !localStorage.getItem(PACKAGE_FLOW_STORAGE_KEYS.activeTab)) {
    const nextActiveTab = mode === "edit" ? 0 : draft.activeTab;
    toStorageJson(PACKAGE_FLOW_STORAGE_KEYS.activeTab, nextActiveTab);
  }
};
