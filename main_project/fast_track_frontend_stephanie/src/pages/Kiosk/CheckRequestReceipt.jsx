import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import KioskHeader from "../../components/KioskHeader";
import KioskBackground from "../../components/KioskBackground";

const CheckRequestReceipt = () => {
  const navigate = useNavigate();
  const data = useLocation().state?.data;

  // Redirect if no data is provided
  if (!data) {
    navigate("/CheckRequestStatus");
    return null;
  }

  // Extract and format data
  const requester_name = `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim() || "N/A";
  const request_number = data.request_number ?? "N/A";
  const student_number = data.student_number ?? "N/A";
  const date_requested = data.date_requested || data.date || "N/A";
  const documents = Array.isArray(data.documents) ? data.documents : [];
  const total_amount = data.total_amount || data.total || "N/A";
  const status = data.request_status ?? data.status ?? "Pending";
  const completion_percent = data.completion_percent ?? 0;

  // Generate document list string
  const document_list =
    documents.length > 0
      ? documents.map((doc) => `${doc.doctype_name} (${doc.copy_amount} copies)`).join(", ")
      : "N/A";

  // Navigation handlers
  const handleCheckAnother = () => navigate("/CheckRequestStatus");
  const handleDone = () => navigate("/RequestNotFound");

  return (
    <div className="relative min-h-screen flex justify-center items-center bg-[#2C3E9E] p-6 overflow-hidden">
      {/* Background Overlay */}
      <KioskBackground opacity={10} blueOverlay={80} />

      {/* Header */}
      <KioskHeader />

      {/* Receipt Card */}
      <div className="relative z-10 bg-white rounded-lg border border-yellow-400 max-w-[900px] w-full flex p-8 shadow-lg overflow-hidden">
        {/* Left Section: Request Details */}
        <div className="w-3/5 pr-4">
          <h2 className="text-center text-base font-serif text-black mb-6">Request Details</h2>

          {/* Requester Info */}
          <div className="grid grid-cols-2 gap-y-6 text-sm font-serif text-[#2c3e9e]">
            <div>
              <p className="text-xs font-semibold mb-2">Requester’s Name</p>
              <p className="text-black font-semibold text-base">{requester_name}</p>

              <p className="mt-8 text-xs font-semibold mb-2">Request Number</p>
              <p className="text-black">{request_number}</p>
            </div>
            <div>
              <p className="text-xs font-semibold mb-2">Student Number</p>
              <p className="text-black font-semibold text-base">{student_number}</p>

              <p className="mt-8 text-xs font-semibold mb-2">Date Requested</p>
              <p className="text-black">{date_requested}</p>
            </div>
          </div>

          <hr className="border border-[#acc3dc] w-5/6 my-6" />

          {/* Documents Section */}
          <div>
            <p className="mb-2 text-sm font-semibold font-serif text-[#2c3e9e]">Document(s) Requested</p>
            <button
              type="button"
              className="inline-flex items-center space-x-2 bg-[#2c3e9e] text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm"
            >
              {document_list}
            </button>
            <p className="italic text-yellow-600 text-xs mt-1 font-serif font-medium">
              <em>Total Amount :</em> {total_amount}
            </p>
          </div>

          <hr className="border border-[#acc3dc] w-5/6 my-6" />

          {/* Status & Completion */}
          <div className="mb-4 flex items-center">
            <button
              type="button"
              className="inline-flex items-center space-x-2 bg-[#2c3e9e] text-white text-xs rounded-full px-3 py-1 shadow-sm"
            >
              {status}
            </button>
            <span className="ml-52 text-[#2c3e9e] text-xs font-semibold font-serif">
              {completion_percent}% Complete
            </span>
          </div>
        </div>

        {/* Right Section: Action Buttons */}
        <div className="w-2/5 flex flex-col justify-between -ml-8">
          <div className="flex justify-end space-x-6 mt-8">
            <button
              onClick={handleCheckAnother}
              className="border border-[#2c3e9e] text-[#2c3e9e] text-xs rounded-md px-6 py-2 hover:bg-[#e7eefa]"
            >
              Check Another Request
            </button>
            <button
              onClick={handleDone}
              className="bg-[#2c3e9e] text-white text-xs rounded-md px-10 py-2 hover:bg-[#1f2c6e]"
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
