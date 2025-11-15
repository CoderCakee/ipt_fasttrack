import React, { useState } from "react";
import {
  ArrowLeftIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  ChatBubbleLeftEllipsisIcon,
} from "@heroicons/react/24/outline";
import KioskHeader from "../../components/KioskHeader";
import KioskBackground from "../../components/KioskBackground";
import { useNavigate } from "react-router-dom";

const ContactRegistrar = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      alert("Message sent! Thank you for contacting AUF Registrar.");
      setSending(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1500);
  };

  return (
    <div className="relative min-h-screen font-sans text-gray-800 bg-[#2C3E9E]">
      {/* Background */}
      <KioskBackground opacity={15} blueOpacity={80} />

      <div className="relative z-10">
        {/* Header aligned flush-left */}
        <div className="px-6 pt-6">
          <KioskHeader />
        </div>

        {/* Main content wrapper to handle full screen */}
        <div className="min-h-screen flex flex-col justify-start">

          {/* Centered main content with white container */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 bg-white rounded-2xl shadow-lg mt-10 mb-10">

            {/* Back Button */}
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-blue-800 hover:text-blue-600 font-semibold mb-6"
              aria-label="Go back"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Back
            </button>

            {/* Page Title */}
            <h1 className="text-2xl font-bold mb-6 text-blue-900 border-b border-blue-200 pb-2">
              Contact the Registrar
            </h1>

            {/* Contact Info Section */}
            <section className="bg-white rounded-xl shadow p-6 mb-8 border border-gray-200">
              <h2 className="text-lg font-semibold text-blue-900 mb-4">Get in Touch</h2>
              <ul className="space-y-4 text-gray-700 text-sm">
                <li className="flex items-center gap-3">
                  <PhoneIcon className="w-5 h-5 text-blue-900 flex-shrink-0" />
                  <span>(045) 625-2888 local 1234</span>
                </li>
                <li className="flex items-center gap-3">
                  <EnvelopeIcon className="w-5 h-5 text-blue-900 flex-shrink-0" />
                  <a
                    href="mailto:registrar@auf.edu.ph"
                    className="underline hover:text-blue-700"
                  >
                    registrar@auf.edu.ph
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <MapPinIcon className="w-5 h-5 text-blue-900 flex-shrink-0" />
                  <address className="not-italic">
                    2nd Floor, AUF Main Building
                    <br />
                    MacArthur Highway, Angeles City, Pampanga
                  </address>
                </li>
                <li className="flex items-center gap-3">
                  <ClockIcon className="w-5 h-5 text-blue-900 flex-shrink-0" />
                  <span>Monday – Friday: 8:00 AM – 5:00 PM (Closed on weekends and holidays)</span>
                </li>
                <li className="flex items-center gap-3">
                  <ChatBubbleLeftEllipsisIcon className="w-5 h-5 text-blue-900 flex-shrink-0" />
                  <a
                    href="https://twitter.com/AUFOfficial"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-blue-700"
                  >
                    @AUFOfficial
                  </a>
                </li>
              </ul>
            </section>

            {/* Contact Form Section */}
            <section className="bg-white rounded-xl shadow p-6 mb-8 border border-gray-200">
              <h2 className="text-lg font-semibold text-blue-900 mb-4">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block mb-1 font-semibold text-gray-700">
                    Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-700 transition"
                    placeholder="Your full name"
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-1 font-semibold text-gray-700">
                    Email <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-700 transition"
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block mb-1 font-semibold text-gray-700">
                    Subject <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-700 transition"
                    placeholder="Subject"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block mb-1 font-semibold text-gray-700">
                    Message <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-700 transition"
                    placeholder="Type your message here..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-blue-900 text-white font-semibold rounded-lg py-3 hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {sending ? "Sending..." : "Send Message"}
                </button>
              </form>
            </section>

            {/* Quick Help Section */}
            <section className="bg-blue-50 rounded-xl shadow p-6 mb-8 border border-blue-200 text-sm text-gray-700">
              <h2 className="font-semibold mb-2 text-blue-900">Need Quick Help?</h2>
              <p className="mb-1">
                <strong>For urgent concerns:</strong> Visit the Registrar&apos;s Office directly during office hours.
              </p>
              <p className="mb-1">
                <strong>For password reset:</strong> Contact AUF IT Helpdesk at{" "}
                <a
                  href="mailto:ithelpdesk@auf.edu.ph"
                  className="underline text-blue-700 hover:text-blue-900"
                >
                  ithelpdesk@auf.edu.ph
                </a>
              </p>
              <p>
                <strong>For payment concerns:</strong> Contact AUF Cashier’s Office at (045) 625 2888 local 1100.
              </p>
            </section>

            {/* Location Section */}
            <section className="bg-white rounded-xl shadow p-6 border border-gray-300 text-center text-gray-600 text-xs">
              <h2 className="font-semibold mb-2 text-blue-900">How to Find Us</h2>
              <div className="w-full h-48 bg-gray-200 rounded-md mb-3 flex items-center justify-center text-gray-400 select-none">
                Map placeholder
              </div>
              <p>
                The Registrar&apos;s Office is located on the 2nd floor of the AUF Main Building, easily accessible from the main entrance. Look for the signage or ask the Information Desk for directions.
              </p>
            </section>

          </div> {/* End of white container */}
        </div> {/* End of min-h-screen wrapper */}
      </div>
    </div>
  );
};

export default ContactRegistrar;
