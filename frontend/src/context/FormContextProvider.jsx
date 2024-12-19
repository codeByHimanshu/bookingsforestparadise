import React, { createContext, useState } from "react";

export const FormContext = createContext();

export const FormContextProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    checkInDate: "",
    checkOutDate: "",
    NoOfAdults: 1,
    NoOfChildren: 1,
    NoOfRooms: 1,
  });

  return (
    <FormContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormContext.Provider>
  );
};
