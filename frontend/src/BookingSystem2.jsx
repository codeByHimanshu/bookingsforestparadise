import { useState, useEffect } from "react";
import Header from "./components/Header";
import {
  checkInDate,
  checkOutDate,
  selectedRooms,
  price,
  global_count,
} from "./store/atoms";
import { useRecoilState } from "recoil";
import { Link } from "react-router-dom";
import { initializePayment } from "./utils/peyment";

const RoomAvailabilityCheck = () => {
  const [bookingDetails, setBookingDetails] = useState([]);
  const [roomData, setRoomData] = useState([]);
  const [showButtonClick4, setShowButtonClick4] = useState(false);
  const [date, setDate] = useRecoilState(checkInDate);
  const [selectRooms, setSelectRoom] = useRecoilState(selectedRooms);
  const [money, setMoney] = useRecoilState(price);
  const [count, setCount] = useRecoilState(global_count);
  const handleAddRoomClick4 = () => {
    setShowButtonClick4(true);
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

  // test check

  const handleAddRoom = (roomname) => {
    setSelectRoom((prev) => {
      const count = prev[roomname] ? prev[roomname] + 1 : 1;
      return { ...prev, [roomname]: count };
    });
  };
  const handleRemoveRoom = (roomname) => {
    setSelectRoom((prev) => {
      const count = prev[roomname] ? prev[roomname] - 1 : 0;
      const updated = { ...prev, [roomname]: count };
      if (updated[roomname] === 0) delete updated[roomname];
      return updated;
    });
  };
  const getTotalPrice = () => {
    return Object.entries(selectRooms).reduce((total, [roomId, count]) => {
      const room = roomData.find((room) => room.name === roomId);
      return total + room.price * count;
    }, 0);
  };
  setMoney(getTotalPrice());
  useEffect(() => {
    setCount(Object.values(selectRooms).reduce((sum, num) => sum + num, 0));
  }, [selectRooms]);

  return (
    <>
      <Header />
      <div>
        <div className="room-check-form w-3/4">
          <center>
            <form>
              <div className="form-group">
                <label htmlFor="checkInDate">Check-In Date</label>
                <input type="date" id="checkInDate" defaultValue={date}></input>
              </div>
              <div className="form-group">
                <label htmlFor="checkOutDate">Check-Out Date</label>
                <input
                  type="date"
                  id="checkOutDate"
                  defaultValue={date}
                ></input>
              </div>
              <div className="">
                <button
                  style={{ backgroundColor: "#455d58", color: "#ffffff" }}
                  className="cAvail p-4 rounded-2xl font-semibold"
                  type="button"
                >
                  Check Availability
                </button>
              </div>
            </form>
          </center>
        </div>
      </div>
      <div className="second-section flex ">
        <div className="flex-col w-full">
          <div className="col-span-1">
            <section>
              {roomData.map((room) => (
                <div className="flex" key={room.id}>
                  <div className="image wala div w-1/3">
                    <div
                      className="m-4 p-4 border-2 border-gray-300 rounded-xl"
                      style={{ backgroundColor: "#ffffff" }}
                    >
                      <img src={room.image} />
                    </div>
                  </div>

                  <div class="flex w-2/3 ">
                    <div
                      className="m-4 p-4 border-2 border-gray-300 rounded-xl w-2/3"
                      style={{ backgroundColor: "#ffffff" }}
                    >
                      <div className="bg-white">
                        <h1
                          className="text-2xl font-medium"
                          style={{ color: "#455d58" }}
                        >
                          {room.name}
                        </h1>
                        <div className="mt-5 flex justify-between  ">
                          <div className="firstpart">
                            <div>
                              <h1 className="text-2xl"></h1>
                              <h6 className="text-2xl">some heading</h6>
                            </div>
                          </div>
                          <div className="second flex-col relative">
                            <div className="flex-row static top-0 right-">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="size-6"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                                />
                              </svg>
                            </div>
                            <div className="flex-row mt-2 static">
                              <div style={{ color: "#666666" }} className="">
                                Price for{" "}
                                <span>{selectRooms[room.name] || 0}</span> Night
                              </div>
                              <div className="list-none flex space-x-1">
                                <div style={{ color: "#666666" }}>
                                  <span>{selectRooms[room.name] || 0}</span>{" "}
                                  Adult,
                                </div>
                                <div style={{ color: "#666666" }}>
                                  <span>{selectRooms[room.name] || 0}</span>{" "}
                                  Child,
                                </div>
                                <div style={{ color: "#666666" }}>
                                  {selectRooms[room.name] || 0} Room
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="border bg-gray-100  rounded-sm flex  justify-between">
                          <div className="ml-3">
                            <div>some heading</div>
                            <div>some heading</div>
                          </div>
                          <div className="flex space-x-3 ">
                            <div className="mt-3" style={{ color: "#455d58" }}>
                              {room.availableRooms} Rooms Left
                            </div>
                            <div>
                              {showButtonClick4 ? (
                                <div className="flex space-x-2">
                                  <button
                                    className="m-2 px-2 rounded-lg"
                                    style={{
                                      backgroundColor: "#455d58",
                                      borderRadius: "8px",
                                    }}
                                    onClick={() => {
                                      handleAddRoom(room.name);
                                    }}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke-width="1.5"
                                      stroke="currentColor"
                                      class="size-6"
                                    >
                                      <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M12 4.5v15m7.5-7.5h-15"
                                      />
                                    </svg>
                                  </button>
                                  <span className="m-2 px-2 font-bold text-2xl">
                                    <span>{selectRooms[room.name] || 0}</span>
                                  </span>
                                  <button
                                    className="m-2 px-2 rounded-lg"
                                    style={{
                                      backgroundColor: "#455d58",
                                      borderRadius: "8px",
                                    }}
                                    onClick={() => {
                                      handleRemoveRoom(room.name);
                                    }}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke-width="1.5"
                                      stroke="currentColor"
                                      class="size-6"
                                    >
                                      <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M5 12h14"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              ) : (
                                <button
                                  className="p-3 font-semibold
                                  "
                                  style={{
                                    backgroundColor: "#455d58",
                                    borderRadius: "8px",
                                    color: "#ffffff",
                                  }}
                                  onClick={handleAddRoomClick4}
                                >
                                  Add Room
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          </div>
        </div>
        <div class="flex flex-initial w-1/4">
          <div
            className="m-4 p-4 border-2 border-white-300 rounded-xl "
            style={{ backgroundColor: "#ffffff" }}
          >
            <div className="bg-gray-100">
              {" "}
              <h1 className="text-2xl font-semibold">Booking Summary</h1>
            </div>
            <div className="mt-2 font-semibold " style={{ color: "#444" }}>
              Dates : <span>{date}</span> - <span>{date}</span>
            </div>
            {Object.keys(selectRooms).length > 0 && (
              <div className="mt-4">
                {Object.entries(selectRooms).map(([roomId, cnt]) => {
                  const room = roomData.find((room) => room.name === roomId);
                  // console.log(room.price, "from booking summary got clikced");
                  return (
                    <div className="" key={room.id}>
                      <div className="">
                        <div
                          className="font-semibold "
                          style={{ color: "#444" }}
                        >
                          <p>
                            {room.name} : {cnt} : {room.price}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="text-2xl" style={{ color: "" }}>
              <span
                className="font-semibold"
                style={{ color: "#455d58" }}
                id=""
              >
                Total: {money}
              </span>
            </div>
            <div>
              <Link to="/form">
                <button
                  className="font-semibold text-2xl  text-white p-3 rounded"
                  style={{ backgroundColor: "#455d58" }}
                >
                  Book Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomAvailabilityCheck;
