import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import KioskHeader from "../../components/KioskHeader";
import KioskBackground from "../../components/KioskBackground";
import nextStepIcon from "../../assets/nextstep.png";
import infoIcon from "../../assets/infoblue.png";

// Progress steps
const progressSteps = [
  { id: 1, label: "Request Received" },
  { id: 2, label: "Processing" },
  { id: 3, label: "Released" },
  { id: 4, label: "Document Received" },
];

const CheckRequestReceipt = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState(location.state?.data || null);
  const [loading, setLoading] = useState(!data);

  // Extract request_number from URL query if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const requestNumber = params.get("request_number");

    if (!data) {
      setLoading(true);
      setTimeout(() => {
        const fetchedData = {
          first_name: "John",
          last_name: "Doe",
          student_number: "2023-12345",
          request_number: requestNumber || "REQ-0001",
          date_requested: "2025-11-10",
          documents: [{ doctype_name: "Transcript of Records" }],
          total_amount: "500 PHP",
          request_status: "Processing",
          completion_percent: 50,
        };
        setData(fetchedData);
        setLoading(false);
      }, 500); // Simulated fetch delay
    }
  }, [data, location.search]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#2C3E9E] text-white">
        <p>Loading request details...</p>
      </div>
    );
  }

  // Prepare fields
  const requester_name = `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim() || "N/A";
  const student_number = data.student_number ?? "N/A";
  const request_number = data.request_number ?? "N/A";
  const date_requested = data.date_requested || data.date || "N/A";
  const documents = Array.isArray(data.documents) ? data.documents : [];
  const total_amount = data.total_amount || data.total || "N/A";
  const status = data.request_status ?? data.status ?? "Processing";
  const completion_percent = data.completion_percent ?? 50;

  // Determine current step based on status
  const statusLower = status.toLowerCase();
  let currentStep = 2;
  if (statusLower === "request received" || statusLower === "received") currentStep = 1;
  else if (statusLower === "processing") currentStep = 2;
  else if (statusLower === "released") currentStep = 3;
  else if (statusLower === "document received") currentStep = 4;

  // Navigation handlers
  const handleCheckAnother = () => setTimeout(() => navigate("/CheckRequestStatus"), 700);
  const handleDone = () => setTimeout(() => navigate(-1), 700);

  return (
    <div className="relative min-h-screen flex justify-center items-center bg-[#2C3E9E] p-6 overflow-hidden">
      <KioskBackground opacity={10} blueOpacity={80} />
      <KioskHeader />

      <div className="relative z-10 bg-white rounded-xl max-w-[900px] w-full flex flex-col lg:flex-row p-8 shadow-xl overflow-hidden">
        
        {/* Left Section: Request Details */}
        <div className="w-full lg:w-3/5 pr-0 lg:pr-8 mb-6 lg:mb-0">
          <h2 className="text-center text-lg font-serif text-black mb-6">Request Details</h2>

          {/* Requester Information */}
          <div className="grid grid-cols-2 gap-y-6 text-sm font-serif text-[#2c3e9e]">
            <div>
              <p className="text-xs font-semibold mb-1">Requester’s Name</p>
              <p className="text-black font-medium text-base">{requester_name}</p>

              <p className="mt-6 text-xs font-semibold mb-1">Request Number</p>
              <p className="text-black font-medium">{request_number}</p>
            </div>
            <div>
              <p className="text-xs font-semibold mb-1">Student Number</p>
              <p className="text-black font-medium">{student_number}</p>

              <p className="mt-6 text-xs font-semibold mb-1">Date Requested</p>
              <p className="text-black font-medium">{date_requested}</p>
            </div>
          </div>

          <hr className="border-[0.5px] border-[#acc3dc] w-full my-6" />

          {/* Documents Requested */}
          <div>
            <p className="mb-2 text-m font-semibold font-serif text-[#2c3e9e]">Document(s) Requested</p>
            {documents.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-1">
                {documents.map((doc) => (
                  <span
                    key={doc.doctype_id || doc.reqdoc_id || doc.doctype_name}
                    className="inline-flex items-center bg-[#2c3e9e] text-white text-xs font-medium px-3 py-1 rounded-full shadow"
                  >
                    {doc.doctype_name ?? doc.name ?? "Document"}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs italic mb-1">N/A</p>
            )}
            <p className="italic text-yellow-600 text-xs font-serif font-medium mt-1">
              <em>Total Amount:</em> {total_amount}
            </p>
          </div>

          <hr className="border border-[#acc3dc] w-full my-6" />

          {/* Status & Completion */}
          <div className="mb-6 flex flex-col space-y-2">
            <p className="text-sm font-semibold font-serif text-[#2c3e9e]">Current Status</p>
            <div className="flex items-center w-full">
              <button
                type="button"
                className="inline-flex items-center bg-[#2c3e9e] text-white text-sm rounded-full px-4 py-1 shadow font-semibold flex-none"
              >
                {status}
              </button>
              <span className="ml-auto text-sm font-semibold font-serif text-[#2c3e9e]">
                {completion_percent}% Complete
              </span>
            </div>
          </div>

          {/* Enhanced Progress Tracker */}
          <div className="w-full mb-6">
            <div className="relative">
              {/* Track Background */}
              <div className="absolute top-6 left-0 w-full h-1 bg-gray-200 rounded-full"></div>

              {/* Track Fill */}
              <div
                className="absolute top-6 left-0 h-1 bg-gradient-to-r from-[#2C3E9E] to-[#4A5FC1] rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${((currentStep - 1) / (progressSteps.length - 1)) * 100}%` }}
              ></div>

              {/* Steps */}
              <ol className="flex items-center justify-between relative">
                {progressSteps.map((step, idx) => {
                  const isActive = idx + 1 === currentStep;
                  const isCompleted = idx + 1 < currentStep;
                  return (
                    <li key={step.id} className="relative flex-1 flex flex-col items-center group">
                      {/* Step Circle */}
                      <div className="flex items-center justify-center">
                        <div
                          className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-bold shadow-xl transition-all duration-500 transform ${
                            isCompleted
                              ? "bg-gradient-to-br from-blue-400 to-blue-500 shadow-blue-400/50"
                              : isActive
                              ? "bg-gradient-to-br from-[#2C3E9E] to-[#4A5FC1] shadow-blue-500/50 animate-bounce"
                              : "bg-gray-300 shadow-gray-400/50"
                          }`}
                        >
                          {isCompleted ? (
                            <svg
                              className="w-6 h-6"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : isActive ? (
                            <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                          ) : (
                            <span className="text-gray-600">{step.id}</span>
                          )}
                        </div>
                      </div>

                      {/* Step Label */}
                      <div className="mt-3 text-center">
                        <span
                          className={`text-sm font-semibold transition-colors duration-300 ${
                            isActive || isCompleted ? "text-[#2C3E9E]" : "text-gray-500"
                          }`}
                        >
                          {step.label}
                        </span>
                        {isActive && (
                          <div className="mt-1 text-xs text-[#4A5FC1] font-medium">In Progress</div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>

        {/* Right Section: Next Step & Info */}
        <div className="w-full lg:w-2/5 flex flex-col justify-between">
          <div className="mt-6 p-4 text-sm text-gray-800 font-serif">
            {/* Header with Icon */}
            <div className="flex items-center gap-2 mb-2">
              <img src={nextStepIcon} alt="Next Step Icon" className="h-5 w-5" />
              <h3 className="font-semibold text-base">Next Step</h3>
            </div>
            <p className="text-[#2c3e9e]">
              Please wait for an SMS/email notification when your documents are ready.
            </p>
          </div>

          <aside className="mt-6 bg-yellow-100 p-4 text-sm font-serif leading-relaxed shadow-sm">
            <p>
              <strong>Estimated completion:</strong> 2-3 business days <br />
              <strong>Pickup Location:</strong> Registrar’s Office, <br />
              2nd Floor, AUF Main Building <br />
              <strong>Notes:</strong> Documents are currently being processed by the Registrar.
            </p>
          </aside>

          <div className="mt-6 flex items-start space-x-3 text-xs text-gray-700 font-serif">
            <img src={infoIcon} alt="Information Icon" className="w-5 h-5 mt-[2px] flex-shrink-0" />
            <p>
              If you are a representative, ensure you have the authorization letter and
              the requester’s valid ID when picking up the documents.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-auto flex justify-end space-x-4">
            <button
              onClick={handleCheckAnother}
              className="w-72 border-2 border-[#2c3e9e] text-[#2c3e9e] text-sm rounded-md py-2 hover:bg-[#2c3e9e] hover:text-white transition-all duration-300 hover:shadow-md"
            >
              Check Another Request
            </button>

            <button
              onClick={handleDone}
              className="w-72 bg-[#2C3E9E] text-white text-sm rounded-md py-2 hover:bg-[#1f2c6e]"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckRequestReceipt;
