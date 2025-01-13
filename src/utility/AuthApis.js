import axios from "axios";
import FormData from "form-data";

// Ensure the token is correctly formatted without spaces
const authHeader = `${process.env.REACT_APP_AUTH_TOKEN}`;
const baseURL = process.env.REACT_APP_API_BASE_URL;

const config = {
  headers: {
    "Content-Type": "application/json",
    Authorization: authHeader,
  },
};

// Login user
export const loginUser = async (email, password, firebaseToken) => {
  try {
    const response = await axios.post(
      `${baseURL}/partner/partner_login/`,
      {
        email,
        password,
        web_firebase_token: firebaseToken
      },
      config
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Check if user exists
export const checkUserExistence = async (email) => {
  try {
    const response = await axios.post(
      `${baseURL}/partner/is_user_exist/`,
      { email },
      config
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return { message: "User does not exist." };
    }
    throw error;
  }
};

export const checkUserNameForPartner = async (data) => {
  try {
    const response = await axios.post(
      `${baseURL}/partner/check_username_exist/`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};
// Create partner profile
export const createPartnerProfile = async (data) => {
  try {
    const response = await axios.post(
      `${baseURL}/partner/create_partner_profile/`,
      data,
      config
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Verify OTP
export const verifyOtp = async (data) => {
  try {
    const response = await axios.put(
      `${baseURL}/partner/verify_otp/`,
      data,
      config
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Resend OTP
export const resendOtp = async (data) => {
  try {
    const response = await axios.put(
      `${baseURL}/partner/resend_otp/`,
      data,
      config
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update partner services
export const updatePartnerServices = async (data) => {
  try {
    const response = await axios.post(
      `${baseURL}/partner/partner_service/`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Upload company data
export const uploadCompanyData = async (
  basicDetails,
  addressDetails,
  registrationTaxInfo,
  companyOverview,
  selectedFile,
  companyCertificateFile
) => {
  const { partner_session_token } = JSON.parse(
    localStorage.getItem("SignedUp-User-Profile")
  );
  let data = new FormData();
  data.append("partner_session_token", partner_session_token);
  data.append("company_name", basicDetails.companyName);
  data.append("user_name", basicDetails.user_name);
  data.append("contact_name", basicDetails.contactName);
  data.append("contact_number", basicDetails.contactNumber);
  data.append("company_website", basicDetails.websiteURL);
  data.append("license_type", registrationTaxInfo.selectedLicense.value);
  data.append("license_number", registrationTaxInfo.incorporationNumber);
  data.append("total_experience", companyOverview.yearsOfExperience);
  data.append("company_bio", companyOverview.companyDetail);
  data.append("company_logo", selectedFile); // Ensure selectedFile is a File object
  data.append("license_certificate", companyCertificateFile); // Ensure companyCertificate is a File object
  data.append("street_address", addressDetails.streetAddress);
  data.append("address_line2", addressDetails.addressLine2);
  data.append("city", addressDetails.city);
  data.append("state", addressDetails.state || ""); // Ensure state is not undefined
  data.append("country", addressDetails.countryRegion);
  data.append("postal_code", addressDetails.postalCode);
  data.append("lat", "");
  data.append("long", "");

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseURL}/partner/register_as_company/`,
    headers: {
      Authorization: authHeader,
      "Content-Type": "multipart/form-data",
    },
    data: data,
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Upload individual data
export const uploadIndividualDocuments = async (formData) => {
  const { partner_session_token } = JSON.parse(
    localStorage.getItem("SignedUp-User-Profile")
  );
  let data = new FormData();
  data.append("partner_session_token", partner_session_token);
  data.append("contact_name", formData.contactName);
  data.append("contact_number", formData.contactNumber);
  data.append("driving_license_number", formData.licenseNumber);
  data.append("front_side_photo", formData.frontLicense);
  data.append("back_side_photo", formData.backLicense);
  data.append("street_address", formData.streetAddress);
  data.append("address_line2", formData.addressLine2);
  data.append("city", formData.city);
  data.append("state", formData.state || "");
  data.append("country", formData.countryRegion);
  data.append("postal_code", formData.postalCode);
  data.append("lat", "");
  data.append("long", "");

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseURL}/partner/register_as_individual/`,
    headers: {
      Authorization: authHeader,
      "Content-Type": "multipart/form-data",
    },
    data: data,
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};
