import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for routing
import PatientManagementAndNominee from '../contracts/PatientManagementAndNominee.json'; // Adjust path as needed
import HospitalAndHealthcareProfessionalManagement from '../contracts/HospitalAndHealthcareProfessionalManagement.json'; // Adjust path as needed

const LandingPage = ({ web3, account }) => { // Receiving web3 and account as props
    const [loginId, setLoginId] = useState('');
    const [userType, setUserType] = useState('hospital'); // Default user type
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            if (userType === 'hospital') {
                const contract = new web3.eth.Contract(
                    HospitalAndHealthcareProfessionalManagement.abi,
                    "0xE1c4ab92401e2193266877C7d14DFE2D93b79380"
                    // "YOUR_HOSPITAL_CONTRACT_ADDRESS_HERE"
                );
                const hospital = await contract.methods.getHospital(loginId).call();
                
                if (hospital.id !== '0') {
                    // Redirect to Hospital Dashboard
                    navigate('/hospital-dashboard'); // Add your actual hospital dashboard route
                } else {
                    setMessage('Hospital not found. Please check your login ID.');
                }
            } else if (userType === 'doctor') {
                const contract = new web3.eth.Contract(
                    HospitalAndHealthcareProfessionalManagement.abi,
                    "0xE1c4ab92401e2193266877C7d14DFE2D93b79380"
                    // "YOUR_HOSPITAL_CONTRACT_ADDRESS_HERE"
                );
                const doctor = await contract.methods.getHealthcareProfessional(loginId).call();
                
                if (doctor.id !== '0') {
                    // Redirect to Doctor Dashboard
                    navigate('/doctor-dashboard'); // Add your actual doctor dashboard route
                } else {
                    setMessage('Doctor not found. Please check your login ID.');
                }
            } else if (userType === 'patient') {
                const contract = new web3.eth.Contract(
                    PatientManagementAndNominee.abi,
                    "0xC57DC079fB608632e4Ad9C83924Ef5F1CB1A5bc2"
                    // "YOUR_PATIENT_CONTRACT_ADDRESS_HERE"
                );
                const patient = await contract.methods.getPatientByPublicId(loginId).call();
                
                if (patient.id !== '0') {
                    // Redirect to Patient Dashboard
                    navigate('/patient-dashboard'); // Add your actual patient dashboard route
                } else {
                    setMessage('Patient not found. Please check your public ID.');
                }
            }
        } catch (error) {
            console.error(error);
            setMessage('Error logging in. Please try again.');
        }
    };

    return (
        <div>
            <h1>Welcome to the Hospital Management System</h1>
            <p>A project developed by ZYNO and team</p>
            <nav>
                <ul>
                    <li><Link to="/register-hospital">Hospital Registration</Link></li>
                    <li><Link to="/register-doctor">Doctor Registration</Link></li>
                    <li><Link to="/register-patient">Patient Registration</Link></li>
                </ul>
            </nav>

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

export default LandingPage;
