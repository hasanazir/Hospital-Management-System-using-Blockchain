import addresses from '../contracts/addresses.json';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HealthcareProfessionalManagement from '../contracts/HealthcareProfessionalManagement.json'; // Contract for healthcare professional management
import HospitalManagement from '../contracts/HospitalManagement.json'; // Contract for hospital management

const healthcareProfessionalContractAddress = addresses.HealthcareProfessionalManagement;
const hospitalContractAddress = addresses.HospitalManagement;

const DoctorRegistration = ({ web3, account }) => {
    const [name, setName] = useState('');
    const [hospitalId, setHospitalId] = useState('');
    const [gocDoctorId, setGocDoctorId] = useState(''); // New input for gocDoctorId
    const [hospitalPassword, setHospitalPassword] = useState(''); // New input for password
    const [message, setMessage] = useState('');
    const [doctorId, setDoctorId] = useState(null); // Track doctor ID for approval event
    const navigate = useNavigate();

    // Function to handle registration form submission
    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage('Registering doctor...');

        try {
            const contractHealthcare = new web3.eth.Contract(
                HealthcareProfessionalManagement.abi,
                healthcareProfessionalContractAddress // Address for healthcare professional management contract
            );

            // Register the healthcare professional (doctor) with gocDoctorId and password
            const receipt = await contractHealthcare.methods
                .registerProfessional(name, hospitalId, gocDoctorId, hospitalPassword) // Removed specialty parameter
                .send({ from: account });

            // Extract the doctor ID from the transaction receipt
            const doctorIdFromReceipt = receipt.events.ProfessionalRegistered.returnValues.id;
            setDoctorId(doctorIdFromReceipt); // Store the auto-generated doctor ID

            setMessage('Doctor registration submitted. Waiting for hospital approval...');
        } catch (error) {
            console.error(error);
            setMessage('Error registering the doctor. Please try again.');
        }
    };

    // Event listener to check if the doctor gets approved by the hospital
    useEffect(() => {
        if (doctorId) {
            const contractHospital = new web3.eth.Contract(
                HospitalManagement.abi,
                hospitalContractAddress // Replace with the correct hospital management contract address
            );

            // Listen for the DoctorApproved event from the hospital management smart contract
            contractHospital.events.DoctorApproved({
                filter: { doctorId }, // Filter for the specific doctor ID
            })
            .on('data', (event) => {
                const { approved } = event.returnValues;
                if (approved) {
                    setMessage('Doctor approved! Redirecting...');
                    navigate('/doctor-dashboard'); // Redirect to doctor dashboard upon approval
                } else {
                    setMessage('Doctor registration was rejected by the hospital.');
                }
            })
            .on('error', (error) => {
                console.error(error);
                setMessage('Error while waiting for approval.');
            });
        }
    }, [doctorId, web3, navigate]);

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
                    <label htmlFor="hospitalId">Hospital ID:</label>
                    <input
                        type="number"
                        id="hospitalId"
                        value={hospitalId}
                        onChange={(e) => setHospitalId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="gocDoctorId">GOC Doctor ID:</label>
                    <input
                        type="text"
                        id="gocDoctorId"
                        value={gocDoctorId}
                        onChange={(e) => setGocDoctorId(e.target.value)}
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
                <button type="submit">Register Doctor</button>
            </form>
            {message && <p>{message}</p>}
            {doctorId && <p>Your auto-generated Doctor ID: {doctorId}</p>} {/* Display the auto-generated Doctor ID */}
        </div>
    );
};

export default DoctorRegistration;
