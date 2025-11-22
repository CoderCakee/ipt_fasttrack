import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import SearchIcon from "../../assets/search.png";

/* ----------------------- Status Badge ----------------------- */
const StatusBadge = ({ status }) => {
  const colors = {
    Paid: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Failed: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`${colors[status] || "bg-gray-100 text-gray-700"} text-xs font-semibold px-2 py-0.5 rounded whitespace-nowrap`}
    >
      {status}
    </span>
  );
};

/* ----------------------- Payment Row ----------------------- */
const PaymentRecordRow = ({
  paymentId,
  requestNumber,
  requesterName,
  paymentMethod,
  amount,
  status,
  onMarkAsPaid,
  onMarkAsUnpaid,
  onViewDetails,
}) => {
  return (
    <div className="border border-gray-300 rounded-md p-4 mb-4 flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0">
      {/* Left section */}
      <div className="text-sm md:text-base flex flex-col space-y-1 text-gray-800">
        <span className="font-semibold">{paymentId}</span>
        <a className="text-blue-600 underline font-semibold">{requestNumber}</a>
        <span>{requesterName}</span>
        <span className="text-gray-500 text-xs">
          Payment Method <strong>{paymentMethod}</strong>
        </span>
      </div>

      {/* Right section */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-5">
        {status !== "Paid" ? (
          <button
            onClick={() => onMarkAsPaid(paymentId)}
            className="bg-green-600 text-white px-4 py-1 rounded-md hover:bg-green-700 transition"
          >
            Mark as Paid
          </button>
        ) : (
          <button
            onClick={() => onMarkAsUnpaid(paymentId)}
            className="bg-yellow-600 text-white px-4 py-1 rounded-md hover:bg-yellow-700 transition"
          >
            Mark as Unpaid
          </button>
        )}

        <button
          onClick={() => onViewDetails(paymentId)}
          className="border border-gray-400 text-gray-700 px-4 py-1 rounded-md hover:bg-gray-100 transition"
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

/* ----------------------- Payment Details Modal ----------------------- */
const PaymentDetailsModal = ({ payment, onClose }) => {
  if (!payment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

      {/* White Modal Box */}
      <div className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">

        {/* Close Button (top-right) */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 text-3xl leading-none hover:text-gray-700"
        >
          ×
        </button>

        {/* Header */}
        <h2 className="text-xl font-bold text-center text-blue-900 mb-4">
          Payment Details
        </h2>

        {/* Body Content */}
        <div className="space-y-3 text-gray-700">
          <p><strong>Payment ID:</strong> {payment.paymentId}</p>
          <p><strong>Request Number:</strong> {payment.requestNumber}</p>
          <p><strong>Requester Name:</strong> {payment.requesterName}</p>
          <p><strong>Payment Method:</strong> {payment.paymentMethod}</p>
          <p><strong>Amount:</strong> ₱{payment.amount}</p>

          <div className="flex items-center">
            <strong className="mr-2">Status:</strong>
            <StatusBadge status={payment.status} />
          </div>
        </div>
      </div>
    </div>
  );
};


/* ----------------------- Confirmation Modal ----------------------- */
const ConfirmationModal = ({ isOpen, onConfirm, onCancel, action, paymentId }) => {
  if (!isOpen) return null;

  const message =
    action === "paid"
      ? `Are you sure you want to mark payment ${paymentId} as Paid?`
      : `Are you sure you want to mark payment ${paymentId} as Unpaid?`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold text-blue-900 mb-4">Confirm Action</h2>
        <p className="text-gray-700 mb-6">{message}</p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="border border-gray-400 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

/* ----------------------- Main Payment Tracking Page ----------------------- */
const PaymentTracking = () => {
  const navigate = useNavigate();

  /* --- States --- */
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const [paymentRecords, setPaymentRecords] = useState([
    {
      id: 1,
      paymentId: "PAY-2024-001234",
      requestNumber: "FAST-2024-510586",
      requesterName: "Juan Dela Cruz",
      paymentMethod: "Cash",
      amount: 100,
      status: "Paid",
    },
    {
      id: 2,
      paymentId: "PAY-2024-001235",
      requestNumber: "FAST-2024-510587",
      requesterName: "Maria Santos",
      paymentMethod: "Cash",
      amount: 200,
      status: "Paid",
    },
    {
      id: 3,
      paymentId: "PAY-2024-001236",
      requestNumber: "FAST-2024-510588",
      requesterName: "Pedro Pascual",
      paymentMethod: "Online Banking",
      amount: 350,
      status: "Pending",
    },
  ]);

  /* --- Filtered List --- */
  const filteredPayments = paymentRecords.filter((record) => {
    const matchesSearch =
      record.paymentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.requesterName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All Statuses" || record.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  /* ----------------------- CSV Export ----------------------- */
  const convertToCSV = (data) => {
    const headers = [
      "Payment ID",
      "Request Number",
      "Requester Name",
      "Payment Method",
      "Amount",
      "Status",
    ];

    const rows = data.map((row) =>
      [
        row.paymentId,
        row.requestNumber,
        row.requesterName,
        row.paymentMethod,
        row.amount,
        row.status,
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    );

    return [headers.join(","), ...rows].join("\n");
  };

  const handleExportClick = () => {
    if (filteredPayments.length === 0) {
      alert("No data to export.");
      return;
    }

    const csv = convertToCSV(filteredPayments);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `payment_records_${Date.now()}.csv`;
    link.click();
  };

  /* --- Action Handlers --- */
  const handleMarkAsPaid = (id) => setConfirmAction({ action: "paid", paymentId: id });
  const handleMarkAsUnpaid = (id) => setConfirmAction({ action: "unpaid", paymentId: id });

  const confirmActionHandler = () => {
    setPaymentRecords((records) =>
      records.map((r) =>
        r.paymentId === confirmAction.paymentId
          ? { ...r, status: confirmAction.action === "paid" ? "Paid" : "Pending" }
          : r
      )
    );
    setConfirmAction(null);
  };

  const handleViewDetails = (id) => {
    setSelectedPayment(paymentRecords.find((r) => r.paymentId === id));
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedPayment(null);
    setShowModal(false);
  };

  /* ----------------------- Render ----------------------- */
  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Payment Tracking</h1>
        <p className="text-gray-700 text-sm">
          Monitor payment status and transaction history
        </p>
      </div>

      {/* Search + Filter + Export */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-col md:flex-row items-center gap-4 mb-8 bg-gray-50 p-4 rounded-lg shadow-sm"
      >
        {/* Search bar */}
        <div className="relative flex-grow w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by name, ID, or request number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-md pl-4 pr-20 py-3 focus:ring-2 focus:ring-blue-600"
          />
          <button
            type="submit"
            className="absolute right-0 top-0 h-full px-6 bg-blue-800 text-white rounded-r-md hover:bg-blue-900 flex items-center justify-center"
          >
            <img src={SearchIcon} alt="Search" className="w-5 h-5 filter brightness-0 invert" />
          </button>
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-blue-600"
        >
          <option>All Statuses</option>
          <option>Paid</option>
          <option>Pending</option>
          <option>Failed</option>
        </select>

        {/* Export */}
        <button
          type="button"
          onClick={handleExportClick}
          className="bg-blue-800 text-white px-4 py-3 rounded-md hover:bg-blue-900 whitespace-nowrap"
        >
          Export
        </button>
      </form>

      {/* Payment Records */}
      <section className="border border-gray-300 rounded-md p-6 bg-white space-y-2">
        {filteredPayments.length === 0 ? (
          <p className="text-gray-600 italic">No payment records found.</p>
        ) : (
          filteredPayments.map((record) => (
            <PaymentRecordRow
              key={record.id}
              {...record}
              onMarkAsPaid={handleMarkAsPaid}
              onMarkAsUnpaid={handleMarkAsUnpaid}
              onViewDetails={handleViewDetails}
            />
          ))
        )}
      </section>

      {/* Modals */}
      {showModal && <PaymentDetailsModal payment={selectedPayment} onClose={closeModal} />}
      {confirmAction && (
        <ConfirmationModal
          isOpen
          onConfirm={confirmActionHandler}
          onCancel={() => setConfirmAction(null)}
          action={confirmAction.action}
          paymentId={confirmAction.paymentId}
        />
      )}
    </AdminLayout>
  );
};

export default PaymentTracking;
