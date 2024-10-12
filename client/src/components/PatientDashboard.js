import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap'; // Modal to display record details
import addressFile from '../address.json';
import patientContractABI from '../contracts/PatientManagementAndNominee.json';

const PatientDashboard = ({ web3, account }) => {
  const [contract, setContract] = useState(null);
  const [requests, setRequests] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Load the contract instance
  useEffect(() => {
    const loadContract = async () => {
      try {
        const address = addressFile.PatientManagementAndNominee;
        const abi = patientContractABI.abi;
        const contractInstance = new web3.eth.Contract(abi, address);
        setContract(contractInstance);
      } catch (error) {
        console.error('Error loading contract:', error);
      }
    };

    if (web3 && account) loadContract();
  }, [web3, account]);

  // Fetch pending requests
  useEffect(() => {
    const fetchRequests = async () => {
      if (!contract) return;

      const events = await contract.getPastEvents('MedicalRecordRequested', {
        fromBlock: 0,
        toBlock: 'latest',
      });

      const filteredRequests = events.filter(
        (event) => event.returnValues.patientId === account
      );

      setRequests(filteredRequests);
    };

    fetchRequests();
  }, [contract, account]);

  // Handle viewing record details
  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setShowModal(true);
  };

  // Accept the record request
  const acceptRequest = async (requestId) => {
    try {
      await contract.methods.acceptMedicalRecord(requestId).send({ from: account });
      alert('Record request accepted!');
      setRequests(requests.filter((req) => req.returnValues.requestId !== requestId));
      setShowModal(false);
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  // Reject the record request
  const rejectRequest = (requestId) => {
    setRequests(requests.filter((req) => req.returnValues.requestId !== requestId));
    setShowModal(false);
  };

  return (
    <div>
      <h1>Patient Dashboard</h1>

      <h2>Pending Medical Record Requests</h2>
      {requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <ul>
          {requests.map((req) => (
            <li key={req.returnValues.requestId}>
              <span>Doctor: {req.returnValues.doctorName}</span>
              <Button variant="info" onClick={() => handleViewDetails(req.returnValues)}>
                View Details
              </Button>
            </li>
          ))}
        </ul>
      )}

      {/* Modal to display full record details */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Medical Record Request Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRecord ? (
            <div>
              <p><strong>Doctor Name:</strong> {selectedRecord.doctorName}</p>
              <p><strong>Diagnosis:</strong> {selectedRecord.diagnosis}</p>
              <p><strong>Treatment:</strong> {selectedRecord.treatment}</p>
              <p><strong>Prescription:</strong> {selectedRecord.prescription}</p>
              <p><strong>Notes:</strong> {selectedRecord.notes}</p>
              <p><strong>Date of Visit:</strong> {selectedRecord.dateOfVisit}</p>
              <p><strong>Allergies:</strong> {selectedRecord.allergies.join(', ')}</p>
              <p><strong>Medical History:</strong> {selectedRecord.medicalHistory.join(', ')}</p>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => acceptRequest(selectedRecord.requestId)}>
            Accept
          </Button>
          <Button variant="danger" onClick={() => rejectRequest(selectedRecord.requestId)}>
            Reject
          </Button>
        </Modal.Footer>
      </Modal>

      <button onClick={() => navigate('/view-records')}>View Medical Records</button>
      <button onClick={() => navigate('/manage-nominee')}>Manage Nominee</button>
    </div>
  );
};

export default PatientDashboard;
