export const initializePayment = async (totalAmount, roomId, selectedRooms, checkInDate, checkOutDate, adults, children, username, email, phoneNumber) => {
  try {
    const response = await fetch("http://localhost:5000/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: totalAmount,
        currency: "INR",
        receipt: "receipt#1",
        notes: {},
        contact: phoneNumber,
        method: "card",
        email,
        vpa: ""
      }),
    });

    const order = await response.json();
    if (order.error) {
      alert("Error: " + order.error);
      return {
        success: false,
        error: order.error,
      };
    }

    const options = {
      key: "rzp_test_ocuXD6Q9Bhb4lq",
      amount: order.amount,
      currency: order.currency,
      name: "Ratana International Hotel",
      description: "Test Transaction",
      image: "PHOTO.png",
      order_id: order.id,
      callback_url: "http://localhost:5000/payment-success",
      prefill: {
        name: username,
        email: email || "your.email@example.com",
        contact: phoneNumber || "Enter Your Phone",
      },
      theme: {
        color: "#3399cc",
      },
      handler: async function (response) {
        alert("Payment success");

        try {
          const verifyResponse = await fetch(
            "http://localhost:5000/verify-payment",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            }
          );

          const data = await verifyResponse.json();
          if (data.status === "ok") {
            // Return successful payment response
            return {
              success: true,
              paymentId: response.razorpay_payment_id,
              status: "success",
            };
          } else {
            alert("Payment verification failed");
            return {
              success: false,
              error: "Payment verification failed",
            };
          }
        } catch (error) {
          console.error("Error:", error);
          alert("Error verifying payment");
          return {
            success: false,
            error: "Error verifying payment",
          };
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error("Error initializing payment:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};