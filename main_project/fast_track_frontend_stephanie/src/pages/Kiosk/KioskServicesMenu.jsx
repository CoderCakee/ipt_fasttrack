import React from "react";
import { useNavigate } from "react-router-dom"; // Import this
import checkStatusIcon from "../../assets/checkstatus.png";
import requestDocumentIcon from "../../assets/requestdocument.png";
import multipleDocumentIcon from "../../assets/multiplerequest.png";
import priorityIcon from "../../assets/priority.png";

const services = [
  {
    title: "CHECK STATUS",
    description: "Track your existing documents requests",
    icon: <img src={checkStatusIcon} alt="Check Status Icon" className="h-12 w-12" />,
  },
  {
    title: "REQUEST DOCUMENT",
    description: "Quick service for single document requests",
    icon: <img src={requestDocumentIcon} alt="Request Document Icon" className="h-12 w-12" />,
  },
  {
    title: "MULTIPLE DOCUMENT REQUEST",
    description: "Request multiple documents in one transaction",
    icon: <img src={multipleDocumentIcon} alt="Multiple Document Icon" className="h-12 w-12" />,
  },
  {
    title: "PRIORITY LANE",
    description: "For pregnant women, PWDs, and senior citizens",
    icon: <img src={priorityIcon} alt="Priority Lane Icon" className="h-12 w-12" />,
  },
];

const KioskServicesMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel */}
      <div className="bg-blue-800 text-gold flex flex-col justify-center p-8 lg:w-1/3 rounded-bl-[80px] rounded-tl-[80px]">
        <h1 className="text-4xl font-extrabold uppercase mb-6 text-yellow-600 tracking-widest">Welcome!</h1>
        <p className="text-white mb-8 max-w-xs leading-relaxed">
          Fast Track helps you skip the long lines and get your documents quickly.
        </p>
        <ul className="text-white space-y-3 max-w-xs list-none">
          <li className="flex items-start space-x-2">
            <span className="text-yellow-400 mt-1">➢</span>
            <span>Request document in just a few steps</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-yellow-400 mt-1">➢</span>
            <span>Can process multiple requests</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-yellow-400 mt-1">➢</span>
            <span>Track your request anytime</span>
          </li>
        </ul>
      </div>

      {/* Right Panel */}
      <div className="flex-1 bg-gray-300 p-8 flex flex-col items-center justify-start">
        <div className="flex items-center space-x-2 text-yellow-700 bg-yellow-700 bg-opacity-40 rounded-full px-4 py-2 mb-10 w-fit">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-yellow-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0120 8.618V15.382a1 1 0 01-1.447.894L15 14M5 10v4m0-4l4 2m-4 0L9 12" />
          </svg>
          <span className="uppercase font-semibold tracking-wide text-sm">Choose a service to continue</span>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-4xl">
          {services.map(({ title, description, icon }, idx) => (
            <div
              key={idx}
              onClick={() => {
                if (title === "CHECK STATUS") {
                  navigate("/CheckRequestStatus");
                } else if (title === "REQUEST DOCUMENT") {
                  navigate("/RequestDocument");
                }  else if (title === "MULTIPLE DOCUMENT REQUEST") {
                  navigate("/MultiDocumentRequest")
                }
              }}
              className="relative bg-blue-800 text-white rounded-lg p-6 flex flex-col items-center justify-center shadow-lg cursor-pointer"
            >
              {/* Left white rounded vertical strip */}
              <div className="absolute left-0 top-0 h-full w-4 bg-white rounded-l-lg"></div>
              <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                <div>{icon}</div>
                <h2 className="uppercase font-semibold tracking-wide text-sm">{title}</h2>
                <p className="text-xs max-w-xs">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KioskServicesMenu;
