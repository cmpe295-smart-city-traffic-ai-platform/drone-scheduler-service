import React, { useEffect, useState } from 'react';
import '../App.css';
import { Button } from './Button';
import './HeroSection.css';

import { useNavigate } from 'react-router-dom';

function HeroSection() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({});

  useEffect(() => {
    const handleMessage = (event) => {
        // Process the received data
        console.log("Message received:", event.data);
        setUserData(event.data);
    };

    // Add event listener for 'message'
    window.addEventListener("message", handleMessage);

    // Cleanup listener on component unmount
    return () => {
        window.removeEventListener("message", handleMessage);
    };
}, []);

  const handleLogin = () => {
    const email = userData.email;
    const password = userData.password;
    const firstN = userData.firstN;
    const lastN = userData.lastN;
    const role = userData.role;
    const user_id = userData.user_id;

    localStorage.setItem("email", email);
    localStorage.setItem("role", role);
    localStorage.setItem("lastName", lastN);
    localStorage.setItem("firstName", firstN);
    localStorage.setItem("user_id", user_id);
    localStorage.setItem("password", password);
    // Perform any necessary login actions
    navigate('/login');
  };

  const handleRegister = () => {
    // Perform any necessary login actions
    navigate('/register');
  };

  console.log('did it work?', userData);

  return (
    <div className='hero-container'>
      <video src='/videos/video-3.mp4' autoPlay loop muted />
      <h1>Drone Service made easy</h1>
      <p>Elevate your productivity with our advanced drone service cloud technology</p>
      <div className='hero-btns'>
        <Button
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
          onClick={handleLogin}
        >
          Enter
        </Button>
        {/* <Button
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
          onClick={handleRegister}
        >
          Register
        </Button> */}
      </div>
    </div>
  );
}

export default HeroSection;
