import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import KioskHeader from "../../components/KioskHeader";
import KioskBackground from "../../components/KioskBackground";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import infoIcon from "../../assets/infoblue.png";

export default function RequestDocumentStep3() {
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect back if no state (user accessed page directly)
  useEffect(() => {
    if (!location.state || !location.state.personalInfo || !location.state.documents) {
    }
  }, [location.state, navigate]);

  const { personalInfo = {}, documents = [], notes = "" } = location.state || {};

  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Compute total amount
  const totalAmount = documents.reduce(
    (sum, doc) => sum + (doc.price || 0) * (doc.copies || 1),
    0
  );

  const handleBack = () => navigate(-1);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!acceptedPrivacy) {
      setError("Please accept the Data Privacy Act agreement to continue.");
      return;
    }

    setError("");
    setSubmitting(true);

    // TODO: Replace with actual submission API call
    setTimeout(() => {
      setSubmitting(false);
      navigate("/SuccessMessage");
    }, 1500);
  };

  const formatCurrency = (amount) => `₱${amount.toLocaleString()}`;

  return (
    <div className="min-h-screen relative flex flex-col bg-[#2C3E9E]">
      <KioskBackground opacity={10} blueOpacity={80} />

      {/* Fixed Header */}
      <div className="w-full h-16">
        <KioskHeader />
      </div>

      <div className="relative z-10 px-4 pb-10 mt-16">
            <main className="flex-grow flex justify-center items-start px-4 pb-8">
            <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-10 mx-auto">
              
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

              {/* Step indicator */}
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

              {/* Review Section */}
              <section className="border border-gray-300 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-1 text-lg">
                  Review Your Request
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  Please verify all information
                </p>

                {/* Requester Information */}
                <div className="mb-6">
                  <h4 className="font-semibold text-blue-900 mb-2">Requester Information</h4>
                  <dl className="text-gray-700 text-sm space-y-1">
                    <div>
                      <dt className="inline font-semibold">Name:</dt>{" "}
                      <dd className="inline">
                        {`${personalInfo.firstName || ""} ${personalInfo.middleName || ""} ${personalInfo.lastName || ""}`.trim()}
                      </dd>
                    </div>
                    <div>
                      <dt className="inline font-semibold">Student #:</dt>{" "}
                      <dd className="inline">{personalInfo.studentId || ""}</dd>
                    </div>
                    <div>
                      <dt className="inline font-semibold">Email:</dt>{" "}
                      <dd className="inline">{personalInfo.email || ""}</dd>
                    </div>
                    <div>
                      <dt className="inline font-semibold">Contact:</dt>{" "}
                      <dd className="inline">{personalInfo.phone || ""}</dd>
                    </div>
                    <div>
                      <dt className="inline font-semibold">Relationship:</dt>{" "}
                      <dd className="inline">{personalInfo.relationship || ""}</dd>
                    </div>
                  </dl>
                </div>

                {/* Notes */}
                {notes && (
                  <div className="mb-4 text-gray-700 text-sm">
                    <strong>Notes / Remarks:</strong> {notes}
                  </div>
                )}

                {/* Documents Requested */}
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">Documents Requested</h4>
                  <ul className="divide-y divide-gray-300 text-gray-700 text-sm">
                    {documents.map(({ doctype_id, name, copies, purposeDescription, price }) => (
                      <li key={doctype_id} className="flex justify-between py-3">
                        <div>
                          <p className="font-semibold text-gray-900">{name}</p>
                          <p className="text-xs text-gray-500">
                            {copies} {copies === 1 ? "copy" : "copies"} • {purposeDescription || ""}
                          </p>
                        </div>
                        <div className="font-semibold text-gray-900">
                          {formatCurrency((price || 0) * (copies || 1))}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Total Amount */}
                <div className="flex justify-between items-center mt-6 border-t border-gray-300 pt-4">
                  <span className="font-semibold text-gray-900">Total Amount:</span>
                  <span className="font-bold text-yellow-600 text-lg">{formatCurrency(totalAmount)}</span>
                </div>

                {/* Info Box */}
                <div className="mt-4 flex items-center space-x-2 bg-[#E6EEF9] rounded border border-[#A6D0F5] px-4 py-2 text-sm text-[#3C6FC4]">
                  <img src={infoIcon} alt="Info" className="w-5 h-5 object-contain" />
                  <p className="flex-1">
                    Processing usually takes 3–5 working days. You will receive an
                    email with payment instructions and your request number.
                  </p>
                </div>

                {/* Data Privacy Checkbox */}
                <label className="flex items-start space-x-3 mt-4">
                  <input
                    type="checkbox"
                    checked={acceptedPrivacy}
                    onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                    className="form-checkbox mt-1 h-4 w-4 text-yellow-600"
                    aria-required="true"
                  />
                  <span className="text-sm text-gray-700">
                    I understand that all personal information provided will be used
                    solely for processing my document request in compliance with the
                    Data Privacy Act.
                  </span>
                </label>

                {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
              </section>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 border border-blue-800 text-blue-800 rounded px-4 py-3 font-semibold hover:bg-[#2c3e9e] hover:text-white transition"
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
