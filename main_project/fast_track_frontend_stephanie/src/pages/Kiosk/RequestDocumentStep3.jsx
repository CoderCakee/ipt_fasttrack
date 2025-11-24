import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import KioskHeader from "../../components/KioskHeader";
import KioskBackground from "../../components/KioskBackground";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

const API_BASE = "http://127.0.0.1:8000/api";

export default function RequestDocumentStep3() {
  const navigate = useNavigate();
  const location = useLocation();

  // REMOVED 'globalPurpose' because we are doing per-document purpose now
  const { studentData, documents, notes } = location.state || {};

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    // UPDATED CHECK: Only check for studentData and documents
    if (!studentData || !documents) {
      navigate("/RequestDocumentStep1");
    }
  }, [studentData, documents, navigate]);

  const calculateTotal = () => {
    return documents?.reduce((acc, doc) => acc + (doc.price * doc.copies), 0) || 0;
  };

  const handleFinalSubmit = async () => {
    setSubmitting(true);
    setSubmitError("");

    try {
      // 1. Construct Payload
      const payload = {
        first_name: studentData.firstName,
        middle_name: studentData.middleName,
        last_name: studentData.lastName,
        student_number: studentData.studentId,
        email_address: studentData.email,
        mobile_number: studentData.phone,
        notes: notes,

        // 2. Map the documents
        // USE THE SPECIFIC PURPOSE ID FROM THE DOCUMENT OBJECT
        requested_documents: documents.map((doc) => ({
          doctype_id: doc.doctype_id,
          copy_amount: doc.copies,
          purpose_id: doc.purpose_id // Using specific document purpose
        })),
      };

      // 3. Send to Backend
      const response = await axios.post(`${API_BASE}/request-create/`, payload);
      console.log("Request Success:", response.data);

      // 4. Navigate to Receipt
      navigate("/RequestReceipt", {
        state: { receiptData: response.data },
      });

    } catch (err) {
      console.error(err);
      const errorMsg =
        err.response?.data?.error ||
        JSON.stringify(err.response?.data) ||
        "Failed to submit request. Please try again.";
      setSubmitError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!studentData || !documents) return null;

  return (
    <div className="min-h-screen relative flex flex-col bg-[#2C3E9E]">
      <KioskBackground opacity={10} blueOpacity={80} />
      <div className="relative z-10 flex flex-col min-h-screen">
        <KioskHeader />

        <main className="flex-grow flex justify-center items-start px-4 pt-16 pb-8">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-10 mx-auto mt-12">

            {/* Back Button */}
            <div className="relative mb-6">
              <button
                onClick={() => navigate(-1)}
                className="absolute left-0 flex items-center text-blue-900 hover:text-blue-700 font-semibold transition"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-1" />
                Back
              </button>
              <h2 className="text-blue-900 font-bold text-2xl tracking-wide text-center select-none">
                Review Request
              </h2>
            </div>

            {/* Progress Bar (Step 3) */}
            <div className="flex justify-center items-center space-x-6 mb-8 w-2/3 max-w-sm mx-auto">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm bg-[#2039ad] select-none">
                    {step}
                  </div>
                  {step !== 3 && <div className="flex-1 h-1 rounded bg-[#2039ad] mx-1"></div>}
                </React.Fragment>
              ))}
            </div>

            {/* Error Message */}
            {submitError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center text-sm">
                {submitError}
              </div>
            )}

            <div className="space-y-6">
              {/* Student Summary */}
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200 text-sm space-y-2">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-bold text-blue-900">Requesting As:</span>
                  <span className="text-gray-900">
                    {studentData.firstName} {studentData.lastName} ({studentData.studentId})
                  </span>
                </div>
                {/* Removed Global Purpose display since it's now per document */}
              </div>

              {/* Document Table */}
              <div className="bg-white rounded border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Document Details
                      </th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                        Qty
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {documents.map((doc, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          <div className="font-bold">{doc.name}</div>
                          {/* Display the specific purpose for this document */}
                          <div className="text-xs text-gray-500">Purpose: {doc.purpose_name}</div>
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 text-center">
                          {doc.copies}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 text-right">
                          ₱{doc.price * doc.copies}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="bg-gray-50 px-4 py-3 border-t flex justify-between items-center">
                  <span className="font-bold text-blue-900">Total Amount</span>
                  <span className="font-bold text-xl text-[#C5A93D]">
                    ₱{calculateTotal()}
                  </span>
                </div>
              </div>

              {/* Notes */}
              {notes && (
                <div className="bg-yellow-50 p-3 rounded border border-yellow-200 text-sm">
                  <span className="font-bold text-gray-700">Notes:</span> {notes}
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleFinalSubmit}
                disabled={submitting}
                className="w-full bg-[#C5A93D] hover:bg-yellow-600 text-white font-semibold py-4 rounded uppercase tracking-widest transition shadow-lg disabled:opacity-70"
              >
                {submitting ? "Submitting Request..." : "CONFIRM & SUBMIT"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}