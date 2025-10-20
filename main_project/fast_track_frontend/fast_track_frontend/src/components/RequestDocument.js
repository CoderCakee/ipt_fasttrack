import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api"; // Django API prefix

const RequestDocument = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    student_number: "",
    email_address: "",
    mobile_number: "",
    doctype_id: "",
    purpose_id: "",
    copy_amount: 1,
    notes: "",
  });

  const [documentTypes, setDocumentTypes] = useState([]);
  const [purposes, setPurposes] = useState([]);
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch both document types and purposes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE}/request-create/`);
        setDocumentTypes(res.data.document_types);
        setPurposes(res.data.purposes);
      } catch (err) {
        console.error(err);
        setError(
          "Unable to load document types or purposes. Please check your Django API path."
        );
      }
    };
    fetchData();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Build payload in Django's expected structure
    const payload = {
      first_name: formData.first_name,
      middle_name: formData.middle_name,
      last_name: formData.last_name,
      student_number: formData.student_number,
      email_address: formData.email_address,
      mobile_number: formData.mobile_number,
      purpose_id: formData.purpose_id,
      requested_documents: [
        {
          doctype_id: formData.doctype_id,
          copy_amount: formData.copy_amount,
        },
      ],
      notes: formData.notes,
    };

    try {
      const response = await axios.post(`${API_BASE}/request-create/`, payload);
      setReceipt(response.data); // Store receipt data for display
    } catch (err) {
      console.error(err);
      setError(err.response?.data || "Failed to submit request.");
    } finally {
      setLoading(false);
    }
  };

  // --- RECEIPT VIEW ---
  if (receipt) {
    return (
      <div
        style={{
          maxWidth: "700px",
          margin: "2rem auto",
          background: "#1e1e1e",
          color: "#fff",
          padding: "2rem",
          borderRadius: "10px",
        }}
      >
        <h2>📄 Request Receipt</h2>
        <p>
          <strong>Request ID:</strong> {receipt.request_id}
        </p>
        <p>
          <strong>Date:</strong> {new Date(receipt.created_at).toLocaleString()}
        </p>
        <p>
          <strong>Requester:</strong> {receipt.requester_name}
        </p>

        <p><strong>Documents:</strong></p>
        <ul>
          {receipt.requested_documents.map((doc, index) => (
            <li key={index}>
              {doc.document_name} — {doc.copies} copies @ ₱{doc.price_per_copy} each (Subtotal: ₱{doc.subtotal})
            </li>
          ))}
        </ul>

        <p><strong>Total Amount:</strong> ₱{receipt.total_amount}</p>
        <p><strong>Processing Time:</strong> {receipt.processing_time}</p>

        <button
          onClick={() => setReceipt(null)}
          style={{
            marginTop: "1rem",
            background: "#444",
            color: "#fff",
            border: "none",
            padding: "10px 15px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Submit another request
        </button>
      </div>
    );
  }

  // --- FORM VIEW ---
  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "2rem auto",
        background: "#f5f5f5",
        padding: "2rem",
        borderRadius: "10px",
      }}
    >
      <h2>🧾 Request a Document</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          name="first_name"
          placeholder="First Name"
          onChange={handleChange}
          required
        />
        <input
          name="middle_name"
          placeholder="Middle Name"
          onChange={handleChange}
        />
        <input
          name="last_name"
          placeholder="Last Name"
          onChange={handleChange}
          required
        />
        <input
          name="student_number"
          placeholder="Student Number"
          onChange={handleChange}
        />
        <input
          type="email"
          name="email_address"
          placeholder="Email Address"
          onChange={handleChange}
        />
        <input
          name="mobile_number"
          placeholder="Mobile Number"
          onChange={handleChange}
        />

        <select name="doctype_id" onChange={handleChange} required>
          <option value="">Select Document Type</option>
          {documentTypes.map((doc) => (
            <option key={doc.doctype_id} value={doc.doctype_id}>
              {doc.name} — ₱{doc.price}
            </option>
          ))}
        </select>

        <select name="purpose_id" onChange={handleChange} required>
          <option value="">Select Purpose</option>
          {purposes.map((p) => (
            <option key={p.purpose_id} value={p.purpose_id}>
              {p.description}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="copy_amount"
          min="1"
          value={formData.copy_amount}
          onChange={handleChange}
          required
        />

        <textarea
          name="notes"
          placeholder="Additional Notes"
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
};

export default RequestDocument;
