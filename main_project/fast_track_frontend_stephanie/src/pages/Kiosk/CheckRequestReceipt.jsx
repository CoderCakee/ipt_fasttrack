import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import KioskHeader from "../../components/KioskHeader";
import KioskBackground from "../../components/KioskBackground";

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
        // Use either fetched request_number or default
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
      }, 500); // small delay to simulate fetch
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

  // Determine current step
  const statusLower = status.toLowerCase();
  let currentStep = 2;
  if (statusLower === "request received" || statusLower === "received") currentStep = 1;
  else if (statusLower === "processing") currentStep = 2;
  else if (statusLower === "released") currentStep = 3;
  else if (statusLower === "document received") currentStep = 4;

  const handleCheckAnother = () => navigate("/CheckRequestStatus");
  const handleDone = () => navigate("/KioskServicesMenu");

  return (
    <div className="relative min-h-screen flex justify-center items-center bg-[#2C3E9E] p-6 overflow-hidden">
      <KioskBackground opacity={10} blueOpacity={80} />
      <KioskHeader />

      <div className="relative z-10 bg-white rounded-xl border border-yellow-400 max-w-[900px] w-full flex flex-col lg:flex-row p-8 shadow-xl overflow-hidden">
        {/* Left Section */}
        <div className="w-full lg:w-3/5 pr-0 lg:pr-8 mb-6 lg:mb-0">
          <h2 className="text-center text-lg font-serif font-bold text-black mb-6">Request Details</h2>

          <div className="grid grid-cols-2 gap-y-6 text-sm font-serif text-[#2c3e9e]">
            <div>
              <p className="text-xs font-semibold mb-1">Requester’s Name</p>
              <p className="text-black font-semibold text-base">{requester_name}</p>

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

          <hr className="border border-[#acc3dc] w-full my-6" />

          <div>
            <p className="mb-2 text-sm font-semibold font-serif text-[#2c3e9e]">Document(s) Requested</p>
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
          <div className="mb-6 flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <button
              type="button"
              className="inline-flex items-center space-x-2 bg-[#2c3e9e] text-white text-sm rounded-full px-4 py-1 shadow font-semibold"
            >
              <span>{status}</span>
            </button>
            <span className="mt-2 lg:mt-0 text-[#2c3e9e] text-sm font-semibold font-serif">
              {completion_percent}% Complete
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full mb-6">
            <ol className="flex items-center justify-between">
              {progressSteps.map((step, idx) => {
                const isActive = idx + 1 === currentStep;
                const isCompleted = idx + 1 < currentStep;
                return (
                  <li key={step.id} className="relative flex-1 flex flex-col items-center">
                    <div className="flex items-center justify-center">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center text-white font-bold ${
                          isCompleted ? "bg-[#2c3e9e]" : isActive ? "bg-[#2c3e9e]" : "bg-gray-300"
                        }`}
                      >
                        {step.id}
                      </div>
                      {idx < progressSteps.length - 1 && (
                        <div
                          className={`absolute top-3 left-1/2 w-full h-1 ${
                            isCompleted ? "bg-[#2c3e9e]" : "bg-gray-300"
                          }`}
                          style={{ zIndex: -1 }}
                        />
                      )}
                    </div>
                    <span className={`mt-2 text-xs text-center ${isActive || isCompleted ? "text-[#2c3e9e]" : "text-gray-500"}`}>
                      {step.label}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-2/5 flex flex-col justify-between">
          <div className="mt-6 bg-yellow-50 rounded-md border border-yellow-300 p-4 text-sm text-gray-800 font-serif shadow-sm">
            <h3 className="font-semibold mb-2 text-base">Next Step</h3>
            <p className="text-blue-700">
              Please wait for an SMS/email notification when your documents are ready.
            </p>
          </div>

          <aside className="mt-6 bg-yellow-100 border border-yellow-300 rounded-md p-4 text-sm font-serif leading-relaxed shadow-sm">
            <p>
              <strong>Estimated completion:</strong> 2-3 business days <br />
              <strong>Pickup Location:</strong> Registrar’s Office, Room 102 <br />
              <strong>Notes:</strong> Documents are currently being processed by the Registrar.
            </p>
          </aside>

          <div className="mt-6 flex items-start space-x-3 text-xs text-gray-700 font-serif">
            <svg
              className="w-5 h-5 text-blue-600 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1 4v-4m-3 8h6m-3-14h.01" />
            </svg>
            <p>
              If you are a representative, ensure you have the authorization letter and the requester’s valid ID when picking up the documents.
            </p>
          </div>

          <div className="mt-auto flex justify-end space-x-4">
            <button
              onClick={handleCheckAnother}
              className="border border-[#2c3e9e] text-[#2c3e9e] text-sm rounded-md px-6 py-2 hover:bg-[#e7eefa]"
            >
              Check Another Request
            </button>
            <button
              onClick={handleDone}
              className="bg-[#2c3e9e] text-white text-sm rounded-md px-10 py-2 hover:bg-[#1f2c6e]"
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
