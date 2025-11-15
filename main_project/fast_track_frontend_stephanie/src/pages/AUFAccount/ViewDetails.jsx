import React from "react";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import KioskHeader from "../../components/KioskHeader";
import KioskBackground from "../../components/KioskBackground";
import { useNavigate } from "react-router-dom";

// Mock request data
const mockRequest = {
  requestNumber: "1728901234567",
  submittedDate: "Nov 8, 2025",
  requesterName: "Juan Dela Cruz",
  documents: [
    { name: "TOR", copies: 2 },
    { name: "GOOD-MORAL", copies: 1 },
  ],
  totalAmount: 550,
  statusSteps: [
    {
      id: 1,
      label: "Request Received",
      description: "Your request has been received by the Registrar.",
      complete: true,
    },
    {
      id: 2,
      label: "Processing",
      description: "Documents are being prepared.",
      complete: false,
      current: true,
    },
    {
      id: 3,
      label: "Released by Registrar",
      description: "Documents are ready for pickup or delivery.",
      complete: false,
    },
    {
      id: 4,
      label: "Document Claimed",
      description: "Documents have been received.",
      complete: false,
    },
  ],
  estimatedCompletion: "Nov 13, 2025",
  pickupInfo: {
    location: "AUF Registrar's Office, 2nd Floor, Main Building",
    hours: "Monday–Friday, 8:00 AM – 5:00 PM",
    requirements: "Valid AUF ID or Government-issued ID",
  },
};

const ViewDetails = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col bg-[#2C3E9E] font-sans text-gray-800">
      {/* Background */}
      <KioskBackground opacity={15} blueOpacity={80} />

      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-20">
        <KioskHeader />
      </div>

      {/* Scrollable Content */}
      <div 
        className="flex-1 overflow-y-auto pt-24" // Adjust pt-20 based on header height
        style={{
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE/Edge
        }}
      >
        <style>
          {`
            .scrollable-content::-webkit-scrollbar {
              display: none; // Chrome, Safari, Opera
            }
          `}
        </style>

        <div className="relative z-10 flex flex-col min-h-screen">
          {/* Main content wrapper */}
          <div className="flex-grow flex justify-center items-start px-4 sm:px-6">
            {/* White content container */}
            <div className="bg-white rounded-2xl shadow-lg max-w-4xl w-full p-6 md:p-10 mb-20">

              {/* Back Button */}
              <button
                type="button"
                onClick={() => navigate("/Home")}
                className="inline-flex items-center gap-2 text-blue-800 hover:text-blue-600 font-semibold mb-6"
                aria-label="Go back"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                Back
              </button>

              {/* Page Title */}
              <h1 className="text-2xl font-bold mb-6 text-blue-900 border-b border-blue-200 pb-2">
                Request Details
              </h1>

              {/* Request Info Card */}
              <section className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 shadow-sm">
                <h2 className="text-lg font-semibold text-blue-900 mb-3">
                  Request #{mockRequest.requestNumber}
                </h2>
                <p className="text-sm text-gray-600 mb-2">
                  Submitted on {mockRequest.submittedDate}
                </p>
                <p className="text-sm text-gray-700 mb-1">
                  <strong>Requester:</strong> {mockRequest.requesterName}
                </p>
                <p className="text-sm text-gray-700 mb-3">
                  <strong>Documents:</strong>{" "}
                  {mockRequest.documents.map((d) => `${d.name} (${d.copies})`).join(", ")}
                </p>

                {/* Total Amount */}
                <div className="flex justify-between items-center mt-3 bg-blue-800 text-white rounded-md py-3 px-4">
                  <span className="text-sm font-semibold">Total Amount</span>
                  <span className="text-2xl font-bold">₱{mockRequest.totalAmount}</span>
                </div>
              </section>

              {/* Request Status */}
              <section className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
                <h2 className="text-lg font-semibold text-blue-900 mb-4">
                  Request Status
                </h2>
                <ol className="space-y-5">
                  {mockRequest.statusSteps.map((step, i) => (
                    <li key={step.id} className="flex items-start gap-3">
                      {/* Step Icon */}
                      <span
                        className={`flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                          step.complete
                            ? "border-green-600 bg-green-600 text-white"
                            : step.current
                            ? "border-blue-700 bg-blue-700 text-white"
                            : "border-gray-300 text-gray-400"
                        }`}
                      >
                        {step.complete ? (
                          <CheckCircleIcon className="w-4 h-4" />
                        ) : step.current ? (
                          <XCircleIcon className="w-4 h-4" />
                        ) : (
                          i + 1
                        )}
                      </span>

                      {/* Step Info */}
                      <div>
                        <h4
                          className={`font-semibold ${
                            step.complete || step.current ? "text-gray-900" : "text-gray-400"
                          }`}
                        >
                          {step.label}
                          {step.current && (
                            <span className="ml-2 text-xs text-blue-700 bg-blue-100 rounded-full px-2 py-0.5">
                              Current
                            </span>
                          )}
                        </h4>
                        <p className="text-sm text-gray-600">{step.description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              {/* Estimated Completion */}
              <section className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8 text-blue-900 text-sm shadow-sm">
                <p>
                  <strong>Estimated completion:</strong> {mockRequest.estimatedCompletion}
                </p>
                <p className="mt-1">
                  Documents are currently being processed. You will be notified once they are ready for pickup.
                </p>
              </section>

              {/* Pickup Information */}
              <section className="bg-white border border-gray-300 rounded-xl p-6 shadow-sm text-sm text-gray-700">
                <h2 className="text-lg font-semibold text-blue-900 mb-3">
                  Pickup Information
                </h2>
                <p><strong>Location:</strong> {mockRequest.pickupInfo.location}</p>
                <p><strong>Hours:</strong> {mockRequest.pickupInfo.hours}</p>
                <p><strong>Requirements:</strong> {mockRequest.pickupInfo.requirements}</p>
              </section>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDetails;
