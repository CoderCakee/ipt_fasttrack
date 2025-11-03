import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import UserAvatar from "../assets/avatar.png";
import FastTrackLogo from "../assets/logo.png";

// Sidebar button component
const SidebarButton = ({ children, active = false, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-3 text-sm rounded-md w-full transition-colors duration-300 ${
      active
        ? "bg-blue-300 text-blue-900 font-semibold"
        : "text-white hover:bg-blue-700 hover:text-white"
    }`}
  >
    {children}
  </button>
);

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Sidebar items with their routes
  const sidebarItems = [
    { label: "Dashboard", route: "/AdminDashboard", icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 6h18M3 18h18" /></svg> },
    { label: "Request Management", route: "/RequestManagement", icon: null },
    { label: "Payment Tracking", route: "/PaymentTracking", icon: null },
    { label: "Notifications", route: "/Notifications", icon: null },
    { label: "User Management", route: "/UserManagement", icon: null },
    { label: "Reports & Logs", route: "/Reports", icon: null },
  ];

  return (
    <div className="flex flex-col h-screen">
      {/* HEADER */}
      <header className="flex justify-between items-center px-6 py-6 bg-gray-100 border-b border-gray-300 flex-shrink-0">
        <div className="flex items-center gap-3">
          <img src={FastTrackLogo} alt="Fast Track Logo" className="h-16 object-contain" />
        </div>
        <div className="flex items-center gap-4 text-right text-base pr-4">
          <div>
            <p className="font-bold text-gray-800 text-lg">Admin User</p>
            <p className="text-gray-600 text-sm">Registrar&apos;s Office</p>
          </div>
          <img
            src={UserAvatar}
            alt="User avatar"
            className="w-12 h-12 rounded-full border border-gray-300 object-cover"
          />
        </div>
      </header>

      {/* MAIN AREA */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* SIDEBAR */}
        <nav className="w-60 bg-blue-900 text-white flex flex-col space-y-2 px-3 py-6 overflow-y-auto flex-shrink-0">
          {sidebarItems.map(({ label, route, icon }) => (
            <SidebarButton
              key={label}
              onClick={() => navigate(route)}
              active={location.pathname === route}
            >
              {icon} {label}
            </SidebarButton>
          ))}
        </nav>

        {/* MAIN CONTENT */}
        <main className="flex-1 bg-white p-8 overflow-y-auto min-h-0">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
