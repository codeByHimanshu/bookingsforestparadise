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
<<<<<<< HEAD
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
  });
  // useEffect(() => {
  //   if (Data) {
  //     if (Data) setBookingData(Data);
  //   }
  // }, [Data]);
=======
  const handlePayNow = async (totalAmount, roomId, selectedRooms) => {
    if (!totalAmount) {
      alert("Please choose a room.");
      return;
    }
    localStorage.setItem("roomId", roomId); // Save room ID
    localStorage.setItem("selectedRooms", selectedRooms); // Save selected rooms
  }
>>>>>>> 9350bd4fc26f87eef702ce414e42b24725b09159

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
<<<<<<< HEAD
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 shadow-lg rounded-lg w-96"
      >
        <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
          Edit Order Details
        </h2>
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-gray-600 font-medium mb-2"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            // value={}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-600 font-medium mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            // value={bookingdata.checkInDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="Phone Number"
            className="block text-gray-600 font-medium mb-2"
          >
            Phone Number
          </label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            // value={}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="checkindate"
            className="block text-gray-600 font-medium mb-2"
          >
            CheckInDate
          </label>
          <input
            type="date"
            id="checkinDate"
            name="checkinDate"
            // value={bookingdata.checkInDate}
            defaultValue={bookingdata.checkInDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="checkoutdate"
            className="block text-gray-600 font-medium mb-2"
          >
            CheckOutDate
          </label>
          <input
            type="Date"
            id="checkOutDate"
            name="checkOutDate"
            // value={bookingdata.checkOutDate}
            defaultValue={bookingdata.checkOutDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="NoOfAdults"
            className="block text-gray-600 font-medium mb-2"
          >
            NoOfAdults
          </label>
          <input
            type="text"
            id="NoOfAdults"
            name="NoOfAdults"
            // value={bookingdata.NoOfAdults}
            defaultValue={bookingdata.NoOfAdults}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="NoOfChildren"
            className="block text-gray-600 font-medium mb-2"
          >
            NoOfChildren
          </label>
          <input
            type="text"
            id="NoOfChildren"
            name="NoOfChildren"
            // value={bookingdata.NoOfChildren}
            defaultValue={bookingdata.NoOfChildren}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="NoOfRooms"
            className="block text-gray-600 font-medium mb-2"
          >
            NoOfRooms
          </label>
          <input
            type="text"
            id="NoOfRooms"
            name="NoOfRooms"
            // value={bookingdata.NoOfRooms}
            defaultValue={bookingdata.NoOfRooms}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="amount"
            className="block text-gray-600 font-medium mb-2"
          >
            Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={orderData.amount}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="status"
            className="block text-gray-600 font-medium mb-2"
          >
            Status
          </label>
          <input
            type="text"
            id="status"
            name="status"
            value={orderData.status}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Submit
        </button>
      </form>
    </div>
=======
    <>
   <Header />
  

      </>
>>>>>>> 9350bd4fc26f87eef702ce414e42b24725b09159
  );
};

export default AutofillForm;
