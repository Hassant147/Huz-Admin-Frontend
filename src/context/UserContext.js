import React, { createContext, useState, useEffect } from "react";
import { getStoredPartnerProfile } from "../utility/partnerSession";

const defaultUserContextValue = {
  userData: {},
  updateUserProfile: () => {},
};

export const UserContext = createContext(defaultUserContextValue);

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const storedUserData = getStoredPartnerProfile();
    if (storedUserData) {
      setUserData(storedUserData);
    }
  }, []);

  const updateUserProfile = (updatedData) => {
    setUserData(updatedData);
    localStorage.setItem("SignedUp-User-Profile", JSON.stringify(updatedData));
  };

  return (
    <UserContext.Provider value={{ userData, updateUserProfile }}>
      {children}
    </UserContext.Provider>
  );
};
