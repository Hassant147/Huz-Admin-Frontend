import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const storedUserData = localStorage.getItem("SignedUp-User-Profile");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
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
