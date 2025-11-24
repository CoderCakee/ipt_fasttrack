import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import KioskHeader from "../../components/KioskHeader";
import KioskBackground from "../../components/KioskBackground";
import nextStepIcon from "../../assets/nextstep.png";
import infoIcon from "../../assets/infoblue.png";

const API_BASE = "http://127.0.0.1:8000/api";

const progressSteps = [
  { id: 1, label: "Request Received" },
  { id: 2, label: "Processing" },
  { id: 3, label: "Released" },
  { id: 4, label: "Document Received" },
];

const CheckRequestReceipt = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequestData = async () => {
      // 1. Get ID from URL (e.g., ...?id=105)
      const params = new URLSearchParams(location.search);
      const requestId = params.get("id");

      if (!requestId) {
        // If no ID, go back to scanner
        navigate("/CheckRequestStatus");
        return;
      }

      try {
        setLoading(true);
        // 2. Fetch fresh data from Backend
        const response = await axios.get(`${API_BASE}/check-request-qr/?id=${requestId}`);
        setData(response.data);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Request not found. Please check the ID and try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequestData();
  }, [location.search, navigate]);

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#2C3E9E] text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-serif tracking-wider">Retrieving Request Details...</p>
        </div>
      </div>
    );
  }

  // --- ERROR STATE ---
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#2C3E9E] text-white p-6">
        <KioskBackground opacity={10} blueOpacity={80} />
        <div className="relative z-10 text-center bg-white/10 p-8 rounded-xl backdrop-blur-md border border-white/20 shadow-2xl max-w-md w-full">
          <p className="text-xl font-bold mb-2">Error</p>
          <p className="mb-6 text-sm opacity-90">{error}</p>
          <button
            onClick={() => navigate("/CheckRequestStatus")}
            className="bg-[#C5A93D] hover:bg-[#b09532] text-white px-8 py-3 rounded-lg font-bold uppercase tracking-widest text-sm transition-all shadow-lg"
          >
            Scan Again
          </button>
        </div>
      </div>
    );
  }

  // --- DATA MAPPING ---
  // Using the exact fields from your Python View
  const requester_name = `${data.first_name || ""} ${data.last_name || ""}`.trim();
  const student_number = data.student_number || "N/A";
  const request_number = data.formatted_request_number || `REQ-${data.request_id}`;
  const date_requested = data.date_requested || "N/A";
  const documents = data.requested_documents || [];
  const total_amount = data.total_amount || "0 PHP";
  const status = data.status || "Processing";
  const completion_percent = data.completion_percent || 0;

  // Calculate Progress Step
  const statusLower = status.toLowerCase();
  let currentStep = 2;
  if (statusLower.includes("received") && !statusLower.includes("document")) currentStep = 1;
  else if (statusLower.includes("processing") || statusLower.includes("pending")) currentStep = 2;
  else if (statusLower.includes("released") || statusLower.includes("ready")) currentStep = 3;
  else if (statusLower.includes("document received") || statusLower.includes("completed")) currentStep = 4;

  const handleCheckAnother = () => navigate("/CheckRequestStatus");
  const handleDone = () => navigate("/KioskServicesMenu");

  return (
    <div className="relative min-h-screen flex justify-center items-center bg-[#2C3E9E] p-6 overflow-hidden">
      <KioskBackground opacity={10} blueOpacity={80} />
      <KioskHeader />

      <div className="relative z-10 bg-white rounded-xl max-w-[900px] w-full flex flex-col lg:flex-row p-8 shadow-xl overflow-hidden mt-16 animate-fade-in-up">

        {/* Left Section: Details */}
        <div className="w-full lg:w-3/5 pr-0 lg:pr-8 mb-6 lg:mb-0">
          <h2 className="text-center text-xl font-serif text-blue-900 mb-6 font-bold tracking-wide">Request Details</h2>

          <div className="grid grid-cols-2 gap-y-6 text-sm font-serif text-[#2c3e9e]">
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Requester Name</p>
              <p className="text-black font-semibold text-base capitalize">{requester_name}</p>

              <p className="mt-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Request Number</p>
              <p className="text-black font-semibold">{request_number}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Student Number</p>
              <p className="text-black font-semibold">{student_number}</p>

              <p className="mt-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Date Requested</p>
              <p className="text-black font-semibold">{date_requested}</p>
            </div>
          </div>

          <hr className="border-t border-gray-200 w-full my-6" />

          <div>
            <p className="mb-3 text-sm font-bold font-serif text-[#2c3e9e] uppercase tracking-wide">Document(s) Requested</p>
            {documents.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-3">
                {documents.map((doc, index) => (
                  <div key={index} className="inline-flex items-center bg-blue-50 border border-blue-100 text-blue-900 text-xs px-3 py-1.5 rounded-md shadow-sm">
                    <span className="font-semibold">{doc.document_name}</span>
                    <span className="ml-2 bg-blue-200 text-blue-800 text-[10px] px-1.5 rounded font-bold">x{doc.copy_amount}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 italic mb-2">No documents listed</p>
            )}
            <p className="text-yellow-600 text-sm font-serif font-bold mt-2 flex items-center">
              Total Amount: <span className="ml-2 text-lg">{total_amount}</span>
            </p>
          </div>

          <hr className="border-t border-gray-200 w-full my-6" />

          {/* Status Bar */}
          <div className="mb-6">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Current Status</p>
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
              <span className="inline-flex items-center bg-[#2c3e9e] text-white text-sm rounded px-3 py-1 font-bold capitalize shadow-sm">
                {status}
              </span>
              <span className="text-sm font-bold text-[#2c3e9e]">
                {completion_percent}% Complete
              </span>
            </div>
          </div>

          {/* Progress Tracker Visual */}
          <div className="w-full mb-2 px-2">
            <div className="relative">
              <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 rounded-full"></div>
              <div
                className="absolute top-5 left-0 h-1 bg-[#2C3E9E] rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${((currentStep - 1) / (progressSteps.length - 1)) * 100}%` }}
              ></div>
              <ol className="flex items-center justify-between relative">
                {progressSteps.map((step, idx) => {
                  const isActive = idx + 1 === currentStep;
                  const isCompleted = idx + 1 < currentStep;
                  return (
                    <li key={step.id} className="relative flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md z-10 transition-colors duration-300 ${isCompleted || isActive ? "bg-[#2C3E9E] text-white" : "bg-white border-2 border-gray-300 text-gray-400"}`}>
                         {isCompleted ? "✓" : step.id}
                      </div>
                      <span className={`mt-2 text-[10px] font-bold uppercase tracking-wider ${isCompleted || isActive ? "text-[#2C3E9E]" : "text-gray-400"}`}>{step.label}</span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-2/5 flex flex-col pl-0 lg:pl-8 border-t lg:border-t-0 lg:border-l border-gray-200 mt-6 lg:mt-0 pt-6 lg:pt-0">
           {/* ... (Right section content remains largely the same, just visual tweaks) ... */}
           <div className="flex-grow">
              <div className="flex items-center gap-2 mb-3">
                <img src={nextStepIcon} alt="Next" className="h-6 w-6" />
                <h3 className="font-bold text-blue-900 text-lg">Next Step</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-6">
                {currentStep === 1 && "The registrar is verifying your request details."}
                {currentStep === 2 && "Please wait for an SMS/Email notification when your documents are ready."}
                {currentStep === 3 && "Your documents are ready! Proceed to the window to claim them."}
                {currentStep === 4 && "This request has been completed."}
              </p>

              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
                <h4 className="text-yellow-800 font-bold text-xs uppercase mb-2">Estimated Completion</h4>
                <p className="text-gray-800 text-sm">2-3 business days</p>
                <h4 className="text-yellow-800 font-bold text-xs uppercase mt-3 mb-2">Pickup Location</h4>
                <p className="text-gray-800 text-sm">Registrar’s Office, 2nd Floor, AUF Main Building</p>
              </div>

               <div className="flex gap-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
                <img src={infoIcon} alt="Info" className="w-5 h-5 flex-shrink-0" />
                <p className="text-xs text-blue-900 leading-snug">
                  <strong>Representative?</strong> Ensure you have the authorization letter and the requester’s valid ID.
                </p>
              </div>
           </div>

           <div className="mt-8 space-y-3">
             <button onClick={handleCheckAnother} className="w-full border-2 border-[#2C3E9E] text-[#2C3E9E] font-bold uppercase text-sm py-3 rounded-lg hover:bg-blue-50 transition">
                Check Another Request
             </button>
             <button onClick={handleDone} className="w-full bg-[#2C3E9E] text-white font-bold uppercase text-sm py-3 rounded-lg hover:bg-[#1a2b88] transition shadow-lg">
                Done
             </button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default CheckRequestReceipt;
