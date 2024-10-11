import addresses from '../contracts/addresses.json';
// src/components/HospitalDashboard.js
import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import HealthcareProfessionalManagement from '../contracts/HealthcareProfessionalManagement.json'; // Adjust the path as needed

const hospitalContractAddress = addresses.HospitalManagement;
const healthcareProfessionalContractAddress=addresses.HealthcareProfessionalManagement;

const HospitalDashboard = ({ web3, account }) => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            const contract = new web3.eth.Contract(
                HealthcareProfessionalManagement.abi,
                healthcareProfessionalContractAddress // Add your contract address here
            );

            const totalProfessionals = await contract.methods.professionalCount().call();
            const requestsArray = [];

            for (let i = 1; i <= totalProfessionals; i++) {
                const professional = await contract.methods.getProfessional(i).call();
                if (!professional.isApproved) { // Display only those professionals who are not yet approved
                    requestsArray.push(professional);
                }
            }

            setRequests(requestsArray);
        };

        fetchRequests();
    }, [web3]);

    const handleApproval = async (professionalId) => {
        const contract = new web3.eth.Contract(
            HealthcareProfessionalManagement.abi,
            healthcareProfessionalContractAddress // Add your contract address here
        );

        await contract.methods.approveProfessional(professionalId).send({ from: account });
        
        // Refresh the requests after approval
        const updatedRequests = requests.filter(request => request.professionalId !== professionalId);
        setRequests(updatedRequests);
    };

    const handleRejection = (professionalId) => {
        // Logic to handle rejection
        setRequests(requests.filter(request => request.professionalId !== professionalId));
    };

    return (
        <div>
            <h2>Hospital Dashboard</h2>
            <h3>Doctor Requests</h3>
            {requests.length === 0 ? (
                <p>No requests pending approval.</p>
            ) : (
                <ul>
                    {requests.map((request) => (
                        <li key={request.professionalId}>
                            <p>Doctor Name: {request.name}</p>
                            <p>Government Doctor ID: {request.gocDoctorId}</p>
                            <button onClick={() => handleApproval(request.professionalId)}>Approve</button>
                            <button onClick={() => handleRejection(request.professionalId)}>Reject</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default HospitalDashboard;
