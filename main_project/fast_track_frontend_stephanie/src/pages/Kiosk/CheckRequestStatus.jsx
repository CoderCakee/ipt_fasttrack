import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import Axios
import KioskHeader from "../../components/KioskHeader";
import KioskBackground from "../../components/KioskBackground";
import { ArrowLeftIcon, QrCodeIcon } from "@heroicons/react/24/solid";
import QRScanningModal from "../../components/Modals/QRScanningModal";

const API_BASE = "http://127.0.0.1:8000/api";

export default function CheckRequestStatus() {
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Navigate back to the services menu
  const handleBack = () => navigate(-1);

  // --- LOGIC 1: HANDLE API LOOKUP ---
  const processScannedCode = async (code) => {
    if (loading) return;
    setLoading(true);
    setModalVisible(false);

    // Clean the ID (remove spaces/prefixes)
    const cleanId = code.trim();

    // DIRECT NAVIGATION - No API call needed here!
    // We let the Receipt page handle the fetching.
    // This is faster and prevents the "stuck" screen issue.
    navigate(`/CheckRequestReceipt?id=${cleanId}`);

    setLoading(false);
  };

  // --- LOGIC 2: PHYSICAL SCANNER (Keyboard Listener) ---
  useEffect(() => {
    let scanBuffer = "";
    let lastKeyTime = Date.now();

    const handleKeyDown = (e) => {
      const currentTime = Date.now();

      // If keystrokes are too slow (>50ms apart), it's a human typing, reset buffer
      if (currentTime - lastKeyTime > 50) {
        scanBuffer = "";
      }
      lastKeyTime = currentTime;

      if (e.key === "Enter") {
        if (scanBuffer.length > 0) {
          processScannedCode(scanBuffer);
          scanBuffer = ""; // Clear after processing
        }
      } else if (e.key.length === 1) {
        // Only add printable characters
        scanBuffer += e.key;
      }
    };

    // Attach listener
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []); // Empty dependency array = runs once on mount


  // --- LOGIC 3: WEBCAM SCANNER ---
  const handleWebcamScan = (data) => {
    if (data) {
      processScannedCode(data);
    }
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center bg-[#2C3E9E] p-6 overflow-hidden">
      <KioskBackground opacity={10} blueOverlay={80} />
      <KioskHeader />

      <main className="relative z-10 bg-white rounded-3xl max-w-md w-full p-10 shadow-2xl flex flex-col items-center text-center border border-gray-200">

        <button
          type="button"
          onClick={handleBack}
          className="flex items-center text-sm text-[#2C3E9E] font-semibold mb-6 hover:underline self-start"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" /> Back
        </button>

        <h1 className="text-[#2C3E9E] font-bold text-3xl mb-2 tracking-wide">
          Scan Your QR Code
        </h1>

        <p className="text-gray-700 text-sm mb-8 px-4">
          Present your QR code to the camera OR scan it with the handheld scanner.
        </p>

        {/* Error Message */}
        {errorMsg && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm w-full">
            {errorMsg}
          </div>
        )}

        {/* QR Scan Button (Opens Webcam Modal) */}
        <button
          type="button"
          onClick={() => setModalVisible(true)}
          disabled={loading}
          className="flex flex-col items-center justify-center gap-4 bg-[#2C3E9E] hover:bg-blue-800 text-white font-bold py-10 px-12 rounded-2xl shadow-2xl hover:shadow-blue-500/50 transition-all transform hover:scale-105 disabled:opacity-50"
        >
          {loading ? (
            <span className="animate-pulse">Checking...</span>
          ) : (
            <>
              <QrCodeIcon className="h-16 w-16" />
              <span className="text-xl">Tap to Use Camera</span>
            </>
          )}
        </button>

        <div className="mt-8 bg-gray-50 rounded-xl p-4 shadow-inner w-full text-left text-sm text-gray-700">
          <p className="font-semibold mb-2">Instructions:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Option 1:</strong> Tap the button above to use the webcam.</li>
            <li><strong>Option 2:</strong> Use the handheld scanner directly (no need to click).</li>
          </ul>
        </div>
      </main>

      {/* QR Scanning Modal - Passes the handleWebcamScan function */}
      <QRScanningModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onScan={handleWebcamScan}
      />
    </div>
  );
}