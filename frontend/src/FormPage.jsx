import { checkInDate, checkOutDate, selectedRooms, price } from "./store/atoms";
import { useRecoilState } from "recoil";

const FormPage = () => {
  const [today, setToday] = useRecoilState(checkInDate);
  const [yestarday, setYestarday] = useRecoilState(checkOutDate);
  const [room, setRoom] = useRecoilState(selectedRooms);

  const [totalPrice, setTotalPrice] = useRecoilState(price);

  return (
    <div className="flex flex-row">
      <div className="item1">
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
          <h1 className="text-3xl font-semibold text-center mb-6">
            Booking Details
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
          <div class="max-w-4xl mx-auto p-6 bg-white border rounded-lg shadow-md">
            <h2 class="text-2xl font-semibold text-center mb-6">
              Hotel Policy & Booking Conditions
            </h2>

            <div class="mb-8">
              <h3 class="text-xl font-semibold mb-4">Hotel Policy</h3>
              <p class="mb-2">
                To ensure a pleasant and comfortable stay for all guests, Hotel
                Ratana International has established the following policies. By
                confirming your booking, you agree to comply with these
                guidelines.
              </p>

              <div class="mb-4">
                <h4 class="text-lg font-semibold">1. Check-In & Check-Out:</h4>
                <p>
                  <strong>Check-In Time:</strong> 2:00 PM
                </p>
                <p>
                  <strong>Check-Out Time:</strong> 12:00 PM (noon)
                </p>
                <p>
                  <strong>Early Check-In:</strong> Subject to availability and
                  may incur an additional charge.
                </p>
                <p>
                  <strong>Late Check-Out:</strong> Subject to availability and
                  may incur an additional charge.
                </p>
                <p>
                  Guests who wish to request early check-in or late check-out
                  should inform the hotel in advance to check availability.
                </p>
              </div>

              <div class="mb-4">
                <h4 class="text-lg font-semibold">2. Reservation & Payment:</h4>
                <p>
                  <strong>Reservation Confirmation:</strong> A valid reservation
                  confirmation (e.g., booking reference number or email) is
                  required at check-in.
                </p>
                <p>
                  <strong>Payment Method:</strong> Payment can be made via
                  credit card, debit card, or cash at check-in. A valid credit
                  card is required at the time of booking for guarantee
                  purposes.
                </p>
                <p>
                  <strong>Deposit:</strong> A security deposit is required upon
                  check-in. This deposit will be refunded at check-out, provided
                  there are no damages or extra charges.
                </p>
              </div>

              <p class="text-sm text-gray-600">
                For more detailed information, or if you have any questions
                about our policies, feel free to contact the front desk. We look
                forward to welcoming you to Hotel Ratana International for a
                comfortable and enjoyable stay.
              </p>
            </div>

            <div class="mb-8">
              <h3 class="text-xl font-semibold mb-4">Cancellation Policy</h3>

              <div class="mb-4">
                <h4 class="text-lg font-semibold">Standard Reservations:</h4>
                <p>
                  <strong>
                    Cancellation Requests Made 48 Hours Prior to Check-In:
                  </strong>{" "}
                  No cancellation fee will be charged. You will receive a full
                  refund of any prepayments made.
                </p>
                <p>
                  <strong>
                    Cancellation Requests Made Less Than 48 Hours Prior to
                    Check-In:
                  </strong>{" "}
                  A cancellation fee equivalent to one night's stay will be
                  charged.
                </p>
              </div>

              <div class="mb-4">
                <h4 class="text-lg font-semibold">
                  Non-Refundable Reservations:
                </h4>
                <p>
                  <strong>Prepaid and Non-Refundable Rates:</strong> These
                  reservations are not eligible for refunds. Any cancellation or
                  modification will result in the full charge of the reservation
                  amount.
                </p>
              </div>

              <div class="mb-4">
                <h4 class="text-lg font-semibold">
                  Group Reservations (10 rooms or more):
                </h4>
                <p>
                  <strong>
                    Cancellation Requests Made 14 Days Prior to Check-In:
                  </strong>{" "}
                  No cancellation fee will be charged. You will receive a full
                  refund of any prepayments made.
                </p>
                <p>
                  <strong>
                    Cancellation Requests Made Less Than 14 Days Prior to
                    Check-In:
                  </strong>{" "}
                  A cancellation fee equivalent to 50% of the total reservation
                  amount will be charged.
                </p>
              </div>

              <div class="mb-4">
                <h4 class="text-lg font-semibold">Special Circumstances</h4>
                <p>
                  We understand that emergencies and unforeseen circumstances
                  can arise. In cases of extreme situations such as natural
                  disasters, serious illness, or other emergencies, please
                  contact our customer service team immediately. We will review
                  these situations on a case-by-case basis and do our best to
                  accommodate your needs.
                </p>
              </div>
            </div>

            <div class="mb-8">
              <h3 class="text-xl font-semibold mb-4">Contact Information</h3>
              <p>
                For any questions or assistance regarding our Refund &
                Cancellation Policy, please contact us:
              </p>
              <p class="font-semibold">Ratana International Hotel</p>
              <p>
                <strong>Phone:</strong> +91-7897949999, +91-7084345555
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:bookings@ratanainternational.com"
                  class="text-blue-500"
                >
                  bookings@ratanainternational.com
                </a>
              </p>
            </div>

            <div class="text-center">
              <label class="inline-flex items-center text-sm">
                <input type="checkbox" class="form-checkbox text-blue-500" />
                <span class="ml-2">
                  I acknowledge and accept the Terms of Cancellation Policy &
                  Hotel Policy.
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="item2">
        <div class="max-w-md mx-auto p-6 bg-white border rounded-lg shadow-md">
          <h2 class="text-2xl font-semibold text-center mb-6">
            Your Booking Summary
          </h2>

          <div class="space-y-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-800">
                HOTEL RATANA INTERNATIONAL
              </h3>
              <p class="text-sm text-gray-600">
                Tedhi Pulia Ring Rd, Next to SBI Bank, Kalyanpur (West),
                Lucknow, Uttar Pradesh - 226022, India
              </p>
              <p class="text-sm text-gray-600">Phone: +916388278500</p>
              <p class="text-sm text-gray-600">
                Email:{" "}
                <a
                  href="mailto:bookings@ratanainternational.com"
                  class="text-blue-500"
                >
                  bookings@ratanainternational.com
                </a>
              </p>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-gray-800">
                Check-In & Check-Out
              </h4>
              <p class="text-sm text-gray-600">
                <strong>Check-In:</strong> {today}
              </p>
              <p class="text-sm text-gray-600">
                <strong>Check-Out:</strong> {yestarday}
              </p>
             
            </div>

            <div class="border-t border-gray-200 pt-4">
              <div class="flex justify-between items-center">
                <span class="text-lg font-semibold text-gray-800">
                  Total Price
                </span>
                <span class="text-xl font-bold text-gray-900">{totalPrice} ,INR</span>
              </div>
            </div>
          </div>

          <div class="mt-6 text-center">
            <button class="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormPage;
