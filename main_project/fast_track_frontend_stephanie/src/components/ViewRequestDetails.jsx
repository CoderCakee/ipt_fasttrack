import React from "react";

// Reusable Button component
const Button = ({ children, disabled, onClick, black }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`py-2 px-4 rounded-md font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-600 
      ${
        disabled
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : black
          ? "bg-black text-white hover:bg-gray-800"
          : "bg-gray-200 text-gray-900 hover:bg-gray-300"
      }`}
    type="button"
  >
    {children}
  </button>
);

// Progress step circle
const StepCircle = ({ completed, number }) => (
  <div
    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition 
      ${completed ? "bg-blue-700 text-white" : "bg-gray-300 text-gray-500"}`}
  >
    {number}
  </div>
);

// Progress bar between steps
const StepBar = ({ completed }) => (
  <div
    className={`h-1 flex-grow rounded-full transition ${
      completed ? "bg-blue-700" : "bg-gray-300"
    }`}
  />
);

/**
 * ViewRequestDetails Component
 * Shows request info, progress tracker, and a single next-step button.
 * Props:
 * - request: object with database-aligned fields.
 * - onUpdateStatus: function(request_id, nextStatus) → updates parent state.
 * - onClose: callback to close/hide this detail panel.
 */
const ViewRequestDetails = ({ request, onUpdateStatus, onClose }) => {
  const {
    request_id,
    status = "Requested",
    user = {},
    email = "",
    contact_number = "",
    requested_documents = [],
  } = request;

  const requesterName = user.first_name
    ? `${user.first_name} ${user.last_name}`
    : "N/A";

  const statusSteps = ["Requested", "Processing", "Released", "Received"];
  const currentStepIndex = statusSteps.findIndex(
    (s) => s.toLowerCase() === status.toLowerCase()
  );

  // Determine next status and button label
  const nextStatusMap = {
    Requested: "Processing",
    Processing: "Released",
    Released: "Received",
  };
  const nextStatus = nextStatusMap[status];
  const buttonLabel = nextStatus ? `Mark as ${nextStatus}` : null;

  const handleStatusClick = () => {
    if (nextStatus) {
      onClose(); // Close modal first
      setTimeout(() => {
        onUpdateStatus && onUpdateStatus(request_id, nextStatus);
      }, 100); // Delay to ensure modal closes smoothly
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="request-details-title"
      className="absolute bg-white rounded-lg shadow-xl p-6 max-w-md w-full z-20"
      style={{ minWidth: 350 }}
    >
      {/* Close button top-right */}
      <button
        onClick={onClose}
        aria-label="Close request details"
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-600 rounded"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <h2
        id="request-details-title"
        className="text-blue-900 font-bold text-lg mb-4"
      >
        Request Details
      </h2>

      {/* Request Info */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-4 text-gray-700 text-sm">
        <div>
          <span className="block font-semibold text-gray-900">Request ID</span>
          <span>{request_id}</span>
        </div>
        <div>
          <span className="block font-semibold text-gray-900">Status</span>
          <span>{status}</span>
        </div>
        <div>
          <span className="block font-semibold text-gray-900">Requester Name</span>
          <span>{requesterName}</span>
        </div>
        <div>
          <span className="block font-semibold text-gray-900">Email</span>
          <span>{email}</span>
        </div>
        <div>
          <span className="block font-semibold text-gray-900">Contact Number</span>
          <span>{contact_number || "N/A"}</span>
        </div>
      </div>

      {/* Requested Documents */}
      <div className="mb-6">
        <p className="font-semibold text-gray-900 mb-2">Requested Documents</p>
        <div className="flex flex-wrap gap-2">
          {requested_documents.length > 0 ? (
            requested_documents.map((doc) => (
              <span
                key={doc.doctype_id}
                className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap"
              >
                {doc.name} ({doc.copy_amount})
              </span>
            ))
          ) : (
            <span className="text-gray-500 text-sm">No documents listed</span>
          )}
        </div>
      </div>

      {/* Progress tracker */}
      <div className="flex items-center space-x-2 mb-6">
        {statusSteps.map((step, index) => (
          <React.Fragment key={step}>
            <StepCircle completed={index <= currentStepIndex} number={index + 1} />
            {index < statusSteps.length - 1 && <StepBar completed={index < currentStepIndex} />}
          </React.Fragment>
        ))}
      </div>

      {/* Step labels */}
      <div className="grid grid-cols-4 text-xs text-gray-600 font-semibold mb-6">
        {statusSteps.map((step) => (
          <div key={step} className="text-center">{step}</div>
        ))}
      </div>

      {/* Single Next-Step Button */}
      {nextStatus ? (
        <div className="flex justify-end">
          <Button black onClick={handleStatusClick}>{buttonLabel}</Button>
        </div>
      ) : (
        <p className="text-green-600 font-semibold text-right">Final Step Completed ✓</p>
      )}
    </div>
  );
};

export default ViewRequestDetails;
