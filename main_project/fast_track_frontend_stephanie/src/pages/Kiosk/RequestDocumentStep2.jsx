import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import KioskHeader from "../../components/KioskHeader";
import KioskBackground from "../../components/KioskBackground";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

const API_BASE = "http://127.0.0.1:8000/api";

export default function RequestDocumentStep2() {
  const navigate = useNavigate();
  const location = useLocation();

  const { studentData } = location.state || {};

  // Safety check
  useEffect(() => {
    if (!studentData) navigate("/RequestDocumentStep1");
  }, [studentData, navigate]);

  const [documentTypes, setDocumentTypes] = useState([]);
  const [purposes, setPurposes] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE}/request-create/`);
        if (res.data.document_types) setDocumentTypes(res.data.document_types);
        if (res.data.purposes) setPurposes(res.data.purposes);
      } catch (err) {
        console.error("Failed to fetch documents", err);
      } finally {
        setLoadingDocs(false);
      }
    };
    fetchData();
  }, []);

  const [selectedDocuments, setSelectedDocuments] = useState({});
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({});

  const toggleDocument = (doctype_id) => {
    setSelectedDocuments((prev) => {
      const newSelection = { ...prev };
      if (newSelection[doctype_id]) delete newSelection[doctype_id];
      else newSelection[doctype_id] = { copies: 1, purpose: "" }; // Default state
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
  };

  const handleNext = (e) => {
    e.preventDefault();
    const newErrors = {};

    // 1. Must select at least one document
    if (Object.keys(selectedDocuments).length === 0)
      newErrors.documents = "Select at least one document.";

    // 2. Every selected document MUST have a purpose
    Object.keys(selectedDocuments).forEach((id) => {
      if (!selectedDocuments[id].purpose)
        newErrors[id] = "Select a purpose.";
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 3. Format data to include the specific purpose per document
    const formattedDocs = Object.keys(selectedDocuments).map((id) => {
      const doc = documentTypes.find((d) => d.doctype_id === Number(id));
      const purp = purposes.find((p) => p.purpose_id === selectedDocuments[id].purpose);
      return {
        doctype_id: Number(id),
        name: doc?.name || "Unknown Document",
        price: doc?.price || 0,
        copies: selectedDocuments[id].copies,
        purpose_id: selectedDocuments[id].purpose, // Specific Purpose ID
        purpose_name: purp?.description || "Unknown Purpose" // For display in Step 3
      };
    });

    // 4. Navigate (Do NOT pass a globalPurpose)
    navigate("/RequestDocumentStep3", {
      state: {
        studentData,
        documents: formattedDocs,
        notes,
      },
    });
  };

  const copyOptions = Array.from({ length: 10 }, (_, i) => i + 1);

  if (!studentData) return null;

  return (
    <div className="min-h-screen relative flex flex-col bg-[#2C3E9E]">
      <KioskBackground opacity={10} blueOpacity={80} />
      <div className="relative z-10 flex flex-col min-h-screen">
        <KioskHeader />

        <main className="flex-grow flex justify-center items-start px-4 pt-16 pb-8">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-10 mx-auto mt-12">

            <div className="relative mb-6">
              <button onClick={() => navigate(-1)} className="absolute left-0 flex items-center text-blue-900 font-semibold">
                <ArrowLeftIcon className="h-5 w-5 mr-1" /> Back
              </button>
              <h2 className="text-blue-900 font-bold text-2xl tracking-wide text-center">Request Document</h2>
            </div>

            <div className="flex justify-center items-center space-x-6 mb-6 w-2/3 max-w-sm mx-auto">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm ${step <= 2 ? "bg-[#2039ad]" : "bg-gray-300 text-gray-700"}`}>{step}</div>
                  {step !== 3 && <div className="flex-1 h-1 rounded bg-gray-300 mx-1"></div>}
                </React.Fragment>
              ))}
            </div>

            {loadingDocs ? (
              <p className="text-center text-gray-500">Loading documents...</p>
            ) : (
              <form onSubmit={handleNext} className="space-y-6">
                {errors.documents && <p className="text-red-600 font-medium text-center">{errors.documents}</p>}

                <fieldset className="space-y-4">
                  {documentTypes.map(({ doctype_id, name, price }) => {
                    const selected = !!selectedDocuments[doctype_id];
                    return (
                      <div key={doctype_id} className={`border rounded p-4 transition ${selected ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}>
                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="font-medium text-gray-900">{name} (₱{price})</span>
                          <input type="checkbox" checked={selected} onChange={() => toggleDocument(doctype_id)} className="w-5 h-5 text-blue-600 rounded" />
                        </label>

                        {selected && (
                          <div className="mt-3 pl-4 border-l-2 border-blue-200 grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-bold text-gray-500 uppercase">Purpose <span className="text-red-600">*</span></label>
                              <select
                                value={selectedDocuments[doctype_id].purpose}
                                onChange={(e) => handlePurposeChange(doctype_id, e.target.value)}
                                className={`w-full mt-1 border rounded px-2 py-1 text-sm ${errors[doctype_id] ? 'border-red-500 bg-red-50' : ''}`}
                              >
                                <option value="">-- Select --</option>
                                {purposes.map((p) => (<option key={p.purpose_id} value={p.purpose_id}>{p.description}</option>))}
                              </select>
                              {errors[doctype_id] && <p className="text-red-600 text-xs mt-1">{errors[doctype_id]}</p>}
                            </div>
                            <div>
                               <label className="text-xs font-bold text-gray-500 uppercase">Copies</label>
                               <select value={selectedDocuments[doctype_id].copies} onChange={(e) => handleCopiesChange(doctype_id, e.target.value)} className="w-full mt-1 border rounded px-2 py-1 text-sm">
                                {copyOptions.map((n) => (<option key={n} value={n}>{n}</option>))}
                              </select>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </fieldset>

                <div>
                  <label className="block mb-1 text-gray-900 font-medium">Notes (Optional)</label>
                  <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full border rounded p-2" placeholder="Specific instructions..." />
                </div>

                <button type="submit" className="w-full bg-[#C5A93D] hover:bg-yellow-600 text-white font-semibold py-3 rounded uppercase tracking-widest transition">
                  NEXT: REVIEW REQUEST
                </button>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}