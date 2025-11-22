import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import KioskHeader from "../../components/KioskHeader";
import KioskBackground from "../../components/KioskBackground";
import checkmarkIcon from "../../assets/checkmark.png";

export default function SuccessMessage() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Trigger fade-in after mount
    setShow(true);

    // Redirect after 8 seconds
    const timer = setTimeout(() => {
      navigate("/SingleDocumentReceipt");
    }, 8000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="relative min-h-screen flex flex-col bg-[#2C3E9E] overflow-hidden">
      <KioskBackground opacity={10} blueOpacity={80} />
      <KioskHeader />

      <main className="flex-grow flex items-center justify-center px-4">
        <div
          className={`
            bg-white rounded-lg p-8 max-w-md w-full text-center shadow-lg
            transition-all duration-700 ease-out
            ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
          `}
        >
     
          <div className="mb-4 flex justify-center">
            <img
              src={checkmarkIcon}
              alt="Success Icon"
              className="w-16 h-16 object-contain"
            />
          </div>

          <h1 className="text-lg font-semibold text-gray-900 mb-2">
            Request Submitted Successfully!
          </h1>

          <p className="text-sm text-gray-600">
            Your request has been received and is being processed.
          </p>
        </div>
      </main>
    </div>
  );
}
