import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FastTrackLogo from "../../assets/logo.png";
import background from "../../assets/background.webp";

const AdminLoginForm = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    navigate("/AdminDashboard"); 
  };

  const handleForgotPassword = () => {
    alert("Forgot Password feature coming soon!");
  };

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
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white px-12 md:px-32 py-24">
        {/* Logo */}
        <img src={FastTrackLogo} alt="FastTrack Logo" className="w-48 mb-12" />

        {/* Login heading */}
        <h3 className="text-[#00308F] font-bold text-3xl mb-10">LOGIN </h3>

        {/* Login form */}
        <form className="w-full max-w-md space-y-6" onSubmit={handleLoginSubmit}>
          {/* Username input */}
          <div>
            <label htmlFor="username" className="block text-base font-medium text-gray-900 mb-2">
              Username/Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
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
                    d="M5.121 17.804A13.937 13.937 0 0112 15c3.314 0 6.313 1.032 8.879 2.79M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your email or username"
                className="w-full pl-12 pr-4 py-4 bg-gray-100 placeholder-gray-600 rounded-lg text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-[#00308F]"
                required
              />
            </div>
          </div>

          {/* Password input */}
          <div>
            <label htmlFor="password" className="block text-base font-medium text-gray-900 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
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
                    d="M12 11c1.656 0 3-1.567 3-3.5S13.656 4 12 4 9 5.567 9 7.5 10.344 11 12 11zM12 11v8m-6 0a6 6 0 0112 0v0a6 6 0 01-12 0v0z"
                  />
                </svg>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-12 pr-12 py-4 bg-gray-100 placeholder-gray-600 rounded-lg text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-[#00308F]"
                required
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Forgot password */}
          <p
            onClick={handleForgotPassword}
            className="text-sm text-[#00308F] cursor-pointer hover:underline select-none text-right"
          >
            Forgot Password?
          </p>

          {/* Submit button */}
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
      </div>
    </div>
  );
};

export default AdminLoginForm;
