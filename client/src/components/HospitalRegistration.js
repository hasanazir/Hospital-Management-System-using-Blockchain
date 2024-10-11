import addresses from '../contracts/addresses.json';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HospitalManagement from '../contracts/HospitalManagement.json'; // Adjust path as needed

const hospitalContractAddress = addresses.HospitalManagement;
console.log(hospitalContractAddress);
const HospitalRegistration = ({ web3, account }) => {
    const [govHospitalId, setGovHospitalId] = useState(''); // Government-assigned hospital ID
    const [hospitalName, setHospitalName] = useState('');
    const [hospitalAddress, setHospitalAddress] = useState(''); // Hospital address
    const [hospitalContact, setHospitalContact] = useState(''); // Hospital contact
    const [hospitalPassword, setHospitalPassword] = useState(''); // New field for password
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const contract = new web3.eth.Contract(
                HospitalManagement.abi,
                hospitalContractAddress // Hospital contract address
            );

            // Call the register function with the password
            await contract.methods
                .registerHospital(govHospitalId, hospitalName, hospitalAddress, hospitalContact, hospitalPassword)
                .send({ from: account });

            setMessage('Hospital registered successfully!');
            navigate('/hospital-dashboard'); // Navigate to the hospital dashboard after successful registration
        } catch (error) {
            console.error(error);
            setMessage('Error registering hospital. Please try again.');
        }
    };

    return (
        <div>
            <h1>Register Hospital</h1>
            <form onSubmit={handleRegister}>
                <div>
                    <label htmlFor="govHospitalId">Government Hospital ID:</label>
                    <input
                        type="text"
                        id="govHospitalId"
                        value={govHospitalId}
                        onChange={(e) => setGovHospitalId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="hospitalName">Hospital Name:</label>
                    <input
                        type="text"
                        id="hospitalName"
                        value={hospitalName}
                        onChange={(e) => setHospitalName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="hospitalAddress">Hospital Address:</label>
                    <input
                        type="text"
                        id="hospitalAddress"
                        value={hospitalAddress}
                        onChange={(e) => setHospitalAddress(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="hospitalContact">Hospital Contact:</label>
                    <input
                        type="text"
                        id="hospitalContact"
                        value={hospitalContact}
                        onChange={(e) => setHospitalContact(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="hospitalPassword">Password:</label>
                    <input
                        type="password"
                        id="hospitalPassword"
                        value={hospitalPassword}
                        onChange={(e) => setHospitalPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Register Hospital</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default HospitalRegistration;
