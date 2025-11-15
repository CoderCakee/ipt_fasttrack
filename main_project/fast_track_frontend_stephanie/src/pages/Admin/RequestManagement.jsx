import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import ViewRequestDetails from "../../components/ViewRequestDetails";
import SearchIcon from "../../assets/search.png";

// StatusTag component for colored status badges
const StatusTag = ({ status }) => {
  const statusStyles = {
    Processing: "bg-blue-100 text-blue-800",
    Released: "bg-green-100 text-green-700",
    "Request Received": "bg-gray-300 text-gray-600",
  };

  const style = statusStyles[status] || "bg-gray-200 text-gray-700";

  return (
    <span
      className={`${style} px-3 py-1 text-xs rounded-full font-semibold whitespace-nowrap shadow-sm`}
    >
      {status}
    </span>
  );
};

// Individual request card with Notify button
const RequestCard = ({ requestNumber, requesterName, documents, status, onView, onNotify }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4 shadow-sm hover:shadow-md transition-shadow duration-200">
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <p className="text-blue-700 font-semibold text-lg mb-1">{requestNumber}</p>
        <p className="text-gray-800 mb-2">{requesterName}</p>
        <p className="text-xs text-gray-500 font-semibold mb-1">Documents</p>
        <p className="text-gray-700 text-sm">{documents}</p>
      </div>

      <div className="flex flex-col items-end space-y-3 ml-4">
        <StatusTag status={status} />
        <div className="flex space-x-2">
          <button
            onClick={onView}
            className="flex items-center gap-1 border border-gray-400 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-100 transition"
            aria-label={`View details for ${requestNumber}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            View
          </button>
          <button
            onClick={onNotify}
            className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition"
            aria-label={`Notify for ${requestNumber}`}
          >
            Notify
          </button>
        </div>
      </div>
    </div>
  </div>
);

const RequestManagement = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Static data for demo; replace with API in the future
  const requests = [
    {
      id: 1,
      request_id: 1,
      requestNumber: "FAST-2024-510586",
      requesterName: "Juan Dela Cruz",
      user: { first_name: "Juan", last_name: "Dela Cruz" },
      email: "juan@auf.edu.ph",
      contact_number: "09123456789",
      requested_documents: [
        { doctype_id: 1, name: "Diploma", copy_amount: 1 },
        { doctype_id: 2, name: "Good Moral Certificate", copy_amount: 1 },
      ],
      status: "Processing",
    },
    {
      id: 2,
      request_id: 2,
      requestNumber: "FAST-2024-510587",
      requesterName: "Maria Santos",
      user: { first_name: "Maria", last_name: "Santos" },
      email: "maria@auf.edu.ph",
      contact_number: "09223334444",
      requested_documents: [
        { doctype_id: 3, name: "Transcript of Records", copy_amount: 1 },
      ],
      status: "Released",
    },
  ];

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleStatusChange = (e) => setStatusFilter(e.target.value);

  const handleViewClick = (req) => {
    setSelectedRequest(req);
  };

  const closeModal = () => setSelectedRequest(null);

  // New: handle notification button click
  const handleNotify = (req) => {
    navigate("/NotificationManagement", {
      state: {
        recipient: req.email || "",
        requestNumber: req.requestNumber || "",
        notificationType: "Email", // default notification type or logic to determine
      },
    });
  };

  // Filter
  const filteredRequests = requests.filter((req) => {
    const statusMatch =
      statusFilter === "All Statuses" || req.status === statusFilter;
    const searchLower = searchTerm.toLowerCase();
    const searchMatch =
      req.requestNumber.toLowerCase().includes(searchLower) ||
      req.requesterName.toLowerCase().includes(searchLower);
    return statusMatch && searchMatch;
  });

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-900 mb-1">Request Management</h1>
        <p className="text-gray-700 text-base">Manage and track document requests</p>
      </div>

      {/* Search and filter */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-col md:flex-row items-center gap-4 mb-8 bg-gray-50 p-4 rounded-lg shadow-sm"
      >
        <div className="relative flex-grow w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by name, ID, or request number..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full border border-gray-300 rounded-md pl-4 pr-20 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />

          <button
            type="submit"
            className="absolute right-0 top-0 h-full px-6 bg-blue-800 text-white rounded-r-md hover:bg-blue-900 transition flex items-center justify-center"
          >
            <img
              src={SearchIcon}
              alt="Search"
              className="w-5 h-5 object-contain filter invert brightness-0"
            />
          </button>
        </div>

        <select
          value={statusFilter}
          onChange={handleStatusChange}
          className="border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        >
          <option>All Statuses</option>
          <option>Processing</option>
          <option>Released</option>
          <option>Request Received</option>
        </select>
      </form>

      {/* Requests List */}
      <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Requests</h2>
        {filteredRequests.length === 0 ? (
          <p className="text-gray-600 italic text-center py-8">No matching requests found.</p>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((req) => (
              <RequestCard
                key={req.id}
                requestNumber={req.requestNumber}
                requesterName={req.requesterName}
                documents={req.requested_documents.map((d) => d.name).join(", ")}
                status={req.status}
                onView={() => handleViewClick(req)}
                onNotify={() => handleNotify(req)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Modal for ViewRequestDetails */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <ViewRequestDetails
            request={selectedRequest}
            onMarkProcessing={(id) => console.log("Mark Processing:", id)}
            onMarkReleased={(id) => console.log("Mark Released:", id)}
            onClose={closeModal}
          />
          <button
            onClick={closeModal}
            className="absolute top-6 right-8 text-white text-3xl font-bold hover:text-gray-300"
          >
            ×
          </button>
        </div>
      )}
    </AdminLayout>
  );
};

export default RequestManagement;
