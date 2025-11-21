import React from "react";
import { useNavigate } from "react-router-dom";
import {
  DocumentTextIcon,
  UserIcon,
  CreditCardIcon,
  ClockIcon,
  BookOpenIcon,
  PhoneIcon,
  ChevronRightIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import KioskBackground from "../../components/KioskBackground";
import KioskHeader from "../../components/KioskHeader";

const Home = ({
  userName = "Juan",
  activeRequestCount = 1,
  activeRequest = {
    requestNumber: "#1728901234567",
    documents: "TOR, GOOD-MORAL",
    status: "Processing",
    completionPercent: 50,
  },
}) => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col font-sans text-gray-800 bg-[#2C3E9E]">
      {/* Background */}
      <KioskBackground opacity={15} blueOpacity={80} />

      {/* Fixed Header */}
      <KioskHeader />


      {/* Scrollable Content */}
      <div
        className="flex-1 overflow-y-auto pt-16" // adjusted padding to offset header height
        style={{
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE/Edge
        }}
      >
        <style>
          {`
            .scrollable-content::-webkit-scrollbar {
              display: none; /* Chrome, Safari, Opera */
            }
          `}
        </style>

        {/* Main content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          {/* Dashboard card */}
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-20">

            {/* Welcome Banner */}
            <header className="bg-blue-100 rounded-xl p-4 sm:p-6 mb-6 text-gray-800 shadow-md">
              <h2 className="text-lg font-semibold mb-2 sm:mb-4 text-gray-800">
                Welcome back,
                <br />
                <span className="font-bold text-xl">{userName}</span>
              </h2>

              <div className="bg-blue-50 rounded-md py-3 px-4 flex flex-col items-start text-left max-w-full">
                <span className="text-sm font-medium text-gray-700">
                  Active <span className="font-semibold">Requests</span>
                </span>
                <span className="font-bold text-3xl text-blue-900">{activeRequestCount}</span>
              </div>
            </header>

            {/* Active Requests */}
            <section className="mb-6">
              <h3 className="text-gray-700 font-semibold text-lg mb-2">Your Active Requests</h3>
              <div className="border border-blue-200 rounded-lg p-3 sm:p-5 shadow-md bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs text-gray-500">Request {activeRequest.requestNumber}</p>
                  <ClockIcon className="w-5 h-5 text-blue-600" />
                </div>

                <h3 className="text-base font-bold mb-2">{activeRequest.documents}</h3>

                {/* Progress bar */}
                <div className="mb-2">
                  <div className="w-full bg-blue-100 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${activeRequest.completionPercent}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{activeRequest.status}</p>
                </div>

                <button
                  type="button"
                  className="text-blue-700 font-semibold text-sm hover:underline flex items-center gap-1"
                  onClick={() => navigate(`/RequestDetails/${activeRequest.requestNumber}`)}
                >
                  View Details <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            </section>

            {/* Quick Actions */}
            <h3 className="text-gray-700 font-semibold text-lg mb-2">Quick Actions</h3>
            <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {[
                { icon: <DocumentTextIcon className="w-12 h-12 text-blue-700" />, label: "Request Document", onClick: () => navigate("/RequestDocumentStep1") },
                { icon: <CreditCardIcon className="w-12 h-12 text-blue-700" />, label: "Payment Info", onClick: () => navigate("/PaymentInfo") },
                { icon: <ClockIcon className="w-12 h-12 text-blue-700" />, label: "My History", onClick: () => navigate("/RequestHistory") },
                { icon: <UserIcon className="w-12 h-12 text-blue-700" />, label: "My Profile", onClick: () => navigate("/MyProfile") },
              ].map(({ icon, label, onClick }) => (
                <button
                  key={label}
                  onClick={onClick}
                  className="group flex flex-col items-center justify-center border border-gray-300 rounded-xl 
                             p-3 sm:p-4 bg-white shadow-sm transition cursor-pointer
                             hover:bg-blue-700 hover:border-blue-800 hover:shadow-md"
                  aria-label={label}
                >
                  {/* Icon wrapper */}
                  <div className="w-12 h-12 text-blue-700 transition group-hover:text-white flex items-center justify-center">
                    {React.cloneElement(icon, { className: "w-12 h-12 stroke-current" })}
                  </div>
                  
                  {/* Label */}
                  <span className="mt-1 text-sm font-semibold text-gray-700 transition group-hover:text-white">
                    {label}
                  </span>
                </button>
              ))}
            </section>

            {/* FAQ and Contact */}
            <section className="space-y-3 mb-8">
              <button
                type="button"
                className="flex items-center gap-2 w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                onClick={() => navigate("/RegistrarInfo")}
                aria-label="Guidelines & Help"
              >
                <BookOpenIcon className="w-5 h-5" />
                Guidelines & Help
              </button>
              <button
                type="button"
                className="flex items-center gap-2 w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                onClick={() => navigate("/ContactRegistrar")}
                aria-label="Contact Registrar"
              >
                <PhoneIcon className="w-5 h-5" />
                Contact Registrar
              </button>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
