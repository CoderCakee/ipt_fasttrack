import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";

const NotificationManagement = () => {
  const location = useLocation();
  const prefill = location.state || {};

  // Tabs
  const [activeTab, setActiveTab] = useState("send");

  // Form states - prefilled from navigation state if any
  const [notificationType, setNotificationType] = useState(
    prefill.notificationType || "Email"
  );
  const [recipient, setRecipient] = useState(prefill.recipient || "");
  const [requestNumber, setRequestNumber] = useState(prefill.requestNumber || "");
  const [template, setTemplate] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sendImmediately, setSendImmediately] = useState(false);

  // 🔥 AUTO-UPDATE RECIPIENT WHEN NOTIFICATION TYPE CHANGES
  useEffect(() => {
    if (notificationType === "Email") {
      setRecipient(prefill.recipient || "");
    } else if (notificationType === "SMS") {
      setRecipient(prefill.contactNumber || "");
    }
  }, [notificationType, prefill]);

  // Notification templates
  const [templates, setTemplates] = useState([
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
  ]);

  // Modal states
  const [showAddTemplateModal, setShowAddTemplateModal] = useState(false);
  const [newTemplateTitle, setNewTemplateTitle] = useState("");
  const [newTemplateContent, setNewTemplateContent] = useState("");

  // Placeholder notification history
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

  // Update subject/message when template changes
  useEffect(() => {
    if (!template) {
      setSubject("");
      setMessage("");
      return;
    }
    const selectedTemplate = templates.find((t) => t.title === template);
    if (selectedTemplate) {
      const content = selectedTemplate.content.replace(
        /#{requestNumber}/g,
        requestNumber || "N/A"
      );
      setSubject(selectedTemplate.title);
      setMessage(content);
    }
  }, [template, requestNumber, templates]);

  // Send handler
  const handleSendNotification = (e) => {
    e.preventDefault();
    alert(
      `Notification Sent!\nType: ${notificationType}\nRecipient: ${recipient}\nRequest Number: ${requestNumber}\nSubject: ${subject}\nMessage:\n${message}\nSend Immediately: ${sendImmediately}`
    );
  };

  // Add template handler
  const handleAddTemplate = (e) => {
    e.preventDefault();
    if (!newTemplateTitle.trim() || !newTemplateContent.trim()) return;
    const newTemplate = {
      id: Date.now(),
      title: newTemplateTitle,
      content: newTemplateContent,
    };
    setTemplates([...templates, newTemplate]);
    setNewTemplateTitle("");
    setNewTemplateContent("");
    setShowAddTemplateModal(false);
  };

  // Icons
  const MailIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4 inline text-blue-700 mr-1"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );

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
      <p className="text-gray-700 mb-2 whitespace-pre-wrap">{message}</p>
      <p className="text-xs font-semibold text-green-700">{status}</p>
    </div>
  );

  return (
    <AdminLayout>
      <div className="p-6 bg-white rounded-md shadow-sm">
        <h1 className="text-blue-900 font-bold text-2xl mb-1">
          Notification Management
        </h1>
        <p className="text-gray-700 mb-5">
          Send and manage SMS and email notifications
        </p>

        {/* Tabs */}
        <div className="flex space-x-3 mb-6 bg-gray-100 rounded-md overflow-hidden w-max">
          <button
            className={`px-4 py-2 ${
              activeTab === "send"
                ? "bg-blue-900 text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("send")}
          >
            Send Notification
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "history"
                ? "bg-blue-900 text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("history")}
          >
            Notification History
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "templates"
                ? "bg-blue-900 text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("templates")}
          >
            Templates
          </button>
        </div>

        {/* SEND TAB */}
        {activeTab === "send" && (
          <form
            onSubmit={handleSendNotification}
            className="border border-gray-300 rounded-md p-6 space-y-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Notification Type */}
              <div>
                <label className="text-xs font-semibold text-gray-700">
                  Notification Type
                </label>
                <select
                  value={notificationType}
                  onChange={(e) => setNotificationType(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700"
                >
                  <option value="Email">Email</option>
                  <option value="SMS">SMS</option>
                </select>
              </div>

              {/* Recipient */}
              <div>
                <label className="text-xs font-semibold text-gray-700">
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
                  className="w-full rounded-md bg-gray-200 px-3 py-2 text-gray-700"
                />
              </div>

              {/* Request Number */}
              <div>
                <label className="text-xs font-semibold text-gray-700">
                  Request Number
                </label>
                <input
                  type="text"
                  placeholder="FAST-2024-001234"
                  value={requestNumber}
                  onChange={(e) => setRequestNumber(e.target.value)}
                  className="w-full rounded-md bg-gray-200 px-3 py-2 text-gray-700"
                />
              </div>

              {/* Template */}
              <div>
                <label className="text-xs font-semibold text-gray-700">
                  Use Template
                </label>
                <select
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  className="w-full rounded-md bg-gray-200 px-3 py-2 text-gray-700"
                >
                  <option value="">No Template</option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.title}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              {notificationType === "Email" && (
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-gray-700">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="Enter notification subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-md bg-gray-200 px-3 py-2 text-gray-700"
                    required
                  />
                </div>
              )}

              {/* Message */}
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-gray-700">
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Enter your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-md bg-gray-200 px-3 py-2 text-gray-700"
                  required
                />
              </div>
            </div>

            {/* Send Immediately */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={sendImmediately}
                onChange={(e) => setSendImmediately(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label className="text-sm text-gray-700">Send Immediately</label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-4 w-full bg-yellow-700 hover:bg-yellow-800 text-white font-semibold rounded-md py-3"
            >
              Send Notification
            </button>
          </form>
        )}

        {/* HISTORY TAB */}
        {activeTab === "history" && (
          <div className="text-gray-600">
            {notifications.map((item, index) => (
              <NotificationItem key={index} {...item} />
            ))}
          </div>
        )}

        {/* TEMPLATES TAB */}
        {activeTab === "templates" && (
          <section className="border border-blue-200 rounded-md p-6 bg-white space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-gray-800 font-semibold">Notification Templates</h2>
              <button
                onClick={() => setShowAddTemplateModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Add New Template
              </button>
            </div>

            {templates.map(({ id, title, content }) => (
              <div key={id} className="border border-gray-300 bg-gray-50 p-4 rounded-md">
                <h3 className="font-semibold mb-2">{title}</h3>
                <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                  {content}
                </pre>
              </div>
            ))}
          </section>
        )}

        {/* ADD TEMPLATE MODAL */}
        {showAddTemplateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-xl">
              <h2 className="text-xl font-bold text-blue-900 mb-6">
                Add New Template
              </h2>
              <form onSubmit={handleAddTemplate} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Template Title
                  </label>
                  <input
                    type="text"
                    value={newTemplateTitle}
                    onChange={(e) => setNewTemplateTitle(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Template Content
                  </label>
                  <textarea
                    value={newTemplateContent}
                    onChange={(e) => setNewTemplateContent(e.target.value)}
                    rows={6}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddTemplateModal(false)}
                    className="border border-gray-400 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Add Template
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default NotificationManagement;
