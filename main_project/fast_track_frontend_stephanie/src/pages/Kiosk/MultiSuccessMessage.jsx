import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import KioskHeader from "../../components/KioskHeader";
import KioskBackground from "../../components/KioskBackground";
import checkmarkIcon from "../../assets/checkmark.png";

export default function MultiSuccessMessage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [show, setShow] = useState(false);

  // 🧠 Get the document count (default to 1 if not provided)
  const documentCount = location.state?.documentCount || 1;

  useEffect(() => {
    setShow(true);

    // Redirect after 8 seconds
    const timer = setTimeout(() => {
      navigate("/MultiDocumentReceipt");
    }, 8000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="relative min-h-screen flex flex-col bg-[#2C3E9E] overflow-hidden">
      <KioskBackground opacity={10} blueOpacity={80} />
      <KioskHeader />

      <main className="flex-grow flex items-center justify-center px-4">
        <div
          className={`bg-white border-2 border-yellow-500 rounded-lg p-8 max-w-md w-full text-center shadow-lg
            transition-all duration-700 ease-out
            ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
          `}
        >
          {/* ✅ PNG checkmark icon */}
          <div className="mb-4 flex justify-center">
            <img
              src={checkmarkIcon}
              alt="Success Icon"
              className="w-16 h-16 object-contain"
            />
          </div>

          <h1 className="text-lg font-semibold text-gray-900 mb-2">
            Multi-Document Request Submitted!
          </h1>

          <p className="text-sm text-gray-600">
            Your request for <span className="font-semibold">{documentCount}</span>{" "}
            {documentCount === 1 ? "document" : "documents"} has been received and is being processed.
          </p>
        </div>
      </main>
    </div>
  );
}
