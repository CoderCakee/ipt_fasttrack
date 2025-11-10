import React from "react";
import { useNavigate } from "react-router-dom";
import {
  EnvelopeIcon,
  PhoneIcon,
  AcademicCapIcon,
  CalendarIcon,
  MapPinIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import KioskBackground from "../../components/KioskBackground";

const MyProfile = () => {
  const navigate = useNavigate();

  // Mocked user data
  const user = {
    initials: "JD",
    fullName: "Juan Santos Dela Cruz",
    studentId: "2021-123456",
    status: "Active Student",
    email: "stephaniejoyrevano26@yahoo.com",
    contactNumber: "09171234567",
    program: "Bachelor of Science in Computer Science",
    yearLevel: "4th Year",
    campus: "Main Campus, Angeles City",
    requestStats: {
      total: 3,
      active: 2,
      completed: 1,
    },
    clearances: {
      financial: true,
      library: true,
      documentAccess: true,
    },
  };

  return (
    <div className="relative min-h-screen font-sans text-gray-800 bg-[#2C3E9E] py-12">
      {/* Kiosk-style background like PaymentInfo */}
      <KioskBackground opacity={15} blueOpacity={80} />

      {/* Main container */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 py-8 bg-white rounded-2xl shadow-lg space-y-6">
        {/* Back button */}
        <button
          onClick={() => navigate("/Home")}
          type="button"
          className="inline-flex items-center space-x-2 text-blue-800 hover:text-blue-600 font-semibold mb-6"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Back</span>
        </button>

        {/* Page Header */}
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Profile</h1>

        {/* User Info Card */}
        <section className="bg-gray-50 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-red-900 flex items-center justify-center text-white font-black text-3xl mb-3 select-none">
              {user.initials}
            </div>
            <p className="text-xl font-semibold text-gray-900">{user.fullName}</p>
            <p className="text-gray-600">{user.studentId}</p>
            <span className="mt-2 inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-semibold select-none">
              {user.status}
            </span>
          </div>
        </section>

        {/* Personal Information */}
        <section className="bg-gray-50 rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-lg text-gray-900 mb-2">Personal Information</h2>
          <div className="flex items-center space-x-3 text-gray-700">
            <EnvelopeIcon className="w-5 h-5 text-red-900 flex-shrink-0" />
            <span className="break-all">{user.email}</span>
          </div>
          <div className="flex items-center space-x-3">
            <PhoneIcon className="w-5 h-5 text-red-900 flex-shrink-0" />
            <span>{user.contactNumber}</span>
          </div>
          <div className="flex items-center space-x-3">
            <AcademicCapIcon className="w-5 h-5 text-red-900 flex-shrink-0" />
            <span>{user.program}</span>
          </div>
          <div className="flex items-center space-x-3">
            <CalendarIcon className="w-5 h-5 text-red-900 flex-shrink-0" />
            <span>{user.yearLevel}</span>
          </div>
          <div className="flex items-center space-x-3">
            <MapPinIcon className="w-5 h-5 text-red-900 flex-shrink-0" />
            <span>{user.campus}</span>
          </div>
        </section>

        {/* Request Statistics */}
        <section className="bg-gray-50 rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-lg text-gray-900 mb-4">Request Statistics</h2>
          <div className="flex justify-around text-center text-gray-700">
            <div>
              <p className="text-2xl font-bold text-red-900">{user.requestStats.total}</p>
              <p className="uppercase text-xs font-semibold">Total Requests</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{user.requestStats.active}</p>
              <p className="uppercase text-xs font-semibold">Active</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{user.requestStats.completed}</p>
              <p className="uppercase text-xs font-semibold">Completed</p>
            </div>
          </div>
        </section>

        {/* Account Status */}
        <section className="bg-gray-50 rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-lg text-gray-900 mb-4">Account Status</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-center justify-between">
              <span>Financial Clearance</span>
              <span className="inline-flex items-center gap-1 text-green-700 font-semibold">
                <CheckCircleIcon className="w-5 h-5" />
                Cleared
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span>Library Clearance</span>
              <span className="inline-flex items-center gap-1 text-green-700 font-semibold">
                <CheckCircleIcon className="w-5 h-5" />
                Cleared
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span>Document Access</span>
              <span className="inline-flex items-center gap-1 text-green-700 font-semibold">
                <CheckCircleIcon className="w-5 h-5" />
                Active
              </span>
            </li>
          </ul>
        </section>

        {/* Privacy Notice */}
        <section className="bg-gray-50 rounded-xl p-4 mb-8 shadow-sm text-gray-600 text-xs text-center select-none">
          Your personal information is protected under the Data Privacy Act. For any updates or concerns, please contact the Registrar’s Office.
        </section>

        {/* Logout Button */}
        <button
          type="button"
          onClick={() => {
            alert("Logging out");
            // TODO: Implement logout logic
          }}
          className="inline-flex items-center justify-center gap-2 text-red-900 border border-red-900 hover:bg-red-900 hover:text-white rounded-xl px-6 py-3 font-semibold transition max-w-xs mx-auto"
        >
          <ArrowLeftIcon className="w-5 h-5 rotate-180" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default MyProfile;
