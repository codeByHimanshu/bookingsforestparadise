import React, { useState, useEffect } from "react";
import axios from "axios";

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch data from the API
    const fetchRooms = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/rooms/room-type",
          { params:{ name:"Business"} }
        );
        setRooms(response.data); // Set rooms in state
      } catch (err) {
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Room List</h1>
      {rooms.length > 0 ? (
        <ul>
          {rooms.map((room) => (
            <li key={room._id}>{room.name}</li> // Adjust based on your data structure
          ))}
        </ul>
      ) : (
        <p>No rooms found.</p>
      )}
    </div>
  );
};

export default RoomList;
