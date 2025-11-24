import React from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { XMarkIcon } from "@heroicons/react/24/solid";

const QRScanningModal = ({ visible, onCancel, onScan }) => {
  if (!visible) return null;

  const handleScan = (detectedCodes) => {
    // This library returns an array of detected codes
    if (detectedCodes && detectedCodes.length > 0) {
      const rawValue = detectedCodes[0].rawValue;
      onScan(rawValue);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
      <div className="bg-white rounded-2xl overflow-hidden shadow-2xl max-w-sm w-full relative">

        {/* Header */}
        <div className="bg-[#2C3E9E] p-4 flex justify-between items-center">
          <h3 className="text-white font-bold text-lg">Scan QR Code</h3>
          <button onClick={onCancel} className="text-white hover:text-gray-300">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Camera Viewport */}
        <div className="p-4 bg-black">
          <div className="relative border-4 border-[#C5A93D] rounded-lg overflow-hidden h-64">
            <Scanner
                onScan={handleScan}
                onError={(error) => console.log(error)}
                components={{
                    audio: false, // Disable beep sound if desired
                    torch: false,
                }}
                styles={{
                    container: { width: "100%", height: "100%" }
                }}
            />

            {/* Scanning Overlay Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500 shadow-lg animate-scan-line"></div>
          </div>
          <p className="text-white text-center text-xs mt-2">
            Align QR code within the frame
          </p>
        </div>

        {/* Manual Cancel Button */}
        <div className="p-4">
          <button
            onClick={onCancel}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRScanningModal;