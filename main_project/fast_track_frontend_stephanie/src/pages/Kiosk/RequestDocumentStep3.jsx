import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import KioskHeader from "../../components/KioskHeader";
import KioskBackground from "../../components/KioskBackground";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function RequestDocumentReview() {
  const navigate = useNavigate();
  const location = useLocation();

  // Receive passed payload and personal info state from previous step
  // Example structure assumed in location.state:
  // {
  //   personalInfo: { firstName, middleName, lastName, studentId, email, phone, relationship },
  //   documents: [ { doctype_id, name, price, copies, purposeDescription } ],
  //   totalAmount: number
  // }
  const {
    personalInfo = {},
    documents = [],
  } = location.state || {};

  // Checkbox for Data Privacy Act acceptance
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Calculate total amount from documents (copies * price)
  const totalAmount = documents.reduce(
    (sum, doc) => sum + (doc.price || 0) * (doc.copies || 1),
    0
  );

  const handleBack = () => {
    navigate(-1); // Back to step 2
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!acceptedPrivacy) {
      setError("Please accept the Data Privacy Act agreement to continue.");
      return;
    }

    setError("");
    setSubmitting(true);

    // Here you can send the final payload to your API if needed.
    // For demonstration, we just alert and navigate success page:

    setTimeout(() => {
      alert("Request submitted successfully!");
      setSubmitting(false);
      navigate("/SuccessMessage");
    }, 1500);
  };

  return (
    <div className="min-h-screen relative flex flex-col bg-[#2C3E9E]">
      <KioskBackground opacity={10} blueOpacity={80} />
      <div className="relative z-10 flex flex-col min-h-screen">
        <KioskHeader />

        <main className="flex-grow flex justify-center items-start px-4 pt-16 pb-8">
          <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-10 mx-auto mt-12">
            {/* Header */}
            <div className="relative mb-6">
              <button
                onClick={handleBack}
                type="button"
                className="absolute left-0 flex items-center text-blue-900 hover:text-blue-700 font-semibold transition"
                aria-label="Back to previous step"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-1" />
                Back
              </button>
              <h2 className="text-blue-900 font-bold text-2xl tracking-wide text-center select-none">
                Request Document
              </h2>
            </div>

           <div className="flex justify-center items-center space-x-6 mb-10 w-2/3 max-w-sm mx-auto">
  {[1, 2, 3].map((step) => (
    <React.Fragment key={step}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm select-none ${
          step <= 3 ? "bg-[#2039ad]" : "bg-gray-300 text-gray-700"
        }`}
      >
        {step}
      </div>
      {step !== 3 && <div className="flex-1 h-1 rounded bg-gray-300 mx-1"></div>}
    </React.Fragment>
  ))}
</div>

            {/* Review card */}
            <section className="border border-gray-300 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-1 text-lg">Review Your Request</h3>
              <p className="text-gray-600 text-sm mb-6">
                Please verify all information
              </p>

              {/* Requester Information */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-2">Requester Information</h4>
                <dl className="text-gray-700 text-sm space-y-1">
                  <div>
                    <dt className="inline font-semibold">Name:</dt>{" "}
                    <dd className="inline">{`${personalInfo.firstName || ""} ${personalInfo.middleName || ""} ${personalInfo.lastName || ""}`.trim()}</dd>
                  </div>
                  <div>
                    <dt className="inline font-semibold">Student #:</dt>{" "}
                    <dd className="inline">{personalInfo.studentId || "-"}</dd>
                  </div>
                  <div>
                    <dt className="inline font-semibold">Email:</dt>{" "}
                    <dd className="inline">{personalInfo.email || "-"}</dd>
                  </div>
                  <div>
                    <dt className="inline font-semibold">Contact:</dt>{" "}
                    <dd className="inline">{personalInfo.phone || "-"}</dd>
                  </div>
                </dl>
              </div>

              {/* Documents Requested */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Documents Requested</h4>
                <ul className="divide-y divide-gray-300 text-gray-700 text-sm">
                  {documents.map(({ doctype_id, name, copies, purposeDescription, price }) => (
                    <li key={doctype_id} className="flex justify-between py-3">
                      <div>
                        <p className="font-semibold text-gray-900">{name}</p>
                        <p className="text-xs text-gray-500">
                          {copies} {copies === 1 ? "copy" : "copies"} • {purposeDescription || ""}
                        </p>
                      </div>
                      <div className="font-semibold text-gray-900">₱{price * copies}</div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Total Amount */}
              <div className="flex justify-between items-center mt-6 border-t border-gray-300 pt-4">
                <span className="font-semibold text-gray-900">Total Amount:</span>
                <span className="font-semibold text-[#6B0F0F] text-lg">
                  ₱{totalAmount}
                </span>
              </div>

              {/* Info box */}
              <div className="mt-4 flex items-center space-x-2 bg-[#E6EEF9] rounded border border-[#A6D0F5] px-4 py-2 text-sm text-[#3C6FC4]">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1 4v-4m-3 8h6m-3-14h.01" />
                </svg>
                <p className="flex-1">
                  Processing usually takes 3–5 working days. You will receive an email with payment instructions and your request number.
                </p>
              </div>

              {/* Data Privacy Checkbox */}
              <label className="flex items-start space-x-3 mt-4">
                <input
                  type="checkbox"
                  checked={acceptedPrivacy}
                  onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                  className="form-checkbox mt-1 h-4 w-4 text-[#6B0F0F]"
                  aria-required="true"
                />
                <span className="text-sm text-gray-700">
                  I understand that all personal information provided will be used solely for processing my document request in compliance with the Data Privacy Act.
                </span>
              </label>
              {error && (
                <p className="text-red-600 mt-2 text-sm">
                  {error}
                </p>
              )}
            </section>

          {/* Buttons */}
<div className="flex gap-2">
  <button
    type="button"
    onClick={handleBack}
    className="flex-1 border border-blue-800 text-blue-800 rounded px-4 py-3 font-semibold hover:bg-blue-100 transition"
  >
    Back
  </button>
  <button
    type="button"
    disabled={!acceptedPrivacy || submitting}
    onClick={handleSubmit}
    className={`flex-1 rounded px-4 py-3 font-semibold text-white transition ${
      acceptedPrivacy
        ? "bg-yellow-600 hover:bg-yellow-700"
        : "bg-gray-300 cursor-not-allowed"
    }`}
  >
    {submitting ? "Submitting..." : "Submit Request"}
  </button>
</div>

          </div>
        </main>
      </div>
    </div>
  );
}
