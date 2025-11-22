import React from "react";
import { useNavigate } from "react-router-dom";
import checkStatusIcon from "../../assets/qrcode.png";
import requestDocumentIcon from "../../assets/requestdocument.png";
import RegistrarInfoIcon from "../../assets/info.png";
import ChooseIcon from "../../assets/choose.png";

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
    title: "REGISTRAR INFO & HELP",
    description: "Office hours, location & guidelines",
    icon: <img src={RegistrarInfoIcon} alt="Registrar Info Icon" className="h-12 w-12" />,
  },
];

const KioskServicesMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col lg:flex-row overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="h-1/2 bg-blue-800"></div>
        <div className="h-1/2 bg-white"></div>
      </div>

      {/* ===== Left Panel ===== */}
      <div className="text-gold flex flex-col justify-center p-8 lg:w-1/3 rounded-br-[80px] bg-blue-800 shadow-xl">
        <h1 className="text-6xl font-extrabold uppercase mb-6 text-yellow-500 tracking-widest">
          Welcome!
        </h1>
        <p className="text-white text-xl mb-8 max-w-xs leading-relaxed whitespace-nowrap">
          Fast Track helps you skip the long lines <br /> and get your documents quickly.
        </p>

        <ul className="text-white text-lg space-y-3 max-w-xs list-none">
          <li className="flex items-start space-x-2 whitespace-nowrap">
            <span className="text-yellow-400 mt-1">➢</span>
            <span>Request document in just a few steps</span>
          </li>
          <li className="flex items-start space-x-2 whitespace-nowrap">
            <span className="text-yellow-400 mt-1">➢</span>
            <span>Can process multiple requests</span>
          </li>
          <li className="flex items-start space-x-2 whitespace-nowrap">
            <span className="text-yellow-400 mt-1">➢</span>
            <span>Track your request anytime</span>
          </li>
        </ul>
      </div>

      {/* ===== Right Panel ===== */}
      <div className="flex-1 bg-white p-8 flex flex-col items-center justify-start rounded-tl-[80px]">
        <div className="w-full max-w-6xl flex flex-col h-full">
          {/* Banner + Square Icon */}
          <div className="flex items-center space-x-4 mt-16">
            {/* Square icon box */}
            <div className="bg-yellow-600 w-20 h-20 flex items-center justify-center rounded-md shadow-lg">
              <img src={ChooseIcon} alt="Icon" className="h-12 w-12" />
            </div>

            {/* Banner */}
            <div className="bg-yellow-600 px-8 py-6 select-none inline-block rounded-r-full">
              <span className="uppercase font-semibold text-white text-xl tracking-widest">
                Choose a service to continue
              </span>
            </div>
          </div>

          {/* Services Grid */}
          <div className="mt-10 flex-1 flex flex-col space-y-6">
            {services.map(({ title, description, icon }, idx) => (
              <button
                key={idx}
                onClick={() => {
                setTimeout(() => {

                  if (title === "REQUEST DOCUMENT") navigate("/RequestDocumentStep1");
                  else if (title === "SCAN QR TO CHECK STATUS") navigate("/CheckRequestStatus");
                  else if (title === "REGISTRAR INFO & HELP") navigate("/RegistrarInfo");
                }, 600); 

                }}
                className="flex items-center gap-8 w-full rounded-xl px-12 py-8 cursor-pointer
                  bg-gray-100 hover:bg-blue-50 hover:border hover:border-blue-800
                  transition-all shadow-sm hover:shadow-md"
              >
                <div className="bg-blue-800 p-4 rounded-2xl flex justify-center items-center shrink-0">
                  {React.cloneElement(icon, { className: "h-12 w-12" })}
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
