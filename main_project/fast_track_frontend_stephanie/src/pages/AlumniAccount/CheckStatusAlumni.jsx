import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import KioskHeader from "../../components/KioskHeader";
import KioskBackground from "../../components/KioskBackground";
import { ArrowLeftIcon, QrCodeIcon, CameraIcon } from "@heroicons/react/24/solid";

export default function CheckStatusAlumni() {
  const navigate = useNavigate();
  const [qrData, setQrData] = useState("");
  const [scanning, setScanning] = useState(false);
  const fileInputRef = useRef(null);

  const handleBack = () => navigate("/KioskServicesMenu");

  // Simulate QR code scan from camera
  const handleScan = () => {
    // TODO: Integrate actual camera QR scanner here
    alert("Camera scanner activated. Implement camera scanning here.");
    const scannedRequestNumber = "FAST-2024-510586"; // Example simulated result
    setQrData(scannedRequestNumber);
    navigate("/CheckRequestReceipt", {
      state: { data: { request_number: scannedRequestNumber } },
    });
  };

  // Handle file upload for QR code image
  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // TODO: Integrate QR code image decoding here (e.g. use jsQR or similar library)
    // For now, simulating decoded data
    alert(`QR Code image uploaded: ${file.name}`);
    const decodedRequestNumber = "FAST-2024-510586"; // Simulated decoded result
    setQrData(decodedRequestNumber);
    navigate("/CheckRequestReceipt", {
      state: { data: { request_number: decodedRequestNumber } },
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center bg-[#2C3E9E] p-6 overflow-hidden">
      {/* Background Overlay */}
      <KioskBackground opacity={10} blueOpacity={80} />

      {/* Header */}
      <KioskHeader />

      <main className="relative z-10 bg-white rounded-3xl max-w-lg w-full p-10 shadow-2xl flex flex-col items-center text-center border border-gray-200 space-y-6">
        {/* Back Button */}
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center text-sm text-[#2C3E9E] font-semibold self-start hover:underline"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" /> Back
        </button>

        {/* Title */}
        <h1 className="text-[#2C3E9E] font-bold text-3xl tracking-wide">
          Scan or Upload Your QR Code
        </h1>
        <p className="text-gray-700 text-sm px-4">
          Present your QR code or upload an image to check the status of your document request.
        </p>

        {/* Scan QR Code Button */}
        <button
          type="button"
          onClick={handleScan}
          className="flex flex-col items-center justify-center gap-4 bg-[#2C3E9E] hover:bg-blue-800 text-white font-bold py-10 px-12 rounded-2xl shadow-2xl hover:shadow-blue-500/50 transition-all transform hover:scale-105 w-full"
          aria-label="Scan QR Code"
        >
          <QrCodeIcon className="h-16 w-16" />
          <span className="text-xl">Tap to Scan QR</span>
        </button>

        {/* Upload QR Code */}
        <button
          type="button"
          onClick={triggerFileInput}
          className="flex flex-col items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-[#2C3E9E] font-semibold py-6 px-8 rounded-2xl shadow-inner w-full text-sm transition cursor-pointer"
          aria-label="Upload QR Code Image"
        >
          <CameraIcon className="h-10 w-10" />
          Upload QR Code Image
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={onFileChange}
            className="hidden"
            aria-hidden="true"
          />
        </button>

        {/* Instructions */}
        <div className="bg-gray-50 rounded-xl p-4 shadow-inner w-full text-left text-sm text-gray-700">
          <p className="font-semibold mb-2">Instructions:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Hold your QR code steady in front of the scanner or upload a clear QR code image.</li>
            <li>Make sure QR code is not blurry or obstructed.</li>
            <li>If you encounter issues, ask kiosk staff for help.</li>
          </ul>
        </div>

        {/* Display scanned data */}
        {qrData && (
          <p className="mt-6 text-gray-700 text-sm font-semibold break-words">
            Scanned Request Number: {qrData}
          </p>
        )}
      </main>
    </div>
  );
}
