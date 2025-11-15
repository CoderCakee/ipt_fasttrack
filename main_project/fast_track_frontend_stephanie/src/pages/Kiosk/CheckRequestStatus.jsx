import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import KioskHeader from "../../components/KioskHeader";
import KioskBackground from "../../components/KioskBackground";
import { ArrowLeftIcon, QrCodeIcon } from "@heroicons/react/24/solid";
import QRScanningModal from "../../components/Modals/QRScanningModal"; 

export default function CheckRequestStatus() {
  const navigate = useNavigate();
  const [qrData, setQrData] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  // Navigate back to the services menu
  const handleBack = () => navigate(-1);

  // Simulate QR scanning
  const handleScan = () => {
    setModalVisible(true); // show scanning modal

    setTimeout(() => {
      const scannedRequestNumber = "FAST-2024-510586";
      setQrData(scannedRequestNumber);
      setModalVisible(false);

      // Navigate to receipt page with scanned data
      navigate("/CheckRequestReceipt", {
        state: { data: { request_number: scannedRequestNumber } },
      });
    }, 2000); // simulate 2-second scanning delay
  };

  const handleCancelScan = () => {
    setModalVisible(false); // allow user to cancel scan
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center bg-[#2C3E9E] p-6 overflow-hidden">
      {/* Background Overlay */}
      <KioskBackground opacity={10} blueOverlay={80} />

      {/* Header */}
      <KioskHeader />

      {/* QR Scan Card */}
      <main className="relative z-10 bg-white rounded-3xl max-w-md w-full p-10 shadow-2xl flex flex-col items-center text-center border border-gray-200">
        
        {/* Back Button */}
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center text-sm text-[#2C3E9E] font-semibold mb-6 hover:underline self-start"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" /> Back
        </button>

        {/* Title */}
        <h1 className="text-[#2C3E9E] font-bold text-3xl mb-2 tracking-wide">
          Scan Your QR Code
        </h1>

        {/* Subtitle / Description */}
        <p className="text-gray-700 text-sm mb-8 px-4">
          Present your QR code here to check the status of your document request.
        </p>

        {/* QR Scan Button */}
        <button
          type="button"
          onClick={handleScan}
          className="flex flex-col items-center justify-center gap-4 bg-[#2C3E9E] hover:bg-blue-800 text-white font-bold py-10 px-12 rounded-2xl shadow-2xl hover:shadow-blue-500/50 transition-all transform hover:scale-105"
        >
          <QrCodeIcon className="h-16 w-16" />
          <span className="text-xl">Tap to Scan QR</span>
        </button>

        {/* Instruction Box */}
        <div className="mt-8 bg-gray-50 rounded-xl p-4 shadow-inner w-full text-left text-sm text-gray-700">
          <p className="font-semibold mb-2">Instructions:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Hold your QR code steady in front of the scanner.</li>
            <li>Ensure the QR code is clearly visible and not blurry.</li>
            <li>If scanning fails, ask for assistance from the kiosk staff.</li>
          </ul>
        </div>

        {/* Display scanned data */}
        {qrData && (
          <p className="mt-6 text-gray-700 text-sm font-semibold">
            Scanned Request Number: {qrData}
          </p>
        )}
      </main>

      {/* QR Scanning Modal */}
      <QRScanningModal visible={modalVisible} onCancel={handleCancelScan} />
    </div>
  );
}
