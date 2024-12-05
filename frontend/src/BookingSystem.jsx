import { useState, useEffect } from 'react';
import './assets/css/BookingSystem.css';
import Header from './components/Header';
import { initializePayment } from './utils/peyment';

const RoomAvailabilityCheck = () => {
  const today = new Date().toISOString().split("T")[0];
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [message, setMessage] = useState("");
  const [showCards, setShowCards] = useState(false);
  const [roomData, setRoomData] = useState([]);  // Correct state for room data
  const [bookingDetails, setBookingDetails] = useState([]);

  const handlePayNow = async (totalAmount, roomId, selectedRooms) => {
    if (!totalAmount) {
        alert('Please choose a room.');
        return;
    }
    localStorage.setItem('roomId', roomId);  // Save room ID
    localStorage.setItem('selectedRooms', selectedRooms);  // Save selected rooms
    await initializePayment(totalAmount, roomId, selectedRooms);  // Pass data to payment function
};

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/rooms");
        const data = await response.json();
        setRoomData(data);  // Update roomData state
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
      setMessage("Oops! Something went wrong. We're sorry, but there seems to be an issue. Please try again later or contact support if the problem persists");
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
  const handleBooking = async (roomId, selectedRooms) => {
    const roomsToUpdate = [
      {
        roomId, // Only the specific room's ID
        selectedRooms, // Only the specific room's selected rooms
      },
    ];
  
    console.log("Rooms to update:", roomsToUpdate);
  
    try {
      const response = await fetch('http://localhost:5000/api/rooms/update-availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomsToUpdate }),
      });
  
      if (response.ok) {
        alert('Booking successful! Rooms have been updated.');
      } else {
        alert('Rooms Unavailable');
      }
    } catch (error) {
      console.error('Error during booking:', error);
      alert('An error occurred during the booking process.');
    }
  };
  

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
                  {[...Array(10).keys()].map(i => (
                    <option key={i} value={i + 1}>
                      {i + 1} Room{(i + 1) > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className='cAvail'
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
            <button className="go-back" onClick={goBack}>
              Go Back
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
                    >
                      + Add Person
                    </button>
                    <button
                      className="add-room btn1"
                      onClick={() => increaseRooms(room.id)}
                    >
                      + Add Room
                    </button>
                    <button className="pay-now btn1" onClick={() => handleBooking(room._id, room.selectedRooms)}>Pay Now</button>
                    <button onClick={() => handlePayNow(room.totalAmount, room.id, room.selectedRooms)}>
    Book Now
</button>

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
