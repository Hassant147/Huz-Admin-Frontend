import React, { useState } from 'react';
import { changePassword } from '../../../utility/Api';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importing the new icons
import eye from '../../../assets/eye1.svg';
import eye2 from '../../../assets/eye2.svg';
import { BiErrorAlt } from 'react-icons/bi';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[!@#$%^&*<>?a-zA-Z\d]{8,}$/;
    return regex.test(password);
  };

  const handleValidation = () => {
    const newErrors = {};
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (!validatePassword(formData.newPassword)) {
      newErrors.newPassword = 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number';
    }
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === 'newPassword' && validatePassword(value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        newPassword: '',
      }));
    } else if (name === 'confirmPassword' && formData.newPassword === value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!handleValidation()) {
      return;
    }
    setSubmitLoading(true);
    try {
      const { partner_session_token } = JSON.parse(localStorage.getItem('SignedUp-User-Profile'));
      await changePassword(partner_session_token, formData.currentPassword, formData.newPassword);
      alert('Password updated successfully!');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setErrors({});
    } catch (error) {
      alert('Failed to update password. Because your old password is not correct');
    }
    setSubmitLoading(false);
  };

  const toggleShowPassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="lg:w-[85%]">
      <form onSubmit={handleSubmit} className="mx-auto ">
        <div className="p-10 bg-white rounded-md shadow-md">
          <div className="mb-4 relative md:w-[435px]">
            <label className="block text-gray-700 text-xs font-light mb-2" htmlFor="currentPassword">
              Old password
            </label>
            <input
              type={showPassword.currentPassword ? 'text' : 'password'}
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className="p-2 outline-none border rounded-md w-full font-thin text-sm shadow-sm"
            />
            <button type="button" onClick={() => toggleShowPassword('currentPassword')} className="absolute right-2 top-1/2 transform -translate-y-1/2">
              {showPassword.currentPassword ? <img src={eye} alt="eye" className="w-[20px] h-[16px] mt-6" /> : <img src={eye2} alt="eye" className="w-[20px] h-[16px] mt-6" />}
            </button>
            {errors.currentPassword && (
              <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                <BiErrorAlt /> <p className="text-red-600 text-xs">{errors.currentPassword}</p>
              </div>
            )}
          </div>
          <div className="mb-4 relative md:w-[435px]">
            <label className="block text-gray-700 text-xs font-light mb-2" htmlFor="newPassword">
              New password
            </label>
            <input
              type={showPassword.newPassword ? 'text' : 'password'}
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className="p-2 outline-none border rounded-md w-full font-thin text-sm shadow-sm"
            />
            <button type="button" onClick={() => toggleShowPassword('newPassword')} className="absolute right-2 top-1/2 transform -translate-y-1/2">
              {showPassword.newPassword ? (
                <img src={eye} alt="eye" className={`w-[20px] h-[16px] ${errors.confirmPassword ? '-mt-3' : 'mt-6'}`} />
              ) : (
                <img src={eye2} alt="eye" className={`w-[20px] h-[16px] ${errors.confirmPassword ? '-mt-3' : 'mt-6'}`} />
              )}
            </button>
            {errors.newPassword && (
              <div className="text-red-500 text-xs flex gap-1 mt-1">
                <BiErrorAlt className="w-[3rem] mt-0.5 md:w-[2rem] xl:w-[1.5rem]" /> <p className="text-red-600 text-xs">{errors.newPassword}</p>
              </div>
            )}
          </div>
          <div className=" relative md:w-[435px]">
            <label className="block text-gray-700 text-xs font-light mb-2" htmlFor="confirmPassword">
              Re-type new password
            </label>
            <input
              type={showPassword.confirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className="p-2 outline-none border rounded-md w-full font-thin text-sm shadow-sm"
            />
            <button type="button" onClick={() => toggleShowPassword('confirmPassword')} className="absolute right-2 top-1/2 transform -translate-y-1/2">
              {showPassword.confirmPassword ? (
                <img src={eye} alt="eye" className={`w-[20px] h-[16px] ${errors.confirmPassword ? 'mt-0' : 'mt-6'}`} />
              ) : (
                <img src={eye2} alt="eye" className={`w-[20px] h-[16px] ${errors.confirmPassword ? 'mt-0' : 'mt-6'}`} />
              )}
            </button>
            {errors.confirmPassword && (
              <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                <BiErrorAlt /> <p className="text-red-600 text-xs">{errors.confirmPassword}</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#00936C] hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full"
            disabled={submitLoading}
          >
            {submitLoading && (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {submitLoading ? 'Changing Password...' : 'Change Password'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
