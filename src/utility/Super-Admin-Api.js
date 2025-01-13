import axios from "axios";

const authHeader = `${process.env.REACT_APP_AUTH_TOKEN}`;
const baseURL = process.env.REACT_APP_API_BASE_URL;

const config = {
  headers: {
    "Content-Type": "application/json",
    Authorization: authHeader,
  },
};

const apiClient = axios.create({
  baseURL,
  ...config,
});

export const checkUserExistence = async (phoneNumber) => {
  try {
    const response = await apiClient.post("/common/is_user_exist/", {
      phone_number: phoneNumber,
    });

    // Return response status and data to handle it in the component
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return {
        status: 404,
      };
    } else {
      console.error("Error checking user existence:", error);
      throw error;
    }
  }
};

export const fetchPendingCompanies = async () => {
  try {
    const response = await apiClient.get(
      "/management/fetch_all_pending_companies/"
    );

    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    if (error.response) {
      return {
        status: error.response.status,
        error: error.response.data,
      };
    } else {
      console.error("Error fetching pending companies:", error);
      throw error;
    }
  }
};

export const fetchSalesDirectors = async () => {
  try {
    const response = await apiClient.get(
      "/management/fetch_all_sale_directors/"
    );
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    if (error.response) {
      return {
        status: error.response.status,
        error: error.response.data.message,
      };
    } else {
      console.error("Error fetching sales directors:", error);
      throw error;
    }
  }
};

export const updateCompanyStatus = async (
  partner_session_token,
  account_status,
  session_token = ""
) => {
  try {
    const response = await apiClient.put(
      "/management/approved_or_reject_company/",
      {
        partner_session_token,
        account_status,
        session_token, // Send the sales director session token if provided
      }
    );
    return {
      status: response.status,
      message: response.data.message,
    };
  } catch (error) {
    if (error.response) {
      return {
        status: error.response.status,
        error: error.response.data.message,
      };
    } else {
      console.error("Error updating company status:", error);
      throw error;
    }
  }
};

export const fetchApprovedCompanies = async () => {
  try {
    const response = await apiClient.get(
      "/management/fetch_all_approved_companies/"
    );
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    if (error.response) {
      return {
        status: error.response.status,
        error: error.response.data.message,
      };
    } else {
      console.error("Error fetching approved companies:", error);
      throw error;
    }
  }
};

export const fetchPaidBookings = async () => {
  try {
    const response = await apiClient.get(
      "/management/fetch_all_paid_bookings/"
    );
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    if (error.response) {
      return {
        status: error.response.status,
        error: error.response.data.message,
      };
    } else {
      console.error("Error fetching paid bookings:", error);
      throw error;
    }
  }
};

// API to confirm payment and update booking status
export const confirmBookingPayment = async (
  user_session_token,
  bookingNumber
) => {
  try {
    const response = await apiClient.put(
      "/management/approve_booking_payment/",
      {
        session_token: user_session_token,
        booking_number: bookingNumber,
      }
    );

    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    if (error.response) {
      // Server responded with a status other than 200 range
      return {
        status: error.response.status,
        error: error.response.data.message || "An error occurred.",
      };
    } else if (error.request) {
      // The request was made, but no response was received
      return {
        status: 500,
        error: "No response received from the server.",
      };
    } else {
      // Something happened in setting up the request that triggered an error
      return {
        status: 500,
        error: "An error occurred while making the request.",
      };
    }
  }
};

// Define the function to fetch all pending partner payments
export const fetchPendingPartnerPayments = async () => {
  try {
    const response = await apiClient.get(
      "/management/fetch_all_partner_receive_able_payments_details/"
    );
    return { status: response.status, data: response.data };
  } catch (error) {
    return { status: error.response?.status, error: error.message };
  }
};

// Define the function to fetch booking details
export const fetchBookingDetails = async (partner_session_token, booking_number) => {
  try {
    const response = await apiClient.get('/bookings/get_booking_detail_by_booking_number/', {
      params: {
        partner_session_token,
        booking_number,
      },
    });
    return { status: response.status, data: response.data };
  } catch (error) {
    console.error('Error fetching booking details:', error);
    return { status: error.response?.status, error: error.message };
  }
};

//API for approving partner's payments
export const updatePartnerPaymentStatus = async (partner_session_token, booking_number) => {
  try {
    const response = await apiClient.put('/management/transfer_partner_receive_able_payments/', {
      partner_session_token,
      booking_number,
    });
    return { status: response.status, data: response.data };
  } catch (error) {
    console.error('Error updating payment status:', error);
    return { status: error.response?.status, error: error.message };
  }
};

export default apiClient; // Export apiClient as default