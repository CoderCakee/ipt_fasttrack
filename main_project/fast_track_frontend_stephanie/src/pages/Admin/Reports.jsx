import React, { useState } from "react";
import AdminLayout from "../../components/AdminLayout";

export default function ReportsLogsPage() {
  // State for tabs and dropdown selections
  const [activeTab, setActiveTab] = useState("Reports");
  const [reportType, setReportType] = useState("Request Summary");
  const [dateRange, setDateRange] = useState("This month");
  const [format, setFormat] = useState("PDF");

  // Placeholder handler for generate report
  const handleGenerateReport = () => {
    alert(
      `Generating ${reportType} report for ${dateRange} in ${format} format.`
    );
    // TODO: integrate with API endpoint e.g. /api/reports/generate/
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-full bg-gray-50 min-h-screen">
        {/* Title */}
        <h1 className="text-blue-900 font-bold text-2xl mb-1">Reports & Logs</h1>
        <p className="mb-6 text-gray-700">
          Generate reports and view system activity logs
        </p>

        {/* Tabs */}
        <div className="flex space-x-3 mb-6 text-sm font-semibold">
          {["Reports", "Analytics", "System Logs"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-1 transition-all ${
                activeTab === tab
                  ? "bg-blue-900 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Reports Tab Content */}
        {activeTab === "Reports" && (
          <section
            aria-label="Generate Reports"
            className="bg-white rounded-xl border border-blue-200 p-6 max-w-4xl"
          >
            <h2 className="text-lg font-semibold mb-5 text-black flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m2 0a2 2 0 00-2-2H7a2 2 0 000 4h8a2 2 0 002-2zM5 12a2 2 0 00-2 2v3a2 2 0 002 2h3"
                />
              </svg>
              Generate Reports
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleGenerateReport();
              }}
              className="flex flex-wrap gap-4 items-end mb-6"
            >
              {/* Report Type */}
              <div className="flex-1 min-w-[160px]">
                <label
                  htmlFor="reportType"
                  className="block text-sm font-semibold text-black mb-1"
                >
                  Report Type
                </label>
                <select
                  id="reportType"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full rounded-xl bg-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 border border-transparent hover:border-blue-400 transition"
                  aria-required="true"
                >
                  <option>Request Summary</option>
                  <option>Payment History</option>
                  <option>User Activity</option>
                  <option>Notifications</option>
                </select>
              </div>

              {/* Date Range */}
              <div className="flex-1 min-w-[160px]">
                <label
                  htmlFor="dateRange"
                  className="block text-sm font-semibold text-black mb-1"
                >
                  Date Range
                </label>
                <select
                  id="dateRange"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full rounded-xl bg-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 border border-transparent hover:border-blue-400 transition"
                  aria-required="true"
                >
                  <option>This month</option>
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>This year</option>
                  <option>Custom</option>
                </select>
              </div>

              {/* Format */}
              <div className="flex-1 min-w-[160px]">
                <label
                  htmlFor="format"
                  className="block text-sm font-semibold text-black mb-1"
                >
                  Format
                </label>
                <select
                  id="format"
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full rounded-xl bg-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 border border-transparent hover:border-blue-400 transition"
                  aria-required="true"
                >
                  <option>PDF</option>
                  <option>Excel</option>
                  <option>CSV</option>
                </select>
              </div>

              {/* Generate Button */}
              <button
                type="submit"
                className="flex items-center justify-center gap-2 bg-black text-white px-6 py-2 rounded-2xl text-sm font-semibold hover:bg-gray-900 transition-all min-w-[160px] w-full sm:w-auto"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Generate Report
              </button>
            </form>
          </section>
        )}

        {/* Analytics Tab Content */}
        {activeTab === "Analytics" && (
          <section
            aria-label="Analytics Dashboard"
            className="bg-white rounded-2xl border border-gray-300 p-6 max-w-full pl-6"
          >
            <h2 className="text-base font-semibold mb-5 text-black flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m2 0a2 2 0 00-2-2H7a2 2 0 000 4h8a2 2 0 002-2zM5 12a2 2 0 00-2 2v3a2 2 0 002 2h3" />
              </svg>
              Analytics Overview
            </h2>

            <form className="flex gap-4 items-center mb-6">
              {/* Dropdowns */}
              <div className="flex flex-col w-1/3">
                <label htmlFor="analyticsType" className="block text-sm font-medium text-black mb-1">Analytics Type</label>
                <select
                  id="analyticsType"
                  defaultValue="User Engagement"
                  className="rounded-lg bg-gray-100 px-3 py-2 text-sm border border-transparent focus:ring-2 focus:ring-blue-600"
                >
                  <option>User Engagement</option>
                  <option>Request Trends</option>
                  <option>Performance</option>
                </select>
              </div>
              <div className="flex flex-col w-1/3">
                <label htmlFor="analyticsDateRange" className="block text-sm font-medium text-black mb-1">Date Range</label>
                <select
                  id="analyticsDateRange"
                  defaultValue="This Month"
                  className="rounded-lg bg-gray-100 px-3 py-2 text-sm border border-transparent focus:ring-2 focus:ring-blue-600"
                >
                  <option>This Month</option>
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>This Year</option>
                </select>
              </div>
              <div className="flex flex-col w-1/6">
                <label htmlFor="analyticsFormat" className="block text-sm font-medium text-black mb-1">Format</label>
                <select
                  id="analyticsFormat"
                  defaultValue="PDF"
                  className="rounded-lg bg-gray-100 px-3 py-2 text-sm border border-transparent focus:ring-2 focus:ring-blue-600"
                >
                  <option>PDF</option>
                  <option>Excel</option>
                  <option>CSV</option>
                </select>
              </div>

              {/* Generate button */}
              <button
                type="button"
                className="flex items-center gap-2 justify-center bg-black text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-gray-900 transition-all w-1/6"
                onClick={() => alert("Generating analytics report...")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Generate Report
              </button>
            </form>

            {/* Analytics summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Card 1 */}
              <div className="border border-gray-300 rounded-2xl p-4 flex flex-col items-center text-center space-y-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m-7-5h6" />
                </svg>
                <p className="font-medium text-black text-sm">Total Requests</p>
                <p className="text-xs text-gray-600">1,230</p>
              </div>

              {/* Card 2 */}
              <div className="border border-gray-300 rounded-2xl p-4 flex flex-col items-center text-center space-y-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <p className="font-medium text-black text-sm">Completed Requests</p>
                <p className="text-xs text-gray-600">1,020</p>
              </div>

              {/* Card 3 */}
              <div className="border border-gray-300 rounded-2xl p-4 flex flex-col items-center text-center space-y-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
                <p className="font-medium text-black text-sm">Pending Requests</p>
                <p className="text-xs text-gray-600">210</p>
              </div>

              {/* Card 4 */}
              <div className="border border-gray-300 rounded-2xl p-4 flex flex-col items-center text-center space-y-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
                <p className="font-medium text-black text-sm">Average Processing Time</p>
                <p className="text-xs text-gray-600">3.5 Days</p>
              </div>
            </div>

            {/* Charts placeholders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="border border-gray-300 rounded-2xl p-4 flex flex-col">
                <h3 className="text-base font-semibold mb-4 text-blue-900">Request Status Breakdown</h3>
                <div className="h-56 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400" aria-label="Request Status Breakdown Chart">
                  Chart Placeholder
                </div>
              </div>

              <div className="border border-gray-300 rounded-2xl p-4 flex flex-col">
                <h3 className="text-base font-semibold mb-4 text-blue-900">Request Volume Trend</h3>
                <div className="h-56 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400" aria-label="Request Volume Trend Chart">
                  Chart Placeholder
                </div>
              </div>

              <div className="border border-gray-300 rounded-2xl p-4 flex flex-col md:col-span-2 mt-4 md:mt-0">
                <h3 className="text-base font-semibold mb-4 text-blue-900">User Activity Heatmap</h3>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400" aria-label="User Activity Heatmap">
                  Heatmap Placeholder
                </div>
              </div>
            </div>
          </section>
        )}

        {/* System Logs Tab Content */}
        {activeTab === "System Logs" && (
          <section
            aria-label="System Logs"
            className="bg-white rounded-2xl border border-gray-300 p-6 max-w-full pl-6"
          >
            <h2 className="text-lg font-semibold mb-6 text-blue-900 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-900"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path d="M9 12h6m2 0a2 2 0 00-2-2H7a2 2 0 000 4h8a2 2 0 002-2zM5 12a2 2 0 00-2 2v3a2 2 0 002 2h3"></path>
              </svg>
              System Logs
            </h2>

            {/* Filter Form */}
            <form className="flex flex-wrap gap-4 mb-6 items-center">
              {/* Search Box */}
              <div className="flex-1 min-w-[250px] relative">
                <label htmlFor="search" className="sr-only">
                  Search Logs
                </label>
                <input
                  id="search"
                  type="search"
                  placeholder="Search logs..."
                  className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 pr-10"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Log Type Dropdown */}
              <div className="min-w-[140px]">
                <label
                  htmlFor="logType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Log Type
                </label>
                <select
                  id="logType"
                  className="w-full rounded-xl bg-gray-100 px-3 py-2 text-sm border border-transparent focus:ring-2 focus:ring-blue-600"
                  defaultValue="All"
                >
                  <option>All</option>
                  <option>Error</option>
                  <option>Info</option>
                  <option>Warning</option>
                </select>
              </div>

              {/* Date Range Dropdown */}
              <div className="min-w-[140px]">
                <label
                  htmlFor="logDateRange"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Date Range
                </label>
                <select
                  id="logDateRange"
                  className="w-full rounded-xl bg-gray-100 px-3 py-2 text-sm border border-transparent focus:ring-2 focus:ring-blue-600"
                  defaultValue="Last 7 days"
                >
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>This month</option>
                  <option>This year</option>
                </select>
              </div>
            </form>

            {/* Logs List */}
            <div className="overflow-auto max-h-[400px] border border-gray-300 rounded-xl shadow-sm">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-blue-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Timestamp</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Message</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 ">
                  {/* Log entry row example */}
                  <tr className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-4 py-3 whitespace-nowrap text-gray-500">2025-10-13 14:05</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-gray-900">Payment verified.</span> by User <span className="italic">juan@auf.edu.ph</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-green-100 px-3 py-0.5 text-xs font-semibold text-green-800">Info</span>
                    </td>
                  </tr>

                  <tr className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-4 py-3 whitespace-nowrap text-gray-500">2025-10-12 09:22</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-gray-900">Document released.</span> Request ID <span className="font-mono text-gray-700">#102</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-blue-100 px-3 py-0.5 text-xs font-semibold text-blue-800">Info</span>
                    </td>
                  </tr>

                  <tr className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-4 py-3 whitespace-nowrap text-gray-500">2025-10-10 16:40</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-red-700">Payment failed.</span> Reference #GC1234567
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-red-100 px-3 py-0.5 text-xs font-semibold text-red-800">Error</span>
                    </td>
                  </tr>

                  {/* Add more rows or map from dynamic data */}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <nav className="flex justify-between items-center mt-6" aria-label="Pagination">
              <button
                disabled
                className="rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-not-allowed"
              >
                Previous
              </button>
              <p className="text-sm text-gray-600">Page 1 of 5</p>
              <button
                className="rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Next
              </button>
            </nav>
          </section>
        )}
      </div>
    </AdminLayout>
  );
}
