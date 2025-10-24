import './App.css';
import React from 'react';
import CheckRequest from './components/CheckRequest';
import RequestDocument from "./components/RequestDocument";
import LoginForm from "./components/LoginForm";
import AdminDashboardTest from "./components/AdminDashboardTest";

function App() {
  return (
    <div className="App" style={{ padding: '2rem' }}>
      <h1>Check Request Test</h1>
      <CheckRequest />

      <hr style={{ margin: '2rem 0' }} />

      <h1>Request Receipt Test</h1>
      <RequestDocument />

      <hr style={{ margin: '2rem 0' }} />

      <h1>Login Test</h1>
      <LoginForm />

      <hr style={{ margin: '2rem 0' }} />

      <h1>Admin Dashboard Test</h1>
      <AdminDashboardTest />
    </div>
  );
}

export default App;
