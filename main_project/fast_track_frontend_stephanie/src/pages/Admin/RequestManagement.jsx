import React, { useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import SearchIcon from "../../assets/search.png";

// StatusTag component for colored status badges
const StatusTag = ({ status }) => {
  // Map status to tailwind bg and text classes
  const statusStyles = {
    Processing: "bg-blue-100 text-blue-800",
    Released: "bg-green-100 text-green-700",
    "Request Received": "bg-gray-300 text-gray-600",
  };

  const style = statusStyles[status] || "bg-gray-200 text-gray-700";

  return (
    <span
      className={`${style} px-2 py-1 text-xs rounded-md font-semibold whitespace-nowrap`}
    >
      {status}
    </span>
  );
};

// Individual request card component
const RequestCard = ({
  requestNumber,
  requesterName,
  documents,
  status,
  onView,
}) => {
  return (
    <div className="border border-gray-300 rounded-md p-4 mb-4 flex justify-between items-start">
      <div>
        <p className="text-blue-700 font-semibold mb-1">{requestNumber}</p>
        <p className="text-gray-800 mb-2">{requesterName}</p>
        <p className="text-xs text-gray-500 font-semibold mb-1">Documents</p>
        <p className="text-gray-700 text-sm">{documents}</p>
      </div>

      <div className="flex flex-col items-end space-y-2">
        <StatusTag status={status} />
        <button
          onClick={onView}
          className="border border-gray-400 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-100 transition"
          aria-label={`View details for ${requestNumber}`}
        >
          {/* Eye icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="inline-block w-5 h-5 mr-1"
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
      </div>
    </div>
  );
};

const RequestManagement = () => {
  // Search term state
  const [searchTerm, setSearchTerm] = useState("");
  // Status filter state
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  // Placeholder data of document requests
  const requests = [
    {
      id: 1,
      requestNumber: "FAST-2024-510586",
      requesterName: "Juan Dela Cruz",
      documents: "Diploma, Certificate of Good Moral Character",
      status: "Processing",
    },
    {
      id: 2,
      requestNumber: "FAST-2024-510586",
      requesterName: "Juan Dela Cruz",
      documents: "Transcript of Records (TOR)",
      status: "Released",
    },
    {
      id: 3,
      requestNumber: "FAST-2024-510586",
      requesterName: "Juan Dela Cruz",
      documents: "Certificate of Grades",
      status: "Request Received",
    },
  ];

  // Handlers
  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleStatusChange = (e) => setStatusFilter(e.target.value);
  const handleViewClick = (requestNumber) => {
    alert(`View details for ${requestNumber} - Feature coming soon!`);
  };

  // Filter requests based on search and status
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
      {/* Page title and description */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-blue-900 mb-1">
          Request Management
        </h1>
        <p className="text-gray-700 text-sm">
          Manage and track document requests
        </p>
      </div>

      {/* Search and filter controls */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-col md:flex-row items-center gap-4 mb-6"
      >
        {/* Search bar */}
        <div className="relative flex-grow w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by name, ID, or request number..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full border border-gray-300 rounded-md pl-4 pr-20 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            aria-label="Search payments"
          />

          <button
            type="submit"
            className="absolute right-0 top-0 h-full px-6 bg-blue-800 text-white rounded-r-md hover:bg-blue-900 transition flex items-center justify-center"
            aria-label="Search button"
          >
            <img
              src={SearchIcon}
              alt="Search"
              className="w-5 h-5 object-contain filter invert brightness-0"
            />
          </button>
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={handleStatusChange}
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
          aria-label="Filter by status"
        >
          <option>All Statuses</option>
          <option>Processing</option>
          <option>Released</option>
          <option>Request Received</option>
        </select>
      </form>

      {/* Document Requests List */}
      <section
        aria-label={`Document Requests (${filteredRequests.length})`}
        className="border border-gray-300 rounded-md p-6 space-y-4"
      >
        {filteredRequests.length === 0 ? (
          <p className="text-gray-600 italic">No matching requests found.</p>
        ) : (
          filteredRequests.map((req) => (
            <RequestCard
              key={req.id}
              requestNumber={req.requestNumber}
              requesterName={req.requesterName}
              documents={req.documents}
              status={req.status}
              onView={() => handleViewClick(req.requestNumber)}
            />
          ))
        )}
      </section>
    </AdminLayout>
  );
};

export default RequestManagement;
