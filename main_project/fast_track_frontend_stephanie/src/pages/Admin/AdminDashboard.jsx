import React from "react";
import { NavLink } from "react-router-dom";
import UserAvatar from "../../assets/avatar.png";
import FastTrackLogo from "../../assets/logo.png";
import RequestIcon from "../../assets/requestdocument.png";
import PendingIcon from "../../assets/pending.png";
import CompletedIcon from "../../assets/completed.png";
import UsersIcon from "../../assets/activeusers.png";
import DashboardIcon from "../../assets/dashboard.png";
import RequestManagementIcon from "../../assets/requestdocument.png";
import PaymentTrackingIcon from "../../assets/payment.png";
import NotificationManagementIcon from "../../assets/notification.png";
import UserManagementIcon from "../../assets/activeusers.png";
import ReportIcon from "../../assets/report.png";

// Icons for dashboard cards
const IconRequest = () => (
  <img src={RequestIcon} alt="Request Icon" className="w-10 h-10 inline-block ml-1" />
);
const IconPending = () => (
  <img src={PendingIcon} alt="Pending Icon" className="w-10 h-10 inline-block ml-1" />
);
const IconCompleted = () => (
  <img src={CompletedIcon} alt="Completed Icon" className="w-10 h-10 inline-block ml-1" />
);
const IconUsers = () => (
  <img src={UsersIcon} alt="Users Icon" className="w-10 h-10 inline-block ml-1" />
);

// Sidebar Button using NavLink
const SidebarButton = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-2 px-4 py-3 text-sm rounded-md w-full transition-colors duration-300 ${
        isActive
          ? "bg-blue-300 text-blue-900 font-semibold"
          : "text-white hover:bg-blue-700 hover:text-white"
      }`
    }
  >
    {icon}
    {label}
  </NavLink>
);

// Tag component
const StatusTag = ({ children, colorClass }) => (
  <span
    className={`inline-block text-xs font-medium px-2 py-0.5 rounded whitespace-nowrap ${colorClass}`}
  >
    {children}
  </span>
);

// Recent request row
const RecentRequestRow = ({
  requestNumber,
  requesterName,
  docType,
  statusLabel,
  statusColor,
}) => (
  <div
    className={`flex justify-between items-center rounded-md py-3 px-4 ${
      statusLabel === "Released" ? "bg-blue-100" : "bg-gray-200"
    }`}
  >
    <div>
      <p className="font-semibold text-blue-900">{requestNumber}</p>
      <p className="text-sm">{requesterName}</p>
    </div>
    <div className="flex items-center gap-2">
      <StatusTag colorClass="bg-blue-200 text-blue-700">{docType}</StatusTag>
      <StatusTag colorClass={statusColor}>{statusLabel}</StatusTag>
    </div>
  </div>
);

const AdminDashboard = () => {
  // Sidebar items
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
        <nav className="w-60 bg-blue-900 text-white flex flex-col space-y-2 px-3 py-6 overflow-y-auto flex-shrink-0">
          {sidebarItems.map(({ label, route, icon }) => (
            <SidebarButton key={label} to={route} icon={icon} label={label} />
          ))}
        </nav>

        {/* MAIN CONTENT */}
        <main className="flex-1 bg-white p-8 overflow-y-auto min-h-0">
          {/* Page title and description */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-blue-900 mb-1">Dashboard Overview</h1>
            <p className="text-gray-700 text-sm">
              Real-time summary of FAST Track system activity
            </p>
          </div>

          {/* Stats cards */}
          <section className="flex flex-wrap gap-5 mb-8">
            {[
              { label: "Total Requests", value: 1247, icon: <IconRequest /> },
              { label: "Pending", value: 89, icon: <IconPending /> },
              { label: "Completed", value: 1158, icon: <IconCompleted /> },
              { label: "Active Users", value: 321, icon: <IconUsers /> },
            ].map(({ label, value, icon }, index) => (
              <div
                key={index}
                className="flex items-center bg-yellow-600 text-white px-6 py-6 rounded-md flex-1 min-w-[220px] max-w-[400px] h-28"
              >
                <div className="flex-grow">
                  <p className="text-lg font-semibold">{label}</p>
                  <p className="text-3xl font-bold">{value}</p>
                </div>
                {icon}
              </div>
            ))}
          </section>

          {/* Charts placeholders */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="border border-gray-300 rounded-md h-36 p-4 text-gray-600 text-sm">
              Weekly Request Volume
            </div>
            <div className="border border-gray-300 rounded-md h-36 p-4 text-gray-600 text-sm">
              Document Types Distribution
            </div>
          </section>

          {/* Recent Requests */}
          <section className="border border-gray-300 rounded-md p-4 mb-8">
            <h2 className="text-gray-700 font-semibold mb-4">Recent Requests</h2>
            <div className="space-y-2">
              <RecentRequestRow
                requestNumber="FAST-2024-510586"
                requesterName="Juan Dela Cruz"
                docType="Transcript of Records"
                statusLabel="Processing"
                statusColor="bg-blue-200 text-blue-800"
              />
              <RecentRequestRow
                requestNumber="FAST-2024-510587"
                requesterName="Maria Clara"
                docType="Diploma"
                statusLabel="Released"
                statusColor="bg-green-200 text-green-700"
              />
              <RecentRequestRow
                requestNumber="FAST-2024-510588"
                requesterName="Jose Rizal"
                docType="Good Moral"
                statusLabel="Request Received"
                statusColor="bg-gray-300 text-gray-600"
              />
            </div>
          </section>

          {/* System Alerts */}
          <section className="bg-yellow-100 border border-yellow-300 rounded-md px-4 py-3 text-sm text-yellow-900">
            <div className="flex items-center gap-2 mb-1">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.29 3.86L1.82 18a1 1 0 00.86 1.5h16.64a1 1 0 00.86-1.5L13.71 3.86a1 1 0 00-1.72 0z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4M12 17h.01" />
              </svg>
              <p className="font-semibold">System Alerts</p>
            </div>
            <ul className="list-disc list-inside">
              <li>3 requests are overdue for processing</li>
              <li>Payment verification needed for 8 requests</li>
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
