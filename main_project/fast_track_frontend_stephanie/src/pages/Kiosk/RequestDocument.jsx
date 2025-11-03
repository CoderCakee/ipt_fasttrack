import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import KioskHeader from "../../components/KioskHeader";
import KioskBackground from "../../components/KioskBackground";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

const API_BASE = "http://127.0.0.1:8000/api";

export default function RequestDocument() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    studentId: "",
    email: "",
    phone: "",
    documentType: "",
    purpose: "",
    copies: 1,
    notes: "",
  });

  const [documentTypes, setDocumentTypes] = useState([]);
  const [purposes, setPurposes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch document types and purposes from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE}/request-create/`);
        if (res.data.document_types) setDocumentTypes(res.data.document_types);
        if (res.data.purposes) setPurposes(res.data.purposes);
      } catch (err) {
        console.error(err);
        setError(
          "Unable to load document types or purposes. Please check your API."
        );
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Convert documentType and purpose to numbers
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "documentType" || name === "purpose" ? Number(value) : value,
    }));
  };

  const incrementCopies = () => {
    setFormData((prev) => ({ ...prev, copies: prev.copies + 1 }));
  };

  const decrementCopies = () => {
    setFormData((prev) => ({
      ...prev,
      copies: prev.copies > 1 ? prev.copies - 1 : 1,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
        const payload = {
          first_name: formData.firstName,
          middle_name: formData.middleName,
          last_name: formData.lastName,
          student_number: formData.studentId,
          email_address: formData.email,
          mobile_number: formData.phone,
          purpose_id: formData.purpose,
          requested_documents: [
            {
              doctype_id: formData.documentType,
              copy_amount: formData.copies,
            },
          ],
          notes: formData.notes,
        };

      const response = await axios.post(`${API_BASE}/request-create/`, payload);
      console.log("Request submitted successfully:", response.data);
      navigate("/SuccessMessage");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
        JSON.stringify(err.response?.data) ||
        "Failed to submit request."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/KioskServicesMenu");
  };

  return (
    <div className="min-h-screen relative flex flex-col bg-[#2C3E9E]">
      <KioskBackground opacity={10} blueOpacity={80} />
      <div className="relative z-10 flex flex-col min-h-screen">
        <KioskHeader />
        <main className="flex-grow flex justify-center items-start px-4 py-8">
          <div className="bg-white bg-opacity-95 border-2 border-yellow-600 rounded-lg shadow-lg max-w-2xl w-full p-6 md:p-20">
            <button
              onClick={handleBack}
              type="button"
              className="flex items-center text-gray-700 hover:text-blue-700 mb-4 text-sm font-medium transition"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back
            </button>

            <h2 className="text-center text-blue-900 font-semibold text-xl md:text-2xl mb-8">
              Request a Document
            </h2>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {["firstName", "middleName", "lastName", "studentId", "email", "phone"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-900">
                      {field === "firstName" ? "First Name" :
                       field === "middleName" ? "Middle Name" :
                       field === "lastName" ? "Last Name" :
                       field === "studentId" ? "Student ID" :
                       field === "email" ? "Email Address" :
                       "Phone Number"}
                      {field !== "middleName" && <span className="text-red-600">*</span>}
                    </label>
                    <input
                      id={field}
                      name={field}
                      type={field === "email" ? "email" : "text"}
                      placeholder={
                        field === "studentId" ? "e.g., 23-1774-384" :
                        field === "email" ? "example@gmail.com" :
                        field === "phone" ? "XXXX-XXX-XXX" :
                        `Enter your ${field === "firstName" ? "first" : field === "lastName" ? "last" : "middle"} name`
                      }
                      value={formData[field]}
                      onChange={handleChange}
                      required={field !== "middleName"}
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 py-2 px-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                    />
                  </div>
                ))}

                {/* Document Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-900">
                    Document Type<span className="text-red-600">*</span>
                  </label>
                  <select
                    id="documentType"
                    name="documentType"
                    value={formData.documentType}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                  >
                    <option value="" disabled>Select document type</option>
                    {documentTypes.map((doc) => (
                      <option key={doc.doctype_id} value={doc.doctype_id}>
                        {doc.name} — ₱{doc.price}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Purpose */}
                <div>
                  <label className="block text-sm font-medium text-gray-900">
                    Purpose<span className="text-red-600">*</span>
                  </label>
                  <select
                    id="purpose"
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                  >
                    <option value="" disabled>Select purpose</option>
                    {purposes.map((p) => (
                      <option key={p.purpose_id} value={p.purpose_id}>
                        {p.description}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Copies */}
              <div className="flex items-center space-x-4 max-w-xs">
                <label className="block text-sm font-medium text-gray-900">Number of Copies</label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={decrementCopies}
                    className="bg-blue-900 text-white px-3 py-1 rounded hover:bg-blue-700 transition select-none"
                  >
                    -
                  </button>
                  <span className="font-mono text-lg w-10 text-center">{formData.copies}</span>
                  <button
                    type="button"
                    onClick={incrementCopies}
                    className="bg-blue-900 text-white px-3 py-1 rounded hover:bg-blue-700 transition select-none"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-900">Additional Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  placeholder="Any special instructions or additional information"
                  value={formData.notes}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 py-2 px-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 rounded tracking-widest transition"
              >
                {loading ? "Submitting..." : "SUBMIT REQUEST"}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
