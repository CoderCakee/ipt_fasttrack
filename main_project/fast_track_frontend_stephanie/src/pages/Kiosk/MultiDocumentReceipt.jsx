// src/pages/Kiosk/CheckRequestReceipt.jsx

import React from "react";
import KioskHeader from "../../components/KioskHeader";
import KioskBackground from "../../components/KioskBackground";
import { useNavigate } from "react-router-dom";

const MultiDocumentReceipt = ({
  requesterName = "Dela Cruz, Juan",
  requestNumber = "FAST-2024-510586",
  studentNumber = "23-1576-329",
  dateRequested = "September 19, 2025",
  documentRequested = "Certificate of Good Moral Character",
  totalAmount = "₱150",
  status = "Processing",
  completionPercent = 50,
}) => {
  const navigate = useNavigate();

  const returnMenu = () => {
    navigate("/KioskServicesMenu");
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#2C3E9E] overflow-hidden font-serif">
      {/* Background + Header */}
      <div className="absolute inset-0 z-0">
        <KioskBackground opacity={10} blueOpacity={80} />
      </div>
      <div className="relative z-20">
        <KioskHeader />
      </div>

      {/* Main Content */}
      <main className="relative z-20 flex-grow flex justify-center items-center px-6 py-10">
        <div className="bg-white border-2 border-yellow-400 rounded-lg shadow-2xl max-w-lg w-full p-8 text-[#2c3e9e]">
          {/* Title */}
          <h2 className="text-center text-blue-900 font-semibold text-lg mb-1">
            Document Request Receipt
          </h2>
          <p className="text-center text-gray-600 text-xs mb-6">
            Angeles University Foundation
          </p>

          {/* Request Number & Date */}
          <div className="flex justify-between text-gray-700 text-s mb-4">
            <div>
              <p className="font-medium">Request Number:</p>
              <p className="text-black">{requestNumber}</p>
            </div>
            <div className="text-left">
              <p className="font-medium">Date:</p>
              <p className="text-black">{dateRequested}</p>
            </div>
          </div>

          {/* Requester’s Name */}
          <div className="text-gray-700 text-sm mb-4 mb-4">
            <p className="font-medium">Requester’s Name:</p>
            <p className="text-black">{requesterName}</p>
          </div>

          <hr className="border-gray-300 mb-4" />

          {/* Requested Documents */}
          <div className="mb-4">
            <div className="mb-2 font-semibold text-black">Requested Documents:</div>

            <div className="bg-gray-50 rounded-md border border-gray-200 p-3 flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">
                  {documentRequested}{" "}
                  <span className="text-xs rounded px-2 py-0.5 bg-blue-900 text-white ml-1">
                    ₱100
                  </span>
                </p>
                <p className="text-xs text-gray-600">Copies: 1</p>
                <p className="text-xs text-gray-600">
                  Purpose: Transfer of School
                </p>
              </div>
              <div className="text-yellow-500 font-semibold text-sm">x1</div>
            </div>

            <div className="text-right text-blue-900 italic text-sm mt-1">
              Total Amount : {totalAmount}
            </div>
          </div>

          {/* Processing Time */}
          <div className="mb-4 text-gray-700 text-xs">
            <p className="font-semibold mb-1">Processing Time:</p>
            <p>3–5 working days</p>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-xs text-gray-800 mb-6">
            <p className="font-semibold mb-1 text-[#2c3e9e]">Instructions:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Bring this receipt when collecting documents</li>
              <li>You will be notified when documents are ready</li>
              <li>
                If sending a representative, provide authorization letter and
                your valid ID
              </li>
            </ul>
          </div>

          {/* Footer Note */}
          <p className="text-center text-gray-500 text-[10px] mb-6">
            For inquiries, visit the Registrar’s Office <br />
            Keep this receipt for your records
          </p>

          {/* Buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => window.print()}
              className="px-4 py-1.5 border border-blue-900 text-blue-900 rounded hover:bg-blue-50 transition"
            >
              Print Receipt
            </button>
            <button
              onClick={returnMenu}
              className="px-4 py-1.5 bg-blue-900 text-white rounded hover:bg-blue-800 transition"
            >
              Return to Menu
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MultiDocumentReceipt;
