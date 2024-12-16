import React, { useState, useEffect } from "react";
import axios from "axios";

const AutofillForm = () => {
  const [orderData, setOrderData] = useState({
    order_id: "",
    amount: 0,
    status: "",
  });
  const [bookingdata, setBookingData] = useState({
    checkInDate: new Date(),
    checkOutDate: new Date(),
    NoOfAdults: 0,
    NoOfAdults: 0,
    NoOfChildren: 0,
    NoOfRooms: 0,
  });

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
            htmlFor="order_id"
            className="block text-gray-600 font-medium mb-2"
          >
            CheckInDate
          </label>
          <input
            type="date"
            id="checkInDate"
            name="checkInDate"
            value={bookingdata.checkInDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="amount"
            className="block text-gray-600 font-medium mb-2"
          >
            CheckOutDate
          </label>
          <input
            type="Date"
            id="checkOutDate"
            name="checkOutDate"
            value={bookingdata.checkOutDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="status"
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
            value={bookingdata.NoOfAdults}
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
            value={bookingdata.NoOfChildren}
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
            value={bookingdata.NoOfRooms}
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
  );
};

export default AutofillForm;
