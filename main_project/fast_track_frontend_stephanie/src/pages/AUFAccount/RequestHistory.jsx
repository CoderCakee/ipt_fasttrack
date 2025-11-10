import React from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import KioskBackground from "../../components/KioskBackground";

const mockRequests = [
  {
    requestNumber: "#1762706399293",
    status: "Received",
    documents: ["GRADES"],
    date: "Nov 10, 2025",
    amount: 50,
    statusColor: "bg-blue-100 text-blue-800",
  },
  {
    requestNumber: "#1728901234567",
    status: "Processing",
    documents: ["TOR (2 copies)", "GOOD-MORAL"],
    date: "Nov 8, 2025",
    amount: 550,
    statusColor: "bg-yellow-100 text-yellow-800",
  },
  {
    requestNumber: "#1728801234567",
    status: "Claimed",
    documents: ["GRADES"],
    date: "Oct 31, 2025",
    amount: 50,
    statusColor: "bg-gray-300 text-gray-600",
  },
];

const RequestHistory = () => {
  const navigate = useNavigate();

  const handleViewDetails = (requestNumber) => {
    alert(`View details for request ${requestNumber}`);
  };

  const handleReRequest = (requestNumber) => {
    alert(`Re-request initiated for ${requestNumber}`);
  };

  return (
    <div className="relative min-h-screen font-sans text-gray-800 bg-[#2C3E9E]">
      {/* Kiosk-style background */}
      <KioskBackground opacity={15} blueOpacity={80} />

      {/* Centered main container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Light container for form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">

          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-2 text-blue-700 hover:text-blue-900 font-semibold mb-6"
          >
            <ArrowPathIcon className="w-5 h-5 rotate-180" />
            <span>Back</span>
          </button>

          {/* Page header */}
          <h1 className="text-2xl font-bold mb-2 text-gray-900">Request History</h1>
          <p className="mb-6 text-sm text-gray-700">{mockRequests.length} requests found</p>

          {/* Request list */}
          <ul className="space-y-6">
            {mockRequests.map(({ requestNumber, status, documents, date, amount, statusColor }) => (
              <li
                key={requestNumber}
                className="bg-gray-50 rounded-xl border border-gray-300 p-5 space-y-4 shadow-sm hover:shadow-md transition"
              >
                <header className="flex items-center justify-between">
                  <span className="text-sm font-mono text-gray-700">{`Request ${requestNumber}`}</span>
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusColor}`}>
                    {status}
                  </span>
                </header>

                <section>
                  {documents.map((doc, idx) => (
                    <p key={idx} className="font-semibold text-gray-900 leading-none">{doc}</p>
                  ))}
                </section>

                <section className="flex items-center space-x-6 text-sm text-gray-600">
                  <time dateTime={date}>{date}</time>
                  <span>₱{amount}</span>
                </section>

                <footer className="flex space-x-4 mt-4">
                  <button
                    onClick={() => handleViewDetails(requestNumber)}
                    className="flex items-center gap-1 border border-gray-300 rounded px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                  >
                    <EyeIcon className="w-4 h-4" />
                    View Details
                  </button>
                  <button
                    onClick={() => handleReRequest(requestNumber)}
                    className="flex items-center gap-1 border border-gray-300 rounded px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                  >
                    <ArrowPathIcon className="w-4 h-4" />
                    Re-request
                  </button>
                </footer>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RequestHistory;
