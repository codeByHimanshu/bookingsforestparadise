import { useState, useEffect } from "react";
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
  const [message, setMessage] = useState("");
  const [showCards, setShowCards] = useState(false);
  const [roomData, setRoomData] = useState([]); // Correct state for room data
  const [bookingDetails, setBookingDetails] = useState([]);
  const [page, setPage] = useState("start");

  const handlePayNow = async (totalAmount, roomId, selectedRooms) => {
    if (!totalAmount) {
      alert("Please choose a room.");
      return;
    }
    localStorage.setItem("roomId", roomId); // Save room ID
    localStorage.setItem("selectedRooms", selectedRooms); // Save selected rooms
    await initializePayment(totalAmount, roomId, selectedRooms); // Pass data to payment function
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
          totalAmount: totalPeople * room.price,
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

  const goBack = () => {
    setCheckInDate("");
    setCheckOutDate("");
    setAdults(1);
    setChildren(0);
    setRooms(1);
    setMessage("");
    setShowCards(false);
  };

  // Increase room logic
  const increaseRooms = (id) => {
    setBookingDetails((prevDetails) =>
      prevDetails.map((room) => ({
        ...room,
        selectedRooms: room.selectedRooms + 1,
        totalAmount: room.selectedPeople * room.price,
      }))
    );
    setRooms(rooms + 1);
  };
  // const handleBooking = async (roomId, selectedRooms) => {
  //   const roomsToUpdate = [
  //     {
  //       roomId, // Only the specific room's ID
  //       selectedRooms, // Only the specific room's selected rooms
  //     },
  //   ];  

  //   console.log("Rooms to update:", roomsToUpdate);

  //   try {
  //     const response = await fetch(
  //       "http://localhost:5000/api/rooms/update-availability",
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ roomsToUpdate }),
  //       }
  //     );

  //     if (response.ok) {
  //       alert("Booking successful! Rooms have been updated.");
  //     } else {
  //       alert("Rooms Unavailable");
  //     }
  //   } catch (error) {
  //     console.error("Error during booking:", error);
  //     alert("An error occurred during the booking process.");
  //   }
  // };

  // Add person logic
  const handleAddPerson = (id) => {
    setBookingDetails((prevDetails) =>
      prevDetails.map((room) => {
        if (room.id === id) {
          const newPeople = room.selectedPeople + 1;
          const maxCapacity = room.selectedRooms * 4;

          if (newPeople > maxCapacity) {
            alert(
              `Please increase the number of rooms! ${room.selectedRooms} room(s) can only accommodate ${maxCapacity} people.`
            );
            return room;
          }
          return {
            ...room,
            selectedPeople: newPeople,
            totalAmount: newPeople * room.price,
          };
        }
        return room;
      })
    );
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
      <div> {/* Added wrapper */}
      <div className="page next"> {/* Added wrapper */}
        <div className="inner">
          <button className="go-back" onClick={goBack}>
            Go Back
          </button>
            <div className="room_page">
              <div className="room-card">
            {bookingDetails .filter((room) => room.name === "Standard")
        .map((room) => (
              <>
                <img src={room.image} alt="Standard" className="room-image" />
                <div className="amenities">
  <h2>Standard</h2>
  <div className="amenities-grid">
    <h3><FaWifi /> Free Wifi</h3>
    <h3><BsSafe /> Safe</h3>
    <h3><IoTvSharp /> TV</h3>
    <h3><MdDesk /> Desk</h3>
    <h3><TbAirConditioning /> AC</h3>
  </div>
  <div className="button-container">
    <button className="button select-btn" onClick={() => setPage("next")}>
      Select!
    </button>
    <div className=""><h2 style={{ color: room.availableRooms === 0 ? "red" : "green" }}>Rooms Left : {room.availableRooms}</h2></div>
  </div>
</div></>
              ))}

              
              </div>
            </div>
        </div>
        <div className="inner">
            <div className="room_page">
              <div className="room-card">
                
                {bookingDetails .filter((room) => room.name === "Executive")
        .map((room) => (
          <>
          <img src={room.image} alt="Executive" className="room-image" />

              <div className="amenities">
              <h2>Executive</h2>
                <div className="amenities-grid">
                <h3><FaWifi /> Free Wifi </h3>
                <h3><GiSlippers /> Slippers </h3>
                <h3><GiTowel /> Towels</h3>
                <h3><BiSolidFridge /> Fridge</h3>
                <h3><IoTvSharp /> TV </h3>
                <h3><MdDesk /> Desk </h3>
                <h3><TbAirConditioning /> AC </h3>
                </div>
  <div className="button-container">
    <button className="button select-btn" onClick={() => setPage("next")}>
      Select!
    </button>
    <div className=""><h2 style={{ color: room.availableRooms === 0 ? "red" : "green" }}>Rooms Left : {room.availableRooms}</h2></div>
  </div>
</div></>
              ))}
              </div>
            </div>
        </div>
        <div className="inner">
            <div className="room_page">
              <div className="room-card">
                
                {bookingDetails .filter((room) => room.name === "Business")
        .map((room) => (
          <>
          <img src={room.image} alt="Business" className="room-image" />
              <div className="amenities">
                <h2 >Business</h2>
                <div className="amenities-grid">
                <h3><FaWifi /> Free Wifi </h3>
                <h3><GiSlippers /> Slippers </h3>
                <h3><GiTowel /> Towels</h3>
                <h3><BiSolidFridge /> Fridge</h3>
                <h3><MdOutlineCoffeeMaker /> Coffee Maker</h3>
                <h3><IoTvSharp /> TV </h3>
                <h3><MdDesk /> Desk </h3>
                <h3><TbAirConditioning /> AC </h3>
                </div>
  <div className="button-container">
    <button className="button select-btn" onClick={() => setPage("next")}>
      Select!
    </button>
    <div className=""><h2 style={{ color: room.availableRooms === 0 ? "red" : "green" }}>Rooms Left : {room.availableRooms}</h2></div>
  </div>
</div></>
              ))}
              </div>
            </div>
        </div>
        <div className="inner">
            <div className="room_page">
              <div className="room-card">

                  {bookingDetails .filter((room) => room.name === "Suite Room")
        .map((room) => (
          <>
          <img src={room.image} alt="Suit Room" className="room-image" />               
              <div className="amenities">
                  <h2 >Suite Room</h2>
                  <div className="amenities-grid">
                  <h3><FaWifi /> Free Wifi </h3>
                <h3><GiSlippers /> Slippers </h3>
                <h3><GiTowel /> Towels</h3>
                <h3><BiSolidFridge /> Fridge</h3>
                <h3><MdLocalBar /> Mini Bar</h3>
                <h3><MdOutlineCoffeeMaker /> Coffee Maker</h3>
                <h3><IoTvSharp /> TV </h3>
                <h3><MdDesk /> Desk </h3>
                <h3><TbAirConditioning /> AC </h3>
                </div>
  <div className="button-container">
    <button className="button select-btn" onClick={() => setPage("next")}>
      Select!
    </button>
    <div className=""><h2 style={{ color: room.availableRooms === 0 ? "red" : "green" }}>Rooms Left : {room.availableRooms}</h2></div>
  </div>
</div></>
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
      <div className="page next"> {/* Added wrapper */}
        <div className="inner">
        <button className="button" onClick={() => setPage("start")}>
            Back
          </button>
          {bookingDetails.map((room) => (
            <div className="room_page" key={room.id}>
              <div className="room-card">
                <img src={room.image} alt={room.name} className="room-image" />
                <h3>{room.availableRooms} - Rooms Available</h3>
                <div>
                  <h3>{room.name}</h3>
                  <p>Selected Adults: {adults}</p>
                  <p>Selected Children: {children}</p>
                  <p>People to Book: {room.selectedPeople}</p>
                  <p>Selected Rooms: {room.selectedRooms}</p>
                  <p>Total Amount: ₹{room.totalAmount}</p>
                  <button
                    className="add-person btn1"
                    onClick={() => handleAddPerson(room.id)}
                    disabled={room.availableRooms === 0}
                  >
                    + Add Person
                  </button>
                  <button
                    className="add-room btn1"
                    onClick={() => increaseRooms(room.id)}
                  >
                    + Add Room
                  </button>
                  <button
                    className={`btn1 ${
                      room.selectedRooms === 0 ? "disabled" : ""
                    }`}
                    onClick={() =>
                      handlePayNow(room.totalAmount, room.id, room.availableRooms)
                    }
                    disabled={room.availableRooms === 0}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button className="button" onClick={() => setPage("start")}>
            Back
          </button>
        </div>
      </div>
    </CSSTransition>
  )}
</TransitionGroup>

          </>
        )}
      </div>
    </>
  );
};

export default RoomAvailabilityCheck;
