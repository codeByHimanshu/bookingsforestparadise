import React, { useState } from "react";
// Add your CSS styles here
const Ecom = () => {
  const [selectedRooms, setSelectedRooms] = useState({});
  const rooms = [
    {
      id: "standard-cp",
      name: "Standard CP",
      capacity: "2 Adults, 1 Child",
      price: 3920,
      left: 3,
    },
    {
      id: "standard-ep",
      name: "Standard EP",
      capacity: "2 Adults, 1 Child",
      price: 3200,
      left: 3,
    },
  ];
  const handleAddRoom = (roomId) => {
    setSelectedRooms((prev) => {
      const count = prev[roomId] ? prev[roomId] + 1 : 1;
      return { ...prev, [roomId]: count };
    });
    console.log("selected rooms data ", selectedRooms)
  };
  const handleRemoveRoom = (roomId) => {
    setSelectedRooms((prev) => {
      const count = prev[roomId] ? prev[roomId] - 1 : 0;
      const updated = { ...prev, [roomId]: count };
      if (updated[roomId] === 0) delete updated[roomId];
      return updated;
    });
  };
  const getTotalPrice = () => {
    return Object.entries(selectedRooms).reduce(
      (total, [roomId, count]) => {
        const room = rooms.find((room) => room.id === roomId);
        return total + room.price * count;
      },
      0
    );
  };
  console.log("final state of the selected rooms " , selectedRooms);
  return (
    <div className="container">
      <div className="room-selection">
        {rooms.map((room) => (
          <div key={room.id} className="room-card">
            <img
              src="https://via.placeholder.com/150"
              alt={room.name}
              className="room-image"
            />
            <div className="room-details">
              <h3>{room.name}</h3>
              <p>Room Capacity: {room.capacity}</p>
              <p>Hurry! {room.left - (selectedRooms[room.id] || 0)} Rooms Left</p>
              <p>Price: ₹{room.price}</p>
              <div className="room-controls">
                <button onClick={() => handleRemoveRoom(room.id)}>-</button>
                {console.log(room.id , "room id")}
                <span>{selectedRooms[room.id] || 0}</span>
                <button onClick={() => handleAddRoom(room.id)}>+</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {Object.keys(selectedRooms).length > 0 && (
        <div className="booking-summary">
          <h3>Booking Summary</h3>
          <p>Dates: 04/01/2025 - 05/01/2025</p>
          <p>Night: 1</p>
          {Object.entries(selectedRooms).map(([roomId, count]) => {
            const room = rooms.find((room) => room.id === roomId);
            return (
              <p key={roomId}>
                {room.name}: {count} Room(s) - ₹{room.price * count}
              </p>
            );
          })}
          <p>Total: ₹{getTotalPrice()}</p>
          <button>Book</button>
        </div>
      )}
    </div>
  );
};
export default Ecom;