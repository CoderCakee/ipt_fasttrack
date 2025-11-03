import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import SearchIcon from "../../assets/search.png";

// ✅ Status badge component
const StatusBadge = ({ status }) => {
  const colors = {
    Paid: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Failed: "bg-red-100 text-red-700",
  };

  const className = colors[status] || "bg-gray-100 text-gray-700";

  return (
    <span
      className={`${className} text-xs font-semibold px-2 py-0.5 rounded whitespace-nowrap`}
      aria-label={`Payment status: ${status}`}
    >
      {status}
    </span>
  );
};

// ✅ Single payment record row
const PaymentRecordRow = ({
  paymentId,
  requestNumber,
  requesterName,
  paymentMethod,
  amount,
  status,
  showMarkAsPaid,
  onMarkAsPaid,
  onViewDetails,
}) => {
  return (
    <div className="border border-gray-300 rounded-md p-4 mb-4 flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0">
      {/* Left side */}
      <div className="text-sm md:text-base flex flex-col space-y-1 text-gray-800">
        <span className="font-semibold">{paymentId}</span>
        <a href="#" className="text-blue-600 underline font-semibold">
          {requestNumber}
        </a>
        <span>{requesterName}</span>
        <span className="text-gray-500 text-xs">
          Payment Method{" "}
          <strong className="font-semibold">{paymentMethod}</strong>
        </span>
      </div>

      {/* Right side */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-5">
        {showMarkAsPaid && (
          <button
            onClick={onMarkAsPaid}
            className="bg-green-600 text-white px-4 py-1 rounded-md hover:bg-green-700 transition"
            aria-label={`Mark payment ${paymentId} as paid`}
          >
            Mark as Paid
          </button>
        )}

        <button
          onClick={onViewDetails}
          className="border border-gray-400 text-gray-700 px-4 py-1 rounded-md hover:bg-gray-100 transition"
          aria-label={`View details for payment ${paymentId}`}
        >
          View Details
        </button>

        <div className="text-right min-w-[70px] font-semibold text-gray-900">
          ₱{amount}
        </div>

        <StatusBadge status={status} />
      </div>
    </div>
  );
};

// ✅ Main PaymentTracking Page
const PaymentTracking = () => {
  const navigate = useNavigate();

  // States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  // Mock payment data
  const paymentRecords = [
    {
      id: 1,
      paymentId: "PAY-2024-001234",
      requestNumber: "FAST-2024-510586",
      requesterName: "Juan Dela Cruz",
      paymentMethod: "Cash",
      amount: 100,
      status: "Paid",
      showMarkAsPaid: true,
    },
    {
      id: 2,
      paymentId: "PAY-2024-001235",
      requestNumber: "FAST-2024-510587",
      requesterName: "Maria Santos",
      paymentMethod: "Cash",
      amount: 200,
      status: "Paid",
      showMarkAsPaid: false,
    },
    {
      id: 3,
      paymentId: "PAY-2024-001236",
      requestNumber: "FAST-2024-510588",
      requesterName: "Pedro Pascual",
      paymentMethod: "Online Banking",
      amount: 350,
      status: "Pending",
      showMarkAsPaid: false,
    },
  ];

  // Handlers
  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleStatusChange = (e) => setStatusFilter(e.target.value);
  const handleExportClick = () => alert("Export feature coming soon!");
  const handleMarkAsPaid = (paymentId) =>
    alert(`Marking payment ${paymentId} as Paid - feature coming soon!`);
  const handleViewDetails = (paymentId) =>
    alert(`Viewing details for payment ${paymentId} - feature coming soon!`);

  // Filtered list
  const filteredPayments = paymentRecords.filter((record) => {
    const matchesSearch =
      searchTerm === "" ||
      record.paymentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.requesterName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All Statuses" || record.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-blue-900 mb-1">
          Payment Tracking
        </h1>
        <p className="text-gray-700 text-sm">
          Monitor payment status and transaction history
        </p>
      </div>

      {/* Search + Filter + Export */}
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
          aria-label="Filter by payment status"
        >
          <option>All Statuses</option>
          <option>Paid</option>
          <option>Pending</option>
          <option>Failed</option>
        </select>

        {/* Export button */}
        <button
          type="button"
          onClick={handleExportClick}
          className="bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-900 transition whitespace-nowrap"
          aria-label="Export payment records"
        >
          Export
        </button>
      </form>

      {/* Payment Records Section */}
      <section
        aria-label={`Payment Records (${filteredPayments.length})`}
        className="border border-gray-300 rounded-md p-6 space-y-2 bg-white"
      >
        {filteredPayments.length === 0 ? (
          <p className="text-gray-600 italic">No payment records found.</p>
        ) : (
          filteredPayments.map((record) => (
            <PaymentRecordRow
              key={record.id}
              paymentId={record.paymentId}
              requestNumber={record.requestNumber}
              requesterName={record.requesterName}
              paymentMethod={record.paymentMethod}
              amount={record.amount}
              status={record.status}
              showMarkAsPaid={record.showMarkAsPaid}
              onMarkAsPaid={() => handleMarkAsPaid(record.paymentId)}
              onViewDetails={() => handleViewDetails(record.paymentId)}
            />
          ))
        )}
      </section>
    </AdminLayout>
  );
};

export default PaymentTracking;
