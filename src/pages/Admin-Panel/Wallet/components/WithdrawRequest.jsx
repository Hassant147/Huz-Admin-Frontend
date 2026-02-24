import React, { useContext, useEffect, useState } from "react";
import Select from "react-select";
import { BiErrorAlt } from "react-icons/bi";
import { addWithdrawRequest } from "../../../../utility/Api";
import { ToggleBankAccount } from "../context";
const WithdrawRequest = () => {
  const { bankAccounts } = useContext(ToggleBankAccount); // Access bank accounts from context

  const [formData, setFormData] = useState({
    bank_name: "",
    withdraw_amount: "",
  });
  const [errors, setErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  useEffect(() => {
    if (bankAccounts.length > 0) {
      // Check if the current selected bank_name is still in the updated bankAccounts
      const selectedBank = bankAccounts.find(
        (bank) => bank.bank_name === formData.bank_name
      );
      if (!selectedBank) {
        // If the selected bank is not found in the updated bankAccounts, set it to the first available bank
        setFormData((prev) => ({
          ...prev,
          bank_name: bankAccounts[0].bank_name,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        bank_name: "",
      }));
    }
  }, [bankAccounts]);
  const handleValidation = () => {
    const newErrors = {};
    if (!formData.bank_name) {
      newErrors.bank_name = "Bank Name is required";
    }
    if (!formData.withdraw_amount) {
      newErrors.withdraw_amount = "Amount is required";
    } else if (parseFloat(formData.withdraw_amount) <= 0) {
      // Check if amount is less than or equal to 0
      newErrors.withdraw_amount = "Amount must be greater than 0"; // Set error message accordingly
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!handleValidation()) {
      return;
    }
    setSubmitLoading(true);
    try {
      const account_id = localStorage.getItem("account_id");
      const { partner_session_token } = JSON.parse(
        localStorage.getItem("SignedUp-User-Profile")
      );
      const newAccount = await addWithdrawRequest(
        partner_session_token,
        account_id,
        parseFloat(formData.withdraw_amount)
      );
      setFormData({
        bank_name: "",
        withdraw_amount: "",
      });
      setErrors({});
      alert(newAccount.data.message);
    } catch (error) {
      alert(error.response.data.message);
    }
    setSubmitLoading(false);
  };
  return (
    <>
      <div className="flex items-center justify-between px-6">
        <h1 className="text-lg py-4 text-[#4B465C] font-sans">
          Raise Withdraw Requests
        </h1>
        <a href="/withdrawhistory" className="text-[#7367F0] text-sm underline">
          View all
        </a>
      </div>
      <div className="w-full h-[10px] bg-[#F6F6F6] "></div>

      <div className="flex flex-col bg-white p-4 rounded-lg w-full max-w-md">
        <div className="mb-4">
          <label
            htmlFor="option"
            className="font-sans block text-sm mb-2 text-[#4B465C]"
          >
            Select your bank account
          </label>
          <Select
            id="bank_name"
            name="bank_name"
            value={{ label: formData.bank_name, value: formData.bank_name }}
            onChange={(selectedBank) =>
              setFormData({
                ...formData,
                bank_name: selectedBank.value,
              })
            }
            options={bankAccounts.map((bank) => ({
              value: bank.bank_name,
              label: bank.bank_name,
            }))}
            styles={{ outline: "none" }}
            className={`block w-full text-xs mt-1 bg-white rounded shadow-sm focus:outline-none ${
              errors.bank_name
                ? "border-red-500 focus:ring-red-500"
                : "border-[#B1B1B1] focus:ring-green-500"
            }`}
          />

          {errors.bank_name && (
            <div
              className="text-red-500 text-xs flex items-center
            gap-1 mt-1"
            >
              <BiErrorAlt />{" "}
              <p className="text-red-500 text-xs">{errors.bank_name}</p>
            </div>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="inputField"
            className="font-sans block text-sm text-[#4B465C] mb-2"
          >
            Enter Transaction Amount
          </label>
          <input
            type="number"
            id="inputField"
            name="withdraw_amount"
            value={formData.withdraw_amount}
            onChange={handleChange}
            className="p-2 shadow-sm w-full sm:text-xs border border-gray-100 rounded focus:border-green-600 outline-none"
            placeholder="Amount"
          />
          {errors.withdraw_amount && (
            <div
              className="text-red-500 text-xs flex items-center
            gap-1 mt-1"
            >
              <BiErrorAlt />{" "}
              <p className="text-red-500 text-xs">{errors.withdraw_amount}</p>
            </div>
          )}
        </div>
        <button
          onClick={handleSubmitForm}
          type="submit"
          className="font-poppins bg-[#00936C] w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#F2F2F2] "
        >
          SUBMIT
        </button>
      </div>
    </>
  );
};

export default WithdrawRequest;
