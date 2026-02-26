import axios from "axios";

const resolveApiBaseURL = () => {
  const configuredURL = `${process.env.REACT_APP_API_BASE_URL || ""}`.trim();
  const fallbackURL = "http://127.0.0.1:8000";
  const normalizedBaseURL = configuredURL || fallbackURL;
  return normalizedBaseURL.replace(/\/+$/, "");
};

const API_BASE_URL = resolveApiBaseURL();

// Create an Axios instance with the base URL and default headers
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `${process.env.REACT_APP_AUTH_TOKEN}`,
  },
});

// Function to submit transport package details
export const submitTransportPackage = async (vehicleDetails, category) => {
  const formData = new FormData();
  const { partner_session_token } = JSON.parse(
    localStorage.getItem("SignedUp-User-Profile")
  );

  formData.append("partner_session_token", partner_session_token);

  // Assuming only one file is allowed, use the first file from the array
  if (vehicleDetails.files.length > 0) {
    const file = vehicleDetails.files[0];
    formData.append("vehicle_photos", file, file.name);
  } else {
    throw new Error("No vehicle photo provided");
  }

  formData.append(
    "package_type",
    category === "Fix Route" ? "Fix Route" : "Flexible Route"
  );
  formData.append("transport_type", vehicleDetails.vehicleType);
  formData.append("name_and_model", vehicleDetails.vehicleNameAndModel);
  formData.append("plate_no", vehicleDetails.licensePlateNo);
  formData.append("sitting_capacity", vehicleDetails.sittingCapacity);
  formData.append("common_1", vehicleDetails.startLocation);
  formData.append("common_2", vehicleDetails.endLocation);
  formData.append("cost", vehicleDetails.cost);
  formData.append("availability", vehicleDetails.amenities.join(", "));

  const config = {
    method: "post",
    url: "/partner/enroll_transport_package/",
    headers: {
      Authorization: `${process.env.REACT_APP_AUTH_TOKEN}`,
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  };

  try {
    const response = await apiClient.request(config);

    // Check for a successful response
    if (response.status >= 200 && response.status < 300) {
      // Return the actual data if success
      return response.data;
    } else {
      // Throw error if response is not in the success range
      throw new Error(response.data.message || "Submission failed");
    }
  } catch (error) {
    console.error("Error response:", error);
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error("Error data:", error.response.data);
      throw new Error(error.response.data.message || "Server Error");
    } else if (error.request) {
      // Request was made but no response received
      console.error("Request data:", error.request);
      throw new Error("No response from server");
    } else {
      // Something happened in setting up the request
      console.error("Error message:", error.message);
      throw new Error("Network Error");
    }
  }
};

//edit transport package
export const updateTransportPackage = async (vehicleDetails, category) => {
  const { partner_session_token } = JSON.parse(
    localStorage.getItem("SignedUp-User-Profile")
  );
  const transportPackage = JSON.parse(
    localStorage.getItem("editTransportPackage")
  );

  const formData = new FormData();
  formData.append("partner_session_token", partner_session_token);
  formData.append("package_type", category);
  formData.append("transport_type", vehicleDetails.vehicleType);
  formData.append("name_and_model", vehicleDetails.vehicleNameAndModel);
  formData.append("plate_no", vehicleDetails.licensePlateNo);
  formData.append("sitting_capacity", vehicleDetails.sittingCapacity);
  formData.append("availability", vehicleDetails.amenities.join(", "));
  formData.append("common_1", vehicleDetails.startLocation);
  formData.append("common_2", vehicleDetails.endLocation);
  formData.append("cost", vehicleDetails.cost);
  formData.append("transport_token", transportPackage.transport_token);

  try {
    const response = await apiClient.put(
      "/partner/update_transport_package_basic_detail/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error response:", error);
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error("Error data:", error.response.data);
      throw new Error(error.response.data.message || "Server Error");
    } else if (error.request) {
      // Request was made but no response received
      console.error("Request data:", error.request);
      throw new Error("No response from server");
    } else {
      // Something happened in setting up the request
      console.error("Error message:", error.message);
      throw new Error("Network Error");
    }
  }
};
//edit transport package photos
export const updateTransportPackagePhoto = (file) => {
  const { partner_session_token } = JSON.parse(
    localStorage.getItem("SignedUp-User-Profile")
  );
  const transportPackage = JSON.parse(
    localStorage.getItem("editTransportPackage")
  );

  const formData = new FormData();
  formData.append("partner_session_token", partner_session_token);
  formData.append("transport_token", transportPackage.transport_token);
  formData.append("vehicle_photos", file);

  return apiClient.put("/partner/update_transport_package_photo/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

//function deactivate transport package
export const deactivateTransportPackage = (
  partnerSessionToken,
  transportToken,
  status
) => {
  return apiClient.put("/partner/change_transport_package_status/", {
    partner_session_token: partnerSessionToken,
    transport_token: transportToken,
    // package_status: "Deactivated",
    package_status: status,
  });
};

// Function to fetch transport package details
export const fetchTransportPackage = async () => {
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
      "/partner/get_transport_package_by_token/",
      {
        params: { partner_session_token },
      }
    );

    return { data: response.data, error: null };
  } catch (error) {
    console.error("Fetch Transport Package Error:", error); // Enhanced error logging
    return {
      data: null,
      error: error.response ? error.response.data.message : "Network Error",
    };
  }
};

