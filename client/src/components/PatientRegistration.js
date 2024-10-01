import React, { useState } from 'react';
import Web3 from 'web3';
import PatientManagementAndNominee from '../contracts/PatientManagementAndNominee.json'; // Adjust path as needed
import { useNavigate } from 'react-router-dom';

const PatientRegistration = ({ web3, account }) => {
    const [name, setName] = useState('');
    const [nomineeAddress, setNomineeAddress] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // const web3 = new Web3(Web3.givenProvider || "http://localhost:7545"); // Adjust the provider as needed

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            // const accounts = await web3.eth.getAccounts();
            const contract = new web3.eth.Contract(PatientManagementAndNominee.abi, "0xC57DC079fB608632e4Ad9C83924Ef5F1CB1A5bc2");
            //your patient contract address should be added here
            // Register the patient
            await contract.methods.registerPatient(name, nomineeAddress).send({ from: account });

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
                    <label htmlFor="nomineeAddress">Nominee Address (optional):</label>
                    <input
                        type="text"
                        id="nomineeAddress"
                        value={nomineeAddress}
                        onChange={(e) => setNomineeAddress(e.target.value)}
                    />
                </div>
                <button type="submit">Register Patient</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default PatientRegistration;
