import React from "react";
import { useNavigate } from "react-router-dom";
import FastTrackLogo from "../../assets/logo.png";
import background from "../../assets/background.webp";

const WelcomeScreen = () => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    setTimeout(() => {
    navigate("/KioskServicesMenu");
  }, 700); // 0.7s delay for smoothness
};

  return (
    // Full-screen container with vertical layout
    <div className="min-h-screen flex flex-col">
      {/* Top section with centered logo */}
      <header className="bg-gray-100 flex justify-center">
        <img
          src={FastTrackLogo}
          alt="University Logo"
          className="w-72 max-w-md object-contain"
        />
      </header>

      {/* Main section with background image and centered button */}
      <main
        className="flex-grow flex items-center justify-center bg-center bg-cover relative"
        style={{ backgroundImage: `url(${background})` }}
      >
        {/* Semi-transparent blue overlay */}
        <div className="absolute inset-0 bg-blue-900 bg-opacity-75"></div>

        {/* Centered start button */}
        <button
          type="button"
          onClick={handleStartClick}
          aria-label="Click to start"
          className="relative px-20 py-8 bg-blue-800 text-white font-bold text-3xl uppercase rounded-full shadow-2xl hover:bg-blue-700 hover:scale-105 transform transition-all duration-300 ease-in-out"
        >
          CLICK TO START
        </button>
      </main>
    </div>
  );
};

export default WelcomeScreen;
