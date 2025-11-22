// src/components/RequestDetailsModal.jsx
import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const RequestDetailsModal = ({ request, visible, onClose }) => {
  if (!visible || !request) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-8 shadow-2xl max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Request Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Request Number</label>
            <p className="text-gray-900 font-mono">{request.requestNumber}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Status</label>
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${request.statusColor}`}>
              {request.status}
            </span>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Requester Name</label>
            <p className="text-gray-900">{request.requesterName}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Email</label>
            <p className="text-gray-900">{request.email}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Phone</label>
            <p className="text-gray-900">{request.phone}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Documents Requested</label>
            <ul className="list-disc list-inside text-gray-900">
              {request.documents.map((doc, idx) => (
                <li key={idx}>{doc}</li>
              ))}
            </ul>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Date</label>
            <p className="text-gray-900">{request.date}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Amount</label>
            <p className="text-gray-900">₱{request.amount}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Notes</label>
            <p className="text-gray-900">{request.notes}</p>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default RequestDetailsModal;
