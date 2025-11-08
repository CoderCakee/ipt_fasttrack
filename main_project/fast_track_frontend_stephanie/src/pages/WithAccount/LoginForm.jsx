import React, { useState } from "react";
import KioskBackground from "../../components/KioskBackground";
import FastTrackLogo from "../../assets/logo.png"; // ✅ Your logo image

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Logging in with email: ${email}`);
  };

  const handleGuest = () => {
    alert("Continuing as Guest / Alumni");
  };

  const handleForgotPassword = () => {
    alert("Redirect to forgot password flow");
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#2C3E9E] text-white font-sans">
      {/* Background */}
      <KioskBackground opacity={0} blueOpacity={80} />

      {/* Content */}
      <div className="relative z-10 w-full max-w-lg px-6 sm:px-8">
        {/* Form Card with White Header */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
          {/* Header / Logo Section */}
          <div className="bg-white flex flex-col items-center justify-center py-8 px-4 border-b border-gray-200 shadow-sm">
            <img
              src={FastTrackLogo}
              alt="FAST Track Logo"
              className="w-40 h-auto object-contain drop-shadow-md mb-3" // ✅ Larger logo
            />
            <p className="text-base text-gray-700 font-medium tracking-wide">
              Document Request System
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="p-8 text-gray-800" noValidate>
            <h2 className="font-semibold text-xl text-[#2C3E9E] mb-2">
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
              required
              className="w-full mb-5 rounded-md border border-gray-300 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2C3E9E] transition"
            />

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
              required
              className="w-full mb-8 rounded-md border border-gray-300 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2C3E9E] transition"
            />

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-[#2C3E9E] hover:bg-blue-800 text-white font-semibold py-3 rounded-md tracking-wide transition-all shadow-md hover:shadow-lg"
            >
              Login
            </button>

            {/* Forgot Password */}
            <button
              type="button"
              onClick={handleForgotPassword}
              className="mt-5 text-[#2C3E9E] text-sm underline hover:text-blue-800"
            >
              Forgot Password?
            </button>
          </form>
        </div>

        {/* Guest / Alumni */}
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

        {/* Footer */}
        <p className="mt-10 text-center text-white text-xs max-w-sm mx-auto select-none opacity-80">
          For password reset or technical assistance, contact AUF IT Helpdesk
        </p>
      </div>
    </div>
  );
}
