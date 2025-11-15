import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import KioskHeader from "../../components/KioskHeader";
import KioskBackground from "../../components/KioskBackground";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function RequestDocumentStep2() {
  const navigate = useNavigate();
  const location = useLocation();

  // Receive student data from Step 1
  const { studentData } = location.state || {};
  
  // Redirect back if no studentData (optional safety)
  if (!studentData) {
    navigate("/RequestDocumentStep1");
  }

  // Mock data (replace with API if needed)
  const documentTypes = [
    { doctype_id: 1, name: "Transcript of Records", price: 150 },
    { doctype_id: 2, name: "Diploma", price: 200 },
    { doctype_id: 3, name: "Certificate of Enrollment", price: 100 },
  ];

  const purposes = [
    { purpose_id: 1, description: "Board Exam Application" },
    { purpose_id: 2, description: "Scholarship Application" },
    { purpose_id: 3, description: "Employment Requirement" },
  ];

  const [selectedDocuments, setSelectedDocuments] = useState({});
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({});

  const toggleDocument = (doctype_id) => {
    setSelectedDocuments((prev) => {
      const newSelection = { ...prev };
      if (newSelection[doctype_id]) delete newSelection[doctype_id];
      else newSelection[doctype_id] = { copies: 1, purpose: "" };
      return newSelection;
    });
    setErrors({});
  };

  const handlePurposeChange = (doctype_id, value) => {
    setSelectedDocuments((prev) => ({
      ...prev,
      [doctype_id]: { ...prev[doctype_id], purpose: Number(value) },
    }));
    setErrors({});
  };

  const handleCopiesChange = (doctype_id, value) => {
    setSelectedDocuments((prev) => ({
      ...prev,
      [doctype_id]: { ...prev[doctype_id], copies: Number(value) },
    }));
    setErrors({});
  };

  const handleNotesChange = (e) => setNotes(e.target.value);

  const handleBack = () => navigate(-1);

  const copyOptions = Array.from({ length: 10 }, (_, i) => i + 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (Object.keys(selectedDocuments).length === 0)
      newErrors.documents = "Select at least one document.";

    Object.keys(selectedDocuments).forEach((id) => {
      if (!selectedDocuments[id].purpose)
        newErrors[id] = "Select a purpose for this document.";
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Build payload for Step 3
    const payload = Object.keys(selectedDocuments).map((id) => {
      const docType = documentTypes.find((d) => d.doctype_id === Number(id));
      const purpose = purposes.find(
        (p) => p.purpose_id === selectedDocuments[id].purpose
      );
      return {
        doctype_id: Number(id),
        name: docType?.name || "",
        price: docType?.price || 0,
        copies: selectedDocuments[id].copies,
        purpose: selectedDocuments[id].purpose,
        purposeDescription: purpose?.description || "",
      };
    });

    // Navigate to Step 3 with studentData + documents + notes
    navigate("/RequestDocumentStep3", {
      state: {
        studentData,
        documents: payload,
        notes,
      },
    });
  };

  return (
    <div className="min-h-screen relative flex flex-col bg-[#2C3E9E]">
      <KioskBackground opacity={10} blueOpacity={80} />
      <div className="relative z-10 flex flex-col min-h-screen">
        <KioskHeader />

        <main className="flex-grow flex justify-center items-start px-4 pt-16 pb-8">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-10 mx-auto mt-12">
            {/* Header */}
            <div className="relative mb-6">
              <button
                onClick={handleBack}
                type="button"
                className="absolute left-0 flex items-center text-blue-900 hover:text-blue-700 font-semibold transition"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-1" />
                Back
              </button>
              <h2 className="text-blue-900 font-bold text-2xl tracking-wide text-center select-none">
                Request Document
              </h2>
            </div>

            {/* Progress Tracker */}
            <div className="flex justify-center items-center space-x-6 mb-6 w-2/3 max-w-sm mx-auto">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm select-none ${
                      step <= 2 ? "bg-[#2039ad]" : "bg-gray-300 text-gray-700"
                    }`}
                  >
                    {step}
                  </div>
                  {step !== 3 && <div className="flex-1 h-1 rounded bg-gray-300 mx-1"></div>}
                </React.Fragment>
              ))}
            </div>

            {/* Student Info Summary */}
            {studentData && (
              <div className="mb-6 p-4 bg-gray-100 rounded border">
                <p>
                  <strong>Name:</strong> {studentData.firstName}{" "}
                  {studentData.middleName} {studentData.lastName}
                </p>
                <p>
                  <strong>Student ID:</strong> {studentData.studentId}
                </p>
                <p>
                  <strong>Email:</strong> {studentData.email}
                </p>
                <p>
                  <strong>Phone:</strong> {studentData.phone}
                </p>
              </div>
            )}

            {/* Global Error */}
            {errors.documents && (
              <p className="text-red-600 mb-4">{errors.documents}</p>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Document Selection */}
              <fieldset className="space-y-4">
                <legend className="text-blue-900 font-semibold mb-1">Select Documents</legend>

                {documentTypes.map(({ doctype_id, name, price }) => {
                  const selected = !!selectedDocuments[doctype_id];
                  return (
                    <div key={doctype_id} className="border rounded p-4 flex flex-col space-y-3">
                      <label className="flex items-center justify-between">
                        <span className="font-medium">{name} (₱{price})</span>
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleDocument(doctype_id)}
                          className="form-checkbox text-blue-600"
                        />
                      </label>

                      {selected && (
                        <div className="pl-4 border-l-2 border-blue-200 flex flex-col space-y-2">
                          {/* Purpose */}
                          <select
                            value={selectedDocuments[doctype_id].purpose}
                            onChange={(e) =>
                              handlePurposeChange(doctype_id, e.target.value)
                            }
                            className={`border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-600 transition ${
                              errors[doctype_id]
                                ? "border-red-600 bg-red-50"
                                : "border-gray-300 bg-white"
                            }`}
                          >
                            <option value="">Select Purpose</option>
                            {purposes.map((p) => (
                              <option key={p.purpose_id} value={p.purpose_id}>
                                {p.description}
                              </option>
                            ))}
                          </select>
                          {errors[doctype_id] && (
                            <p className="text-red-600 text-xs mt-1">
                              {errors[doctype_id]}
                            </p>
                          )}

                          {/* Copies */}
                          <select
                            value={selectedDocuments[doctype_id].copies}
                            onChange={(e) =>
                              handleCopiesChange(doctype_id, e.target.value)
                            }
                            className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                          >
                            {copyOptions.map((n) => (
                              <option key={n} value={n}>
                                {n} {n === 1 ? "copy" : "copies"}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  );
                })}
              </fieldset>

              {/* Notes */}
              <div>
                <label className="block mb-1 text-gray-900 font-medium">
                  Notes / Remarks (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Any special instructions..."
                  value={notes}
                  onChange={handleNotesChange}
                  className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 px-4 py-3 border border-blue-800 text-blue-800 rounded font-semibold hover:bg-[#2c3e9e] hover:text-white transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-[#C5A93D] hover:bg-yellow-600 text-white rounded font-semibold transition"
                >
                  Next: Review
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
