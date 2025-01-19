// src/pages/index.js
import { useState } from "react";
import LoginSignupButtons from './LoginSignupButtons';
import Chat from '../components/chat';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const [successMessage, setSuccessMessage] = useState(""); // Track success message

  const handleLoginSuccess = () => {
    setIsLoggedIn(true); // Update login status to true when login is successful
    setSuccessMessage("Login Successful! Welcome!"); // Set success message

    // Log success message to the console
    console.log(successMessage); // This will log the success message to the console
  };

  return (
    <div>
      {/* Conditionally render login button based on login state */}
      {!isLoggedIn && <LoginSignupButtons onLoginSuccess={handleLoginSuccess} />}
      
      {/* Render chat only if logged in */}
      {isLoggedIn && <Chat />}
      
      {/* Display success message when logged in */}
      {successMessage && <p>{successMessage}</p>}
    </div>
  );
}
