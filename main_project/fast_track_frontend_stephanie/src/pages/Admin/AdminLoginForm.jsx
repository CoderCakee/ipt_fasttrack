import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FastTrackLogo from "../../assets/logo.png";
import background from "../../assets/background.webp";
import UserIcon from "../../assets/user.png";
import LockIcon from "../../assets/password.png";

const AdminLoginForm = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Login form error messages
  const [loginError, setLoginError] = useState({ username: "", password: "" });

  // Forgot Password modal state & form
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const modalRef = useRef(null);

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // Login form validation and submit
  const handleLoginSubmit = (e) => {
    e.preventDefault();

    let hasError = false;
    const errors = { username: "", password: "" };

    // Validate username/email
    if (!username.trim()) {
      errors.username = "Username or email is required.";
      hasError = true;
    } else if (username.includes("@") && !isValidEmail(username)) {
      errors.username = "Please enter a valid email address.";
      hasError = true;
    }

    // Validate password
    if (!password) {
      errors.password = "Password is required.";
      hasError = true;
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
      hasError = true;
    }

    setLoginError(errors);

    if (!hasError) {
      // Clear errors and navigate
      setLoginError({ username: "", password: "" });
      navigate("/AdminDashboard");
    }
  };

  // Handle Forgot Password submit
  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      setForgotError("Email is required.");
      return;
    }
    if (!isValidEmail(forgotEmail)) {
      setForgotError("Please enter a valid email address.");
      return;
    }
    setForgotError("");
    setResetMessage(`A password reset link has been sent to ${forgotEmail}`);
    setForgotOpen(false);
    setTimeout(() => setResetMessage(""), 4000);
  };

  const handleForgotPasswordClick = () => {
    setForgotEmail("");
    setForgotError("");
    setForgotOpen(true);
  };

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (forgotOpen && modalRef.current && !modalRef.current.contains(event.target)) {
        setForgotOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [forgotOpen]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side */}
      <div
        className="relative w-full md:w-1/2 h-80 md:h-auto bg-cover bg-center flex flex-col justify-end px-16 pb-16 hidden md:flex"
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="absolute inset-0 bg-[#00308F] opacity-80 z-10"></div>
        <div className="relative z-20 max-w-sm text-white">
          <h1 className="text-yellow-600 font-extrabold text-6xl mb-2">WELCOME !</h1>
          <h2 className="uppercase font-semibold tracking-widest text-lg mb-3">
            FAST TRACK – REGISTRAR&apos;S OFFICE PORTAL
          </h2>
          <p className="text-m leading-relaxed">
            Log in to process, track, and manage document requests efficiently and securely.
          </p>
        </div>
      </div>

      {/* Right side: Larger login form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white px-12 md:px-32 py-24 relative">
        <img src={FastTrackLogo} alt="FastTrack Logo" className="w-48 mb-12" />
        <h3 className="text-[#00308F] font-bold text-3xl mb-10">LOGIN </h3>

        <form className="w-full max-w-md space-y-6" onSubmit={handleLoginSubmit}>
          {/* Username input */}
          <div>
            <label htmlFor="username" className="block text-base font-medium text-gray-900 mb-2">
              Username/Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <img src={UserIcon} alt="User Icon" className="w-6 h-6 opacity-70" />
              </div>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your email or username"
                className={`w-full pl-12 pr-4 py-4 bg-gray-100 placeholder-gray-600 rounded-lg text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-[#00308F] ${
                  loginError.username ? "border-red-500 border-2" : ""
                }`}
              />
            </div>
            {loginError.username && (
              <p className="mt-1 text-red-600 text-sm">{loginError.username}</p>
            )}
          </div>

          {/* Password input */}
<div>
  <label htmlFor="password" className="block text-base font-medium text-gray-900 mb-2">
    Password
  </label>
  <div className="relative">
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <img src={LockIcon} alt="Password Icon" className="w-6 h-6 opacity-70" />
    </div>
    <input
      type={showPassword ? "text" : "password"}
      id="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Enter your password"
      className={`w-full pl-12 pr-12 py-4 bg-gray-100 placeholder-gray-600 rounded-lg text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-[#00308F] ${
        loginError.password ? "border-red-500 border-2" : ""
      }`}
    />
    <button
      type="button"
      aria-label={showPassword ? "Hide password" : "Show password"}
      onClick={() => setShowPassword(!showPassword)}
      className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-600 hover:text-gray-900 focus:outline-none"
    >
      {showPassword ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.243 0-7.7-2.538-9.185-6a10.11 10.11 0 015.362-5.944M6.708 6.707a9.956 9.956 0 016.708-2.456c4.243 0 7.7 2.538 9.542 6a10.12 10.12 0 01-1.305 2.333M15 12a3 3 0 11-6 0 3 3 0 016 0zM3 3l18 18"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      )}
    </button>
  </div>
  {loginError.password && (
    <p className="mt-1 text-red-600 text-sm">{loginError.password}</p>
  )}
</div>


          {/* Forgot password */}
          <p
            onClick={handleForgotPasswordClick}
            className="text-sm text-[#00308F] cursor-pointer hover:underline select-none text-right"
          >
            Forgot Password?
          </p>

          <button
            type="submit"
            className="w-full mt-6 py-4 rounded-lg bg-[#B9970E] text-white font-bold text-lg tracking-widest hover:bg-yellow-600 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-yellow-300"
          >
            LOGIN
          </button>
        </form>

        {/* Support contact text */}
        <p className="mt-16 text-center text-sm text-gray-400 max-w-xs mx-auto select-text">
          For technical support, contact IT Services <br />
          Email: itservices@auf.edu.ph
        </p>

        {/* Success Message Banner */}
        {resetMessage && (
          <div className="fixed top-0 left-0 right-0 z-50 flex justify-center animate-slideDown">
            <div className="bg-green-600 text-white text-sm sm:text-base font-medium px-6 py-4 rounded-b-2xl shadow-lg flex items-center space-x-3 max-w-lg w-full mx-4 sm:mx-0">
              <span>{resetMessage}</span>
              <button
                onClick={() => setResetMessage("")}
                className="ml-auto text-white hover:text-gray-200 focus:outline-none"
                aria-label="Close notification"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Forgot Password Modal */}
        {forgotOpen && (
          <>
            <div
              onClick={() => setForgotOpen(false)}
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
            />
            <div className="fixed inset-0 flex items-center justify-center z-50 px-4 sm:px-0">
              <div
                ref={modalRef}
                className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-lg relative"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6">Forgot Password</h3>
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="forgotEmail" className="block text-sm font-medium text-gray-700 mb-1">
                      Enter your email address
                    </label>
                    <input
                      type="email"
                      id="forgotEmail"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                      className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                        forgotError ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="email@auf.edu.ph"
                    />
                    {forgotError && <p className="mt-1 text-red-600 text-sm">{forgotError}</p>}
                  </div>
                  <div className="flex justify-end gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setForgotOpen(false)}
                      className="border border-gray-300 px-5 py-2 rounded-xl text-gray-700 hover:bg-gray-100 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-[#B9970E] text-white px-5 py-2 rounded-xl hover:bg-yellow-600 font-semibold"
                    >
                      Send Reset Link
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminLoginForm;
