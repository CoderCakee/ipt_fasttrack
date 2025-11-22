import React from "react";
import { useNavigate } from "react-router-dom";
import FastTrackLogo from "../../assets/logo.png";
import KioskBackground from "../../components/KioskBackground";

const WelcomeScreen = () => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    setTimeout(() => {
      navigate("/KioskServicesMenu");
    }, 700);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#2C3E9E] overflow-hidden">

      {/* SAME BLUE OVERLAY SYSTEM */}
      <KioskBackground opacity={15} blueOverlay={80} />

      {/* Top Logo */}
      <header className="relative z-10 bg-gray-100 flex justify-center">
        <img
          src={FastTrackLogo}
          alt="University Logo"
          className="w-72 max-w-md object-contain"
        />
      </header>

      {/* Center Button */}
      <main className="relative z-10 flex-grow flex items-center justify-center">
        <button
          type="button"
          onClick={handleStartClick}
          aria-label="Click to start"
          className="px-20 py-8 bg-blue-800 text-white font-bold text-3xl uppercase rounded-full shadow-2xl hover:bg-blue-700 hover:scale-105 transform transition-all duration-300"
        >
          Tap to Start
        </button>
      </main>
    </div>
  );
};

export default WelcomeScreen;
