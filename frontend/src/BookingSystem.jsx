import React, { useState, useEffect } from 'react';
import './assets/css/BookingSystem.css'
import Header from './components/Header';

const RoomAvailabilityCheck = () => {
  const today = new Date().toISOString().split("T")[0];
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [message, setMessage] = useState("");
  const [showCards, setShowCards] = useState(false);

  const [bookingDetails, setBookingDetails] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      const response = await fetch("http://localhost:5000/api/rooms");
      const data = await response.json();
      setRoomData(data);
    };
    fetchRooms();
  }, []);
  
  // Dummy room data
  // const roomData = [
  //   {
  //     id: 1,
  //     name: "Deluxe Room",
  //     price: 2000,
  //     image: "https://media.istockphoto.com/id/185083188/photo/luxury-shangri-la-hotel-room.jpg?s=1024x1024&w=is&k=20&c=c07mcS7zJ9-cPEjRS4JE-qGPymHSAoU-DNBsa8wmA8E=",
  //     available: true,
  //   },
  //   {
  //     id: 2,
  //     name: "Super Deluxe Room",
  //     price: 3000,
  //     image: "https://plus.unsplash.com/premium_photo-1675615667752-2ccda7042e7e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //     available: true,
  //   },
  //   {
  //     id: 3,
  //     name: "Family Suite",
  //     price: 5000,
  //     image: "https://media.istockphoto.com/id/92397207/photo/luxurious-hotel-room.jpg?s=1024x1024&w=is&k=20&c=qMqw3EZ_fac46TBvtgqov_W9Bz8IhcGRoDmLNTOlNbg=",
  //     available: true,
  //   },
  // ];

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
      setShowCards(true); // Show cards
      setMessage("");
    } else {
      setMessage("No rooms available for the selected dates.");
    }
  };

  const goBack = () => {
    // Reset all states and show the form again
    setCheckInDate("");
    setCheckOutDate("");
    setAdults(1);
    setChildren(0);
    setRooms(1);
    setMessage("");
    setShowCards(false);
  };

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
        {/* <h2>Room Availability Check</h2> */}
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
              <label htmlFor="adults">Adults(max 30):</label>
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
              <label htmlFor="children">Children(max 10):</label>
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
              <label htmlFor="rooms"> Rooms(max 10):</label>
              <select
                id="rooms"
                value={rooms}
                onChange={(e) => setRooms(e.target.value)}
              >
                <option value="1">1 Room</option>
                <option value="2">2 Rooms</option>
                <option value="3">3 Rooms</option>
                <option value="4">4 Rooms</option>
                <option value="5">5 Rooms</option>
                <option value="6">6 Rooms</option>
                <option value="7">7 Rooms</option>
                <option value="8">8 Rooms</option>
                <option value="9">9 Rooms</option>
                <option value="10">10 Rooms</option>
              </select>
            <button className='cAvail'
              type="button"
              onClick={checkAvailability}
              disabled={!checkInDate || !checkOutDate}
            >
              Check Availability
            </button>
            </div>
          </form>
          {message && <p className="availability-message">{message}</p>}
        </>
      ) : (
        <>
          <button className="go-back" onClick={goBack}>
            Go Back
          </button>
          {bookingDetails.map((room) => (
          <div className="room_page">
              <div className="room-card" key={room.id}>
              <img src={room.image} alt={room.name} className="room-image" />
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
              >
                + Add Person
              </button>
              <button
                className="add-room btn1"
                onClick={() => increaseRooms(room.id)}
              >
                + Add Room
              </button>
              <button className="pay-now btn1">Pay Now</button>
             </div>
            </div>
          </div>
          ))}
        </>
      )}
    </div>
    </>
  );
};

export default RoomAvailabilityCheck;

