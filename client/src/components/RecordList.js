// src/components/RecordsList.js
import React, { useEffect, useState } from 'react';
import DoctorManagement from '../contracts/DoctorManagement.json'; // Adjust the path as needed
import addresses from '../contracts/addresses.json';

const RecordsList = ({ web3, account }) => {
    const [records, setRecords] = useState([]);
    const doctorContractAddress = addresses.DoctorManagement; // Adjust the address as needed

    const fetchRecords = async () => {
        try {
            const contract = new web3.eth.Contract(
                DoctorManagement.abi,
                doctorContractAddress
            );

            // Fetch records associated with the doctor
            const records = await contract.methods.getRecordsForDoctor(account).call();
            setRecords(records);
        } catch (error) {
            console.error("Error fetching records:", error);
        }
    };

    useEffect(() => {
        fetchRecords(); // Fetch records on component mount
    }, [account]);

    return (
        <div>
            <h2>Medical Records</h2>
            <ul>
                {records.map((record, index) => (
                    <li key={index}>
                        <strong>Patient ID:</strong> {record.patientId}<br />
                        <strong>Doctor Name:</strong> {record.doctorName}<br />
                        <strong>Diagnosis:</strong> {record.diagnosis}<br />
                        <strong>Treatment:</strong> {record.treatment}<br />
                        <strong>Prescription:</strong> {record.prescription}<br />
                        <strong>Notes:</strong> {record.notes}<br />
                        <strong>Date of Visit:</strong> {record.dateOfVisit}<br />
                        <strong>Allergies:</strong> {record.allergies.join(', ')}<br />
                        <strong>Medical History:</strong> {record.medicalHistory.join(', ')}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecordsList;
