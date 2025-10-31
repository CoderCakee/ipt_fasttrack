// src/components/TextField.jsx
import React from "react";

export default function KioskLongTextFIeld({
  label,
  name,
  id,
  value,
  onChange,
  placeholder,
  required = false,
  type = "text",
  className = "",
  disabled = false,
}) {
  return (
    <div className="flex flex-col w-full">
      {/* Label */}
      {label && (
        <label
          htmlFor={id || name}
          className="text-xs font-semibold text-[#2C3E9E] mb-1 select-none"
        >
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}

      {/* Input */}
      <input
        type={type}
        id={id || name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`rounded-md border border-[#2C3E9E] px-4 py-2 placeholder-gray-400 placeholder:text-xs focus:outline-none focus:ring-1 focus:ring-[#2C3E9E] focus:border-[#2C3E9E] text-gray-700 transition-colors ${className}`}
      />
    </div>
  );
}
