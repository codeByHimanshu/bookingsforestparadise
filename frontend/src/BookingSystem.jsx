import { useState, useEffect } from "react";
import { Await, useNavigate } from "react-router-dom";
import "./assets/css/BookingSystem.css";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Header from "./components/Header";
import { initializePayment } from "./utils/peyment";
import { MdOutlineCoffeeMaker } from "react-icons/md";
import { BsSafe } from "react-icons/bs";
import { GiTowel } from "react-icons/gi";
import { BiSolidFridge } from "react-icons/bi";
import { MdLocalBar } from "react-icons/md";
import { FaWifi } from "react-icons/fa";
import { IoTvSharp } from "react-icons/io5";
import { GiSlippers } from "react-icons/gi";
import { TbAirConditioning } from "react-icons/tb";
import { MdDesk } from "react-icons/md";
const RoomAvailabilityCheck = () => {
  const today = new Date().toISOString().split("T")[0];
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [message, setMessage] = useState("");
  const [showCards, setShowCards] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [roomData, setRoomData] = useState([]); // Correct state for room data
  const [bookingDetails, setBookingDetails] = useState([]);
  const [page, setPage] = useState("start");
  const [selectedRoomData, setSelectedRoomData] = useState([]);
  const [paymentpage, setPaymentPage] = useState("start");
  const [showPaymentPage, setshowPaymentPage] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    phoneNumber: "",
    email: "",
    checkInDate: checkInDate,
    checkOutDate: checkOutDate,
    adults: adults,
    children: children,
    rooms: rooms,
    totalAmount: selectedRoomData.totalAmount || "",
  });

  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
      adults: adults,
      children: children,
      rooms: rooms,
      totalAmount: selectedRoomData.totalAmount || "",
    }));
  }, [checkInDate, checkOutDate, adults, children, rooms, selectedRoomData]);

  const navigate = useNavigate();

 
  const bookingformclick = () => {
    setShowForm(!showForm);
    setShowCards(!showCards);
    setshowPaymentPage(false);
  };
  const Paymentformclick = () => {
    setshowPaymentPage(!showPaymentPage);
    setShowForm(!showForm);
  };
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/rooms");
        const data = await response.json();
        setRoomData(data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchRooms();
  }, []);

  // Check availability logic
  const checkAvailability = () => {
    const totalPeople = parseInt(adults) + parseInt(children);
    const maxCapacity = rooms * 4;

    if (totalPeople > maxCapacity) {
      setMessage(
        `Maximum capacity exceeded! ${rooms} room(s) can only accommodate ${maxCapacity} people.`
      );
      return;
    }

    const availableRooms = roomData.filter((room) => room.available);
    if (availableRooms.length > 0) {
      setBookingDetails(
        availableRooms.map((room) => ({
          ...room,
          selectedPeople: totalPeople,
          selectedRooms: rooms,
          totalAmount: rooms * room.price,
        }))
      );
      setShowCards(true);
      setMessage("");
    } else {
      setMessage(
        "Oops! Something went wrong. We're sorry, but there seems to be an issue. Please try again later or contact support if the problem persists"
      );
    }
  };

  const handleSelectRoom = (room) => {
    setSelectedRoomId(room.id);
    setSelectedRoom(room); // Set the selected room details here
    setPage("next");
  };
  const goBack = () => {
    setCheckInDate("");
    setCheckOutDate("");
    setAdults(1);
    setChildren(0);
    setRooms(1);
    setMessage("");
    setShowCards(false);
  };

  const bookNow = async (name) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/rooms/room-type?name=${encodeURIComponent(
          name
        )}`
      );
      const data = await response.json();
      if (data.error) {
        console.error(data.error);
      } else {
        const roomCount = parseInt(rooms) || 0;
        const roomPrice = parseFloat(data.rooms[0].price) || 0;
        setSelectedRoomData({
          ...data,
          totalAmount: roomCount * roomPrice,
        });
      }
    } catch (error) {
      console.error("Error fetching room data:", error);
    }
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();
    if (
      !formData.username ||
      !formData.email ||
      !formData.phoneNumber ||
      !formData.checkInDate ||
      !formData.checkOutDate ||
      !formData.adults ||
      !formData.rooms ||
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
      if (response.ok) {
        console.log("Booking response:", result);
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
  const handlePayNow = async (totalAmount) => {
    console.log(totalAmount , "from handle paynow")
    if (!totalAmount) {
      alert("Please choose a room.");
      return;
    }
  
    await initializePayment(totalAmount,formData.email); 
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <>
      <Header />
      <div className="room-check-form">
        {!showCards ? (
          <>
            <form>
              <div className="form-group">
                <label htmlFor="checkInDate">Check-In Date:</label>
                <input
                  type="date"
                  id="checkInDate"
                  value={checkInDate}
                  min={today}
                  onChange={(e) => setCheckInDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="checkOutDate">Check-Out Date:</label>
                <input
                  type="date"
                  id="checkOutDate"
                  value={checkOutDate}
                  min={checkInDate || today}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="adults">Adults (max 30):</label>
                <input
                  type="number"
                  id="adults"
                  value={adults}
                  min="1"
                  max="30"
                  onChange={(e) => setAdults(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="children">Children (max 10):</label>
                <input
                  type="number"
                  id="children"
                  value={children}
                  min="0"
                  max="10"
                  onChange={(e) => setChildren(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="rooms">Rooms (max 10):</label>
                <select
                  id="rooms"
                  value={rooms}
                  onChange={(e) => setRooms(e.target.value)}
                >
                  {[...Array(10).keys()].map((i) => (
                    <option key={i} value={i + 1}>
                      {i + 1} Room{i + 1 > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className="cAvail"
                type="button"
                onClick={checkAvailability}
                disabled={!checkInDate || !checkOutDate}
              >
                Check Availability
              </button>
            </form>
            {message && <p className="availability-message">{message}</p>}
          </>
        ) : (
          <>
            <TransitionGroup>
              {page === "start" && (
                <CSSTransition key="start" classNames="page" timeout={300}>
                  <div>
                    {" "}
                    <div className="page next">
                      {" "}
                      <div className="inner">
                        <button className="go-back" onClick={goBack}>
                          Go Back
                        </button>
                        <div className="room_page">
                          <div className="room-card">
                            {bookingDetails
                              .filter((room) => room.name === "Standard")
                              .map((room) => (
                                <>
                                  <img
                                    src={room.image}
                                    alt="Standard"
                                    className="room-image"
                                  />
                                  <div className="amenities">
                                    <h2>Standard</h2>
                                    <div className="amenities-grid">
                                      <h3>
                                        <FaWifi /> Free Wifi
                                      </h3>
                                      <h3>
                                        <BsSafe /> Safe
                                      </h3>
                                      <h3>
                                        <IoTvSharp /> TV
                                      </h3>
                                      <h3>
                                        <MdDesk /> Desk
                                      </h3>
                                      <h3>
                                        <TbAirConditioning /> AC
                                      </h3>
                                    </div>
                                    <div className="button-container">
                                      <button
                                        className="button select-btn"
                                        onClick={() => {
                                          setSelectedRoomId(room.id);
                                          setPage("next");
                                        }}
                                      >
                                        Select
                                      </button>
                                      <div className="">
                                        <h2
                                          style={{
                                            color:
                                              room.availableRooms === 0
                                                ? "red"
                                                : "green",
                                          }}
                                        >
                                          Rooms Left : {room.availableRooms}
                                        </h2>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              ))}
                          </div>
                        </div>
                      </div>
                      <div className="inner">
                        <div className="room_page">
                          <div className="room-card">
                            {bookingDetails
                              .filter((room) => room.name === "Executive")
                              .map((room) => (
                                <>
                                  <img
                                    src={room.image}
                                    alt="Executive"
                                    className="room-image"
                                  />

                                  <div className="amenities">
                                    <h2>Executive</h2>
                                    <div className="amenities-grid">
                                      <h3>
                                        <FaWifi /> Free Wifi{" "}
                                      </h3>
                                      <h3>
                                        <GiSlippers /> Slippers{" "}
                                      </h3>
                                      <h3>
                                        <GiTowel /> Towels
                                      </h3>
                                      <h3>
                                        <BiSolidFridge /> Fridge
                                      </h3>
                                      <h3>
                                        <IoTvSharp /> TV{" "}
                                      </h3>
                                      <h3>
                                        <MdDesk /> Desk{" "}
                                      </h3>
                                      <h3>
                                        <TbAirConditioning /> AC{" "}
                                      </h3>
                                    </div>
                                    <div className="button-container">
                                      <button
                                        className="button select-btn"
                                        onClick={() => {
                                          setSelectedRoomId(room.id);
                                          setPage("next");
                                        }}
                                      >
                                        Select
                                      </button>
                                      <div className="">
                                        <h2
                                          style={{
                                            color:
                                              room.availableRooms === 0
                                                ? "red"
                                                : "green",
                                          }}
                                        >
                                          Rooms Left : {room.availableRooms}
                                        </h2>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              ))}
                          </div>
                        </div>
                      </div>
                      <div className="inner">
                        <div className="room_page">
                          <div className="room-card">
                            {bookingDetails
                              .filter((room) => room.name === "Business")
                              .map((room) => (
                                <>
                                  <img
                                    src={room.image}
                                    alt="Business"
                                    className="room-image"
                                  />
                                  <div className="amenities">
                                    <h2>Business</h2>
                                    <div className="amenities-grid">
                                      <h3>
                                        <FaWifi /> Free Wifi{" "}
                                      </h3>
                                      <h3>
                                        <GiSlippers /> Slippers{" "}
                                      </h3>
                                      <h3>
                                        <GiTowel /> Towels
                                      </h3>
                                      <h3>
                                        <BiSolidFridge /> Fridge
                                      </h3>
                                      <h3>
                                        <MdOutlineCoffeeMaker /> Coffee Maker
                                      </h3>
                                      <h3>
                                        <IoTvSharp /> TV{" "}
                                      </h3>
                                      <h3>
                                        <MdDesk /> Desk{" "}
                                      </h3>
                                      <h3>
                                        <TbAirConditioning /> AC{" "}
                                      </h3>
                                    </div>
                                    <div className="button-container">
                                      <button
                                        className="button select-btn"
                                        onClick={() => {
                                          setSelectedRoomId(room.id);
                                          setPage("next");
                                        }}
                                      >
                                        Select
                                      </button>
                                      <div className="">
                                        <h2
                                          style={{
                                            color:
                                              room.availableRooms === 0
                                                ? "red"
                                                : "green",
                                          }}
                                        >
                                          Rooms Left : {room.availableRooms}
                                        </h2>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              ))}
                          </div>
                        </div>
                      </div>
                      <div className="inner">
                        <div className="room_page">
                          <div className="room-card">
                            {bookingDetails
                              .filter((room) => room.name === "Suite Room")
                              .map((room) => (
                                <>
                                  <img
                                    src={room.image}
                                    alt="Suit Room"
                                    className="room-image"
                                  />
                                  <div className="amenities">
                                    <h2>Suite Room</h2>
                                    <div className="amenities-grid">
                                      <h3>
                                        <FaWifi /> Free Wifi{" "}
                                      </h3>
                                      <h3>
                                        <GiSlippers /> Slippers{" "}
                                      </h3>
                                      <h3>
                                        <GiTowel /> Towels
                                      </h3>
                                      <h3>
                                        <BiSolidFridge /> Fridge
                                      </h3>
                                      <h3>
                                        <MdLocalBar /> Mini Bar
                                      </h3>
                                      <h3>
                                        <MdOutlineCoffeeMaker /> Coffee Maker
                                      </h3>
                                      <h3>
                                        <IoTvSharp /> TV{" "}
                                      </h3>
                                      <h3>
                                        <MdDesk /> Desk{" "}
                                      </h3>
                                      <h3>
                                        <TbAirConditioning /> AC{" "}
                                      </h3>
                                    </div>
                                    <div className="button-container">
                                      <button
                                        className="button select-btn"
                                        onClick={() => {
                                          setSelectedRoomId(room.id);
                                          setPage("next");
                                        }}
                                      >
                                        Select
                                      </button>
                                      <div className="">
                                        <h2
                                          style={{
                                            color:
                                              room.availableRooms === 0
                                                ? "red"
                                                : "green",
                                          }}
                                        >
                                          Rooms Left : {room.availableRooms}
                                        </h2>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CSSTransition>
              )}
              {page === "next" && (
                <CSSTransition key="next" classNames="page" timeout={300}>
                  <div className="page next">
                    <div className="inner">
                      <button
                        className="button"
                        onClick={() => setPage("start")}
                      >
                        Back
                      </button>
                      {bookingDetails
                        .filter((room) => room.id === selectedRoomId)
                        .map((room) => (
                          <div className="room_page" key={room.id}>
                            <div className="room-card">
                              <img
                                src={room.image}
                                alt={room.name}
                                className="room-image"
                              />
                              <div className="amenities">
                                <h2>{room.name}</h2>
                                <p>Selected Adults: {adults}</p>
                                <p>Selected Children: {children}</p>
                                <p>People to Book: {room.selectedPeople}</p>
                                <p>Selected Rooms: {room.selectedRooms}</p>
                                <p>Total Amount: ₹{room.totalAmount}</p>
                                <br />

                                <button
                                  className={`btn1 ${
                                    room.availableRooms === 0 ? "disabled" : ""
                                  }`}
                                  onClick={() => {
                                    bookNow(room.name); 
                                    bookingformclick(); 
                                  }}
                                  disabled={room.availableRooms === 0}
                                >
                                  Book Now
                                </button>

                                <div className="button-container">
                                  <div style={{ marginTop: "20px" }}>
                                    <h2
                                      style={{
                                        color:
                                          room.availableRooms === 0
                                            ? "red"
                                            : "green",
                                      }}
                                    >
                                      Rooms Left: {room.availableRooms}
                                    </h2>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </CSSTransition>
              )}
            </TransitionGroup>
          </>
        )}
      </div>
      {showForm && selectedRoomData && (
        <div className="page next">
          <div className="inner">
            <div className="flex justify-center items-center h-screen bg-gray-100">
              <form
                // onSubmit={handleSubmit}
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
                    value={formData.username}
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
                    value={formData.email}
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
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="checkinDate"
                    className="block text-gray-600 font-medium mb-2"
                  >
                    CheckInDate
                  </label>
                  <input
                    type="date"
                    id="checkinDate"
                    name="checkinDate"
                    value={formData.checkInDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="checkoutDate"
                    className="block text-gray-600 font-medium mb-2"
                  >
                    CheckOutDate
                  </label>
                  <input
                    type="date"
                    id="checkOutDate"
                    name="checkOutDate"
                    value={formData.checkOutDate}
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
                    name="adults"
                    value={formData.adults}
                    onChange={handleChange}
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
                    name="children"
                    value={formData.children}
                    onChange={handleChange}
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
                    name="rooms"
                    value={formData.rooms}
                    onChange={handleChange}
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
                    name="totalAmount"
                    value={formData.totalAmount}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
                  onClick={() => {
                    handleSubmit();
                    Paymentformclick();
                    setPaymentPage("payment");
                  }}
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* minions worrking */}
      {showPaymentPage && (
        <>
          {paymentpage === "payment" && (
            <CSSTransition key="payment" classNames="page" timeout={300}>
              <div className="page payment">
                <div className="inner">
                  <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto mt-10">
                    <div className="text-center mb-6">
                      <h1 className="text-2xl font-bold text-green-600">
                        🎉 Booking Successful!
                      </h1>
                      <p className="text-gray-700 mt-2">
                        Thank you for choosing us! Please select your payment
                        method below.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <button
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
                        onClick={()=>handlePayNow(selectedRoomData.totalAmount)}
                      >
                        Pay Now
                      </button>
                      <button className="w-full bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600">
                        Pay at Hotel
                      </button>
                      
                    </div>
                  </div>
                </div>
              </div>
            </CSSTransition>
          )}
        </>
      )}
    </>
  );
};

export default RoomAvailabilityCheck;
