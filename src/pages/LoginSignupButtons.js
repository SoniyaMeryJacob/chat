// src/components/LoginSignupButtons.js
import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Login.module.css";

const LoginSignupButtons = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    // Hardcoded credentials for demo purposes
    const users = [
      { username: "abc", password: "abc" },
      { username: "user2", password: "password2" },
    ];

    // Check if entered credentials match any user
    const isValidUser = users.some(
      (user) => user.username === username && user.password === password
    );

    if (isValidUser) {
      setLoginStatus("Login successful!");
      onLoginSuccess(); // Notify parent that login was successful
      router.push("/"); // Redirect to home page after successful login
    } else {
      setLoginStatus("Invalid username or password.");
    }
  };

  return (
    <div className={styles.container}>
      <h1>Login Page</h1>
      <input
        id="text"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className={styles.inputField}
      />
      <input
        id="password"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={styles.inputField}
      />
      <button onClick={handleLogin} className={styles.loginButton}>
        Login
      </button>
      {loginStatus && <p className={styles.loginStatus}>{loginStatus}</p>}
    </div>
  );
};

export default LoginSignupButtons;
