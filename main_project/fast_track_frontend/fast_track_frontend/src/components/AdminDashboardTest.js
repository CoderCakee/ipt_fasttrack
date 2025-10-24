import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api"; // Django API prefix

const AdminDashboardTest = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("access_token"));
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const accessToken = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");

  // Create an axios instance
  const axiosInstance = axios.create({
    baseURL: API_BASE,
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
  });

  // Interceptor for token refresh
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        try {
          const refreshResponse = await axios.post(`${API_BASE}/refresh/`, {
            refresh: refreshToken,
          });
          const newAccessToken = refreshResponse.data.access;
          localStorage.setItem("access_token", newAccessToken);
          axiosInstance.defaults.headers[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          setError("Session expired. Please log in again.");
          setLoggedIn(false);
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        }
      }
      return Promise.reject(error);
    }
  );

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(`${API_BASE}/login/`, {
        email_address: credentials.email,
        password: credentials.password,
      });
      const { access_token, refresh_token } = response.data;

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      setLoggedIn(true);
      setError("");
      console.log("Login successful!");
      fetchDashboard(); // fetch dashboard immediately after login
    } catch (err) {
      console.error(err);
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setData(null);
    setLoggedIn(false);
  };

  // Fetch dashboard
  const fetchDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axiosInstance.get("/admin-dashboard/");
      setData(response.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        setError("You do not have permission to view this page.");
      } else {
        setError("Failed to fetch dashboard data.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loggedIn) fetchDashboard();
  }, [loggedIn]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard Test</h1>

      {!loggedIn ? (
        <form
          onSubmit={handleLogin}
          className="bg-gray-100 p-4 rounded mb-6 w-full max-w-sm"
        >
          <h2 className="text-lg font-semibold mb-2">Login</h2>
          <input
            type="text"
            placeholder="Email or Username"
            value={credentials.email}
            onChange={(e) =>
              setCredentials({ ...credentials, email: e.target.value })
            }
            className="border p-2 mb-2 w-full rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            className="border p-2 mb-2 w-full rounded"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </form>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Dashboard Data</h2>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>

          {loading && <p>Loading...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {data ? (
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          ) : (
            !loading && <p>No data loaded yet.</p>
          )}

          <button
            onClick={fetchDashboard}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh Data
          </button>
        </>
      )}
    </div>
  );
};

export default AdminDashboardTest;
