import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import KioskHeader from "../../components/KioskHeader";
import KioskBackground from "../../components/KioskBackground";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function RequestDocumentStep2() {
  const navigate = useNavigate();

  // Mock data
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

  const toggleDocument = (doctype_id) => {
    setSelectedDocuments((prev) => {
      const newSelection = { ...prev };
      if (newSelection[doctype_id]) {
        delete newSelection[doctype_id];
      } else {
        newSelection[doctype_id] = { copies: 1, purpose: "" };
      }
      return newSelection;
    });
  };

  const handlePurposeChange = (doctype_id, value) => {
    setSelectedDocuments((prev) => ({
      ...prev,
      [doctype_id]: { ...prev[doctype_id], purpose: Number(value) },
    }));
  };

  const handleCopiesChange = (doctype_id, value) => {
    setSelectedDocuments((prev) => ({
      ...prev,
      [doctype_id]: { ...prev[doctype_id], copies: Number(value) },
    }));
  };

  const handleNotesChange = (e) => setNotes(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (Object.keys(selectedDocuments).length === 0) {
      alert("Select at least one document.");
      return;
    }

    for (let key of Object.keys(selectedDocuments)) {
      if (!selectedDocuments[key].purpose) {
        alert("Select a purpose for all selected documents.");
        return;
      }
    }

    const payload = Object.keys(selectedDocuments).map((id) => ({
      doctype_id: Number(id),
      ...selectedDocuments[id],
    }));

    console.log("Submission Payload:", payload, "Notes:", notes);
    alert("Request submitted! Check console for payload.");
  };

  const handleBack = () => navigate(-1);

  const copyOptions = Array.from({ length: 10 }, (_, i) => i + 1);

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

            {/* Progress Tracker (Step 2 active) */}
            <div className="flex justify-center items-center space-x-6 mb-10 w-2/3 max-w-sm mx-auto">
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Document Selection */}
              <fieldset className="space-y-4">
                <legend className="text-gray-900 font-semibold mb-1">Select Documents</legend>

                {documentTypes.map(({ doctype_id, name, price }) => {
                  const checked = !!selectedDocuments[doctype_id];
                  return (
                    <div key={doctype_id} className="border rounded p-3 flex flex-col space-y-2">
                      <label className="flex items-center justify-between">
                        <span>{name} (₱{price})</span>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleDocument(doctype_id)}
                          className="form-checkbox text-blue-600"
                        />
                      </label>

                      {checked && (
                        <div className="pl-4 border-l-2 border-blue-200 flex flex-col space-y-2">

                          {/* Purpose Dropdown */}
                          <select
                            value={selectedDocuments[doctype_id].purpose}
                            onChange={(e) => handlePurposeChange(doctype_id, e.target.value)}
                            required
                            className="border rounded px-2 py-1"
                          >
                            <option value="">Select Purpose</option>
                            {purposes.map((p) => (
                              <option key={p.purpose_id} value={p.purpose_id}>
                                {p.description}
                              </option>
                            ))}
                          </select>

                          {/* Copies Dropdown */}
                          <select
                            value={selectedDocuments[doctype_id].copies}
                            onChange={(e) => handleCopiesChange(doctype_id, e.target.value)}
                            className="border rounded px-2 py-1"
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
                <label className="block mb-1">Notes / Remarks (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Any special instructions..."
                  value={notes}
                  onChange={handleNotesChange}
                  className="w-full border rounded p-2"
                />
              </div>

             {/* Buttons */}
<div className="flex gap-2">
  <button
    type="button"
    onClick={handleBack}
    className="flex-1 px-4 py-3 border border-blue-800 text-blue-800 rounded font-semibold"
  >
    Back
  </button>
  <button
    type="submit"
    className="flex-1 px-4 py-3 bg-yellow-600 text-white rounded font-semibold"
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
