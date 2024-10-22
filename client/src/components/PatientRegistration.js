import addresses from '../contracts/addresses.json';
import React, { useState } from 'react';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';

const patientManagemetAndNomineeContractAddress=addresses.PatientManagementAndNominee;
const PatientRegistration = ({ web3, account }) => {
    const [name, setName] = useState('');
    const [contact, setContact] = useState(''); // State for contact
    const [patientAddress, setPatientAddress] = useState(''); // State for patientAddress (updated)
    const [hospitalPassword, setHospitalPassword] = useState(''); // New state for password
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const contract = new web3.eth.Contract(
                PatientManagementAndNominee.abi,
                patientManagemetAndNomineeContractAddress // Add your patient contract address here
            );

            // Register the patient with password
            await contract.methods.registerPatient(name, contact, patientAddress, hospitalPassword) // Added password parameter
                .send({ from: account });

            setMessage('Patient registered successfully!');

            // Redirect to Patient Dashboard
            navigate('/patient-dashboard');
        } catch (error) {
            console.error(error);
            setMessage('Error registering the patient. Please try again.');
        }
    };

    return (
        <div>
            <h2>Patient Registration</h2>
            <form onSubmit={handleRegister}>
                <div>
                    <label htmlFor="name">Patient Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="contact">Contact:</label>
                    <input
                        type="text"
                        id="contact"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="patientAddress">Patient Address:</label>
                    <input
                        type="text"
                        id="patientAddress"
                        value={patientAddress}
                        onChange={(e) => setPatientAddress(e.target.value)} // Changed from 'address' to 'patientAddress'
                        required
                    />
                </div>
                <div>
                    <label htmlFor="hospitalPassword">Password:</label>
                    <input
                        type="password"
                        id="hospitalPassword"
                        value={hospitalPassword}
                        onChange={(e) => setHospitalPassword(e.target.value)} // Handle password input
                        required
                    />
                </div>
                <button type="submit">Register Patient</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default PatientRegistration;
