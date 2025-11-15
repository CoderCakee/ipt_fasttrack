// components/QRScanningModal.jsx
import React from "react";
import { QrCodeIcon } from "@heroicons/react/24/outline"; // Assuming Heroicons is available

export default function QRScanningModal({ visible, onCancel }) {
  if (!visible) return null; // Don't render if not visible

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center shadow-2xl max-w-sm w-full mx-4">
        {/* Icon */}
        <div className="mb-4">
          <QrCodeIcon className="h-16 w-16 text-blue-600 animate-pulse" />
        </div>
        
        {/* Spinner */}
        <div className="loader mb-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        
        {/* Text */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Scanning QR Code</h3>
        <p className="text-gray-600 text-center mb-4">
          Please hold your QR code steady in front of the scanner. This may take a few seconds.
        </p>
        
        {/* Optional Cancel Button */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="mt-4 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md transition"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
