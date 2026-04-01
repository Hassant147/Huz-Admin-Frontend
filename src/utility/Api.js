import { createApiClient, isManagementRequest } from "./apiConfig";
import { handleAdminUnauthorizedResponse } from "./adminSession";

const apiClient = createApiClient();

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isManagementRequest(error?.config?.url)) {
      return handleAdminUnauthorizedResponse(error);
    }

    return Promise.reject(error);
  }
);

const EMPTY_PAGINATED_RESPONSE = {
  count: 0,
  next: null,
  previous: null,
  results: [],
};

const normalizePaginatedResponse = (payload) => {
  if (Array.isArray(payload)) {
    return {
      count: payload.length,
      next: null,
      previous: null,
      results: payload,
    };
  }

  if (payload && typeof payload === "object") {
    const results = Array.isArray(payload.results) ? payload.results : [];
    return {
      count: Number(payload.count) || results.length,
      next: payload.next || null,
      previous: payload.previous || null,
      results,
    };
  }

  return EMPTY_PAGINATED_RESPONSE;
};

const getPartnerSessionTokenFromPayload = (payload) => {
  if (payload instanceof FormData) {
    return `${payload.get("partner_session_token") || ""}`.trim();
  }

  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    return `${payload.partner_session_token || ""}`.trim();
  }

  return "";
};

const stripPartnerSessionToken = (payload) => {
  if (payload instanceof FormData) {
    const sanitizedFormData = new FormData();
    for (const [key, value] of payload.entries()) {
      if (key !== "partner_session_token") {
        sanitizedFormData.append(key, value);
      }
    }
    return sanitizedFormData;
  }

  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    const { partner_session_token, ...rest } = payload;
    return rest;
  }

  return payload;
};

const withPartnerAuth = (config = {}, explicitToken = "", payload = null) => {
  const partnerSessionToken = `${explicitToken || getPartnerSessionTokenFromPayload(payload) || ""}`.trim();
  if (!partnerSessionToken) {
    return config;
  }

  return {
    ...config,
    headers: {
      ...(config.headers || {}),
      Authorization: `Bearer ${partnerSessionToken}`,
    },
  };
};

const buildPartnerMutationRequest = (payload, explicitToken = "", config = {}) => ({
  payload: stripPartnerSessionToken(payload),
  config: withPartnerAuth(config, explicitToken, payload),
});

const postPartnerMutation = (url, payload, explicitToken = "", config = {}) => {
  const request = buildPartnerMutationRequest(payload, explicitToken, config);
  return apiClient.post(url, request.payload, request.config);
};

const putPartnerMutation = (url, payload, explicitToken = "", config = {}) => {
  const request = buildPartnerMutationRequest(payload, explicitToken, config);
  return apiClient.put(url, request.payload, request.config);
};

const deletePartnerMutation = (url, payload, explicitToken = "", config = {}) => {
  const request = buildPartnerMutationRequest(payload, explicitToken, config);
  return apiClient.delete(url, {
    ...request.config,
    data: request.payload,
  });
};

