import React from "react";
import { useNavigate } from "react-router-dom";
import {
  DocumentTextIcon,
  MagnifyingGlassIcon,
  CurrencyDollarIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import KioskBackground from "../../components/KioskBackground";

const HomeAlumni = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: "Request a Document",
      subtitle: "TOR, Diploma, Grades, and more",
      icon: <DocumentTextIcon className="w-10 h-10 text-blue-700" />,
      path: "/RequestDocumentStep1",
    },
    {
      title: "Check Request Status",
      subtitle: "Track your document request",
      icon: <MagnifyingGlassIcon className="w-10 h-10 text-blue-700" />,
      path: "/CheckRequestStatus",
    },
    {
      title: "Payment Guidelines",
      subtitle: "How to pay for your request",
      icon: <CurrencyDollarIcon className="w-10 h-10 text-blue-700" />,
      path: "/PaymentInfo",
    },
    {
      title: "Registrar Information",
      subtitle: "Office hours, location & guidelines",
      icon: <InformationCircleIcon className="w-10 h-10 text-blue-700" />,
      path: "/RegistrarInfo",
    },
  ];

  return (
    <div className="relative min-h-screen font-sans text-gray-800 bg-[#2C3E9E]">
      {/* Background */}
      <KioskBackground opacity={15} blueOpacity={80} />

      {/* Foreground content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Main White Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mt-14 mb-10">
          {/* Header */}
          <header className="bg-blue-100 rounded-xl p-4 sm:p-6 mb-6 text-gray-800 shadow-md">
            <h1 className="text-lg font-semibold mb-2 text-gray-800">
              Request Your AUF Documents
            </h1>
            <p className="text-sm text-gray-700">
              Fast and convenient document processing for alumni and guests.
            </p>
          </header>

          {/* Info Box */}
          <section className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3 mb-8 text-blue-900 text-sm shadow-sm">
            <InformationCircleIcon className="w-5 h-5 mt-0.5 flex-shrink-0 text-blue-800" />
            <p>
              Log in with your AUF credentials to access your request history
              and experience faster processing.
            </p>
          </section>

          {/* Services Grid */}
          <section className="grid grid-cols-2 sm:grid-cols-2 gap-4">
            {services.map(({ title, subtitle, icon, path }) => (
              <button
                key={title}
                onClick={() => navigate(path)}
                className="flex flex-col items-center justify-center border border-gray-300 rounded-xl p-5 bg-white shadow-sm hover:shadow-md hover:bg-blue-50 transition cursor-pointer text-center"
                aria-label={`Go to ${title}`}
              >
                <div className="mb-2">{icon}</div>
                <h2 className="text-base font-semibold text-blue-900">{title}</h2>
                <p className="text-xs text-gray-600 mt-1">{subtitle}</p>
              </button>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
};

export default HomeAlumni;
