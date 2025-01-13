import React, { useState } from "react";
import showImg from "../assets/show.svg";
import hideImg from "../assets/hide.svg";
import { BiErrorAlt } from "react-icons/bi";
const FormInput = ({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="mb-3">
      <label
        htmlFor={name}
        className="block text-[#4B465C] font-thin text-xs mb-1"
      >
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full p-3 text-sm border rounded-md outline-none ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        />
        {type === "password" && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center px-3 bg-transparent focus:outline-none"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <img
                src={hideImg}
                alt="Hide Password"
                className="h-5 w-5 text-gray-400"
              />
            ) : (
              <img
                src={showImg}
                alt="Show Password"
                className="h-5 w-5 text-gray-400"
              />
            )}
          </button>
        )}
      </div>
      {error && (
        <div
          className={`text-red-500 flex my-3 items-center
               gap-1 ${type === "password" ? " text-sm" : "text-xs"} `}
        >
          <BiErrorAlt className="w-[3rem] md:w-[2rem] xl:w-[1.5rem]" />
          <span className="text-red-500 text-xs">{error}</span>
        </div>
      )}
    </div>
  );
};

export default FormInput;
