import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  EyeIcon,
  ArrowPathIcon,
  ArrowRightIcon,
  DocumentIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

import KioskBackground from "../../components/KioskBackground";
import KioskHeader from "../../components/KioskHeader";
import RequestDetailsModal from "../../components/Modals/RequestDetailsModal"; 

const mockRequests = [
  {
    requestNumber: "#1762706399293",
    status: "Received",
    documents: ["GRADES"],
    date: "Nov 10, 2025",
    amount: 50,
    statusColor: "bg-blue-100 text-blue-800",
    requesterName: "John Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    notes: "Urgent request for grade transcript.",
  },
  {
    requestNumber: "#1728901234567",
    status: "Processing",
    documents: ["TOR (2 copies)", "GOOD-MORAL"],
    date: "Nov 8, 2025",
    amount: 550,
    statusColor: "bg-yellow-100 text-yellow-800",
    requesterName: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "987-654-3210",
    notes: "For job application.",
  },
  {
    requestNumber: "#1728801234567",
    status: "Claimed",
    documents: ["GRADES"],
    date: "Oct 31, 2025",
    amount: 50,
    statusColor: "bg-gray-300 text-gray-600",
    requesterName: "Alice Johnson",
    email: "alice.johnson@example.com",
    phone: "555-123-4567",
    notes: "Already claimed.",
  },
];

const RequestHistory = () => {
  const navigate = useNavigate();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setSelectedRequest(null);
    setModalVisible(false);
  };

  const handleReRequest = (requestNumber) => {
    alert(`Re-request initiated for ${requestNumber}`);
  };

  return (
    <div className="relative min-h-screen font-sans text-gray-800 bg-[#2C3E9E] flex flex-col">
      {/* Kiosk-style background */}
      <KioskBackground opacity={15} blueOpacity={80} />
      
      {/* Fixed Header */}
      <div className="w-full">
        <KioskHeader />
      </div>

      {/* Scrollable Content */}
      <div 
        className="flex-1 overflow-y-auto pt-20" // Adjust pt-20 based on header height
        style={{
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE/Edge
        }}
      >
        <style>
          {`
            .scrollable-content::-webkit-scrollbar {
              display: none; // Chrome, Safari, Opera
            }
          `}
        </style>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 mb-20 mt-16">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center space-x-2 text-blue-700 hover:text-blue-900 font-semibold mb-6"
            >
              <ArrowRightIcon className="w-5 h-5 rotate-180" />
              <span>Back</span>
            </button>

            <h1 className="text-2xl font-bold mb-2 text-gray-900">Request History</h1>
            <p className="mb-6 text-sm text-gray-700">{mockRequests.length} requests found</p>

            <ul className="space-y-6">
              {mockRequests.map((request) => (
                <li
                  key={request.requestNumber}
                  className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-300 p-6 space-y-4 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <header className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DocumentIcon className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-mono text-gray-700">{`Request ${request.requestNumber}`}</span>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${request.statusColor} shadow-sm`}>
                      {request.status}
                    </span>
                  </header>

                  <section className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-800">Documents Requested:</h4>
                    {request.documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <ArrowRightIcon className="w-4 h-4 text-blue-600" />
                        <p className="font-medium text-gray-900">{doc}</p>
                      </div>
                    ))}
                  </section>

                  <section className="flex items-center justify-between text-sm text-gray-600 bg-gray-200 rounded-lg p-3">
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="w-4 h-4" />
                      <time dateTime={request.date}>{request.date}</time>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>₱{request.amount}</span>
                    </div>
                  </section>

                  <footer className="flex space-x-4 mt-4">
                    <button
                      onClick={() => handleViewDetails(request)}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 font-semibold transition shadow-md hover:shadow-lg"
                    >
                      <EyeIcon className="w-4 h-4" />
                      View Details
                    </button>
                  </footer>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <RequestDetailsModal
        request={selectedRequest}
        visible={modalVisible}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default RequestHistory;
