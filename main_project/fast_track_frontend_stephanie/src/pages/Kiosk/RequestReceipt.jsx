import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import KioskHeader from "../../components/KioskHeader";
import KioskBackground from "../../components/KioskBackground";
import { QRCodeSVG } from "qrcode.react";

const RequestReceipt = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve the receipt data
  const { receiptData } = location.state || {};

  // Debugging: Check console to see if data actually arrived
  useEffect(() => {
    console.log("Receipt Data Received:", receiptData);
    if (!receiptData) {
      // If no data, wait 3 seconds then go home, but show a message first
      const timer = setTimeout(() => navigate("/"), 3000);
      return () => clearTimeout(timer);
    }
  }, [receiptData, navigate]);

  // FIX: Instead of returning null (white screen), show a loading/error message
  if (!receiptData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#2C3E9E] text-white">
        <p>No receipt data found. Redirecting...</p>
      </div>
    );
  }

  // --- DERIVED VALUES ---
  const requestNumber = receiptData.request_id || "N/A";

  // Safe Date Formatting
  const dateRequested = receiptData.created_at
    ? new Date(receiptData.created_at).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })
    : "N/A";

  const requesterName = `${receiptData.last_name}, ${receiptData.first_name} ${receiptData.middle_name || ""}`;
  const studentNumber = receiptData.student_number || "N/A";

  // Calculate Total
  const calculateTotal = () => {
    if (receiptData.requested_documents) {
      return receiptData.requested_documents.reduce((acc, doc) => {
        // Backend Serializer sends 'price' directly now
        const price = parseFloat(doc.price) || 0;
        return acc + (price * doc.copy_amount);
      }, 0);
    }
    return 0;
  };
  const totalAmount = calculateTotal();

  // --- ACTIONS ---
  const returnMenu = () => {
    navigate("/KioskServicesMenu");
  };

  const downloadPDF = async () => {
    const jsPDF = (await import("jspdf")).default;
    const html2canvas = (await import("html2canvas")).default;

    const receiptElement = document.getElementById("receipt-content");
    const buttons = document.getElementById("receipt-buttons");

    if (buttons) buttons.style.display = "none";
    await new Promise((resolve) => setTimeout(resolve, 150));

    const canvas = await html2canvas(receiptElement, { scale: 2, useCORS: true });

    if (buttons) buttons.style.display = "flex";

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Request-${requestNumber}.pdf`);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#2C3E9E] font-serif">
      {/* Print Styles */}
      <style>{`
        @media print {
          body { background: white !important; }
          .no-print, .header, .background { display: none !important; }
          #receipt-content {
            box-shadow: none !important; border: none !important; margin: 0 !important; padding: 20px !important;
          }
        }
      `}</style>

      <div className="absolute inset-0 z-0 background">
        <KioskBackground opacity={10} blueOpacity={80} />
      </div>

      <div className="fixed top-0 left-0 right-0 z-20 header">
        <KioskHeader />
      </div>

      <div className="flex-1 overflow-y-auto pt-24 no-scrollbar">
        <main className="relative z-20 flex-grow px-6 pb-6">
          <div id="receipt-content" className="bg-white rounded-2xl shadow-xl max-w-xl w-full mx-auto p-6 mt-4 text-[#2c3e9e] space-y-4 mb-20">

            {/* Title */}
            <div className="text-center">
              <h2 className="text-blue-900 font-bold text-xl tracking-wide select-none">Document Request</h2>
              <p className="text-gray-600 text-sm">Angeles University Foundation</p>
            </div>

            {/* QR Code + Request Number */}
            <div className="flex flex-col items-center mb-4">
              <QRCodeSVG
                value={String(requestNumber)}
                size={120}
                bgColor="#ffffff"
                fgColor="#2039ad"
                level="Q"
                includeMargin={true}
              />
              <div className="text-center mt-1">
                <p className="text-[12px] text-gray-700 font-semibold">Request ID</p>
                <p className="text-base font-bold text-blue-900 tracking-wide">#{requestNumber}</p>
              </div>
            </div>

            <hr className="border-gray-300" />

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4 text-gray-700 text-sm">
              <div>
                <p className="font-medium">Date Requested:</p>
                <p className="text-black">{dateRequested}</p>
              </div>
              <div>
                <p className="font-medium">Student Number:</p>
                <p className="text-black">{studentNumber}</p>
              </div>
              <div className="col-span-2">
                <p className="font-medium">Requester’s Name:</p>
                <p className="text-black uppercase">{requesterName}</p>
              </div>
              {/* Removed Global Purpose Field here because purpose is now per document */}
            </div>

            <hr className="border-gray-300" />

            {/* Dynamic Document List */}
            <div>
              <h3 className="font-semibold text-blue-900 text-sm mb-2">Requested Documents</h3>
              <div className="space-y-2">
                {receiptData.requested_documents && receiptData.requested_documents.map((doc, index) => {
                   // UPDATED MAPPING: Matches the 'RequestReceiptSerializer' from previous step
                   // The serializer sends: document_name, price, purpose_description
                   const docName = doc.document_name || "Unknown Document";
                   const docPrice = doc.price || 0;
                   const docPurpose = doc.purpose_description || "N/A";

                   return (
                      <div key={index} className="bg-gray-50 rounded-md border border-gray-200 p-3 flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900">
                            {docName}
                            <span className="text-[11px] rounded px-1 py-0.5 bg-blue-900 text-white ml-1">
                              ₱{docPrice}
                            </span>
                          </p>
                          <p className="text-[11px] text-gray-500">Purpose: {docPurpose}</p>
                        </div>
                        <div className="text-gray-600 font-semibold text-base">x{doc.copy_amount}</div>
                      </div>
                   );
                })}
              </div>

              <div className="text-right mt-3 pt-2 border-t text-blue-900">
                Total Amount: <span className="font-bold text-yellow-600 text-xl">₱{totalAmount}</span>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-yellow-100 rounded-md p-3 text-[11px] text-gray-800">
              <p className="font-semibold mb-1 text-[#2c3e9e]">Next Steps:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Proceed to the Accounting Office to pay <strong>₱{totalAmount}</strong>.</li>
                <li>Show this receipt (QR Code) for verification.</li>
                <li>Wait for notification via SMS/Email.</li>
              </ul>
            </div>

            {/* Footer */}
            <p className="text-center text-gray-500 text-[10px]">
              Keep this receipt for your records.
            </p>

            {/* Buttons */}
            <div id="receipt-buttons" className="flex flex-col gap-2 pt-1 no-print">
              <div className="flex gap-2">
                <button onClick={() => window.print()} className="flex-1 px-4 py-2 border border-blue-900 text-blue-800 rounded-lg font-semibold hover:bg-blue-50 transition text-sm">
                  Print
                </button>
                <button onClick={downloadPDF} className="flex-1 px-4 py-2 border border-blue-900 text-blue-800 rounded-lg font-semibold hover:bg-blue-50 transition text-sm">
                  Download PDF
                </button>
              </div>
              <button onClick={returnMenu} className="w-full px-4 py-2 border border-blue-900 text-white bg-blue-900 rounded-lg hover:bg-blue-800 transition text-sm">
                Return to Menu
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RequestReceipt;