// Function to enroll package basic details
export const enrollPackageBasicDetail = async (data) => {
  try {
    const response = await apiClient.post(
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
    const response = await apiClient.put(
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
    const response = await apiClient.post(
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
    const response = await apiClient.put(
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
    const response = await apiClient.post(
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
    const response = await apiClient.put(
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
    const response = await apiClient.post(
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
    const response = await apiClient.put(
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
    const response = await apiClient.post(
      "/partner/enroll_package_hotel_detail/",
      data
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// Function to upload hotel photos
export const uploadHotelPhotos = async (data) => {
  const config = {
    method: "post",
    url: "/partner/upload_hotel_photos/",
    headers: {
      Authorization: `${process.env.REACT_APP_AUTH_TOKEN}`,
      "Content-Type": "multipart/form-data",
    },
    data: data,
  };

  try {
    const response = await apiClient.request(config);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// Function to edit package hotel detail
export const editPackageHotelDetail = async (data) => {
  try {
    const response = await apiClient.put(
      "/partner/enroll_package_hotel_detail/",
      data
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to edit package hotel detail");
  }
};

// Delete Hotel Photo
export const deleteHotelPhoto = async (data) => {
  try {
    const response = await apiClient.delete("/partner/upload_hotel_photos/", {
      data,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete hotel photo");
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
    const response = await apiClient.put(
      "/partner/change_huz_package_status/",
      raw
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
  return apiClient.put("/partner/update_partner_avatar/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
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

//Booking API to fetch bookings
export const fetchBookings = async (partnerSessionToken, status) => {
  try {
    const response = await apiClient.get(
      `/bookings/get_all_booking_detail_for_partner/?partner_session_token=${partnerSessionToken}&booking_status=${status}`
    );
    return response.data;
  } catch (error) {
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
    const response = await apiClient.put(endpoint, data);
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
  user_session_token
) => {
  try {
    const formData = new FormData();
    formData.append("session_token", user_session_token);
    formData.append("booking_number", bookingNumber);
    formData.append("document_link", file); // Ensure this is a File object
    formData.append("document_for", documentType);
    formData.append("partner_session_token", partnerSessionToken);

    // Log FormData contents
    for (let [key, value] of formData.entries()) {
    }

    const response = await apiClient.post(
      "/bookings/manage_booking_documents/",
      formData,
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
  partnerSessionToken,
  bookingNumber,
  flightDate,
  flightTime,
  flightFrom,
  flightTo
) => {
  try {
    const response = await apiClient.post(
      "/bookings/manage_booking_airline_details/",
      {
        partner_session_token: partnerSessionToken,
        booking_number: bookingNumber,
        flight_date: flightDate,
        flight_time: flightTime,
        flight_from: flightFrom,
        flight_to: flightTo,
      }
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
    const response = await apiClient.delete(
      "/bookings/delete_booking_documents/",
      {
        data: props,
      }
    );
  } catch (error) {
    console.error(
      "Delete request error:",
      error.response ? error.response.data : error
    );
  }
};

// function to update airline details on booking forms
export const updateAirlineDetails = (
  partnerSessionToken,
  bookingNumber,
  airline_id,
  flightDate,
  flightTime,
  flightFrom,
  flightTo
) => {
  const data = {
    partner_session_token: partnerSessionToken,
    booking_number: bookingNumber,
    booking_airline_id: airline_id,
    flight_date: flightDate,
    flight_time: flightTime,
    flight_from: flightFrom,
    flight_to: flightTo,
  };

  apiClient
    .put("/bookings/manage_booking_airline_details/", data)
    .then((response) => {})
    .catch((error) => {
      console.error(error);
    });
};

//function to Post transport/Hotel forms in booking
export const postTransportDetails = async (formData) => {
  const {
    partner_session_token,
    booking_number,
    detail_for,
    jeddah_name,
    jeddah_number,
    mecca_name,
    mecca_number,
    madinah_name,
    madinah_number,
    comment_1,
    comment_2,
  } = formData;

  try {
    const response = await apiClient.post(
      "/bookings/manage_booking_hotel_or_transport_details/",
      {
        partner_session_token,
        booking_number,
        detail_for,
        jeddah_name,
        jeddah_number,
        mecca_name,
        mecca_number,
        madinah_name,
        madinah_number,
        comment_1,
        comment_2,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to post transport details:", error);
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
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic a2V6dG9ncm91cDpoMnNvNGgybw==",
    },
  };

  try {
    const response = await axios.put(
      `${process.env.REACT_APP_API_BASE_URL}/bookings/manage_booking_hotel_or_transport_details/`,
      JSON.stringify(formData),
      config
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update transport details:", error);
    throw error;
  }
};

export const getWithdrawRequest = async (partnerSessionToken) => {
  try {
    const response = await apiClient.get(
      `/partner/manage_partner_withdraw_request/F${partnerSessionToken}`
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

//get all complaints
export const getPartnerAllComplaints = async (partnerSessionToken, status) => {
  try {
    const response = await apiClient.get(
      `/bookings/get_all_complaints_for_partner/?partner_session_token=${partnerSessionToken}&complaint_status=${status}`
    );

    return response.data;
  } catch (error) {
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

//wallet
export const fetchReceivablePayments = async () => {
  const { partner_session_token } = JSON.parse(
    localStorage.getItem("SignedUp-User-Profile")
  );

  try {
    const response = await apiClient.get(
      "/bookings/get_receivable_payment_statistics/",
      {
        params: {
          partner_session_token: partner_session_token,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return { message: "No payment records found for the user." };
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
