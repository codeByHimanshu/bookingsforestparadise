import React from 'react';
import './App.css';
import {BrowserRouter,Router,Route, Routes} from "react-router-dom"
import About from './About.jsx';
import Contact from './Contact.jsx';
import Home from './Home.jsx';
import Gallery from './Gallery.jsx';
import Rooms from './Rooms.jsx';
import BookingSystem from './BookingSystem.jsx';
import RoomCard from './components/Roomcard.jsx';
import BookingDetailsForm from './BookingDetailsForm.jsx';

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

const App = () => {
  return (
      <BrowserRouter>
      <Routes>
        <Route path ='/' element = {<Home />} />
        <Route path ='/card' element = {<RoomCard />} />
        <Route path ='/home' element = {<Home />} />
        <Route path ='/about' element = {<About />} />
        <Route path ='/contact' element = {<Contact />} />
        <Route path ='/gallery' element = {<Gallery />} />
        <Route path ='/rooms' element = {<Rooms />} />
        <Route path ='/booking' element = {<BookingSystem />} />
        <Route path='/form' element={<BookingDetailsForm/>}/>
      </Routes>
      </BrowserRouter>  
  );
}

export default App;
