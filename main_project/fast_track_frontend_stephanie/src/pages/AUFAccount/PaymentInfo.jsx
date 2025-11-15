import React from "react";
import { useNavigate } from "react-router-dom";
import {
  BanknotesIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import KioskBackground from "../../components/KioskBackground";
import KioskHeader from "../../components/KioskHeader";


const PaymentInfo = () => {
  const navigate = useNavigate();

  // Placeholder request info and amount
  const requestNumber = "#1762706399293";
  const totalAmount = 50;

  // Placeholder bank accounts
  const bankAccounts = [
    {
      name: "BDO",
      description: "Angeles University Foundation",
      accountNumber: "0012-3456-7890",
    },
    {
      name: "BPI",
      description: "Angeles University Foundation",
      accountNumber: "1234-5678-90",
    },
    {
      name: "Landbank",
      description: "Angeles University Foundation",
      accountNumber: "0123-4567-89",
    },
  ];

  const handleBack = () => navigate(-1);

  return (
    <div className="relative min-h-screen font-sans text-gray-800 bg-[#2C3E9E]">
      {/* Kiosk-style background */}
      <KioskBackground opacity={15} blueOpacity={80} />
      <KioskHeader />
      

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-6">

        {/* Back button */}
        <button
          onClick={handleBack}
          type="button"
          className="inline-flex items-center space-x-2 text-blue-800 hover:text-blue-600 font-semibold mb-6"
        >
          <BuildingOfficeIcon className="w-5 h-5" />
          <span>Payment Information</span>
        </button>

    {/* Submission confirmation */}
<div className="bg-blue-100 text-black rounded-xl p-5 mb-6 drop-shadow-lg">
  <p className="font-semibold mb-2 flex items-center gap-2">
    <BanknotesIcon className="w-6 h-6" /> Request Submitted!
  </p>
  <p className="mb-4">
    Request <span className="font-medium">{requestNumber}</span>
  </p>
  <div className="bg-blue-800 rounded-md py-3 px-4 text-2xl font-bold tracking-wide text-center">
    <span className="text-white">₱{totalAmount}</span>
  </div>
</div>


        {/* Payment Guidelines */}
        <section
          aria-labelledby="payment-guidelines"
          className="bg-white rounded-xl border border-gray-300 p-4 sm:p-6 mb-6 shadow"
        >
          <h2 id="payment-guidelines" className="text-gray-900 font-semibold mb-3">
            Payment Guidelines
          </h2>
          <p className="mb-3 text-gray-700">Choose your preferred payment method</p>

          {/* Option 1: AUF Cashier */}
          <article className="mb-5">
            <h3 className="font-semibold mb-1">Option 1: AUF Cashier (Recommended)</h3>
            <p className="mb-2 text-gray-600">
              Pay directly at the AUF Cashier Office during office hours
            </p>
            <dl className="bg-gray-100 p-3 rounded text-gray-700 text-sm">
              <div className="flex justify-between mb-1">
                <dt className="font-semibold">Location:</dt>
                <dd>Ground Floor, AUF Main Building</dd>
              </div>
              <div className="flex justify-between mb-1">
                <dt className="font-semibold">Hours:</dt>
                <dd>Monday–Friday, 8:00 AM – 5:00 PM</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-semibold">Bring:</dt>
                <dd>Your Request Number</dd>
              </div>
            </dl>
          </article>

          {/* Option 2: Online Bank Transfer */}
          <article>
            <h3 className="font-semibold mb-3">Option 2: Online Bank Transfer</h3>
            <p className="mb-3 text-gray-700">Transfer to any of the following AUF bank accounts</p>
            <div className="space-y-3">
              {bankAccounts.map(({ name, description, accountNumber }) => (
                <div
                  key={name}
                  className="border border-gray-300 rounded p-3 flex items-center gap-3 hover:shadow-md transition cursor-pointer"
                  role="button"
                  tabIndex={0}
                  aria-label={`${name} bank account`}
                >
                  <img
                    src={`/assets/banks/${name.toLowerCase()}.png`}
                    alt={`${name} logo`}
                    className="w-10 h-10 object-contain"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                  <div className="flex flex-col text-sm">
                    <span className="font-semibold">{name}</span>
                    <span className="text-gray-600">{description}</span>
                    <span className="font-mono mt-1">{accountNumber}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 bg-yellow-50 border border-yellow-300 rounded p-2 flex items-center gap-2 text-yellow-800 text-sm">
              <InformationCircleIcon className="w-5 h-5 shrink-0" />
              <span>
                <strong>Important:</strong> Include your Request Number and Full Name in the transaction notes/reference.
              </span>
            </div>
          </article>
        </section>

        {/* After Payment Instructions */}
        <section
          aria-labelledby="after-payment"
          className="bg-white rounded-xl border border-gray-300 p-4 sm:p-6 shadow"
        >
          <h2 id="after-payment" className="text-gray-900 font-semibold mb-3">
            After Payment
          </h2>
          <ol className="list-decimal list-inside space-y-1 text-gray-700 text-sm">
            <li>
              Send your payment proof (receipt/screenshot) to{" "}
              <a href="mailto:registrar@auf.edu.ph" className="text-blue-700 underline">
                registrar@auf.edu.ph
              </a>
            </li>
            <li>Include your Request Number in the email subject</li>
            <li>Wait for email confirmation (usually within 1 business day)</li>
            <li>Track your request status using your Request Number</li>
          </ol>
        </section>

      {/* Confirmation Email Notice */}
<section
  aria-labelledby="confirmation-email"
  className="bg-white rounded-xl border border-gray-300 p-4 sm:p-6 shadow mb-6 mt-6"
>
  <p className="text-gray-700 text-sm">
    A confirmation email has been sent to <strong>stephaniejoyrevano@yahoo.com</strong> with your request details and payment instructions.
  </p>
</section>

      </div>
    </div>
  );
};

export default PaymentInfo;