// Function to enroll package basic details
export const enrollPackageBasicDetail = async (data) => {
  try {
    const response = await postPartnerMutation(
      "/partner/enroll_package_basic_detail/",
      data
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// Function to edit package basic details
export const editPackageBasicDetail = async (data) => {
  try {
    const response = await putPartnerMutation(
      "/partner/enroll_package_basic_detail/",
      data
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update package details");
  }
};

// Function to enroll package airline details
export const enrollPackageAirlineDetail = async (data) => {
  try {
    const response = await postPartnerMutation(
      "/partner/enroll_package_airline_detail/",
      data
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// Function to Edit package airline details
export const editPackageAirlineDetail = async (data) => {
  try {
    const response = await putPartnerMutation(
      "/partner/enroll_package_airline_detail/",
      data
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update airline details");
  }
};

// Function to enroll package transport details
export const enrollPackageTransportDetail = async (data) => {
  try {
    const response = await postPartnerMutation(
      "/partner/enroll_package_transport_detail/",
      data
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// Function to edit package transport details
export const editPackageTransportDetail = async (data) => {
  try {
    const response = await putPartnerMutation(
      "/partner/enroll_package_transport_detail/",
      data
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update transport details");
  }
};

// Function to enroll package Ziyarah details
export const enrollPackageZiyarahDetail = async (data) => {
  try {
    const response = await postPartnerMutation(
      "/partner/enroll_package_ziyarah_detail/",
      data
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// Function to edit package Ziyarah details
export const editPackageZiyarahDetail = async (data) => {
  try {
    const response = await putPartnerMutation(
      "/partner/enroll_package_ziyarah_detail/",
      data
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update Ziyarah details");
  }
};

// Function to enroll package hotel details
export const enrollPackageHotelDetail = async (data) => {
  try {
    const response = await postPartnerMutation(
      "/partner/enroll_package_hotel_detail/",
      data
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// Function to edit package hotel detail
export const editPackageHotelDetail = async (data) => {
  try {
    const response = await putPartnerMutation(
      "/partner/enroll_package_hotel_detail/",
      data
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to edit package hotel detail");
  }
};

//function to deacitvate hajj and umrah package

export const deactivatePackage = async (
  partnerSessionToken,
  huzToken,
  status
) => {
  const raw = {
    partner_session_token: partnerSessionToken,
    huz_token: huzToken,
    // package_status: "Deactivated",
    package_status: status,
  };

  try {
    const response = await putPartnerMutation(
      "/partner/change_huz_package_status/",
      raw,
      partnerSessionToken
    );
    return response.data;
  } catch (error) {
    console.error("Error deactivating package:", error);
    if (error.response) {
      throw new Error(error.response.data.message || "Server Error");
    } else if (error.request) {
      throw new Error("No response from server");
    } else {
      throw new Error("Network Error");
    }
  }
};

// Function to fetch packages
export const fetchPackages = async (type, status, page = 1) => {
  try {
    const profile = localStorage.getItem("SignedUp-User-Profile");
    if (!profile) {
      throw new Error("User profile not found in local storage.");
    }

    const { partner_session_token } = JSON.parse(profile);

    if (!partner_session_token) {
      throw new Error("Partner session token not found in local storage.");
    }

    const response = await apiClient.get(
      "/partner/get_package_short_detail_by_partner_token/",
      {
        params: {
          partner_session_token,
          package_type: type,
          package_status: status,
          page, // include page parameter if pagination is supported
        },
      }
    );

    return { data: response.data, error: null };
  } catch (error) {
    console.error("Fetch Packages Error:", error); // Enhanced error logging

    if (error.response && error.response.status === 404) {
      return { data: [], error: " No packages found for the selected type." };
    }

    return { data: [], error: "An error occurred while fetching packages." };
  }
};

// Function to get package details
export const getPackageDetails = async (partnerSessionToken, huzToken) => {
  try {
    const response = await apiClient.get(
      "/partner/get_package_detail_by_partner_token/",
      {
        params: {
          partner_session_token: partnerSessionToken,
          huz_token: huzToken,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// Function to update company profile
export const updateCompanyProfile = async (formData, partnerSessionToken) => {
  const raw = JSON.stringify({
    partner_session_token: partnerSessionToken,
    user_name: formData.username,
    contact_name: formData.contactName,
    contact_number: formData.contactNumber,
    company_website: formData.companyWebsite,
    total_experience: formData.totalExperience,
    company_bio: formData.companyBio,
  });

  try {
    const response = await apiClient.put(
      "/partner/update_partner_company_profile/",
      raw
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//funciton to upload user avatar
export const uploadProfileImage = (formData) => {
  const request = buildPartnerMutationRequest(formData, "", {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return apiClient.put(
    "/partner/update_partner_avatar/",
    request.payload,
    request.config
  );
};

//funciton to upload company logo
export const uploadCompanyLogo = (formData) => {
  return apiClient.put("/partner/update_company_logo/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

//funciton to update company adress
export const updateCompanyAddress = async (formData, partnerSessionToken) => {
  const addressData = {
    partner_session_token: partnerSessionToken,
    address_id: formData.address_id,
    street_address: formData.streetAddress,
    address_line2: formData.addressLine2,
    city: formData.city,
    state: formData.state,
    country: formData.countryRegion,
    postal_code: formData.postalCode,
    lat: formData.lat,
    long: formData.long,
  };

  try {
    const response = await apiClient.put(
      "/partner/update_partner_address_detail/",
      addressData
    );

    return response.data;
  } catch (error) {
    console.error("Error in updateCompanyAddress:", error); // Debugging line
    throw error;
  }
};

// Function to get company address
export const getCompanyAddress = async (partnerSessionToken) => {
  try {
    const response = await apiClient.get(
      `/partner/get_partner_address_detail/?partner_session_token=${partnerSessionToken}`
    );

    return response.data;
  } catch (error) {
    console.error("Error in getCompanyAddress:", error); // Debugging line
    throw error;
  }
};

//funciton to Change password
export const changePassword = async (
  partnerSessionToken,
  currentPassword,
  newPassword
) => {
  const payload = {
    partner_session_token: partnerSessionToken,
    current_password: currentPassword,
    new_password: newPassword,
  };

  try {
    const response = await apiClient.put(
      "/partner/change_partner_password/",
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};

//functon to change Individual profile details.

export const updateIndividualProfile = async (
  formData,
  partnerSessionToken
) => {
  const response = await apiClient.put(
    "/partner/update_individual_partner_profile/",
    {
      partner_session_token: partnerSessionToken,
      contact_name: formData.contactName,
      contact_number: formData.contactNumber,
    }
  );
  return response.data;
};

export const getPartnerOverallTransactionHistory = async (
  partnerSessionToken
) => {
  try {
    const response = await apiClient.get(
      `/partner/get_partner_over_transaction_amount/?partner_session_token=${partnerSessionToken}`
    );
    return response.data;
  } catch (error) {
    console.error("Error in getPartnerOverallTransactionHistory:", error); // Debugging line
    throw error;
  }
};

export const addBankAccount = async (
  partnerSessionToken,
  account_title,
  account_number,
  bank_name,
  branch_code
) => {
  if (branch_code === "") {
    branch_code = "null";
  }
  const payload = {
    partner_session_token: partnerSessionToken,
    account_title: account_title,
    account_number: account_number,
    bank_name: bank_name,
    branch_code: branch_code,
  };

  try {
    const response = await apiClient.post(
      "/partner/manage_partner_bank_account/",
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error adding in bank account:", error);
    throw error;
  }
};

export const getPartnerBankAccounts = async (partnerSessionToken) => {
  try {
    const response = await apiClient.get(
      `/partner/manage_partner_bank_account/?partner_session_token=${partnerSessionToken}`
    );

    return response.data;
  } catch (error) {
    console.error("Error in getPartnerBankAccounts:", error); // Debugging line
    throw error;
  }
};

export const getPartnerAllTransaction = async (partnerSessionToken) => {
  try {
    const response = await apiClient.get(
      `/partner/get_partner_all_transaction_history/?partner_session_token=${partnerSessionToken}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteBankAccount = async (partnerSessionToken, account_id) => {
  const data = {
    account_id: `${account_id}`,
    partner_session_token: `${partnerSessionToken}`,
  };
  try {
    const response = await apiClient.delete(
      "/partner/manage_partner_bank_account/",
      { data }
    );
    return response.data;
  } catch (error) {
    console.error("Error to delete bank account:", error);
    throw error;
  }
};

// Booking API to fetch paginated bookings
export const fetchBookings = async (
  partnerSessionToken,
  {
    workflowBucket,
    bookingNumber = "",
    page = 1,
    pageSize = 10,
  } = {}
) => {
  try {
    const response = await apiClient.get(
      "/bookings/get_all_booking_detail_for_partner/",
      {
        params: {
          partner_session_token: partnerSessionToken,
          workflow_bucket: workflowBucket,
          page,
          page_size: pageSize,
          ...(bookingNumber ? { booking_number: bookingNumber } : {}),
        },
      }
    );
    return normalizePaginatedResponse(response.data);
  } catch (error) {
    if (
      error.response?.status === 404 &&
      error.response?.data?.message === "No bookings found."
    ) {
      return EMPTY_PAGINATED_RESPONSE;
    }
    console.error("Error fetching bookings:", error);
    throw error;
  }
};

// Function to get booking details by booking number
export const getBookingDetails = (partnerSessionToken, bookingNumber) => {
  const endpoint = "/bookings/get_booking_detail_by_booking_number/";
  const params = {
    partner_session_token: partnerSessionToken,
    booking_number: bookingNumber,
  };

  return apiClient
    .get(endpoint, { params })
    .then((response) => response.data)
    .catch((error) => {
      throw new Error(
        error.response ? error.response.data.message : error.message
      );
    });
};

// Function to update booking status
export const updateBookingStatus = async (
  partnerSessionToken,
  bookingNumber,
  bookingStatus,
  partnerRemarks
) => {
  const endpoint = "/bookings/partner_action_for_booking/";
  const data = {
    partner_session_token: partnerSessionToken,
    booking_number: bookingNumber,
    booking_status: bookingStatus,
    partner_remarks: partnerRemarks,
  };

  try {
    const response = await putPartnerMutation(endpoint, data, partnerSessionToken);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response ? error.response.data.message : error.message
    );
  }
};

export const closeBooking = async (partnerSessionToken, bookingNumber) => {
  try {
    const response = await putPartnerMutation(
      "/bookings/update_booking_status_into_close/",
      {
        partner_session_token: partnerSessionToken,
        booking_number: bookingNumber,
      },
      partnerSessionToken
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response ? error.response.data.message : error.message
    );
  }
};

// Function to update booking document status
export const updateBookingDocumentStatus = async (
  partnerSessionToken,
  bookingNumber,
  documentType,
  file,
  user_session_token,
  options = {}
) => {
  try {
    const formData = new FormData();
    formData.append("session_token", user_session_token);
    formData.append("booking_number", bookingNumber);
    formData.append("document_link", file); // Ensure this is a File object
    formData.append("document_for", documentType);
    formData.append("document_category", options.documentCategory || documentType);
    if (options.documentScope) {
      formData.append("document_scope", options.documentScope);
    }
    if (options.documentTitle) {
      formData.append("document_title", options.documentTitle);
    }
    if (options.bookingGroupId) {
      formData.append("booking_group_id", options.bookingGroupId);
    }
    if (options.travelerId) {
      formData.append("traveler_id", options.travelerId);
    }

    const response = await postPartnerMutation(
      "/bookings/manage_booking_documents/",
      formData,
      partnerSessionToken,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating booking document status:", error);
    throw error; // Throw the error to handle it in the calling code
  }
};

// Function to post airline details for booking
export const PostAirlineDetails = async (
  partnerSessionTokenOrPayload,
  bookingNumber,
  flightDate,
  flightTime,
  flightFrom,
  flightTo
) => {
  const payload =
    partnerSessionTokenOrPayload &&
    typeof partnerSessionTokenOrPayload === "object" &&
    !Array.isArray(partnerSessionTokenOrPayload)
      ? partnerSessionTokenOrPayload
      : {
          partner_session_token: partnerSessionTokenOrPayload,
          booking_number: bookingNumber,
          flight_date: flightDate,
          flight_time: flightTime,
          flight_from: flightFrom,
          flight_to: flightTo,
        };
  try {
    const response = await postPartnerMutation(
      "/bookings/manage_booking_airline_details/",
      payload,
      typeof partnerSessionTokenOrPayload === "string"
        ? partnerSessionTokenOrPayload
        : ""
    );
    return response.data;
  } catch (error) {
    console.error("Error updating airline details:", error);
    throw error; // Throw the error to handle it in the calling code
  }
};

//function to delete document from Booking
export const deleteBookingDocument = async (props) => {
  try {
    const response = await deletePartnerMutation(
      "/bookings/delete_booking_documents/",
      props
    );
    return response.data;
  } catch (error) {
    console.error(
      "Delete request error:",
      error.response ? error.response.data : error
    );
    throw error;
  }
};

// function to update airline details on booking forms
export const updateAirlineDetails = async (
  partnerSessionTokenOrPayload,
  bookingNumber,
  airline_id,
  flightDate,
  flightTime,
  flightFrom,
  flightTo
) => {
  const data =
    partnerSessionTokenOrPayload &&
    typeof partnerSessionTokenOrPayload === "object" &&
    !Array.isArray(partnerSessionTokenOrPayload)
      ? partnerSessionTokenOrPayload
      : {
          partner_session_token: partnerSessionTokenOrPayload,
          booking_number: bookingNumber,
          booking_airline_id: airline_id,
          flight_date: flightDate,
          flight_time: flightTime,
          flight_from: flightFrom,
          flight_to: flightTo,
        };

  try {
    const response = await putPartnerMutation(
      "/bookings/manage_booking_airline_details/",
      data,
      typeof partnerSessionTokenOrPayload === "string"
        ? partnerSessionTokenOrPayload
        : ""
    );
    return response.data;
  } catch (error) {
    console.error("Error updating airline details:", error);
    throw error;
  }
};

//function to Post transport/Hotel forms in booking
export const postTransportDetails = async (formData) => {
  try {
    const response = await postPartnerMutation(
      "/bookings/manage_booking_hotel_or_transport_details/",
      formData
    );
    return response.data;
  } catch (error) {
    console.error("Failed to post transport details:", error);
    throw error;
  }
};
export const addWithdrawRequest = async (
  partnerSessionToken,
  accountId,
  withdraw_amount
) => {
  const payload = {
    partner_session_token: partnerSessionToken,
    account_id: accountId,
    withdraw_amount: withdraw_amount,
  };
  try {
    const response = await apiClient.post(
      "/partner/manage_partner_withdraw_request/",
      payload
    );
    return response.data;
  } catch (error) {
    console.error(error.response.data.message);
    throw error;
  }
};

//function to edit transport/Hotel forms in booking
export const updateTransportDetails = async (formData) => {
  try {
    const response = await putPartnerMutation(
      "/bookings/manage_booking_hotel_or_transport_details/",
      formData
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update transport details:", error);
    throw error;
  }
};

export const manageTravelerIssue = async ({
  partnerSessionToken,
  bookingNumber,
  passportId,
  travelerIssueId,
  action = "report",
  issueType = "reported",
  notes = "",
}) => {
  try {
    const response = await putPartnerMutation(
      "/bookings/manage_traveler_issues/",
      {
        partner_session_token: partnerSessionToken,
        booking_number: bookingNumber,
        ...(passportId ? { passport_id: passportId } : {}),
        ...(travelerIssueId ? { traveler_issue_id: travelerIssueId } : {}),
        action,
        issue_type: issueType,
        notes,
      },
      partnerSessionToken
    );
    return response.data;
  } catch (error) {
    console.error("Failed to manage traveler issue:", error);
    throw error;
  }
};

export const getWithdrawRequest = async (partnerSessionToken) => {
  try {
    const response = await apiClient.get(
      "/partner/manage_partner_withdraw_request/",
      {
        params: {
          partner_session_token: partnerSessionToken,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error in getPartnerAllTransaction:", error); // Debugging line
    throw error;
  }
};

export const getOverPartnerComplaints = async (partnerSessionToken) => {
  try {
    const response = await apiClient.get(
      `/bookings/get_overall_complaints_counts/?partner_session_token=${partnerSessionToken}`
    );

    return response.data;
  } catch (error) {
    console.error("Error in getOverPartnerRating:", error); // Debugging line
    throw error;
  }
};

// Get all complaints with server-driven pagination/filtering
export const getPartnerAllComplaints = async (
  partnerSessionToken,
  {
    status = "",
    complaintId = "",
    search = "",
    fromDate = "",
    toDate = "",
    page = 1,
    pageSize = 8,
  } = {}
) => {
  try {
    const response = await apiClient.get(
      "/bookings/get_all_complaints_for_partner/",
      {
        params: {
          partner_session_token: partnerSessionToken,
          page,
          page_size: pageSize,
          ...(status ? { complaint_status: status } : {}),
          ...(complaintId ? { complaint_id: complaintId } : {}),
          ...(search ? { search } : {}),
          ...(fromDate ? { from_date: fromDate } : {}),
          ...(toDate ? { to_date: toDate } : {}),
        },
      }
    );

    return normalizePaginatedResponse(response.data);
  } catch (error) {
    if (
      error.response?.status === 404 &&
      error.response?.data?.message === "Complaint detail not found."
    ) {
      return EMPTY_PAGINATED_RESPONSE;
    }
    console.error("Error in getPartnerAllComplaints:", error); // Debugging line
    throw error;
  }
};

export const updatePartnerAllComplaintsStatus = async (
  partnerSessionToken,
  complaintId,
  status
) => {
  try {
    const response = await apiClient.post(
      `/bookings/give_feedback_on_complaints/`,
      {
        partner_session_token: partnerSessionToken,
        complaint_id: complaintId,
        complaint_status: status,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in updatePartnerAllComplaintsStatus:", error); // Log error
    throw error;
  }
};

//get packages for reviews
export const getPartnerAllPackagesByToken = async (
  partnerSessionToken,
  type
) => {
  try {
    const response = await apiClient.get(
      `/partner/get_package_short_detail_by_partner_token/?partner_session_token=${partnerSessionToken}&package_type=${type}`
      // "/partner/get_package_short_detail_by_partner_token/?partner_session_token=YXNkZkBtYWlsaW5hdG9yLmNvbTUyOTU1OTE3&package_type=Hajj"
    );
    return response.data;
  } catch (error) {
    console.error("Error in getPartnerAllPackagesByToken:", error); // Debugging line
    throw error;
  }
};

//get all ratings
export const getOverPartnerRating = async (partnerSessionToken) => {
  try {
    const response = await apiClient.get(
      `/bookings/get_overall_partner_rating/?partner_session_token=${partnerSessionToken}`
    );

    return response.data;
  } catch (error) {
    console.error("Error in getOverPartnerRating:", error); // Debugging line
    throw error;
  }
};

//get review comments
export const getOverPartnerComments = async (
  partnerSessionToken,
  huz_token
) => {
  try {
    const response = await apiClient.get(
      `/bookings/get_rating_and_review_package_wise/?partner_session_token=${partnerSessionToken}&huz_token=${huz_token}`
    );

    if (response.status === 404) {
      return { message: "No ratings found for this package." };
    }
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return { message: "No ratings found for this package." };
    }
    throw new Error("Failed to fetch data");
  }
};

//get total reviews
export const getOverPartnerTotalRating = async (
  partnerSessionToken,
  huz_token
) => {
  try {
    const response = await apiClient.get(
      `/bookings/get_overall_rating_package_wise/?partner_session_token=${partnerSessionToken}&huz_token=${huz_token}`
      // http://13.213.42.27/bookings/get_overall_rating_package_wise/?partner_session_token=YXNkZmdAbWFpbGluYXRvci5jb201Mjk1NTkxNw==&huz_token=Mzk0MDk2MjAyNC0wNi0wNSAwNzo1MToyMC41NjkwNzk=
    );
    return response.data;
  } catch (error) {
    console.error("Error in getOverPartnerTotalRating :", error); // Debugging line
    throw error;
  }
};

// Function to get partner overall package statistics
export const getPartnerOverallPackageStatistics = async (
  partnerSessionToken
) => {
  try {
    const response = await apiClient.get(
      `/partner/get_partner_overall_package_statistics/?partner_session_token=${partnerSessionToken}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching partner overall package statistics:", error);
    throw error;
  }
};

// Function to fetch booking statistics
export const fetchBookingStatistics = async (partner_session_token) => {
  try {
    const response = await apiClient.get(
      `/bookings/get_overall_booking_statistics/?partner_session_token=${partner_session_token}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching booking data:", error);
    throw error;
  }
};

// Function to fetch overall complaints counts
export const fetchOverallComplaintsCounts = async (partner_session_token) => {
  try {
    const response = await apiClient.get(
      "/bookings/get_overall_complaints_counts/",
      {
        params: {
          partner_session_token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data from API", error);
    throw error;
  }
};

// Function to fetch overall package statistics
export const fetchPackageStatistics = async (partner_session_token) => {
  try {
    const response = await apiClient.get(
      "/partner/get_partner_overall_package_statistics/",
      {
        params: {
          partner_session_token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching package statistics:", error);
    throw error;
  }
};

// Function to fetch yearly earning statistics
export const fetchYearlyEarningStatistics = async (
  partner_session_token,
  year
) => {
  try {
    const response = await apiClient.get(
      "/bookings/get_yearly_earning_statistics/",
      {
        params: {
          partner_session_token,
          year,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching yearly earning statistics:", error);
    throw error;
  }
};

// Wallet receivable payments
export const fetchReceivablePayments = async ({
  page = 1,
  pageSize = 10,
} = {}) => {
  const { partner_session_token } = JSON.parse(
    localStorage.getItem("SignedUp-User-Profile")
  );

  try {
    const response = await apiClient.get(
      "/bookings/get_receivable_payment_statistics/",
      {
        params: {
          partner_session_token: partner_session_token,
          page,
          page_size: pageSize,
        },
      }
    );
    return normalizePaginatedResponse(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return EMPTY_PAGINATED_RESPONSE;
    }
    throw new Error("Failed to fetch data");
  }
};

export const getMasterHotels = async (params = {}) => {
  try {
    const response = await apiClient.get("/management/manage_master_hotels/", {
      params,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch master hotels." };
  }
};

const toMasterHotelFormData = (payload = {}) => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || key === "images" || key === "delete_image_ids") {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== undefined && item !== null && item !== "") {
          formData.append(key, String(item));
        }
      });
      return;
    }

    formData.append(key, typeof value === "boolean" ? String(value) : String(value));
  });

  const imageFiles = Array.isArray(payload.images) ? payload.images : [];
  imageFiles.forEach((file) => {
    if (typeof Blob !== "undefined" && file instanceof Blob) {
      formData.append("images", file);
    }
  });

  const deleteImageIds = Array.isArray(payload.delete_image_ids) ? payload.delete_image_ids : [];
  deleteImageIds.forEach((imageId) => {
    if (imageId) {
      formData.append("delete_image_ids", String(imageId));
    }
  });

  return formData;
};

export const createMasterHotel = async (payload) => {
  try {
    const response = await apiClient.post(
      "/management/manage_master_hotels/",
      toMasterHotelFormData(payload),
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to create master hotel." };
  }
};

export const updateMasterHotel = async (payload) => {
  try {
    const response = await apiClient.put(
      "/management/manage_master_hotels/",
      toMasterHotelFormData(payload),
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update master hotel." };
  }
};

export const deleteMasterHotel = async (hotelId) => {
  try {
    const response = await apiClient.delete("/management/manage_master_hotels/", {
      data: { hotel_id: hotelId },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete master hotel." };
  }
};

//Detail page api

export const getPackagesDetail = async (packageId) => {
  try {
    const response = await apiClient.get(
      `/partner/get_package_detail_by_package_id_for_web/?huz_token=${packageId}`
    );
    return { data: response.data, error: null };
  } catch (error) {
    console.error("Fetch Packages Error:", error); // Enhanced error logging

    // Handling different error scenarios
    if (error.response) {
      // Server responded with a status other than 2xx
      return { data: null, error: error.response.data.message };
    } else if (error.request) {
      // Request was made but no response was received
      return {
        data: null,
        error:
          "Network Error: Unable to reach the server. Please check your internet connection or try again later.",
      };
    } else {
      // Something happened in setting up the request
      return { data: null, error: error.message };
    }
  }
};
