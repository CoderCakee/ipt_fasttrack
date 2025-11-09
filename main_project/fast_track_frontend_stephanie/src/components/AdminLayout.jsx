import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import UserAvatar from "../assets/avatar.png";
import FastTrackLogo from "../assets/logo.png";
import DashboardIcon from "../assets/dashboard.png";
import RequestManagementIcon from "../assets/requestdocument.png";
import PaymentTrackingIcon from "../assets/payment.png";
import NotificationManagementIcon from "../assets/notification.png";
import UserManagementIcon from "../assets/activeusers.png";
import ReportIcon from "../assets/report.png";
import LogoutIcon from "../assets/logout.png";

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

  // Modal Visibility state
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  // Handle confirmed logout: add real auth logout logic here
  const confirmLogout = () => {
    setLogoutModalOpen(false);
    alert("You have been logged out.");
    navigate("/AdminLogin"); // Redirect to login page or root
  };

  const sidebarItems = [
    {
      label: "Dashboard",
      route: "/AdminDashboard",
      icon: <img src={DashboardIcon} alt="Dashboard" className="w-5 h-5" />,
    },
    {
      label: "Request Management",
      route: "/RequestManagement",
      icon: <img src={RequestManagementIcon} alt="Request" className="w-5 h-5" />,
    },
    {
      label: "Payment Tracking",
      route: "/PaymentTracking",
      icon: <img src={PaymentTrackingIcon} alt="Payment" className="w-5 h-5" />,
    },
    {
      label: "Notifications",
      route: "/NotificationManagement",
      icon: <img src={NotificationManagementIcon} alt="Notifications" className="w-5 h-5" />,
    },
    {
      label: "User Management",
      route: "/UserManagement",
      icon: <img src={UserManagementIcon} alt="Users" className="w-5 h-5" />,
    },
    {
      label: "Reports & Logs",
      route: "/Reports",
      icon: <img src={ReportIcon} alt="Reports" className="w-5 h-5" />,
    },
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
        <nav className="w-60 bg-blue-900 text-white flex flex-col justify-between px-3 py-6 overflow-y-auto flex-shrink-0">
          <div className="space-y-2">
            {sidebarItems.map(({ label, route, icon }) => (
              <SidebarButton
                key={label}
                onClick={() => navigate(route)}
                active={location.pathname === route}
              >
                {icon} {label}
              </SidebarButton>
            ))}
          </div>

          {/* LOGOUT BUTTON AT THE BOTTOM */}
          <div className="border-t border-blue-700 pt-4 mt-4">
            <button
              onClick={() => setLogoutModalOpen(true)}
              className="flex items-center gap-2 w-full px-4 py-3 text-sm text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <img src={LogoutIcon} alt="Logout" className="w-5 h-5 opacity-90" />
              <span>Logout</span>
            </button>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className="flex-1 bg-white p-8 overflow-y-auto min-h-0">{children}</main>
      </div>

      {/* LOGOUT CONFIRMATION MODAL */}
      {logoutModalOpen && (
        <>
          {/* Overlay */}
          <div
            onClick={() => setLogoutModalOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50"
          />

          {/* Modal box */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-900"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
                <h3 className="text-lg font-semibold text-blue-900">Confirm Logout</h3>
              </div>
              <p className="text-gray-700 mb-6">
                Are you sure you want to logout?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setLogoutModalOpen(false)}
                  className="border border-blue-900 rounded-xl px-5 py-2 font-semibold text-blue-900 hover:bg-blue-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="bg-blue-900 text-white rounded-xl px-6 py-2 font-semibold hover:bg-blue-800 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminLayout;
