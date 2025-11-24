import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import SearchIcon from "../../assets/search.png";
import ViewRequestDetails from "../../components/ViewRequestDetails";
import axios from "axios";

// StatusTag component
const StatusTag = ({ status }) => {
  const statusStyles = {
    Requested: "bg-gray-300 text-gray-700",
    Processing: "bg-blue-100 text-blue-800",
    Released: "bg-green-100 text-green-700",
    Received: "bg-purple-100 text-purple-800",
  };

  const style = statusStyles[status] || "bg-gray-200 text-gray-700";

  return (
    <span className={`${style} px-3 py-1 text-xs rounded-full font-semibold shadow-sm`}>
      {status}
    </span>
  );
};

// Request Card
const RequestCard = ({
  request,
  onView,
  onNotify,
}) => (
  <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <p className="text-blue-700 font-semibold text-lg mb-1">
          {request.request_number}
        </p>
        <p className="text-gray-800 mb-2">{request.full_name}</p>

        <p className="text-xs text-gray-500 font-semibold mb-1">Documents</p>
        <p className="text-gray-700 text-sm">
          {request.requested_documents.map(d => d.name).join(", ")}
        </p>

        <p className="text-xs text-gray-500 font-semibold mt-3">Date Submitted</p>
        <p className="text-gray-700 text-sm">
          {new Date(request.date_submitted).toLocaleString()}
        </p>
      </div>

      <div className="flex flex-col items-end space-y-3 ml-4">
        <StatusTag status={request.status} />

        <div className="flex space-x-2">
          <button
            onClick={onView}
            className="border border-gray-400 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-100"
          >
            View
          </button>
          <button
            onClick={onNotify}
            className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
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

  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const token = localStorage.getItem("access_token"); // change if needed

  // Fetch requests from API
  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/admin-dashboard/request-management/",
        {
          params: {
            search: searchTerm,
            status_id: statusFilter || undefined,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  // Fetch on load + whenever filters change
  useEffect(() => {
    fetchRequests();
  }, [searchTerm, statusFilter]);

  const handleNotify = (req) => {
    navigate("/NotificationManagement", {
      state: {
        recipient: req.user_id.email,
        requestNumber: req.request_number,
        notificationType: "Email",
      },
    });
  };

  // Update status via API
  const updateStatus = async (requestId, newStatusId) => {
    try {
      await axios.patch(
        `/api/admin-dashboard/update-request-status/${requestId}/`,
        { status_id: newStatusId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchRequests(); // refresh list
      setSelectedRequest(null);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

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
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-md pl-4 pr-20 py-3"
          />
          <button className="absolute right-0 top-0 h-full px-6 bg-blue-800 text-white rounded-r-md">
            <img src={SearchIcon} className="w-5 h-5" />
          </button>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-3"
        >
          <option value="">All Statuses</option>
          <option value="1">Requested</option>
          <option value="2">Processing</option>
          <option value="3">Released</option>
          <option value="4">Received</option>
        </select>
      </form>

      {/* Requests */}
      <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Requests</h2>

        {requests.length === 0 ? (
          <p className="text-gray-600 text-center italic py-8">
            No matching requests found.
          </p>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <RequestCard
                key={req.request_id}
                request={req}
                onView={() => setSelectedRequest(req)}
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
            onClose={() => setSelectedRequest(null)}
            onMarkProcessing={() => updateStatus(selectedRequest.request_id, 2)}
            onMarkReleased={() => updateStatus(selectedRequest.request_id, 3)}
            onMarkReceived={() => updateStatus(selectedRequest.request_id, 4)}
          />
        </div>
      )}
    </AdminLayout>
  );
};

export default RequestManagement;
