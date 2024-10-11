import addresses from '../contracts/addresses.json';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PatientManagementAndNominee from '../contracts/PatientManagementAndNominee.json'; // Adjust path as needed
import HospitalManagement from '../contracts/HospitalManagement.json'; // Adjust path as needed
import HealthcareProfessionalManagement from '../contracts/HealthcareProfessionalManagement.json'; // Adjust path as needed

const healthcareProfessionalContractAddress=addresses.HealthcareProfessionalManagement;
const hospitalContractAddress = addresses.HospitalManagement;
const LoginPage = ({ web3, account }) => {
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState(''); // New state for password
    const [userType, setUserType] = useState('hospital'); // Default user type
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            if (userType === 'hospital') {
                const contract = new web3.eth.Contract(
                    HospitalManagement.abi,
                    hospitalContractAddress
                );
                
                // Call the hospital login function
                const isValid = await contract.methods.loginHospital(loginId, password).call();
                
                if (isValid) {
                    navigate('/hospital-dashboard');
                } else {
                    setMessage('Invalid Government ID or password. Please try again.');
                }
            } else if (userType === 'doctor') {
                const contract = new web3.eth.Contract(
                    HealthcareProfessionalManagement.abi,
                    healthcareProfessionalContractAddress
                );
                
                // Call the doctor login function
                const isValid = await contract.methods.loginDoctor(loginId, password).call();
                
                if (isValid) {
                    navigate('/doctor-dashboard');
                } else {
                    setMessage('Invalid Doctor ID or password. Please try again.');
                }
            } else if (userType === 'patient') {
                const contract = new web3.eth.Contract(
                    PatientManagementAndNominee.abi,
                    "0x1F58EF6fc744B854c143a33405bF7aCf3F0A87Ac"
                );
                
                // Call the patient login function
                const isValid = await contract.methods.patientLogin(loginId, password).call();
                
                if (isValid) {
                    navigate('/patient-dashboard');
                } else {
                    setMessage('Invalid Public ID or password. Please try again.');
                }
            }
        } catch (error) {
            console.error(error);
            setMessage('Error logging in. Please try again.');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="loginId">Enter your ID:</label>
                    <input
                        type="text"
                        id="loginId"
                        value={loginId}
                        onChange={(e) => setLoginId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // Handle password input
                        required
                    />
                </div>
                <div>
                    <label htmlFor="userType">Select User Type:</label>
                    <select id="userType" value={userType} onChange={(e) => setUserType(e.target.value)}>
                        <option value="hospital">Hospital</option>
                        <option value="doctor">Doctor</option>
                        <option value="patient">Patient</option>
                    </select>
                </div>
                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default LoginPage;
