import React, { useContext, useEffect, useState } from "react";
import BankAccountImage from "../../../../assets/BankAccount.svg";
import DeleteIcon from "../../../../assets/DeleteIcon.svg";
import { ToggleBankAccount } from "../context";
import Select from "react-select";
import Loader from "../../../../components/loader";
import banks from "./banks.json";
import {
  addBankAccount,
  deleteBankAccount,
  getPartnerBankAccounts,
} from "../../../../utility/Api";
import addButton from "../../../../assets/addButton.svg";
import { BiErrorAlt } from "react-icons/bi";
const BankAccount = () => {
  const { bankAccounts, setBankAccounts } = useContext(ToggleBankAccount);

  const [formData, setFormData] = useState({
    account_title: "",
    account_number: "",
    bank_name: "",
    branch_code: "",
  });
  const [errors, setErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true); // New state for fetching loader
  // const [bankAccounts, setBankAccounts] = useState([]);
  const [open, setOpen] = useState(false);
  const [deletingAccountId, setDeletingAccountId] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    const fetchBankAccounts = async () => {
      const profile = JSON.parse(localStorage.getItem("SignedUp-User-Profile"));
      if (profile) {
        const partnerSessionToken = profile.partner_session_token;
        try {
          const AccountData = await getPartnerBankAccounts(partnerSessionToken);
          if (AccountData) {
            setBankAccounts(AccountData); // Save the fetched accounts to state
          }
        } catch (error) {
          console.error("Error fetching address data:", error);
        } finally {
          setFetchingData(false); // Stop the loader once data is fetched
        }
      } else {
        setFetchingData(false); // Stop the loader if no profile is found
      }
    };

    fetchBankAccounts();
  }, []);

  const handleValidation = () => {
    const newErrors = {};
    if (!formData.account_title) {
      newErrors.account_title = "Account Title is required";
    }
    if (!formData.account_number) {
      newErrors.account_number = "Account Number is required";
    }
    if (!formData.bank_name) {
      newErrors.bank_name = "Bank Number is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };
  const handleClick = () => {
    setOpen(!open);
  };
  const handleDeleteClick = async (account_id) => {
    try {
      setIsButtonDisabled(true);
      setDeletingAccountId(account_id);
      const { partner_session_token } = JSON.parse(
        localStorage.getItem("SignedUp-User-Profile")
      );
      await deleteBankAccount(partner_session_token, account_id);
      setBankAccounts((prevAccounts) =>
        prevAccounts.filter((account) => account.account_id !== account_id)
      );
      setErrors({});
    } catch (error) {
      alert(error.response.data.message);
    } finally {
      setIsButtonDisabled(false);
      setDeletingAccountId(null);
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!handleValidation()) {
      return;
    }
    setIsButtonDisabled(true);
    setSubmitLoading(true);
    try {
      const { partner_session_token } = JSON.parse(
        localStorage.getItem("SignedUp-User-Profile")
      );
      const newAccount = await addBankAccount(
        partner_session_token,
        formData.account_title,
        formData.account_number,
        formData.bank_name,
        formData.branch_code
      );
      localStorage.setItem("account_id", newAccount.account_id);
      if (bankAccounts.length === 1) {
        localStorage.setItem("account_id", bankAccounts[0].account_id);
      }

      setFormData({
        account_title: "",
        account_number: "",
        bank_name: "",
        branch_code: "",
      });
      setErrors({});
      setBankAccounts((prevAccounts) => [...prevAccounts, newAccount]); // Add the new account to the existing list

      setOpen(false);
    } catch (error) {
      alert(error.response.data.message);
    } finally {
      setIsButtonDisabled(false);
      setSubmitLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-lg px-6 py-4 text-[#4B465C] font-sans">
        Bank Account
      </h1>
      <div className="w-full h-[10px] bg-[#F6F6F6]"></div>
      {open ? (
        ""
      ) : (
        <div className="">
          {fetchingData ? (
            <div className="h-[350px] flex justify-center items-center">
              <Loader />
            </div>
          ) : bankAccounts.length > 0 ? (
            <div className="h-[375px] overflow-y-auto overflow-x-hidden">
              {bankAccounts.map((transaction, index) => (
                <div key={index} className="rounded-b-lg bg-white">
                  <div className="w-full max-w-md flex flex-col">
                    <div className="flex pl-6 flex-row bg-[#F6F6F6] items-center mt-2">
                      <img
                        className=" h-14 object-cover rounded-full"
                        src={
                          banks.find(
                            (bank) => bank.value === transaction.bank_name
                          ).logo
                        }
                        alt=""
                      />
                      <div className="flex flex-col p-3">
                        <p className="font-poppins font-bold text-[#00936C] text-[12px]">
                          {transaction.bank_name}
                        </p>
                        <p className="font-poppins font-bold text-[#121212] text-[11px] py-1">
                          {transaction.account_title}
                        </p>
                        <p className="font-poppins text-[#373737] text-[12px]">
                          {transaction.account_number}
                        </p>
                      </div>

                      <button
                        className="ml-auto p-8"
                        onClick={() =>
                          handleDeleteClick(transaction.account_id)
                        }
                        disabled={isButtonDisabled}
                      >
                        {deletingAccountId === transaction.account_id ? (
                          <Loader />
                        ) : (
                          <img src={DeleteIcon} alt="Icon not found" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {/* Add Account button placed here, after the map function */}
              <div className="flex justify-end mt-2">
                <div className="flex items-center text-[#00936c] p-2 text-sm gap-2">
                  <img src={addButton} alt="" className="h-4" />
                  <button onClick={handleClick}>Add Bank Account</button>
                </div>
              </div>
            </div>
          ) : open ? (
            ""
          ) : (
            <div className="p-4 rounded-lg w-full max-w-md">
              <div className="flex flex-col items-center justify-center">
                <img
                  src={BankAccountImage}
                  alt="Null icon found"
                  className="p-4"
                />
                <p className="text-sm text-[#121212] font-poppins text-center mt-2">
                  You have not added account details yet
                </p>
                <button
                  onClick={handleClick}
                  className="font-bold text-[#00936C] font-poppins"
                >
                  Add Account
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {open && (
        <form
          className="flex flex-col bg-white overflow-y-auto h-[375px] p-4 px-9 rounded-lg w-full max-w-md"
          onSubmit={handleSubmitForm}
        >
          <div className=" rounded-lg mb-2">
            <label
              htmlFor="bank_name"
              className="font-poppins block text-xs text-[#4B465C] py-1"
            >
              Select your bank name
            </label>
            <Select
              id="bank_name"
              name="bank_name"
              value={banks.find((bank) => bank.value === formData.bank)}
              onChange={(selectedBank) =>
                handleChange({
                  target: { name: "bank_name", value: selectedBank.value },
                })
              }
              options={banks}
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
            gap-1 mt-0.5"
              >
                <BiErrorAlt />{" "}
                <p className="text-red-500 text-xs">{errors.bank_name}</p>
              </div>
            )}
          </div>
          <div className="mb-2">
            <label
              htmlFor="account_number"
              className="font-poppins block text-xs text-[#4B465C] py-1"
            >
              Enter Your Account Number
            </label>
            <input
              type="text"
              id="account_number"
              name="account_number"
              value={formData.account_number}
              onChange={handleChange}
              className={`px-3 py-2 shadow-sm w-full sm:text-xs border rounded focus:border-green-600 outline-none ${
                errors.account_number && "border-red-500"
              }`}
              placeholder="Account Number"
            />
            {errors.account_number && (
              <div
                className="text-red-500 text-xs flex items-center
            gap-1 mt-0.5"
              >
                <BiErrorAlt />{" "}
                <p className="text-red-500 text-xs">{errors.account_number}</p>
              </div>
            )}
          </div>
          <div className="mb-1">
            <label
              htmlFor="account_title"
              className="font-poppins block text-xs text-[#4B465C] py-1"
            >
              Enter Your Account Title
            </label>
            <input
              type="text"
              id="account_title"
              name="account_title"
              value={formData.account_title}
              onChange={handleChange}
              className={`px-3 py-2 shadow-sm w-full sm:text-xs border rounded focus:border-green-600 outline-none ${
                errors.account_title && "border-red-500"
              }`}
              placeholder="Account Title"
            />
            {errors.account_title && (
              <div
                className="text-red-500 text-xs flex items-center
gap-1 mt-0.5"
              >
                <BiErrorAlt />{" "}
                <p className="text-red-500 text-xs">{errors.account_title}</p>
              </div>
            )}
          </div>
          <div className="mb-2">
            <label
              htmlFor="branch_code"
              className="font-poppins block text-xs text-[#4B465C] py-1"
            >
              Enter Your Branch Code
            </label>
            <input
              type="text"
              id="branch_code"
              name="branch_code"
              value={formData.branch_code}
              onChange={handleChange}
              className={`px-3 py-2 shadow-sm w-full sm:text-xs border rounded focus:border-green-600 outline-none `}
              placeholder="Branch Code"
            />
            {errors.branch_code && (
              <div
                className="text-red-500 text-xs flex items-center
            gap-1 mt-0.5"
              >
                <BiErrorAlt />{" "}
                <p className="text-red-500 text-xs">{errors.branch_code}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleSubmitForm}
            disabled={isButtonDisabled}
            type="submit"
            className="font-poppins bg-[#00936C] w-full mb-3 flex justify-center py-2 px-4 mt-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#F2F2F2]"
          >
            {submitLoading ? <Loader /> : <p> Add Account</p>}
          </button>
        </form>
      )}
    </>
  );
};

export default BankAccount;
