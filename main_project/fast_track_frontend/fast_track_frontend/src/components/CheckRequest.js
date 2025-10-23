// src/components/CheckRequest.js
import React, { useState } from "react";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000"; // Django server URL

const CheckRequest = () => {
  const [mode, setMode] = useState("number"); // 'number' or 'student'
  const [requestNumber, setRequestNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [requestData, setRequestData] = useState(null);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0); // For cycling requests

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setRequestData(null);
    setCurrentIndex(0);

    try {
      if (mode === "number") {
        // 🔹 Lookup by Request Number
        const postRes = await axios.post(`${API_BASE}/api/check-request-number/`, {
          request_number: requestNumber,
        });

        const getRes = await axios.get(
          `${API_BASE}/api/check-request-details/${postRes.data.request_id}/`
        );
        setRequestData({ requests: [getRes.data] }); // Normalize single request
      } else {
        // 🔹 Lookup by Student Info
        const postRes = await axios.post(`${API_BASE}/api/check-request-by-student/`, {
          first_name: firstName,
          last_name: lastName,
          student_number: studentNumber,
        });

        setRequestData(postRes.data);
      }
    } catch (err) {
      if (err.response && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  const handleNext = () => {
    if (!requestData || !requestData.requests) return;
    setCurrentIndex((prev) => (prev + 1) % requestData.requests.length);
  };

  const handlePrev = () => {
    if (!requestData || !requestData.requests) return;
    setCurrentIndex(
      (prev) =>
        (prev - 1 + requestData.requests.length) % requestData.requests.length
    );
  };

  // Helper to get the currently displayed request
  const currentRequest =
    requestData && requestData.requests
      ? requestData.requests[currentIndex]
      : requestData;

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Check Request Status</h2>

      {/* 🔀 Mode Toggle */}
      <div style={{ marginBottom: "1.5rem" }}>
        <button
          type="button"
          onClick={() => setMode("number")}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: mode === "number" ? "#4CAF50" : "#ddd",
            color: mode === "number" ? "white" : "black",
            border: "none",
            borderRadius: "5px",
            marginRight: "0.5rem",
            cursor: "pointer",
          }}
        >
          By Request Number
        </button>
        <button
          type="button"
          onClick={() => setMode("student")}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: mode === "student" ? "#4CAF50" : "#ddd",
            color: mode === "student" ? "white" : "black",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          By Student Info
        </button>
      </div>

      {/* 🔹 Form Section */}
      <form onSubmit={handleSubmit}>
        {mode === "number" ? (
          <div>
            <input
              type="text"
              placeholder="Enter Request Number"
              value={requestNumber}
              onChange={(e) => setRequestNumber(e.target.value)}
              style={{ padding: "0.5rem", width: "100%", marginBottom: "1rem" }}
              required
            />
          </div>
        ) : (
          <div>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              style={{ padding: "0.5rem", width: "100%", marginBottom: "0.5rem" }}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              style={{ padding: "0.5rem", width: "100%", marginBottom: "0.5rem" }}
              required
            />
            <input
              type="text"
              placeholder="Student Number"
              value={studentNumber}
              onChange={(e) => setStudentNumber(e.target.value)}
              style={{ padding: "0.5rem", width: "100%", marginBottom: "1rem" }}
              required
            />
          </div>
        )}

        <button
          type="submit"
          style={{
            padding: "0.6rem 1.2rem",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Check
        </button>
      </form>

      {/* 🔸 Error Message */}
      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}

      {/* 🔸 Request Info Display */}
      {currentRequest && (
        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            border: "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h3>Request Details</h3>
          <p>
            <strong>Request Number:</strong> {currentRequest.request_number}
          </p>
          <p>
            <strong>Name:</strong>{" "}
            {requestData?.student
              ? `${requestData.student.first_name} ${requestData.student.last_name}`
              : `${currentRequest.first_name} ${currentRequest.last_name}`}
          </p>
          <p>
            <strong>Student Number:</strong>{" "}
            {requestData?.student
              ? requestData.student.student_number
              : currentRequest.student_number}
          </p>
          <p>
            <strong>Date Requested:</strong> {currentRequest.date_requested}
          </p>
          <p>
            <strong>Status:</strong> {currentRequest.request_status}
          </p>

          {currentRequest.documents && currentRequest.documents.length > 0 && (
            <>
              <h4>Documents</h4>
              <ul>
                {currentRequest.documents.map((doc, index) => (
                  <li key={index}>
                    {doc.doctype_name} - Copies: {doc.copy_amount} - Processing:{" "}
                    {doc.processing_time}
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* 🔁 Navigation (only if multiple requests) */}
          {requestData?.requests?.length > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "1rem",
              }}
            >
              <button
                onClick={handlePrev}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "5px",
                  backgroundColor: "#eee",
                  cursor: "pointer",
                }}
              >
                ◀ Previous
              </button>
              <span>
                {currentIndex + 1} of {requestData.requests.length}
              </span>
              <button
                onClick={handleNext}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "5px",
                  backgroundColor: "#eee",
                  cursor: "pointer",
                }}
              >
                Next ▶
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckRequest;
