import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";

const NotificationManagement = () => {
  const navigate = useNavigate();

  // State to manage active tab
  const [activeTab, setActiveTab] = useState("send");

  // Form input states
  const [notificationType, setNotificationType] = useState("Email");
  const [recipient, setRecipient] = useState("");
  const [requestNumber, setRequestNumber] = useState("");
  const [template, setTemplate] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sendImmediately, setSendImmediately] = useState(false);

  // Placeholder notifications
  const [notifications] = useState([
    {
      subject: "Test Email",
      recipient: "user@example.com",
      requestNumber: "FAST-2024-001234",
      sentDate: "2025-11-03",
      message: "This is a test email message.",
      status: "Sent",
    },
    {
      subject: "Test SMS",
      recipient: "09123456789",
      requestNumber: "",
      sentDate: "2025-11-02",
      message: "This is a test SMS message.",
      status: "Sent",
    },
  ]);

  // Notification templates
  const templates = [
    {
      id: 1,
      title: "Documents Ready for Pickup",
      content: `Dear Student,

Your requested documents are now ready for pickup at the Registrar's Office.

Request Number: #{requestNumber}

Office Hours: Monday-Friday, 8:00 AM - 5:00 PM

Please bring this notification and a valid ID.

Best regards,
FAST Track Team`,
    },
    {
      id: 2,
      title: "Payment Required for Document Request",
      content: `Dear Student,

Payment is required to process your document request #{requestNumber}.

Please complete your payment to proceed with processing.

For payment options, visit our office or use our online payment system.

Best regards,
FAST Track Team`,
    },
  ];

  // Handler for sending notification
  const handleSendNotification = (e) => {
    e.preventDefault();
    alert(
      `Notification Sent!\n` +
        `Type: ${notificationType}\n` +
        `Recipient: ${recipient}\n` +
        `Request Number: ${requestNumber}\n` +
        `Template: ${template}\n` +
        `Subject: ${subject}\n` +
        `Message: ${message}\n` +
        `Send Immediately: ${sendImmediately}`
    );
  };

  // Icon Component
  const MailIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4 inline text-blue-700 mr-1"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );

  // Notification Item Component
  const NotificationItem = ({
    subject,
    recipient,
    requestNumber,
    sentDate,
    message,
    status,
  }) => (
    <div className="border border-blue-200 rounded-md p-4 mb-4 bg-white shadow-sm">
      <h3 className="text-blue-700 font-semibold mb-2 flex items-center">
        <MailIcon />
        {subject || "No Subject"}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-2 gap-x-6 text-xs text-gray-700 mb-3">
        <div>
          <p className="font-semibold">Recipient</p>
          <p>{recipient}</p>
        </div>
        <div>
          <p className="font-semibold">Request Number</p>
          <p>{requestNumber || "N/A"}</p>
        </div>
        <div>
          <p className="font-semibold">Sent Date</p>
          <p>{sentDate}</p>
        </div>
      </div>
      <p className="text-gray-700 mb-2">{message}</p>
      <p className="text-xs font-semibold text-green-700">{status}</p>
    </div>
  );

  return (
    <AdminLayout>
      <div className="p-6 bg-white rounded-md shadow-sm">
        {/* Page Title */}
        <h1 className="text-blue-900 font-bold text-2xl mb-1">
          Notification Management
        </h1>
        <p className="text-gray-700 mb-5">
          Send and manage SMS and email notifications
        </p>

        {/* Tabs */}
        <div className="flex space-x-3 mb-6 bg-gray-100 rounded-md overflow-hidden w-max">
          <button
            className={`px-4 py-2 rounded-l-md transition ${
              activeTab === "send"
                ? "bg-blue-900 text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("send")}
          >
            Send Notification
          </button>
          <button
            className={`px-4 py-2 transition ${
              activeTab === "history"
                ? "bg-blue-900 text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("history")}
          >
            Notification History
          </button>
          <button
            className={`px-4 py-2 rounded-r-md transition ${
              activeTab === "templates"
                ? "bg-blue-900 text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("templates")}
          >
            Templates
          </button>
        </div>

        {/* Tab Panels */}
        {activeTab === "send" && (
          <form
            onSubmit={handleSendNotification}
            className="border border-gray-300 rounded-md p-6 space-y-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Notification Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Notification Type
                </label>
                <select
                  value={notificationType}
                  onChange={(e) => setNotificationType(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900 text-gray-700"
                >
                  <option value="Email">Email</option>
                  <option value="SMS">SMS</option>
                </select>
              </div>

              {/* Recipient */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Recipient
                </label>
                <input
                  type={notificationType === "Email" ? "email" : "tel"}
                  placeholder={
                    notificationType === "Email"
                      ? "example@gmail.com"
                      : "09XXXXXXXXX"
                  }
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  required
                  className="w-full rounded-md bg-gray-200 px-3 py-2 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              {/* Request Number */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Request Number (Optional)
                </label>
                <input
                  type="text"
                  placeholder="FAST-2024-001234"
                  value={requestNumber}
                  onChange={(e) => setRequestNumber(e.target.value)}
                  className="w-full rounded-md bg-gray-200 px-3 py-2 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              {/* Template Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Use Template
                </label>
                <select
                  value={template ? templates.find(t => t.title === template)?.id : ""}
                  onChange={(e) => {
                    const selectedId = parseInt(e.target.value);
                    if (!selectedId) {
                      setTemplate("");
                      setSubject("");
                      setMessage("");
                      return;
                    }
                    const selectedTemplate = templates.find((t) => t.id === selectedId);
                    if (selectedTemplate) {
                      setTemplate(selectedTemplate.title);
                      setSubject(selectedTemplate.title);
                      setMessage(selectedTemplate.content);
                    }
                  }}
                  className="w-full rounded-md bg-gray-200 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-900"
                >
                  <option value="">No Template</option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              {notificationType === "Email" && (
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="Enter notification subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    className="w-full rounded-md bg-gray-200 px-3 py-2 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              )}

              {/* Message */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Enter your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="w-full rounded-md bg-gray-200 px-3 py-2 text-gray-700 placeholder-gray-500 resize-y focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>
            </div>

            {/* Send Immediately */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={sendImmediately}
                onChange={(e) => setSendImmediately(e.target.checked)}
                className="rounded border-gray-300 text-blue-900 focus:ring-blue-900"
              />
              <label className="select-none text-gray-700 text-sm">
                Send Immediately
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="mt-4 w-full bg-yellow-700 hover:bg-yellow-800 text-white font-semibold rounded-md py-3 flex justify-center items-center gap-2 transition"
            >
              Send Notification
            </button>
          </form>
        )}

        {activeTab === "history" && (
          <div className="text-gray-600">
            {notifications.map((item, index) => (
              <NotificationItem key={index} {...item} />
            ))}
          </div>
        )}

        {activeTab === "templates" && (
          <section
            id="templates-panel"
            role="tabpanel"
            aria-labelledby="templates-tab"
            className="border border-blue-200 rounded-md p-6 bg-white space-y-6"
          >
            <h2 className="text-gray-800 font-semibold mb-4">Notification Templates</h2>

            {templates.map(({ id, title, content }) => (
              <div
                key={id}
                className="border border-gray-300 rounded-md bg-gray-50 p-4"
                aria-label={`Template: ${title}`}
              >
                <h3 className="font-semibold mb-2">{title}</h3>
                <pre className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {content}
                </pre>
              </div>
            ))}
          </section>
        )}
      </div>
    </AdminLayout>
  );
};

export default NotificationManagement;
