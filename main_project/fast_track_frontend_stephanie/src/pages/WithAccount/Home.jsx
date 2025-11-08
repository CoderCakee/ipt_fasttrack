import React from "react";
import { useNavigate } from "react-router-dom";
import {
  DocumentTextIcon,
  MagnifyingGlassIcon,
  CreditCardIcon,
  ClockIcon,
  BookOpenIcon,
  PhoneIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

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
    <div className="min-h-screen bg-[#2C3E9E] font-sans text-gray-800">
      {/* Centered container */}
      <div className="max-w-6xl mx-auto px-4 md:px-10 py-8">
        {/* Light background panel for the "form/dashboard" */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 mt-6">
          
          {/* Welcome Banner */}
          <header className="bg-blue-100 rounded-xl p-6 mb-8 text-gray-800 shadow-md">
            {/* Greeting */}
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Welcome back,
              <br />
              <span className="font-bold text-xl">{userName}</span>
            </h2>

            {/* Active Requests Banner */}
            <div className="bg-blue-50 rounded-md py-4 px-6 flex items-center gap-2 max-w-5xl">
              <span className="font-semibold text-2xl">{activeRequestCount}</span>
              <span
                className="text-sm cursor-pointer underline hover:text-blue-700"
                onClick={() => navigate("/RequestHistory")}
              >
                Active <span className="font-semibold">Requests</span>
              </span>
            </div>
          </header>

          {/* Active Requests */}
          <section className="mb-10">
            <h3 className="text-gray-700 font-semibold text-lg mb-3">
              Your Active Requests
            </h3>

            <div className="border border-blue-200 rounded-lg p-5 shadow-md bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <p className="text-xs text-gray-500">
                  Request {activeRequest.requestNumber}
                </p>
                <ClockIcon className="w-5 h-5 text-blue-600" />
              </div>

              <h3 className="text-base font-bold mb-2">{activeRequest.documents}</h3>

              {/* Progress bar and status */}
              <div className="mb-3">
                <div className="w-full bg-blue-100 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all"
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

          {/* Quick Actions Label */}
          <h3 className="text-gray-700 font-semibold text-lg mb-3">
            Quick Actions
          </h3>

          {/* Quick Actions */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            {[
              {
                icon: <DocumentTextIcon className="w-8 h-8 text-blue-700" />,
                label: "Request Document",
                onClick: () => navigate("/RequestDocumentStep1"),
              },
              {
                icon: <MagnifyingGlassIcon className="w-8 h-8 text-blue-700" />,
                label: "Track Request",
                onClick: () => navigate("/CheckRequestStatus"),
              },
              {
                icon: <CreditCardIcon className="w-8 h-8 text-blue-700" />,
                label: "Payment Info",
                onClick: () => navigate("/PaymentInfo"),
              },
              {
                icon: <ClockIcon className="w-8 h-8 text-blue-700" />,
                label: "My History",
                onClick: () => navigate("/RequestHistory"),
              },
            ].map(({ icon, label, onClick }) => (
              <button
                key={label}
                onClick={onClick}
                className="flex flex-col items-center justify-center border border-gray-300 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition cursor-pointer"
                aria-label={label}
                type="button"
              >
                {icon}
                <span className="mt-2 text-sm font-semibold text-gray-700">{label}</span>
              </button>
            ))}
          </section>

          {/* FAQ and Contact */}
          <section className="space-y-4">
            <button
              type="button"
              className="flex items-center gap-3 w-full border border-gray-300 rounded-xl px-6 py-4 text-gray-700 hover:bg-gray-50 transition cursor-pointer"
              onClick={() => navigate("/GuidelinesHelp")}
              aria-label="Guidelines & Help"
            >
              <BookOpenIcon className="w-6 h-6" />
              Guidelines & Help
            </button>
            <button
              type="button"
              className="flex items-center gap-3 w-full border border-gray-300 rounded-xl px-6 py-4 text-gray-700 hover:bg-gray-50 transition cursor-pointer"
              onClick={() => navigate("/ContactRegistrar")}
              aria-label="Contact Registrar"
            >
              <PhoneIcon className="w-6 h-6" />
              Contact Registrar
            </button>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Home;
