import React, { createContext, useState } from "react";

export const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    order_id: "",
    amount: 0,
    status: "",
    checkInDate: "",
    checkOutDate: "",
    NoOfAdults: 0,
    NoOfChildren: 0,
    NoOfRooms: 0,
  });

  return (
    <FormContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormContext.Provider>
  );
};
