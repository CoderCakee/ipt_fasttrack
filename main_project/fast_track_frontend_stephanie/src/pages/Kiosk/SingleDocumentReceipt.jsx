import React from "react";
import { useNavigate } from "react-router-dom";
import KioskHeader from "../../components/KioskHeader";
import KioskBackground from "../../components/KioskBackground";
import { QRCodeSVG } from "qrcode.react";

const SingleDocumentReceipt = ({
  requesterName = "Dela Cruz, Juan",
  requestNumber = "FAST-2024-510586",
  studentNumber = "23-1576-329",
  dateRequested = "September 19, 2025",
  documentRequested = "Certificate of Good Moral Character",
  documentPrice = 100,
  copies = 1,
  purpose = "Transfer of School",
  totalAmount = "₱150",
}) => {
  const navigate = useNavigate();

  const returnMenu = () => {
    setTimeout(() => {
      navigate("/KioskServicesMenu");
    }, 700);
  };

  const downloadPDF = async () => {
    const jsPDF = (await import("jspdf")).default;
    const html2canvas = (await import("html2canvas")).default;

    const receiptElement = document.getElementById("receipt-content");
    const buttons = document.getElementById("receipt-buttons");

    // Save current width and apply fixed width for PDF capture
    const originalWidth = receiptElement.style.width;
    receiptElement.style.width = "800px";

    // Hide the buttons before capture
    if (buttons) buttons.style.display = "none";

    // Wait a tiny bit for UI update
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Generate canvas
    const canvas = await html2canvas(receiptElement, {
      scale: 2,
      useCORS: true,
    });

    // Restore original width and buttons
    receiptElement.style.width = originalWidth;
    if (buttons) buttons.style.display = "flex";

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${requestNumber}.pdf`);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#2C3E9E] font-serif">
      {/* Print Styles */}
      <style>{`
        @media print {
          body { background: white !important; }
          .no-print, .header, .background { display: none !important; }
          #receipt-content { box-shadow: none !important; border: none !important; margin: 0 !important; padding: 20px !important; }
        }
      `}</style>

      {/* Background */}
      <div className="absolute inset-0 z-0 background">
        <KioskBackground opacity={10} blueOpacity={80} />
      </div>

      {/* Fixed Header */}
      <div className="w-full header">
        <KioskHeader />
      </div>

      {/* Scrollable Content */}
      <div 
        className="flex-1 overflow-y-auto pt-24" 
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`
          .scrollable-content::-webkit-scrollbar { display: none; }
        `}</style>

        <main className="relative z-20 flex-grow px-6 pb-6 mt-32">
          <div 
            id="receipt-content"
            className="bg-white rounded-2xl shadow-xl max-w-xl w-full mx-auto p-6 mt-4 text-[#2c3e9e] space-y-4 mb-20"
          >
            {/* Title */}
            <div className="text-center">
              <h2 className="text-blue-900 font-bold text-xl tracking-wide select-none">
                Document Request
              </h2>
              <p className="text-gray-600 text-sm">Angeles University Foundation</p>
            </div>

            {/* QR Code + Request Number */}
            <div className="flex flex-col items-center mb-4">
              <QRCodeSVG
                value={requestNumber}
                size={120}
                bgColor="#ffffff"
                fgColor="#2039ad"
                level="Q"
                includeMargin={true}
              />
              <div className="text-center mt-1">
                <p className="text-[12px] text-gray-700 font-semibold">Request Number</p>
                <p className="text-base font-bold text-blue-900 tracking-wide">{requestNumber}</p>
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
              <div>
                <p className="font-medium">Requester’s Name:</p>
                <p className="text-black">{requesterName}</p>
              </div>
            </div>

            <hr className="border-gray-300" />

            {/* Document Section */}
            <div>
              <h3 className="font-semibold text-blue-900 text-sm mb-2">Requested Document</h3>
              <div className="bg-gray-50 rounded-md border border-gray-200 p-3 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">
                    {documentRequested}
                    <span className="text-[11px] rounded px-1 py-0.5 bg-blue-900 text-white ml-1">₱{documentPrice}</span>
                  </p>
                  <p className="text-[11px] text-gray-600 mt-1">Copies: {copies}</p>
                  <p className="text-[11px] text-gray-600">Purpose: {purpose}</p>
                </div>
                <div className="text-gray-600 font-semibold text-base">x{copies}</div>
              </div>
              <div className="text-right mt-1 text-blue-900">
                Total Amount: <span className="font-bold text-yellow-600 text-base">{totalAmount}</span>
              </div>
            </div>

            {/* Processing Info */}
            <div className="text-gray-700 text-sm">
              <p className="font-semibold mb-1">Processing Time:</p>
              <p>3–5 working days</p>
            </div>

            {/* Instructions */}
            <div className="bg-yellow-100 rounded-md p-3 text-[11px] text-gray-800">
              <p className="font-semibold mb-1 text-[#2c3e9e]">Next Steps:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Proceed to the AUF Accounting Office (Ground Floor) to pay the required fees</li>
                <li>Bring your payment receipt to the Registrar for verification</li>
                <li>Wait for an SMS or email notification when your documents are ready for pickup</li>
              </ul>
            </div>

            {/* Footer Note */}
            <p className="text-center text-gray-500 text-[10px]">
              For inquiries, visit the Registrar’s Office
              <br />
              Keep this receipt for your records.
            </p>

            {/* Buttons (hidden on print) */}
            <div id="receipt-buttons" className="flex flex-col gap-2 pt-1 no-print">
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 px-4 py-2 border border-blue-900 text-blue-800 rounded-lg font-semibold hover:bg-blue-50 transition text-sm"
                >
                  Print
                </button>
                <button
                  onClick={downloadPDF}
                  className="flex-1 px-4 py-2 border border-blue-900 text-blue-800 rounded-lg font-semibold hover:bg-blue-50 transition text-sm"
                >
                  Download PDF
                </button>
              </div>

              <button
                onClick={returnMenu}
                className="w-full px-4 py-2 border border-blue-900 text-white bg-blue-900 rounded-lg hover:bg-blue-800 transition text-sm"
              >
                Return to Menu
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SingleDocumentReceipt;
