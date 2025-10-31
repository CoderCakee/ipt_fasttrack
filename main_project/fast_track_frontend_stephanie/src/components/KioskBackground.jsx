import React from "react";
import background from "../assets/background.webp";

export default function KioskBackground({
  opacity = 50, // controls how visible the background image is
  blueOpacity = 70, // controls how strong the blue tint is
}) {
  return (
    <div
      className={`absolute inset-0 bg-[#2C3E9E]/${blueOpacity} z-0`}
      aria-hidden="true"
    >
      <div
  className="absolute inset-0"
  style={{
    opacity: opacity / 100, // convert 0-100 to 0-1
    backgroundImage: `url(${background})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    filter: "brightness(0.8)",
  }}
/>

    </div>
  );
}
