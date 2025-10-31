import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, PlusIcon } from "@heroicons/react/24/solid";
import KioskHeader from "../../components/KioskHeader";
import KioskBackground from "../../components/KioskBackground";

// Example options
const documentTypes = [
  "Transcript",
  "Enrollment Verification",
  "Diploma",
  "Good Moral Certificate",
];
const purposes = ["Personal Use", "Scholarship", "Employment", "Further Studies"];
const copiesOptions = ["1", "2", "3"];

// Component for a single document request row
function DocumentRequestRow({ index, document, handleChange }) {
  return (
    <div className="border border-gray-300 rounded-md p-4 mb-4">
      <h3 className="text-gray-700 font-semibold mb-2">Document #{index + 1}</h3>

      <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0">
        {/* Document Type */}
        <div className="flex flex-col flex-1">
          <label className="mb-1 text-gray-600 font-medium">Document Type</label>
          <select
            name="documentType"
            value={document.documentType}
            onChange={(e) => handleChange(index, e)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="" disabled>
              Select Document
            </option>
            {documentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Purpose */}
        <div className="flex flex-col flex-1">
          <label className="mb-1 text-gray-600 font-medium">Purpose</label>
          <select
            name="purpose"
            value={document.purpose}
            onChange={(e) => handleChange(index, e)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="" disabled>
              Select Purpose
            </option>
            {purposes.map((purpose) => (
              <option key={purpose} value={purpose}>
                {purpose}
              </option>
            ))}
          </select>
        </div>

        {/* Copies */}
        <div className="flex flex-col w-24">
          <label className="mb-1 text-gray-600 font-medium">Copies</label>
          <select
            name="copies"
            value={document.copies}
            onChange={(e) => handleChange(index, e)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            {copiesOptions.map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default function MultiDocumentRequest() {
  const navigate = useNavigate();

  // State to track all document requests
  const [documents, setDocuments] = useState([
    { documentType: "", purpose: "", copies: "1" },
  ]);

  // Handle changes in any row
  const handleDocumentChange = (index, e) => {
    const { name, value } = e.target;
    const newDocuments = [...documents];
    newDocuments[index][name] = value;
    setDocuments(newDocuments);
  };

  // Add a new document row
  const addDocument = () => {
    setDocuments([...documents, { documentType: "", purpose: "", copies: "1" }]);
  };

  // Submit all document requests
  const handleAllRequests = (e) => {
    e.preventDefault();
    navigate("/MultiSuccessMessage", {
      state: { documentCount: documents.length },
    });
  };

  // Go back to the previous page (could be adjusted)
  const handleBack = () => {
    navigate("/MultiDocumentRequest", {
      state: { documentCount: documents.length },
    });
  };

  return (
    <div className="relative min-h-screen bg-[#2C3E9E] text-gray-900 font-sans">
      {/* Background Overlay */}
      <KioskBackground opacity={10} blueOpacity={80} />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <KioskHeader />

        {/* Main scrollable area */}
        <main className="flex-grow flex justify-center items-center p-4 sm:p-8">
          <div
            className="max-w-3xl w-full bg-white rounded-lg border-2 border-yellow-500 shadow-lg 
                       p-6 md:p-10 max-h-[90vh] overflow-y-auto"
          >
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="flex items-center text-gray-700 mb-4 hover:text-blue-700 transition"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back
            </button>

            {/* Page Title */}
            <h1 className="text-center text-blue-900 font-bold text-lg md:text-xl mb-6">
              Multi-Document Request
            </h1>

            <form onSubmit={handleAllRequests}>
              {/* Document Requests Section */}
              <section className="mb-6 border border-gray-300 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-gray-800">Document Requests</h2>
                  <button
                    type="button"
                    onClick={addDocument}
                    className="bg-[#2c3e9e] text-white px-3 py-1 rounded hover:bg-[#1f2c6e] transition flex items-center space-x-1"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    <span>Add Document</span>
                  </button>
                </div>

                {documents.map((doc, i) => (
                  <DocumentRequestRow
                    key={i}
                    index={i}
                    document={doc}
                    handleChange={handleDocumentChange}
                  />
                ))}
              </section>

              {/* Processing Note */}
              <div className="bg-yellow-100 border border-yellow-300 rounded p-4 mb-6 text-sm text-yellow-900">
                <p>
                  <strong>Processing Time:</strong> 3–5 working days for all documents.
                </p>
                <p className="mt-1">
                  <strong>Note:</strong> All documents will be processed together and available for pickup at the same time.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-yellow-600 text-white font-bold uppercase py-3 rounded hover:bg-yellow-700 transition"
              >
                Submit All Requests
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
