// src/pages/index.js
import { useState } from "react";
import LoginSignupButtons from './LoginSignupButtons';
import Chat from '../components/chat';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status

  const handleLoginSuccess = () => {
    setIsLoggedIn(true); // Update login status to true when login is successful
  };

  return (
    <div>
      {/* Conditionally render login button based on login state */}
      {!isLoggedIn && <LoginSignupButtons onLoginSuccess={handleLoginSuccess} />}
      
      {/* Render chat only if logged in */}
      {isLoggedIn && <Chat />} 
    </div>
  );
}
