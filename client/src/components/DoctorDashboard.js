import React, { useState, useEffect } from 'react';
import addresses from '../contracts/addresses.json';
import { useNavigate } from 'react-router-dom';

const doctorContractAddress = addresses.DoctorRecordManagement; // Address for Doctor contract

const DoctorDashboard = ({ web3, account }) => {
    const [patientId, setPatientId] = useState('');
    const [doctorName, setDoctorName] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [treatment, setTreatment] = useState('');
    const [prescription, setPrescription] = useState('');
    const [notes, setNotes] = useState('');
    const [dateOfVisit, setDateOfVisit] = useState('');
    const [allergies, setAllergies] = useState([]);
    const [medicalHistory, setMedicalHistory] = useState([]);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setMessage(''); // Clear messages on mount
    }, []);

    const handleCreateRecord = async (e) => {
        e.preventDefault(); // Prevent form reload
        setMessage(''); // Reset any previous message

        try {
            const contract = new web3.eth.Contract(
                DoctorManagement.abi,
                doctorContractAddress // Doctor contract address
            );

            // Ensure all inputs are provided
            if (
                !patientId || !doctorName || !diagnosis || !treatment || !prescription ||
                !notes || !dateOfVisit || allergies.length === 0 || medicalHistory.length === 0
            ) {
                setMessage('Please fill in all fields.');
                return;
            }

            // Send the request to store the medical record
            await contract.methods
                .createMedicalRecord(
                    patientId,
                    doctorName,
                    diagnosis,
                    treatment,
                    prescription,
                    notes,
                    dateOfVisit,
                    allergies,
                    medicalHistory
                )
                .send({ from: account });

            setMessage('Record creation request sent to patient.');
        } catch (error) {
            console.error('Error creating record:', error);

            if (error.code === 4001) {
                setMessage('Transaction canceled by user.');
            } else {
                setMessage('Error creating medical record. Please try again.');
            }
        }
    };

    return (
        <div>
            <h1>Doctor Dashboard</h1>
            <form onSubmit={handleCreateRecord}>
                <input 
                    type="text" 
                    placeholder="Patient ID" 
                    value={patientId} 
                    onChange={(e) => setPatientId(e.target.value)} 
                    required 
                />
                <input 
                    type="text" 
                    placeholder="Doctor Name" 
                    value={doctorName} 
                    onChange={(e) => setDoctorName(e.target.value)} 
                    required 
                />
                <input 
                    type="text" 
                    placeholder="Diagnosis" 
                    value={diagnosis} 
                    onChange={(e) => setDiagnosis(e.target.value)} 
                    required 
                />
                <input 
                    type="text" 
                    placeholder="Treatment" 
                    value={treatment} 
                    onChange={(e) => setTreatment(e.target.value)} 
                    required 
                />
                <input 
                    type="text" 
                    placeholder="Prescription" 
                    value={prescription} 
                    onChange={(e) => setPrescription(e.target.value)} 
                    required 
                />
                <textarea 
                    placeholder="Notes" 
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)} 
                    required 
                />
                <input 
                    type="date" 
                    value={dateOfVisit} 
                    onChange={(e) => setDateOfVisit(e.target.value)} 
                    required 
                />
                <input 
                    type="text" 
                    placeholder="Allergies (comma-separated)" 
                    onChange={(e) => setAllergies(e.target.value.split(','))} 
                    required 
                />
                <input 
                    type="text" 
                    placeholder="Medical History (comma-separated)" 
                    onChange={(e) => setMedicalHistory(e.target.value.split(','))} 
                    required 
                />
                <button type="submit">Create Medical Record</button>
            </form>
            <p>{message}</p>
            {/* Button to navigate to the Records List */}
            <button onClick={() => navigate('/records-list', { state: { web3, account } })}>
                View Medical Records
            </button>
        </div>
    );
};

export default DoctorDashboard;
