import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [navColor, setNavColor] = useState('transparent'); 

  const handleScroll = () => {
    const scrollPosition = window.scrollY; 
    if (scrollPosition > 5) {
      setNavColor('blue'); 
    } else {
      setNavColor('transparent'); 
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll); 
    return () => {
      window.removeEventListener('scroll', handleScroll); 
    };
  }, []);

  return (

    <header className="hero">
      <nav  className='nav-links'>
        <div className='logo'>
          <img src="/src/assets/images/forestlogo.svg" alt="forest paradise" />
        </div>
        <ul>
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/about">about</Link> </li>
          <li><Link to="/contact">Contact</Link> </li>
          <li><Link to="/gallery">Gallery</Link></li>
          <li><Link to="/rooms">Rooms</Link></li>
          <li><button><Link to="/booking2">Book Now</Link></button></li>
        </ul>
      </nav>
    </header>
  )
}

export default Header