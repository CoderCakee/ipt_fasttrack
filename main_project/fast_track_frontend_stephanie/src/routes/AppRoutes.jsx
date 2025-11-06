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
import AdminDashboard from '../pages/Admin/AdminDashboard'; 
import RequestManagement from '../pages/Admin/RequestManagement'; 
import PaymentTracking from '../pages/Admin/PaymentTracking'; 
import NotificationManagement from '../pages/Admin/NotificationManagement'; 
import UserManagement from '../pages/Admin/UserManagement'; 
import Reports from '../pages/Admin/Reports'; 









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


        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/RequestManagement" element={<RequestManagement />} />
        <Route path="/PaymentTracking" element={<PaymentTracking />} />
        <Route path="/NotificationManagement" element={<NotificationManagement />} />
        <Route path="/UserManagement" element={<UserManagement />} />
        <Route path="/Reports" element={<Reports />} />
    

      
      </Routes>
    </Router>
  );
}

export default AppRoutes;
