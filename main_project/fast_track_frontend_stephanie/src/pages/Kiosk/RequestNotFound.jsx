import React from "react";
import { useNavigate } from "react-router-dom";
import KioskHeader from "../../components/KioskHeader";
import KioskBackground from "../../components/KioskBackground";
import requestNotFoundIcon from "../../assets/request-not-found.png";

const RequestNotFound = () => {
  const navigate = useNavigate();

  const handleTryAgain = () => {
    navigate("/CheckRequestStatus"); 
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#2C3E9E] overflow-hidden">
      {/* Background overlay */}
      <KioskBackground opacity={10} blueOpacity={80} />

    
      <KioskHeader />

    
      <main className="relative z-10 flex-grow flex items-center justify-center px-4">
        <div
          className="bg-white max-w-md w-full p-8 rounded-lg shadow-lg
                     flex flex-col items-center text-center
                     transition-shadow hover:shadow-xl"
        >
          {/* Icon */}
          <img
            src={requestNotFoundIcon}
            alt="Request Not Found Icon"
            className="w-16 h-16 mb-6"
          />

          {/* Title */}
          <h2 className="text-blue-900 text-xl font-semibold mb-2">
            Request Not Found
          </h2>

          {/* Description */}
          <p className="text-gray-700 mb-8 px-2">
            We couldn’t find any request matching the information you entered.
            Please check your details and try again.
          </p>

          {/* Try Again Button */}
          <button
            onClick={handleTryAgain}
            className="w-full py-2 border border-blue-900 text-blue-900 rounded-md
                       text-sm hover:bg-blue-900 hover:text-white transition-colors duration-300"
          >
            Try Again
          </button>
        </div>
      </main>
    </div>
  );
};

export default RequestNotFound;
