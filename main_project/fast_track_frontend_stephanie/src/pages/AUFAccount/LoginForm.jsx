import React, { useState } from "react";
import KioskBackground from "../../components/KioskBackground";
import FastTrackLogo from "../../assets/logo.png"; 
import { useNavigate } from "react-router-dom"; 

export default function LoginForm() {
  const navigate = useNavigate(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Email validations
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Enter a valid AUF email.";
    } else if (!email.endsWith("@auf.edu.ph")) {
      newErrors.email = "Email must be an AUF email address.";
    }

    // Password validations
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    // If errors exist, update state and stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear errors if all validations pass
    setErrors({});
    alert(`Logging in with email: ${email}`);
    // TODO: Implement actual login API
  };

  const handleGuest = () => {
    navigate("/HomeAlumni");
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#2C3E9E] text-white font-sans">
      <KioskBackground opacity={15} blueOpacity={80} />

      <div className="relative z-10 w-full max-w-lg px-6 sm:px-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
          <div className="bg-white flex flex-col items-center justify-center py-8 px-4 border-b border-gray-200 shadow-sm">
            <img
              src={FastTrackLogo}
              alt="FAST Track Logo"
              className="w-40 h-auto object-contain drop-shadow-md mb-3" 
            />
            <p className="text-base text-gray-700 font-medium tracking-wide">
              Document Request System
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 text-gray-800" noValidate>
            <h2 className="font-semibold text-xl text-center text-[#2C3E9E] mb-2">
              Student Login
            </h2>
            <p className="text-gray-600 text-sm mb-8">
              Enter your AUF credentials to access your account.
            </p>

            {/* Email */}
            <label htmlFor="email" className="block text-xs font-semibold mb-1">
              AUF Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="student@auf.edu.ph"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full mb-2 rounded-md border px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2C3E9E] transition ${
                errors.email ? "border-red-600 bg-red-50" : "border-gray-300 bg-white"
              }`}
            />
            {errors.email && (
              <p className="text-red-600 text-xs mb-3">{errors.email}</p>
            )}

            {/* Password */}
            <label htmlFor="password" className="block text-xs font-semibold mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full mb-2 rounded-md border px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2C3E9E] transition ${
                errors.password ? "border-red-600 bg-red-50" : "border-gray-300 bg-white"
              }`}
            />
            {errors.password && (
              <p className="text-red-600 text-xs mb-3">{errors.password}</p>
            )}

            <button
              type="submit"
              className="w-full bg-[#2C3E9E] hover:bg-blue-800 text-white font-semibold py-3 rounded-md tracking-wide transition-all shadow-md hover:shadow-lg mt-3"
            >
              Login
            </button>
          </form>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 mt-10 shadow-xl text-gray-800 border border-gray-200">
          <p className="text-sm mb-4 text-center text-gray-600">
            Alumni or don&apos;t have AUF credentials?
          </p>
          <button
            type="button"
            onClick={handleGuest}
            className="w-full rounded-md border border-[#2C3E9E] text-[#2C3E9E] py-3 font-bold uppercase tracking-wider hover:bg-[#2C3E9E] hover:text-white transition-all shadow-sm hover:shadow-md"
          >
            Continue as Guest / Alumni
          </button>
        </div>

        <p className="mt-10 text-center text-white text-xs max-w-sm mx-auto select-none opacity-80">
          For password reset or technical assistance, contact AUF IT Helpdesk
        </p>
      </div>
    </div>
  );
}
