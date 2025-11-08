import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import KioskHeader from "../../components/KioskHeader";
import KioskBackground from "../../components/KioskBackground";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

const API_BASE = "http://127.0.0.1:8000/api";

export default function RequestDocumentStep1() {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    studentId: "",
    email: "",
    phone: "",
    documentType: "", // doctype_id
    purpose: "",      // purpose_id
    copies: 1,
    notes: "",
    relationship: "", // Relationship to AUF
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
        setError("Unable to load document types or purposes. Please check your API.");
      }
    };
    fetchData();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "documentType" || name === "purpose" ? Number(value) : value,
    }));
  };

  // Handle relationship radio button
  const handleRelationshipChange = (e) => {
    setFormData((prev) => ({ ...prev, relationship: e.target.value }));
  };

  // Increment/Decrement copies
  const incrementCopies = () => setFormData((prev) => ({ ...prev, copies: prev.copies + 1 }));
  const decrementCopies = () =>
    setFormData((prev) => ({ ...prev, copies: prev.copies > 1 ? prev.copies - 1 : 1 }));

  // Navigate back
  const handleBack = () => navigate("/KioskServicesMenu");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Build payload according to backend database models
      const payload = {
        first_name: formData.firstName,
        middle_name: formData.middleName,
        last_name: formData.lastName,
        student_number: formData.studentId,
        email_address: formData.email,
        mobile_number: formData.phone,
        purpose_id: formData.purpose,
        copy_amount: formData.copies,
        notes: formData.notes,
        relationship: formData.relationship,
        requested_documents: [
          {
            doctype_id: formData.documentType,
            copy_amount: formData.copies,
          },
        ],
      };

      // Send POST request to backend
      const response = await axios.post(`${API_BASE}/request-create/`, payload);

      console.log("Request submitted successfully:", response.data);

      // Navigate to success page
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

  return (
    <div className="min-h-screen relative flex flex-col bg-[#2C3E9E]">
      <KioskBackground opacity={10} blueOpacity={80} />
      <div className="relative z-10 flex flex-col min-h-screen">
        <KioskHeader />

        <main className="flex-grow flex justify-center items-start px-4 pt-16 pb-8">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-10 mx-auto mt-12">

            {/* Header: Back button and centered title */}
            <div className="relative mb-6">
              <button
                onClick={handleBack}
                type="button"
                className="absolute left-0 flex items-center text-blue-900 hover:text-blue-700 font-semibold transition"
                aria-label="Back to services menu"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-1" />
                Back
              </button>

              <h2 className="text-blue-900 font-bold text-2xl tracking-wide text-center select-none">
                Request Document
              </h2>
            </div>

            {/* Progress Tracker */}
            <div className="flex justify-center items-center space-x-6 mb-10 w-2/3 max-w-sm mx-auto">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                      step === 1 ? "bg-[#2039ad]" : "bg-gray-300 text-gray-700"
                    } select-none`}
                  >
                    {step}
                  </div>
                  {step !== 3 && <div className="flex-1 h-1 rounded bg-gray-300 mx-1"></div>}
                </React.Fragment>
              ))}
            </div>

            {/* Error message */}
            {error && <p className="text-red-600 mb-4">{error}</p>}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <fieldset className="grid grid-cols-2 gap-x-6 gap-y-4">

                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-900">
                    First Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                  />
                </div>

                {/* Middle Name */}
                <div>
                  <label htmlFor="middleName" className="block text-sm font-medium text-gray-900">
                    Middle Name
                  </label>
                  <input
                    id="middleName"
                    name="middleName"
                    type="text"
                    placeholder="Enter your middle name"
                    value={formData.middleName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-900">
                    Last Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                  />
                </div>

                {/* Student ID */}
                <div>
                  <label htmlFor="studentId" className="block text-sm font-medium text-gray-900">
                    Student ID <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="studentId"
                    name="studentId"
                    type="text"
                    placeholder="e.g., 23-1774-384"
                    value={formData.studentId}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                    Email Address <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="example@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-900">
                    Phone Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    placeholder="XXXX-XXX-XXX"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                  />
                </div>

                {/* Relationship to AUF */}
                <div className="col-span-2">
                  <fieldset>
                    <legend className="text-sm font-semibold text-gray-900 mb-2">
                      Relationship to AUF <span className="text-red-600">*</span>
                    </legend>

                    <div className="flex flex-col space-y-2">
                      <label className="flex items-center space-x-2 text-gray-700 text-sm">
                        <input
                          type="radio"
                          name="relationship"
                          value="current"
                          checked={formData.relationship === "current"}
                          onChange={handleRelationshipChange}
                          required
                          className="form-radio text-blue-600"
                        />
                        <span>Current Student</span>
                      </label>

                      <label className="flex items-center space-x-2 text-gray-700 text-sm">
                        <input
                          type="radio"
                          name="relationship"
                          value="alumni"
                          checked={formData.relationship === "alumni"}
                          onChange={handleRelationshipChange}
                          className="form-radio text-blue-600"
                        />
                        <span>Alumni/Inactive Student</span>
                      </label>

                      <label className="flex items-center space-x-2 text-gray-700 text-sm">
                        <input
                          type="radio"
                          name="relationship"
                          value="representative"
                          checked={formData.relationship === "representative"}
                          onChange={handleRelationshipChange}
                          className="form-radio text-blue-600"
                        />
                        <span>Representative</span>
                      </label>
                    </div>

                    {formData.relationship === "representative" && (
                      <p className="mt-3 rounded-md border border-gray-300 bg-gray-100 py-2 px-3 text-gray-700 text-xs">
                        Authorization letter and student's valid ID required for pickup
                      </p>
                    )}
                  </fieldset>
                </div>

              </fieldset>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full bg-[#C5A93D] hover:bg-yellow-600 text-white font-semibold py-3 rounded uppercase tracking-widest transition"
              >
                {loading ? "Submitting..." : "NEXT: SELECT DOCUMENTS"}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
