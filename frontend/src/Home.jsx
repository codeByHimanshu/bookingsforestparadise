import React from 'react';
import './App.css';
import {BrowserRouter,Router,Route, Routes} from "react-router-dom"
import About from './About.jsx';
import Contact from './Contact.jsx';
import Header from './components/header.jsx';
import Footer from './components/footer.jsx'; 
import RoomQualities from './components/RoomQualities.jsx';

// Dummy data for the hotel
const hotelData = {
  name: "Forest Paradise Resort",
  home: "Experience the Best of Nature and Luxury",
  
  description:
    "Nestled in the serene beauty of Ramnagar, Uttarakhand, near Jim Corbett National Park, Welcome to Forest Paradise Resort, your serene escape nestled amidst the lush greenery of Ramnagar, Uttarakhand, near the majestic Jim Corbett National Park. Discover a harmonious blend of luxury and nature as you unwind in our tranquil haven, surrounded by breathtaking landscapes, the soothing sounds of the forest, and the vibrant charm of wildlife",


  rooms: 50,
  location: "Ramnagar, Uttarakhand",
  services: ["Free WiFi", "Pool", "Restaurant", "24/7 Room Service", "Spa"],
  contact: {
    email: "info@forestparadiseresort.com",
    phone: "+91 123 456 7890",
  },
};

const Home = () => {
  return (
    <>
     <Header/>
    <div className="App">
   

      {/* Hotel Description */}
      <section className="description">
       <center>
       <h2>Welcome to {hotelData.name}</h2>
       <p>{hotelData.description}</p>
       </center>
      </section>

      <section>
      <div className="hotel-description">
  
      <div className="desc">
        <p>
          Nestled amidst the lush greenery of Ramnagar, Uttarakhand, Forest Paradise
          Resort offers a tranquil escape near the iconic Jim Corbett National Park.
          Immerse yourself in nature's beauty while enjoying luxurious accommodations
          and unmatched hospitality. Whether you're seeking adventure or relaxation,
          your perfect getaway starts here.
        </p>
      </div>
          <div className="image-container">
        <img
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGhvdGVsfGVufDB8fDB8fHww" // Replace with your hotel image URL
          alt="Hotel View"
          className="animated-image"
        />
      </div>
    </div>
  
      </section>
<section>
    <RoomQualities/>
</section>
   
      <section className="contact">
        <h2>Contact Us</h2>
        <p>Email: <a href={`mailto:${hotelData.contact.email}`}>{hotelData.contact.email}</a></p>
        <p>Phone: <a href={`tel:${hotelData.contact.phone}`}>{hotelData.contact.phone}</a></p>
      </section>

      {/* Footer */}
      <Footer />
    </div>
    </>
  );
}

export default Home;
