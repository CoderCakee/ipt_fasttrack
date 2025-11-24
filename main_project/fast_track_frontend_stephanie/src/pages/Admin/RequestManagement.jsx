import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import SearchIcon from "../../assets/search.png";
import ViewRequestDetails from "../../components/ViewRequestDetails";

// StatusTag component with colors aligned to steps
const StatusTag = ({ status }) => {
  const statusStyles = {
    Requested: "bg-gray-300 text-gray-700",
    Processing: "bg-blue-100 text-blue-800",
    Released: "bg-green-100 text-green-700",
    Received: "bg-purple-100 text-purple-800",
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

// Request Card
const RequestCard = ({
  requestNumber,
  requesterName,
  documents,
  status,
  onView,
  onNotify,
}) => (
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
          >
            View
          </button>
          <button
            onClick={onNotify}
            className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition"
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

  const [requests, setRequests] = useState([
    {
      request_id: "FAST-2024-510586",
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
      request_id: "FAST-2024-510587",
      user: { first_name: "Maria", last_name: "Santos" },
      email: "maria@auf.edu.ph",
      contact_number: "09223334444",
      requested_documents: [
        { doctype_id: 3, name: "Transcript of Records", copy_amount: 1 },
      ],
      status: "Released",
    },
  ]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleStatusChange = (e) => setStatusFilter(e.target.value);

  const handleViewClick = (req) => setSelectedRequest(req);
  const closeModal = () => setSelectedRequest(null);

  const handleNotify = (req) => {
    navigate("/NotificationManagement", {
      state: {
        recipient: req.email,
        contactNumber: req.contact_number,   
        requestNumber: req.request_id,
        notificationType: "Email",
      },
    });
  };

  // Advance request status to next step
  const handleNextStatus = (request_id) => {
    const steps = ["Requested", "Processing", "Released", "Received"];
    setRequests((prev) =>
      prev.map((r) => {
        if (r.request_id === request_id) {
          const currentIndex = steps.indexOf(r.status);
          const nextStatus = currentIndex < steps.length - 1 ? steps[currentIndex + 1] : r.status;
          return { ...r, status: nextStatus };
        }
        return r;
      })
    );
    closeModal();
  };

  // Filter requests
  const filteredRequests = requests.filter((req) => {
    const matchesStatus =
      statusFilter === "All Statuses" || req.status === statusFilter;

    const search = searchTerm.toLowerCase();
    const matchesSearch =
      req.request_id.toLowerCase().includes(search) ||
      `${req.user.first_name} ${req.user.last_name}`.toLowerCase().includes(search);

    return matchesStatus && matchesSearch;
  });

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-900 mb-1">Request Management</h1>
        <p className="text-gray-700">Manage and track document requests</p>
      </div>

      {/* Search + Filter */}
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
            className="w-full border border-gray-300 rounded-md pl-4 pr-20 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />

          <button
            type="submit"
            className="absolute right-0 top-0 h-full px-6 bg-blue-800 text-white rounded-r-md hover:bg-blue-900"
          >
            <img
              src={SearchIcon}
              className="w-5 h-5 object-contain filter invert brightness-0"
            />
          </button>
        </div>

        <select
          value={statusFilter}
          onChange={handleStatusChange}
          className="border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-blue-600"
        >
          <option>All Statuses</option>
          <option>Requested</option>
          <option>Processing</option>
          <option>Released</option>
          <option>Received</option>
        </select>
      </form>

      {/* Requests List */}
      <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Requests</h2>

        {filteredRequests.length === 0 ? (
          <p className="text-gray-600 text-center italic py-8">
            No matching requests found.
          </p>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((req) => (
              <RequestCard
                key={req.request_id}
                requestNumber={req.request_id}
                requesterName={`${req.user.first_name} ${req.user.last_name}`}
                documents={req.requested_documents.map((d) => d.name).join(", ")}
                status={req.status}
                onView={() => handleViewClick(req)}
                onNotify={() => handleNotify(req)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <ViewRequestDetails
            request={selectedRequest}
            onClose={closeModal}
            onMarkProcessing={(id) => handleNextStatus(id)}
            onMarkReleased={(id) => handleNextStatus(id)}
            onUpdateStatus={(id) => handleNextStatus(id)} // just use one button internally
          />
        </div>
      )}
    </AdminLayout>
  );
};

export default RequestManagement;
