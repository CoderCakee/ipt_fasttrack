// src/components/KioskHeader.jsx
import React from "react";
import FastTrackLogo from "../assets/logo.png";

export default function KioskHeader() {
  return (
    <header className="absolute top-0 left-0 z-10 bg-white rounded-br-[6rem] px-6 py-2 shadow-lg w-[360px] flex items-center">
      <img
        src={FastTrackLogo}
        alt="Fast Track logo"
        className="h-24 w-auto object-contain"
        loading="lazy"
      />
    </header>
  );
}
