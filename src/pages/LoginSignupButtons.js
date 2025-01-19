import { useState } from "react";
import styles from "../styles/Login.module.css";

const LoginSignupButtons = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setIsLoading(true);
    setLoginStatus("");

    try {
      const users = [
        { username: "abc", password: "abc" },
        { username: "xyz", password: "xyz" },
      ];

      const isValidUser = users.some(
        (user) => user.username === username && user.password === password
      );

      if (isValidUser) {
        setLoginStatus("Login successful!");
        onLoginSuccess();
      } else {
        setLoginStatus("Invalid username or password.");
      }
    } catch (error) {
      setLoginStatus("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Login Page</h1>
      <form onSubmit={handleLogin}>
        <input
          id="text"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.inputField}
          aria-label="Username"
        />
        <input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.inputField}
          aria-label="Password"
          autoComplete="off"
        />
        <button
          type="submit"
          className={styles.loginButton}
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
      {loginStatus && (
        <p
          className={`${styles.loginStatus} ${
            loginStatus === "Invalid username or password." ? styles.error : ""
          }`}
        >
          {loginStatus}
        </p>
      )}
    </div>
  );
};

export default LoginSignupButtons;
