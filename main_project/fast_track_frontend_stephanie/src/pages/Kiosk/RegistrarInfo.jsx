import React from "react";
import { useNavigate } from "react-router-dom";
import KioskHeader from "../../components/KioskHeader";
import KioskBackground from "../../components/KioskBackground";
import {
  BuildingLibraryIcon,
  ClockIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

const RegistrarInfo = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#2C3E9E] font-sans text-gray-800 overflow-x-hidden">
      {/* Background */}
      <KioskBackground opacity={10} blueOpacity={80} />

      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-20">
        <KioskHeader />
      </div>

      {/* Scrollable Content */}
      <div 
        className="flex-1 overflow-y-auto pt-20" // Adjust pt-20 based on header height
        style={{
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE/Edge
        }}
      >
        <style>
          {`
            .scrollable-content::-webkit-scrollbar {
              display: none; // Chrome, Safari, Opera
            }
          `}
        </style>

        {/* Foreground */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {/* Main Content */}
          <main className="flex-grow flex justify-center items-start px-4 sm:px-6 py-10 ">
            <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full p-6 pt-6 mb-20">
              
              {/* Back Button */}
              <button
                onClick={handleBack}
                type="button"
                className="flex items-center mb-6 text-[#2C3E9E] hover:text-blue-700 font-semibold transition"
                aria-label="Go back"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>

              {/* Title */}
              <h1 className="bg-[#2C3E9E] text-white font-bold text-xl px-4 py-2 rounded-t-md mb-6">
                AUF Registrar's Office
              </h1>

              {/* Description */}
              <p className="mb-6 leading-relaxed text-gray-700">
                The Office of the University Registrar serves as the official custodian of all academic
                records of Angeles University Foundation. We are committed to providing efficient and
                quality service to all students, alumni, and authorized representatives.
              </p>

              {/* Location & Contact Info */}
              <section className="bg-gray-50 rounded-md border -gray-200 p-5 shadow-sm mb-6 space-y-4">
                <div className="flex items-start space-x-3">
                  <BuildingLibraryIcon className="h-6 w-6 text-[#2C3E9E] flex-shrink-0 mt-[3px]" />
                  <address className="not-italic">
                    <p className="font-semibold mb-1">2nd Floor, AUF Main Building</p>
                    <p>MacArthur Highway, Angeles City, Pampanga</p>
                  </address>
                </div>
                <div className="flex items-center space-x-3">
                  <ClockIcon className="h-5 w-5 text-[#2C3E9E] flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Office Hours:</p>
                    <p className="text-sm">
                      Monday – Friday: 8:00 AM – 5:00 PM <br />
                      <span className="italic text-gray-500">
                        (Closed on weekends and holidays)
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="h-5 w-5 text-[#2C3E9E] flex-shrink-0" />
                  <p>(045) 625-2888 local 1234</p>
                </div>
                <div className="flex items-center space-x-3">
                  <EnvelopeIcon className="h-5 w-5 text-[#2C3E9E] flex-shrink-0" />
                  <a
                    href="mailto:registrar@auf.edu.ph"
                    className="underline text-[#2C3E9E] hover:text-blue-700"
                  >
                    registrar@auf.edu.ph
                  </a>
                </div>
              </section>

              {/* Services Offered */}
              <section className="bg-gray-50 rounded-md border border-gray-200 p-5 shadow-sm mb-6">
                <h2 className="font-semibold text-lg mb-3 text-gray-900">Services Offered</h2>
                <ul className="space-y-2 text-gray-700 text-sm">
                  {[
                    "Transcript of Records (TOR)",
                    "Certificate of Good Moral Character",
                    "Diploma Replacement/Authentication",
                    "Certified True Copy of Grades",
                    "Form 137-A (Permanent Record)",
                    "Certificate of Enrollment/Graduation",
                    "Certificate of Transfer Credentials",
                    "Course Description/Syllabus",
                  ].map((service) => (
                    <li key={service} className="flex items-center space-x-2">
                      <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Processing Time */}
              <section className="bg-gray-50 rounded-md border border-gray-200 p-5 shadow-sm mb-6">
                <h2 className="font-semibold text-lg mb-3 text-gray-900">Processing Time</h2>
                <dl className="text-gray-700 text-sm grid grid-cols-2 gap-x-4 gap-y-2">
                  <dt>Regular Processing</dt>
                  <dd className="text-right">3–5 working days</dd>

                  <dt>Rush Processing</dt>
                  <dd className="text-right">1–2 working days</dd>

                  <dt>Same Day Processing</dt>
                  <dd className="text-right">Subject to availability</dd>
                </dl>
                <p className="text-xs italic mt-2 text-gray-500">
                  *Processing time may vary during peak season (graduation period, enrollment).
                </p>
              </section>

              {/* Important Reminders */}
              <section className="space-y-4">
                <div className="bg-white rounded-md border border-blue-200 p-4 shadow-sm text-sm text-blue-700">
                  <div className="flex items-center mb-2">
                    <ExclamationCircleIcon className="h-5 w-5 mr-2 text-blue-700 flex-shrink-0" />
                    <h3 className="font-semibold">Important Reminders</h3>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">For Document Pickup:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>Bring your valid AUF Student ID or Government-issued ID</li>
                      <li>Present your Official Receipt or payment confirmation</li>
                      <li>Documents are released only to the student or authorized representative</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white rounded-md border border-blue-200 p-4 shadow-sm text-sm text-blue-700">
                  <h4 className="font-semibold mb-1 flex items-center">
                    <InformationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                    For Representatives:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Bring an authorization letter from the student</li>
                    <li>Present valid ID of both student and representative</li>
                    <li>Authorization letter must be notarized for TOR requests</li>
                  </ul>
                </div>

                <div className="bg-blue-50 rounded-md border border-blue-300 p-4 shadow-sm text-sm text-blue-800">
                  <h4 className="font-semibold mb-1 flex items-center">
                    <ExclamationTriangleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                    First-Time TOR Requesters:
                  </h4>
                  <p>
                    You must secure a clearance form from all departments before requesting your
                    Transcript of Records.
                  </p>
                </div>

                <div className="bg-blue-50 rounded-md border border-blue-300 p-4 shadow-sm text-sm text-blue-800">
                  <h4 className="font-semibold mb-1 flex items-center">
                    <ExclamationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                    Account Status:
                  </h4>
                  <p>
                    Documents will not be released to students with outstanding financial obligations or
                    pending clearances.
                  </p>
                </div>
              </section>

              {/* Mission */}
              <section className="mt-8 mb-4 bg-gray-50 rounded-md border border-gray-200 p-5 shadow-sm prose prose-sm max-w-none text-gray-800">
                <h2 className="text-[#2C3E9E] font-semibold">Our Mission</h2>
                <p>
                  To maintain accurate and secure academic records while providing timely, efficient, and
                  courteous service to all stakeholders of Angeles University Foundation. We are
                  committed to upholding the integrity and confidentiality of all student records in
                  compliance with the Data Privacy Act of 2012.
                </p>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default RegistrarInfo;
