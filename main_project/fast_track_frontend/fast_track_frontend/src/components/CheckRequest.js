// src/components/CheckRequest.js
import React, { useState } from 'react';
import axios from 'axios';

const CheckRequest = () => {
  const [requestNumber, setRequestNumber] = useState('');
  const [requestId, setRequestId] = useState(null);
  const [requestData, setRequestData] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setRequestData(null);

    try {
      // POST to validate request number
      const postRes = await axios.post('/api/check-request-number/', {
        request_number: requestNumber
      });
      setRequestId(postRes.data.request_id);

      // GET to fetch request details
      const getRes = await axios.get(`/api/check-request-number/${postRes.data.request_id}/`);
      setRequestData(getRes.data);
    } catch (err) {
      if (err.response && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('An error occurred');
      }
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Check Request Status</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Request Number"
          value={requestNumber}
          onChange={(e) => setRequestNumber(e.target.value)}
          style={{ padding: '0.5rem', width: '300px' }}
        />
        <button type="submit" style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}>
          Check
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {requestData && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Request Details</h3>
          <p><strong>Request Number:</strong> {requestData.request_number}</p>
          <p><strong>Name:</strong> {requestData.first_name} {requestData.last_name}</p>
          <p><strong>Student Number:</strong> {requestData.student_number}</p>
          <p><strong>Date Requested:</strong> {requestData.date_requested}</p>
          <p><strong>Status:</strong> {requestData.request_status}</p>
          <h4>Documents</h4>
          <ul>
            {requestData.documents.map((doc, index) => (
              <li key={index}>
                {doc.doctype_name} - Copies: {doc.copy_amount} - Processing: {doc.processing_time}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CheckRequest;
