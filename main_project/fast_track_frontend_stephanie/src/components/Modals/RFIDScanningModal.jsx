import React from "react";
import { CreditCardIcon } from "@heroicons/react/24/outline";

export default function RFIDScanningModal({ visible, onCancel }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-2xl max-w-md w-full mx-4">
        <div className="mb-6">
          <CreditCardIcon className="h-20 w-20 text-blue-600 animate-pulse" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Scanning RFID Card
        </h2>

        <p className="text-gray-600 text-center mb-6 px-2">
          Please place your RFID card near the scanner. The system will automatically
          detect your student ID. This may take a few seconds.
        </p>

        <div className="mb-6">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>

        {onCancel && (
          <button
            onClick={onCancel}
            className="mt-2 w-full px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition"
          >
            Cancel
          </button>
        )}

        <p className="text-gray-500 text-xs mt-4 text-center">
          If the scan takes longer than 10 seconds, you can cancel and enter your student ID manually.
        </p>
      </div>
    </div>
  );
}
