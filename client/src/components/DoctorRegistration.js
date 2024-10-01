import React, { useState } from 'react';
import HospitalAndHealthcareProfessionalManagement from '../contracts/HospitalAndHealthcareProfessionalManagement.json'; // Adjust path as needed
import { useNavigate } from 'react-router-dom';

const DoctorRegistration = ({ web3, account }) => {
    const [name, setName] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [hospitalId, setHospitalId] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // const web3 = new Web3(Web3.givenProvider || "http://localhost:7545"); // Adjust the provider as needed

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            // const accounts = await web3.eth.getAccounts();
            const contract = new web3.eth.Contract(
                HospitalAndHealthcareProfessionalManagement.abi,
                "0xE1c4ab92401e2193266877C7d14DFE2D93b79380"

                //  "YOUR_HOSPITAL_CONTRACT_ADDRESS_HERE"
                );

            // Register the healthcare professional (doctor)
            await contract.methods.registerHealthcareProfessional(name, specialty, hospitalId).send({ from: account });

            setMessage('Doctor registered successfully!');

            // Redirect to Doctor Dashboard
            navigate('/doctor-dashboard');
        } catch (error) {
            console.error(error);
            setMessage('Error registering the doctor. Please try again.');
        }
    };

    return (
        <div>
            <h2>Doctor Registration</h2>
            <form onSubmit={handleRegister}>
                <div>
                    <label htmlFor="name">Doctor Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="specialty">Specialty:</label>
                    <input
                        type="text"
                        id="specialty"
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="hospitalId">Hospital ID:</label>
                    <input
                        type="number"
                        id="hospitalId"
                        value={hospitalId}
                        onChange={(e) => setHospitalId(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Register Doctor</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default DoctorRegistration;
