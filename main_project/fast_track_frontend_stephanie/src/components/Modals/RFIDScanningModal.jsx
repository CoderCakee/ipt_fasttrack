import React, { useEffect, useRef, useState } from "react";

export default function RFIDScanningModal({ visible, onClose, onScanComplete }) {
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState("");

  // 1. Auto-focus the hidden input whenever the modal opens
  useEffect(() => {
    if (visible && inputRef.current) {
      inputRef.current.focus();
      setInputValue(""); // Reset previous scan
    }
  }, [visible]);

  // 2. Keep focus! If the user clicks away, bring focus back to the input
  const handleBlur = () => {
    if (visible && inputRef.current) {
      inputRef.current.focus();
    }
  };

  // 3. Listen for the "Enter" key (which the scanner sends at the end of the ID)
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Stop form submission
      if (inputValue.trim()) {
        onScanComplete(inputValue); // Send the ID back to the parent
      }
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center relative">

        {/* Icon Animation */}
        <div className="mb-6 flex justify-center">
            <div className="animate-pulse bg-blue-100 p-4 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-blue-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                </svg>
            </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-800 mb-2">Ready to Scan</h3>
        <p className="text-gray-600 mb-6">Please tap your ID card on the reader.</p>

        {/* THE HIDDEN INPUT - This captures the USB Scanner input */}
        <input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          autoComplete="off"
          className="opacity-0 absolute inset-0 cursor-default"
        />

        <button
          onClick={onClose}
          className="text-sm text-gray-400 hover:text-gray-600 underline mt-4"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}