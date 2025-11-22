import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Kiosk

import WelcomeScreen from "../pages/Kiosk/WelcomeScreen";
import KioskServicesMenu from "../pages/Kiosk/KioskServicesMenu"; 
import CheckRequestStatus from '../pages/Kiosk/CheckRequestStatus'; 
import CheckRequestReceipt from '../pages/Kiosk/CheckRequestReceipt'; 
import RequestDocumentStep1 from '../pages/Kiosk/RequestDocumentStep1'; 
import RequestDocumentStep2 from '../pages/Kiosk/RequestDocumentStep2'; 
import RequestDocumentStep3 from '../pages/Kiosk/RequestDocumentStep3'; 
import RequestNotFound from '../pages/Kiosk/RequestNotFound'; 
import SuccessMessage from '../pages/Kiosk/SuccessMessage'; 
import SingleDocumentReceipt from '../pages/Kiosk/SingleDocumentReceipt'; 

import MultiSuccessMessage from '../pages/Kiosk/MultiSuccessMessage'; 
import RegistrarInfo from '../pages/Kiosk/RegistrarInfo'; 


// Admin
import AdminLoginForm from '../pages/Admin/AdminLoginForm'; 
import AdminDashboard from '../pages/Admin/AdminDashboard'; 
import RequestManagement from '../pages/Admin/RequestManagement'; 
import PaymentTracking from '../pages/Admin/PaymentTracking'; 
import NotificationManagement from '../pages/Admin/NotificationManagement'; 
import UserManagement from '../pages/Admin/UserManagement'; 
import Reports from '../pages/Admin/Reports'; 

// AUFAccount
import LoginForm from '../pages/AUFAccount/LoginForm'; 
import Home from '../pages/AUFAccount/Home'; 
import PaymentInfo from '../pages/AUFAccount/PaymentInfo'; 
import RequestHistory from '../pages/AUFAccount/RequestHistory'; 
import MyProfile from '../pages/AUFAccount/MyProfile'; 
import ContactRegistrar from '../pages/AUFAccount/ContactRegistrar'; 
import ViewDetails from '../pages/AUFAccount/ViewDetails'; 

// AlumniAccount
import HomeAlumni from '../pages/AlumniAccount/HomeAlumni'; 
import CheckStatusAlumni from '../pages/AlumniAccount/CheckStatusAlumni'; 


function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/WelcomeScreen" element={<WelcomeScreen/>} />
        <Route path="/KioskServicesMenu" element={<KioskServicesMenu />} />
        <Route path="/CheckRequestStatus" element={<CheckRequestStatus />} />
        <Route path="/CheckRequestReceipt" element={<CheckRequestReceipt />} />
        <Route path="/RequestDocumentStep1" element={<RequestDocumentStep1 />} />
        <Route path="/RequestDocumentStep2" element={<RequestDocumentStep2 />} />
        <Route path="/RequestDocumentStep3" element={<RequestDocumentStep3 />} />
        <Route path="/RequestNotFound" element={<RequestNotFound />} />
        <Route path="/SuccessMessage" element={<SuccessMessage />} />
        <Route path="/SingleDocumentReceipt" element={<SingleDocumentReceipt />} />
        <Route path="/MultiSuccessMessage" element={<MultiSuccessMessage />} />
        <Route path="/RegistrarInfo" element={<RegistrarInfo />} />


        <Route path="/AdminLoginForm" element={<AdminLoginForm />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/RequestManagement" element={<RequestManagement />} />
        <Route path="/PaymentTracking" element={<PaymentTracking />} />
        <Route path="/NotificationManagement" element={<NotificationManagement />} />
        <Route path="/UserManagement" element={<UserManagement />} />
        <Route path="/Reports" element={<Reports />} />


        <Route path="/LoginForm" element={<LoginForm />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/PaymentInfo" element={<PaymentInfo />} />
        <Route path="/RequestHistory" element={<RequestHistory />} />
        <Route path="/MyProfile" element={<MyProfile />} />
        <Route path="/ContactRegistrar" element={<ContactRegistrar />} />        
        <Route path="/ViewDetails" element={<ViewDetails />} />
        <Route path="/HomeAlumni" element={<HomeAlumni />} />
        <Route path="/CheckStatusAlumni" element={<CheckStatusAlumni />} />


      </Routes>
    </Router>
  );
}

export default AppRoutes;
