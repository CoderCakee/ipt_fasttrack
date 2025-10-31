import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import FastTrackLogo from "../../assets/logo.png";
import background from "../../assets/background.webp";

const WelcomeScreen = () => {
    const navigate = useNavigate(); // Initialize navigate

    const handleStartClick = () => {
      navigate("/KioskServicesMenu"); // Navigate to KioskServicesMenu
  };

  return (
    // Container with full screen height and flex column
    <div className="min-h-screen flex flex-col">
      {/* Top logo section */}
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
        style={{
          backgroundImage: `url(${background})`,
        }}
      >
        {/* Overlay with semi-transparent blue filter */}
        <div className="absolute inset-0 bg-blue-900 bg-opacity-75"></div>

        {/* Centered button with hover effect, above overlay */}
        <button
          className="relative px-12 py-4 bg-blue-800 text-white font-bold text-xl uppercase rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          type="button"
          aria-label="Click to start"
          onClick={handleStartClick}
        >
          CLICK TO START
        </button>
      </main>
    </div>
  );
};

export default WelcomeScreen;
