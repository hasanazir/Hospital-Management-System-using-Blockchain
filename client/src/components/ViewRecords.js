import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorRecordManagement from '../contracts/DoctorRecordManagement.json';
import DataStandardizationAndInteroperability from '../contracts/DataStandardizationAndInteroperability.json';
import address from '../address.json';

const ViewRecords = ({ web3, account }) => {
    const navigate = useNavigate();
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [sharedRecords, setSharedRecords] = useState([]);
    const [recipientId, setRecipientId] = useState('');
    const [recordId, setRecordId] = useState('');
    const [doctorRecordManagementContract, setDoctorRecordManagementContract] = useState(null);
    const [standardizationContract, setStandardizationContract] = useState(null);

    useEffect(() => {
        const initContracts = async () => {
            const networkId = await web3.eth.net.getId();
            const doctorRecordManagementAddress = address.DoctorRecordManagement[networkId];
            const standardizationAddress = address.DataStandardizationAndInteroperability[networkId];

            const doctorRecordManagementInstance = new web3.eth.Contract(
                DoctorRecordManagement.abi,
                doctorRecordManagementAddress
            );

            const standardizationInstance = new web3.eth.Contract(
                DataStandardizationAndInteroperability.abi,
                standardizationAddress
            );

            setDoctorRecordManagementContract(doctorRecordManagementInstance);
            setStandardizationContract(standardizationInstance);

            await fetchRecords();
        };

        initContracts();
    }, [web3]);

    const fetchRecords = async () => {
        const records = [];
        const shared = [];

        // Fetch approved medical records
        const recordCount = await doctorRecordManagementContract.methods.recordCount().call();
        for (let i = 1; i <= recordCount; i++) {
            const record = await doctorRecordManagementContract.methods.medicalRecords(i).call();
            if (record.patientId === account) {
                records.push(record);
            }
        }

        // Fetch records shared with the patient
        const requestCount = await doctorRecordManagementContract.methods.requestCount().call();
        for (let i = 1; i <= requestCount; i++) {
            const request = await doctorRecordManagementContract.methods.medicalRecordRequests(i).call();
            if (request.patientId === account && request.approved) {
                shared.push(request);
            }
        }

        setMedicalRecords(records);
        setSharedRecords(shared);
    };

    const handleShareAccess = async () => {
        await standardizationContract.methods.getStandardizedRecord(recordId).call()
            .then(async (record) => {
                const majorDiagnosis = record[1];
                const treatment = record[2];
                const allergies = record[3];
                await doctorRecordManagementContract.methods.shareRecord(recordId, recipientId).send({ from: account });
                alert(`Record shared with ID ${recipientId}:\nDiagnosis: ${majorDiagnosis}\nTreatment: ${treatment}\nAllergies: ${allergies.join(', ')}`);
            })
            .catch((error) => {
                console.error("Error fetching standardized record:", error);
                alert("Error fetching standardized record. Please check the record ID.");
            });
    };

    const handleRevokeAccess = async () => {
        await doctorRecordManagementContract.methods.revokeAccess(recordId).send({ from: account });
        alert(`Access revoked for record ID ${recordId} to ${recipientId}.`);
    };

    return (
        <div>
            <h2>Your Medical Records</h2>
            <h3>Approved Records:</h3>
            {medicalRecords.map((record) => (
                <div key={record.id}>
                    <h4>Record ID: {record.id}</h4>
                    <p>Doctor: {record.doctorName}</p>
                    <p>Diagnosis: {record.diagnosis}</p>
                    <p>Treatment: {record.treatment}</p>
                    <p>Prescription: {record.prescription}</p>
                    <p>Notes: {record.notes}</p>
                    <p>Date of Visit: {record.dateOfVisit}</p>
                    <p>Allergies: {record.allergies.join(', ')}</p>
                    <p>Medical History: {record.medicalHistory.join(', ')}</p>
                </div>
            ))}
            <h3>Shared Records:</h3>
            {sharedRecords.map((request) => (
                <div key={request.requestId}>
                    <h4>Request ID: {request.requestId}</h4>
                    <p>Doctor: {request.doctorName}</p>
                    <p>Diagnosis: {request.diagnosis}</p>
                    <p>Treatment: {request.treatment}</p>
                </div>
            ))}
            <h3>Share Access</h3>
            <input
                type="text"
                value={recipientId}
                onChange={(e) => setRecipientId(e.target.value)}
                placeholder="Recipient ID"
            />
            <input
                type="text"
                value={recordId}
                onChange={(e) => setRecordId(e.target.value)}
                placeholder="Record ID"
            />
            <button onClick={handleShareAccess}>Share Access</button>
            <button onClick={handleRevokeAccess}>Revoke Access</button>
        </div>
    );
};

export default ViewRecords;
