import { checkInDate, checkOutDate, selectedRooms, price } from "./store/atoms";
import { useRecoilState } from "recoil";

const FormPage = () => {
  const [today, setToday] = useRecoilState(checkInDate);
  const [yestarday, setYestarday] = useRecoilState(checkOutDate);
  const [room, setRoom] = useRecoilState(selectedRooms);

  const [totalPrice, setTotalPrice] = useRecoilState(price);

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-semibold text-center mb-6">
        Booking Summary
      </h1>

      <div className="space-y-4">
        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Check-in and Check-out Dates */}
        <div className="flex justify-between">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700">
              Check-in
            </label>
            <input
              type="date"
              value={today}
              onChange={(e) => setToday(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700">
              Check-out
            </label>
            <input
              type="date"
              value={yestarday}
              onChange={(e) => setYestarday(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Room Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Rooms
          </label>
          <ul className="space-y-2 mt-2">
            {Object.entries(room).map(([roomName, count], i) => (
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

        {/* Total Price */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Total Price
          </label>
          <p className="text-xl font-semibold">{totalPrice} INR</p>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            style={{ backgroundColor: "#455d58" }}
            className="w-full py-3  text-white rounded-lg  focus:outline-none focus:ring-2 "
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormPage;
