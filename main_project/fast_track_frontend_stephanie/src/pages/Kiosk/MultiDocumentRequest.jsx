import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import KioskHeader from "../../components/KioskHeader";
import KioskBackground from "../../components/KioskBackground";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function MultiDocumentRequest() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    studentID: "",
    phoneNumber: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContinue = () => {
    navigate("/AddAnotherDocument"); 
  };

  const handleBack = () => {
    navigate("/KioskServicesMenu");
  };

  return (
    <div className="min-h-screen relative flex flex-col bg-[#2C3E9E]">
      <KioskBackground opacity={10} blueOpacity={80} />
      <div className="relative z-10 flex flex-col min-h-screen">
        <KioskHeader />

        <main className="flex-grow flex justify-center items-center px-4 py-8">
          <div className="bg-white bg-opacity-95 border-2 border-yellow-600 rounded-lg shadow-lg max-w-4xl w-full p-8 md:p-16">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="flex items-center text-gray-700 hover:text-blue-700 mb-4 text-sm font-medium transition"
              type="button"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back
            </button>

            {/* Title */}
            <h2 className="text-center text-blue-900 font-semibold text-2xl mb-2">
              Multi-Document Request
            </h2>
            <p className="text-center text-sm md:text-base text-gray-700 mb-8">
              Enter your details to continue with your document request
            </p>

            {/* Form */}
            <form className="space-y-6">
              {/* Full Name */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-900">
                    First Name<span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 py-2 px-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-900">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                    placeholder="Enter middle name"
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 py-2 px-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-900">
                    Last Name<span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 py-2 px-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Student ID and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-900">
                    Student ID
                  </label>
                  <input
                    type="text"
                    name="studentID"
                    value={formData.studentID}
                    onChange={handleChange}
                    placeholder="e.g., 23-1576-329"
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 py-2 px-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-900">
                    Phone Number<span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    required
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="e.g., 0912-345-6789"
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 py-2 px-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Email + Done Button */}
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="md:w-[400px]">
                  <label className="block text-sm font-medium text-blue-900">
                    Email<span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 py-2 px-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                  />
                </div>

                <div className="mt-4 md:mt-0 md:ml-auto">
                  <button
                    type="button"
                    onClick={handleContinue}
                    className="bg-[#2c3e9e] text-white text-xs rounded-md px-10 py-2 hover:bg-[#1f2c6e] transition font-serif font-semibold"
                  >
                    Done
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
