import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomeScreen from "../pages/Kiosk/WelcomeScreen";
import KioskServicesMenu from "../pages/Kiosk/KioskServicesMenu"; 
import CheckRequestStatus from '../pages/Kiosk/CheckRequestStatus'; 
import CheckRequestReceipt from '../pages/Kiosk/CheckRequestReceipt'; 
import RequestDocument from '../pages/Kiosk/RequestDocument'; 
import RequestNotFound from '../pages/Kiosk/RequestNotFound'; 
import SuccessMessage from '../pages/Kiosk/SuccessMessage'; 
import SingleDocumentReceipt from '../pages/Kiosk/SingleDocumentReceipt'; 
import MultiDocumentRequest from '../pages/Kiosk/MultiDocumentRequest'; 
import AddAnotherDocument from '../pages/Kiosk/AddAnotherDocument'; 
import MultiSuccessMessage from '../pages/Kiosk/MultiSuccessMessage'; 
import MultiDocumentReceipt from '../pages/Kiosk/MultiDocumentReceipt'; 

// Admin Pages
import AdminLoginForm from '../pages/Admin/AdminLoginForm'; 



function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLoginForm/>} />
        <Route path="/KioskServicesMenu" element={<KioskServicesMenu />} />
        <Route path="/CheckRequestStatus" element={<CheckRequestStatus />} />
        <Route path="/CheckRequestReceipt" element={<CheckRequestReceipt />} />
        <Route path="/RequestDocument" element={<RequestDocument />} />
        <Route path="/RequestNotFound" element={<RequestNotFound />} />
        <Route path="/SuccessMessage" element={<SuccessMessage />} />
        <Route path="/SingleDocumentReceipt" element={<SingleDocumentReceipt />} />
        <Route path="/MultiDocumentRequest" element={<MultiDocumentRequest />} />
        <Route path="/AddAnotherDocument" element={<AddAnotherDocument />} />
        <Route path="/MultiSuccessMessage" element={<MultiSuccessMessage />} />
        <Route path="/MultiDocumentReceipt" element={<MultiDocumentReceipt />} />




      </Routes>
    </Router>
  );
}

export default AppRoutes;
