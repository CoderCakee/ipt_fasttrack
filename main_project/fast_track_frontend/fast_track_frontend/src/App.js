import './App.css';
import React from 'react';
import CheckRequest from './components/CheckRequest';
import RequestDocument from "./components/RequestDocument";
import LoginForm from "./components/LoginForm"

function App() {
  return (
    <div className="App" style={{ padding: '2rem' }}>
      <h1>Check Request Test</h1>
      <CheckRequest />

      <hr style={{ margin: '2rem 0' }} />

      <h1>Request Receipt Test</h1>
      {/* Pass a test request ID */}
      <RequestDocument />

      <h1>Login</h1>
      <LoginForm />
    </div>
  );
}

export default App;
