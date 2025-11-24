import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import KioskHeader from "../../components/KioskHeader";
import KioskBackground from "../../components/KioskBackground";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import RFIDScanningModal from "../../components/Modals/RFIDScanningModal";

const API_BASE = "http://127.0.0.1:8000/api";

export default function RequestDocumentStep1() {
  const navigate = useNavigate();

  // Form state - STRICTLY Student Info only
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    studentId: "",
    email: "",
    phone: "",
    relationship: "",
  });

  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false); // Used for RFID lookup
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle relationship radio button
  const handleRelationshipChange = (e) => {
    setFormData((prev) => ({ ...prev, relationship: e.target.value }));
    setErrors((prev) => ({ ...prev, relationship: "" }));
  };

  const handleBack = () => navigate(-1);

  // Validation function
  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required.";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required.";
    if (!formData.studentId.trim()) newErrors.studentId = "Student ID is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email))
      newErrors.email = "Invalid email address.";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
    if (!formData.relationship) newErrors.relationship = "Please select your relationship to AUF.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- RFID LOGIC ---
  const startScan = () => {
    setSubmitError("");
    setScanning(true);
  };

  const handleScanSuccess = async (scannedId) => {
    setScanning(false);
    setLoading(true);

    try {
      const response = await axios.get(`${API_BASE}/lookup-rfid/?rfid=${scannedId}`);
      const data = response.data;

      setFormData((prev) => ({
        ...prev,
        studentId: data.student_id || data.student_number || "",
        firstName: data.first_name || "",
        middleName: data.middle_name || "",
        lastName: data.last_name || "",
        email: data.email || "",
        relationship: "current"
      }));

    } catch (err) {
      console.error("RFID scan failed:", err);
      setSubmitError("Student not found or card not registered.");
    } finally {
      setLoading(false);
    }
  };

  // --- SUBMIT LOGIC ---
  const handleNext = (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!validate()) return;

    // INSTEAD OF API CALL, WE PASS DATA TO STEP 2
    navigate("/RequestDocumentStep2", {
        state: { studentData: formData }
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
              <button onClick={handleBack} type="button" className="absolute left-0 flex items-center text-blue-900 hover:text-blue-700 font-semibold transition">
                <ArrowLeftIcon className="h-5 w-5 mr-1" /> Back
              </button>
              <h2 className="text-blue-900 font-bold text-2xl tracking-wide text-center select-none">
                Request Document
              </h2>
            </div>

            {/* Progress Tracker */}
            <div className="flex justify-center items-center space-x-6 mb-10 w-2/3 max-w-sm mx-auto">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm ${step === 1 ? "bg-[#2039ad]" : "bg-gray-300 text-gray-700"} select-none`}>
                    {step}
                  </div>
                  {step !== 3 && <div className="flex-1 h-1 rounded bg-gray-300 mx-1"></div>}
                </React.Fragment>
              ))}
            </div>

            {/* Global error */}
            {submitError && <p className="text-red-600 mb-4 font-bold text-center">{submitError}</p>}

            <RFIDScanningModal visible={scanning} onClose={() => setScanning(false)} onScanComplete={handleScanSuccess} />

            <form onSubmit={handleNext} className="space-y-6">
              <fieldset className="grid grid-cols-2 gap-x-6 gap-y-4">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-900">First Name *</label>
                  <input name="firstName" type="text" value={formData.firstName} onChange={handleChange} className={`mt-1 block w-full rounded-md border py-2 px-3 focus:outline-none focus:ring-2 transition ${errors.firstName ? "border-red-600 ring-red-500 bg-red-50" : "border-gray-300 bg-gray-50 focus:ring-blue-600"}`} />
                  {errors.firstName && <p className="text-red-600 text-xs mt-1">{errors.firstName}</p>}
                </div>

                {/* Middle Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-900">Middle Name</label>
                  <input name="middleName" type="text" value={formData.middleName} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3 focus:ring-blue-600 transition" />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-900">Last Name *</label>
                  <input name="lastName" type="text" value={formData.lastName} onChange={handleChange} className={`mt-1 block w-full rounded-md border py-2 px-3 focus:outline-none focus:ring-2 transition ${errors.lastName ? "border-red-600 ring-red-500 bg-red-50" : "border-gray-300 bg-gray-50 focus:ring-blue-600"}`} />
                  {errors.lastName && <p className="text-red-600 text-xs mt-1">{errors.lastName}</p>}
                </div>

                {/* Student ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-900">Student ID *</label>
                  <input name="studentId" type="text" value={formData.studentId} onChange={handleChange} className={`mt-1 block w-full rounded-md border py-2 px-3 focus:outline-none focus:ring-2 transition ${errors.studentId ? "border-red-600 ring-red-500 bg-red-50" : "border-gray-300 bg-gray-50 focus:ring-blue-600"}`} />
                  {errors.studentId && <p className="text-red-600 text-xs mt-1">{errors.studentId}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-900">Email Address *</label>
                  <input name="email" type="email" value={formData.email} onChange={handleChange} className={`mt-1 block w-full rounded-md border py-2 px-3 focus:outline-none focus:ring-2 transition ${errors.email ? "border-red-600 ring-red-500 bg-red-50" : "border-gray-300 bg-gray-50 focus:ring-blue-600"}`} />
                  {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-900">Phone Number *</label>
                  <input name="phone" type="text" value={formData.phone} onChange={handleChange} className={`mt-1 block w-full rounded-md border py-2 px-3 focus:outline-none focus:ring-2 transition ${errors.phone ? "border-red-600 ring-red-500 bg-red-50" : "border-gray-300 bg-gray-50 focus:ring-blue-600"}`} />
                  {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
                </div>

                {/* Relationship */}
                <div className="col-span-2">
                  <fieldset>
                    <legend className="text-sm font-semibold text-gray-900 mb-2">Relationship to AUF *</legend>
                    <div className="flex flex-col space-y-2">
                      {["current", "alumni", "representative"].map((val) => (
                        <label key={val} className="flex items-center space-x-2 text-gray-700 text-sm">
                          <input type="radio" name="relationship" value={val} checked={formData.relationship === val} onChange={handleRelationshipChange} className="form-radio text-blue-600" />
                          <span>{val === "current" ? "Current Student" : val === "alumni" ? "Alumni/Inactive Student" : "Representative"}</span>
                        </label>
                      ))}
                    </div>
                    {errors.relationship && <p className="text-red-600 text-xs mt-1">{errors.relationship}</p>}
                  </fieldset>
                </div>
              </fieldset>

              <button type="button" onClick={startScan} disabled={scanning} className="mt-6 w-full bg-[#2C3E9E] hover:bg-[#1f2c6e] text-white font-semibold py-3 rounded uppercase tracking-widest transition disabled:opacity-50">
                {scanning ? "Scanning..." : "SCAN RFID"}
              </button>

              <button type="submit" className="mt-4 w-full bg-[#C5A93D] hover:bg-yellow-600 text-white font-semibold py-3 rounded uppercase tracking-widest transition">
                NEXT: SELECT DOCUMENTS
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}