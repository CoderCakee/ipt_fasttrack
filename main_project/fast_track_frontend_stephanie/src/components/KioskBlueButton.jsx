import React from "react";
const KioskBlueButton = ({ onClick, children, className, type = "button" }) => {
  const baseClasses =
    "bg-[#2c3e9e] text-white text-xs rounded-md px-10 py-2 hover:bg-[#1f2c6e] transition font-serif font-semibold";

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${className ? className : ""}`}
    >
      {children}
    </button>
  );
};

export default KioskBlueButton;
