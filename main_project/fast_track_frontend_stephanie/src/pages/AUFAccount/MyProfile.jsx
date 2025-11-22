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
  UserIcon,
  ChartBarIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import KioskBackground from "../../components/KioskBackground";
import KioskHeader from "../../components/KioskHeader";

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

  const handleLogout = () => {
    // Clear any stored user data (e.g., token, session)
    localStorage.removeItem('userToken'); // Adjust based on your auth implementation
    localStorage.removeItem('userData'); // If you store user data

    // Navigate to login page or home
    navigate('/LoginForm'); // Assuming you have a /Login route; change to '/' if needed
  };

  return (
    <div className="relative min-h-screen flex flex-col font-sans text-gray-800 bg-[#2C3E9E]">
      {/* Kiosk Background */}
      <KioskBackground opacity={15} blueOpacity={80} />

      {/* Fixed Header */}
      <div className="w-full">
        <KioskHeader />
      </div>

      {/* Scrollable Content */}
      <div
        className="flex-1 overflow-y-auto pt-16"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style>
          {`
            .scrollable-content::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>

        {/* Main container */}
        <div className="relative z-10  w-[92%] max-w-2xl mx-auto px-6 sm:px-8 py-8 bg-white/95 rounded-2xl shadow-xl space-y-6 mb-8 border border-blue-200 mt-20">
          
          {/* Back Button */}
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
          <section className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 shadow-sm space-y-6 border border-blue-300">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-blue-700 flex items-center justify-center text-white font-black text-3xl mb-4 select-none shadow-lg">
                {user.initials}
              </div>
              <p className="text-xl font-semibold text-gray-900">{user.fullName}</p>
              <p className="text-gray-600">{user.studentId}</p>
              <span className="mt-2 inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-semibold shadow-sm">
                {user.status}
              </span>
            </div>
          </section>

          {/* Personal Information */}
          <section className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 shadow-sm space-y-4 border border-blue-200">
            <h2 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-blue-600" />
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 text-gray-700">
                <EnvelopeIcon className="w-5 h-5 text-blue-600" />
                <span className="break-all">{user.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <PhoneIcon className="w-5 h-5 text-blue-600" />
                <span>{user.contactNumber}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <AcademicCapIcon className="w-5 h-5 text-blue-600" />
                <span>{user.program}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <CalendarIcon className="w-5 h-5 text-blue-600" />
                <span>{user.yearLevel}</span>
              </div>
              <div className="flex items-center space-x-3 md:col-span-2 text-gray-700">
                <MapPinIcon className="w-5 h-5 text-blue-600" />
                <span>{user.campus}</span>
              </div>
            </div>
          </section>

          {/* Request Statistics */}
          <section className="bg-gradient-to-r from-blue-50 to-blue-200 rounded-xl p-6 shadow-sm border border-blue-300">
            <h2 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
              <ChartBarIcon className="w-5 h-5 text-blue-600" />
              Request Statistics
            </h2>

            <div className="flex justify-around text-center text-gray-700">
              <div className="bg-white rounded-lg p-4 shadow-sm flex-1 mx-1">
                <p className="text-3xl font-bold text-blue-700">{user.requestStats.total}</p>
                <p className="uppercase text-xs font-semibold text-gray-600">Total Requests</p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm flex-1 mx-1">
                <p className="text-3xl font-bold text-blue-700">{user.requestStats.active}</p>
                <p className="uppercase text-xs font-semibold text-gray-600">Active</p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm flex-1 mx-1">
                <p className="text-3xl font-bold text-green-600">{user.requestStats.completed}</p>
                <p className="uppercase text-xs font-semibold text-gray-600">Completed</p>
              </div>
            </div>
          </section>

          {/* Account Status */}
          <section className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 shadow-sm border border-blue-300">
            <h2 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
              <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
              Account Status
            </h2>

            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
                <span>Financial Clearance</span>
                <span className="inline-flex items-center gap-1 text-green-700 font-semibold">
                  <CheckCircleIcon className="w-5 h-5" />
                  Cleared
                </span>
              </li>

              <li className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
                <span>Library Clearance</span>
                <span className="inline-flex items-center gap-1 text-green-700 font-semibold">
                  <CheckCircleIcon className="w-5 h-5" />
                  Cleared
                </span>
              </li>

              <li className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
                <span>Document Access</span>
                <span className="inline-flex items-center gap-1 text-green-700 font-semibold">
                  <CheckCircleIcon className="w-5 h-5" />
                  Active
                </span>
              </li>
            </ul>
          </section>

          {/* Privacy Notice */}
          <section className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 mb-8 shadow-sm text-blue-700 text-xs text-center select-none border border-blue-200">
            Your personal information is protected under the Data Privacy Act.
            For any updates or concerns, please contact the Registrar’s Office.
          </section>

          {/* Logout Button */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 text-blue-900 border border-blue-900 hover:bg-blue-900 hover:text-white rounded-xl px-6 py-3 font-semibold transition shadow-md hover:shadow-lg"
            >
              <ArrowLeftIcon className="w-5 h-5 rotate-180" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
