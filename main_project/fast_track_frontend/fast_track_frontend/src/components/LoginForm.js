import React, { useState } from "react";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api"; // Django API prefix

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [userData, setUserData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setUserData(null);

    try {
      const response = await axios.post(`${API_BASE}/login/`, {
        email_address: email,
        password: password,
      });

      setUserData(response.data);
    } catch (error) {
      if (error.response && error.response.data) {
        // Django validation errors come as object or string
        const err = error.response.data;
        setErrorMsg(typeof err === "string" ? err : JSON.stringify(err));
      } else {
        setErrorMsg("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        backgroundColor: "#1e1e1e",
        color: "#f5f5f5",
        borderRadius: "12px",
        boxShadow: "0 0 10px rgba(0,0,0,0.5)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>User Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "12px" }}>
          <label>Email Address:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #555",
              backgroundColor: "#2b2b2b",
              color: "#f5f5f5",
            }}
          />
        </div>
        <div style={{ marginBottom: "12px" }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #555",
              backgroundColor: "#2b2b2b",
              color: "#f5f5f5",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "6px",
            backgroundColor: loading ? "#555" : "#007bff",
            color: "white",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {errorMsg && (
        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            backgroundColor: "#a94442",
            color: "white",
            borderRadius: "6px",
          }}
        >
          {errorMsg}
        </div>
      )}

      {userData && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#2e8b57",
            borderRadius: "6px",
          }}
        >
          <h4>Login Successful!</h4>
          <p>
            <strong>Name:</strong> {userData.first_name} {userData.last_name}
          </p>
          <p>
            <strong>Role:</strong> {userData.role}
          </p>
          <p>
            <strong>Email:</strong> {userData.email_address}
          </p>
          <p>
            <strong>Last Login:</strong>{" "}
            {new Date(userData.last_login).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
