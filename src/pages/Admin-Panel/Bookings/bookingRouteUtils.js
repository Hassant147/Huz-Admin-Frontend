const normalizeBookingNumber = (bookingNumber = "") => `${bookingNumber || ""}`.trim();

export const parseAdminBookingNumberFromSearch = (search = "") => {
  const params = new URLSearchParams(search);
  return normalizeBookingNumber(params.get("booking_number"));
};

export const buildAdminBookingDetailsPath = (bookingNumber = "") => {
  const normalizedBookingNumber = normalizeBookingNumber(bookingNumber);
  return normalizedBookingNumber
    ? `/booking/${encodeURIComponent(normalizedBookingNumber)}`
    : "/booking";
};

export const buildAdminBookingSubflowPath = (bookingNumber = "", flow = "") => {
  const normalizedFlow = `${flow || ""}`.trim().replace(/^\/+/, "");
  const detailsPath = buildAdminBookingDetailsPath(bookingNumber);

  if (!normalizedFlow || detailsPath === "/booking") {
    return detailsPath;
  }

  return `${detailsPath}/${normalizedFlow}`;
};
