import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HospitalAndHealthcareProfessionalManagement from '../contracts/HospitalAndHealthcareProfessionalManagement.json'; // Adjust path as needed

const RegisterHospital = ({ web3, account }) => {
    const [hospitalId, setHospitalId] = useState('');
    const [hospitalName, setHospitalName] = useState('');
    const [hospitalLocation, setHospitalLocation] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const contract = new web3.eth.Contract(
                HospitalAndHealthcareProfessionalManagement.abi,
                "0xE1c4ab92401e2193266877C7d14DFE2D93b79380"
                // "YOUR_HOSPITAL_CONTRACT_ADDRESS_HERE" // Update the contract address here
            );
            
            await contract.methods
                .registerHospital(hospitalId, hospitalName, hospitalLocation)
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
                    <label htmlFor="hospitalId">Hospital ID:</label>
                    <input
                        type="text"
                        id="hospitalId"
                        value={hospitalId}
                        onChange={(e) => setHospitalId(e.target.value)}
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
                    <label htmlFor="hospitalLocation">Hospital Location:</label>
                    <input
                        type="text"
                        id="hospitalLocation"
                        value={hospitalLocation}
                        onChange={(e) => setHospitalLocation(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Register Hospital</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default RegisterHospital;
