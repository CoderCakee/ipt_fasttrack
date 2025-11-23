import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import KioskHeader from "../../components/KioskHeader";
import KioskBackground from "../../components/KioskBackground";
import { ArrowLeftIcon, QrCodeIcon, CameraIcon } from "@heroicons/react/24/solid";
import QRScanningModal from "../../components/Modals/QRScanningModal";

export default function CheckStatusAlumni() {
  const navigate = useNavigate();
  const [qrData, setQrData] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const fileInputRef = useRef(null);

  const handleBack = () => navigate(-1);

  // Simulate QR code scan from camera
  const handleScan = () => {
    setModalVisible(true); // show scanning modal

    setTimeout(() => {
      const scannedRequestNumber = "FAST-2024-510586"; // Example simulated result
      setQrData(scannedRequestNumber);
      setModalVisible(false);

      navigate("/CheckRequestReceipt", {
        state: { data: { request_number: scannedRequestNumber } },
      });
    }, 2000); // simulate 2-second scanning delay
  };

  const handleCancelScan = () => {
    setModalVisible(false); // allow user to cancel scanning
  };

  // Handle file upload for QR code image
  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Simulate decoded QR data
    const decodedRequestNumber = "FAST-2024-510586"; 
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

      <main className="relative z-10 bg-white rounded-3xl max-w-lg w-full p-10 shadow-2xl flex flex-col items-center text-center border border-gray-200 space-y-6 mt-28">
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

        {/* Buttons Container: side by side on medium+ screens */}
        <div className="flex flex-col md:flex-row w-full gap-4">
          {/* Scan QR Code Button */}
          <button
            type="button"
            onClick={handleScan}
            className="flex-1 flex flex-col items-center justify-center gap-4 bg-[#2C3E9E] hover:bg-blue-800 text-white font-bold py-10 px-4 rounded-2xl shadow-2xl hover:shadow-blue-500/50 transition-all transform hover:scale-105"
            aria-label="Scan QR Code"
          >
            <QrCodeIcon className="h-16 w-16" />
            <span className="text-xl">Tap to Scan QR</span>
          </button>

          {/* Upload QR Code */}
          <button
            type="button"
            onClick={triggerFileInput}
            className="flex-1 flex flex-col items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-[#2C3E9E] font-semibold py-10 px-4 rounded-2xl shadow-inner text-sm transition cursor-pointer"
            aria-label="Upload QR Code Image"
          >
            <CameraIcon className="h-10 w-10" />
            Upload QR Code
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={onFileChange}
              className="hidden"
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-gray-50 rounded-xl p-4 shadow-inner w-full text-left text-sm text-gray-700">
          <p className="font-semibold mb-2">Instructions:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Hold your QR code steady in front of the scanner or upload a clear QR code image.</li>
            <li>Make sure QR code is not blurry or obstructed.</li>
          </ul>
        </div>

        {/* Display scanned data */}
        {qrData && (
          <p className="mt-6 text-gray-700 text-sm font-semibold break-words">
            Scanned Request Number: {qrData}
          </p>
        )}
      </main>

      {/* QR Scanning Modal */}
      <QRScanningModal visible={modalVisible} onCancel={handleCancelScan} />
    </div>
  );
}
