import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./components/Header";
import { initializePayment } from "./utils/peyment";


const AutofillForm = ({Data  }) => {
  console.log(Data);
  const [orderData, setOrderData] = useState({
    amount: 0,
    status: "",
  });
  const [bookingdata, setBookingData] = useState({
    checkInDate: new Date(),
    checkOutDate: new Date(),
    NoOfAdults: 0,
    NoOfChildren: 0,
    NoOfRooms: 0,
  });
  const handlePayNow = async (totalAmount, roomId, selectedRooms) => {
    if (!totalAmount) {
      alert("Please choose a room.");
      return;
    }
    localStorage.setItem("roomId", roomId); // Save room ID
    localStorage.setItem("selectedRooms", selectedRooms); // Save selected rooms
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/order-detail");
        setOrderData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/booking-detail"
        );
        setBookingData(response.data);
      } catch (error) {
        console.log("error while fetching the data");
      }
    };
    fetchData();
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderData({ ...orderData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", orderData);
  };

  return (
    <>
   <Header />
  

      </>
  );
};

export default AutofillForm;
