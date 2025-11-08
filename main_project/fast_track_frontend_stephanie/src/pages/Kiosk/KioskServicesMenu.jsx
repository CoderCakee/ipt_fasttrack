import React from "react";
import { useNavigate } from "react-router-dom"; // Import this
import checkStatusIcon from "../../assets/checkstatus.png";
import requestDocumentIcon from "../../assets/requestdocument.png";
import multipleDocumentIcon from "../../assets/multiplerequest.png";
import RegistrarInfoIcon from "../../assets/info.png";


const services = [
  {
    title: "SCAN QR TO CHECK STATUS",
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
    title: "REGISTRAR INFO & HELP",
    description: "Office hours, location & guidelines",
    icon: <img src={RegistrarInfoIcon} alt="Registrar Info Icon" className="h-12 w-12" />,
  }
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
<div className="flex-1 bg-white p-8 flex flex-col items-center justify-start">
  {/* Shared width wrapper for banner + buttons */}
  <div className="w-full max-w-6xl">
    {/* Banner */}
    <div className="bg-yellow-700 rounded-r-full px-6 py-5 select-none inline-block">
      <span className="uppercase font-semibold text-white text-lg tracking-widest whitespace-nowrap">
        Choose a service to continue
      </span>
    </div>

    {/* Services Grid */}
<div className="mt-6 space-y-6">
 {services.map(({ title, description, icon }, idx) => (
  <button
    key={idx}
    onClick={() => {
      if (title === "REQUEST DOCUMENT") navigate("/RequestDocumentStep1");
      else if (title === "SCAN QR TO CHECK STATUS") navigate("/CheckRequestStatus");
      else if (title === "REGISTRAR INFO & HELP") navigate("/RegistrarInfo");
    }}
    className="
      flex items-center gap-6 w-full rounded-xl px-8 py-6 cursor-pointer
      bg-gray-50 
      hover:bg-blue-50 hover:border hover:border-blue-800
      transition-all 
      shadow-sm hover:shadow-md
    "
    type="button"
  >
    <div className="bg-blue-800 p-4 rounded-md flex justify-center items-center shrink-0">
      {React.cloneElement(icon, { className: "h-14 w-14" })}
    </div>
    <div className="text-left">
      <h2 className="text-blue-800 font-bold uppercase text-lg">{title}</h2>
      <p className="text-gray-600 text-sm mt-1">{description}</p>
    </div>
  </button>
))}

</div>


  </div>
</div>

        
      </div>
  );
};

export default KioskServicesMenu;


