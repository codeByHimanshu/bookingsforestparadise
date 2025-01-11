import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import {
  checkInDate,
  checkOutDate,
  selectedRooms,
  price,
  global_count,
} from "./store/atoms";
import { initializePayment } from "./utils/peyment";
const FormPage = () => {
  const [today, setToday] = useRecoilState(checkInDate);
  const [yestarday, setYestarday] = useRecoilState(checkOutDate);
  const [room, setRoom] = useRecoilState(selectedRooms);
  const [count] = useRecoilState(global_count); // Assuming `count` is read-only
  const [totalPrice] = useRecoilState(price);

  const [formData, setFormData] = useState({
    username: "",
    phoneNumber: "",
    email: "",
    NoOfPeople: count,
    NoOfRooms: count,
    checkInDate: today,
    checkOutDate: yestarday,
    room: room,
    totalAmount: totalPrice || "",
  });

  // Sync Recoil states with formData
  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      checkInDate: today,
      checkOutDate: yestarday,
      NoOfPeople: count,
      NoOfRooms: count,
      room: room,
      totalAmount: totalPrice || "",
    }));
  }, [today, yestarday, count, room, totalPrice]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    // Validate required fields
    if (
      !formData.username ||
      !formData.email ||
      !formData.phoneNumber ||
      !formData.NoOfPeople ||
      !formData.NoOfRooms ||
      !formData.checkInDate ||
      !formData.checkOutDate ||
      !formData.room ||
      !formData.totalAmount
    ) {
      alert("All fields are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/rooms/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log(result, "result from the form");

      if (response.ok) {
        console.log("Booking successful:", result);
      } else {
        console.error("Error response:", result);
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error(
        "Error making booking request:",
        error.message,
        error.stack
      );
    }
  };
  const handlePayNow = async () => {
    // console.log(totalAmount, "from handle paynow");
    if (!totalPrice) {
      alert("Please choose a room.");
      return;
    }

    await initializePayment(totalPrice, formData.email);
  };
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-semibold text-center mb-6">
        Booking Summary
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                No Of People
              </label>
              <input
                type="number"
                name="NoOfPeople"
                value={formData.NoOfPeople * 2}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                No Of Rooms
              </label>
              <input
                type="number"
                name="NoOfRooms"
                value={formData.NoOfRooms}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-between">
            <div className="w-1/2">
              <label className="block text-sm font-semibold text-gray-700">
                Check-in
              </label>
              <input
                type="date"
                name="checkInDate"
                value={formData.checkInDate}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-semibold text-gray-700">
                Check-out
              </label>
              <input
                type="date"
                name="checkOutDate"
                value={formData.checkOutDate}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Rooms
            </label>
            <ul className="space-y-2 mt-2">
              {Object.entries(formData.room).map(([roomName, count], i) => (
                <li
                  key={i}
                  className="flex justify-between items-center p-2 bg-gray-100 rounded-lg"
                >
                  <span>{roomName}</span>
                  <span className="font-semibold">{count}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Total Price
            </label>
            <p className="text-xl font-semibold">{formData.totalAmount} INR</p>
          </div>
          <div className="mt-6">
            <button
              type="submit"
              style={{ backgroundColor: "#455d58" }}
              onClick={() => {handlePayNow()}}
              className="w-full py-3 text-white rounded-lg focus:outline-none focus:ring-2"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormPage;
