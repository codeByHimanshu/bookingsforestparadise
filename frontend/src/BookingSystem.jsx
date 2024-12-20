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
import AutofillForm from "./AutoFillForm";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate()

  // const handlePayNow = async (totalAmount, roomId, selectedRooms) => {
  //   if (!totalAmount) {
  //     alert("Please choose a room.");
  //     return;
  //   }
  //   localStorage.setItem("roomId", roomId); // Save room ID
  //   localStorage.setItem("selectedRooms", selectedRooms); // Save selected rooms
  //   await initializePayment(totalAmount, roomId, selectedRooms); // Pass data to payment function
  // };
  const bookingformclick = () => {
    setShowForm(!showForm);
    setShowCards(!showCards)
  }
  useEffect(() => {
    console.log("use effect is called");
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

  useEffect(() => {
    console.log("2nd useeffect is called")
    if (!name) return;

    const fetchRooms = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/rooms/room-type",
          { params:{ name:"Business"} }
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
      } catch (err) {
        console.log("there is an error on fetching the data");
      }
    };
    fetchRooms();
  }, []);

  console.log("useeffect finsihed exec");
  console.log(roomData);
  const checkAvailability = () => {
    console.log("check avalablilty is called");
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
      console.log(bookingDetails);
      for (let i = 0; i < bookingDetails.length; i++) {
        console.log(i + " " + bookingDetails[i]);
      }
      setPay[bookingDetails[2]];

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
      // Ensure roomName is passed as part of the URL correctly
      const response = await fetch(`http://localhost:5000/api/rooms/room-type?name=${encodeURIComponent(name)}`);
      const data = await response.json();
      console.log(data);
      
      console.log("Rooms:", rooms, "Price:", data.rooms[0].price,"name:",data.rooms[0].name);
      
      if (data.error) {
        console.error(data.error); // Log the error message if available
      } else {
        const roomCount = parseInt(rooms) || 0; // Fallback to 0 if rooms is undefined
        const roomPrice = parseFloat(data.rooms[0].price) || 0;
        setSelectedRoomData({
          ...data,
          totalAmount: roomCount * roomPrice,// Calculate totalAmount here based on the number of rooms
        }); // Store the fetched room data
      }
    } catch (error) {
      console.error("Error fetching room data:", error);
    }
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
                    <div className="page next">
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
                                          setSelectedRoomId(room._id);
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
                                          console.log(selectedRoomId);
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
                                <p>Check in Date :{checkInDate}</p>
                                <p>Check out Date:{checkOutDate}</p>
                                <p>Selected Adults: {adults}</p>
                                <p>Selected Children: {children}</p>
                                <p>People to Book: {room.selectedPeople}</p>
                                <p>Selected Rooms: {room.selectedRooms}</p>
                                <p>Total Amount: ₹{room.totalAmount}</p>
                                <br />
                               
                                    <button
                                      className={`btn1 ${room.availableRooms === 0 ? "disabled" : ""}`}
                                      onClick={() => {
                                        console.log(name)
                                        // console.log(selectedRoomData.name)
                                        // console.log(selectedRoom.name)
                                        bookNow(room.name); // Pass the room's name dynamically
                                        bookingformclick(); // Call your form display function
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
              {page === "last" && (
                <CSSTransition key="last" classNames="page" timeout={300}>
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
                              // onChange={handleChange}
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
                              // onChange={handleChange}
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
                              // onChange={handleChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                          </div>
                          {/* ----------------------------------------------------------------------------- */}

                          {bookingDetails
                            .filter((room) => room.id === selectedRoomId)
                            .map((room) => (
                              <div key={room.id}>
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
                                    defaultValue={room.checkInDate}
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
                                    defaultValue={room.checkOutDate}
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
                                    defaultValue={room.adults}
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
                                    defaultValue={room.children}
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
                                    defaultValue={room.rooms}
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
                                    defaultValue={room.totalAmount}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                  />
                                </div>
                              </div>
                            ))}
                          <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
                          >
                            Submit
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </CSSTransition>
              )}
            </TransitionGroup>
          </>
        )}
      </div>
      {showForm &&
        selectedRoomData &&
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
                    // onChange={handleChange}
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
                    // onChange={handleChange}
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
                    // onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                {/* ----------------------------------------------------------------------------- */}


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
                    defaultValue={checkInDate}
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
                    defaultValue={checkOutDate}
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
                    defaultValue={adults}
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
                    defaultValue={children}
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
                    defaultValue={rooms}
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
                    defaultValue={selectedRoomData.totalAmount}
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
          </div>
        </div>

      }

    </>
  );
};

export default RoomAvailabilityCheck;
