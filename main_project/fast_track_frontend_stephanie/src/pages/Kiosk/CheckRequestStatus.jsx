import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FastTrackLogo from "../../assets/logo.png";
import background from "../../assets/background.webp";
import { ArrowLeftIcon, QrCodeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";

const API_BASE = "http://127.0.0.1:8000"; // Backend URL

export default function CheckRequestStatus() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("requestNumber");
  const [requestNumber, setRequestNumber] = useState("");
  const [formData, setFormData] = useState({ firstName: "", lastName: "", studentNumber: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (activeTab === "requestNumber") {
        if (!requestNumber.trim()) return alert("Please enter your request number!");
        // Use backend endpoint for request number
        const postRes = await axios.post(`${API_BASE}/api/check-request-number/`, { request_number: requestNumber });
        // Then fetch full details using returned request_id
        response = await axios.get(`${API_BASE}/api/check-request-details/${postRes.data.request_id}/`);
      } else {
        const { firstName, lastName, studentNumber } = formData;
        if (!firstName || !lastName || !studentNumber) return alert("Fill in all fields!");
        // Use backend endpoint for student info
        response = await axios.post(`${API_BASE}/api/check-request-by-student/`, {
          first_name: firstName,
          last_name: lastName,
          student_number: studentNumber, 
        });
      }

      // Navigate to receipt page with data
      navigate("/CheckRequestReceipt", { state: { data: response.data } });
    } catch (err) {
      console.error("API Error:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Something went wrong. Try again.");
    }
  };

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleBack = () => navigate("/KioskServicesMenu");

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-[#2C3E9E] pt-20">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url(${background})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          filter: "brightness(0.7) blur(1px)",
          zIndex: 0,
        }}
      />
      <header className="absolute top-0 left-0 z-10 bg-white rounded-br-[6rem] px-6 py-2 shadow-lg w-[360px] flex items-center">
        <img src={FastTrackLogo} alt="Fast Track logo" className="h-24 w-auto object-contain" />
      </header>

      <main className="relative z-10 bg-white rounded-xl border-2 border-yellow-600 max-w-lg w-full p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center text-sm text-[#2C3E9E] font-normal mb-5 hover:underline"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" /> Back
          </button>

          <h1 className="text-center text-[#2C3E9E] font-semibold text-lg mb-1 tracking-wide">
            Check Request Status
          </h1>
          <p className="text-center text-sm text-gray-700 mb-6">
            Enter your details to view request status
          </p>

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-200 rounded-full overflow-hidden mb-6 text-sm font-mono shadow-inner">
            <button
              type="button"
              onClick={() => setActiveTab("requestNumber")}
              className={`flex-1 py-2 font-semibold ${
                activeTab === "requestNumber"
                  ? "bg-[#2C3E9E] text-white rounded-full"
                  : "text-[#2C3E9E]"
              }`}
            >
              Request Number
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("studentDetails")}
              className={`flex-1 py-2 font-semibold ${
                activeTab === "studentDetails"
                  ? "bg-[#2C3E9E] text-white rounded-full"
                  : "text-[#2C3E9E]"
              }`}
            >
              Student Details
            </button>
          </div>

          {/* Request Number Tab */}
          {activeTab === "requestNumber" && (
            <section className="mb-6">
              <label
                htmlFor="requestNumber"
                className="block font-mono text-[#2C3E9E] mb-2 text-xs font-semibold"
              >
                Request Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="requestNumber"
                  name="requestNumber"
                  value={requestNumber}
                  onChange={(e) => setRequestNumber(e.target.value)}
                  placeholder="e.g., FAST-2024-510586"
                  className="w-full pr-11 rounded-md border border-[#2C3E9E] px-4 py-2 placeholder-gray-400 text-gray-700"
                />
                <button
                  type="button"
                  onClick={() => alert("QR code scan clicked")}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-[#2C3E9E]"
                >
                  <QrCodeIcon className="h-5 w-5" />
                </button>
              </div>
            </section>
          )}

          {/* Student Details Tab */}
          {activeTab === "studentDetails" && (
            <section className="mb-6">
              <div className="flex gap-4 mb-4">
                <div className="flex flex-col w-1/2">
                  <label
                    htmlFor="firstName"
                    className="text-xs font-semibold text-[#2C3E9E] mb-1"
                  >
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="e.g., John"
                    className="rounded-md border border-[#2C3E9E] px-4 py-2 placeholder-gray-400 text-gray-700"
                  />
                </div>

                <div className="flex flex-col w-1/2">
                  <label
                    htmlFor="lastName"
                    className="text-xs font-semibold text-[#2C3E9E] mb-1"
                  >
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="e.g., Doe"
                    className="rounded-md border border-[#2C3E9E] px-4 py-2 placeholder-gray-400 text-gray-700"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="studentNumber"
                  className="text-xs font-semibold text-[#2C3E9E] mb-1"
                >
                  Student Number
                </label>
                <input
                  type="text"
                  id="studentNumber"
                  name="studentNumber"
                  value={formData.studentNumber}
                  onChange={handleChange}
                  placeholder="e.g., 2024-12345"
                  className="rounded-md bg-gray-200 px-4 py-2 placeholder-gray-400 text-gray-700"
                />
              </div>
            </section>
          )}

          <button
            type="submit"
            className="mt-4 w-full flex justify-center items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 rounded-lg"
          >
            <MagnifyingGlassIcon className="h-5 w-5" /> CHECK STATUS
          </button>
        </form>
      </main>
    </div>
  );
}
