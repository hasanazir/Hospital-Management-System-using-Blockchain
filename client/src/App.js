import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import HospitalRegistration from "./components/HospitalRegistration";
import DoctorRegistration from "./components/DoctorRegistration";
import PatientRegistration from "./components/PatientRegistration";
import HospitalDashboard from './components/HospitalDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import PatientDashboard from './components/PatientDashboard';
import detectEthereumProvider from '@metamask/detect-provider';
import LoginPage from "./components/LoginPage";
import RecordsList from "./components/RecordList";

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const initWeb3 = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        await provider.request({ method: 'eth_requestAccounts' });
        const web3Instance = new Web3(provider);
        const accounts = await web3Instance.eth.getAccounts();
        setWeb3(web3Instance);
        setAccount(accounts[0]);
      } else {
        console.error('MetaMask not detected');
      }
    };
    initWeb3();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage web3={web3} account={account} />} />
        <Route path="/register-hospital" element={<HospitalRegistration web3={web3} account={account} />} />
        <Route path="/register-doctor" element={<DoctorRegistration web3={web3} account={account} />} />
        <Route path="/register-patient" element={<PatientRegistration web3={web3} account={account} />} />
        <Route path="/hospital-dashboard" element={<HospitalDashboard web3={web3} account={account} />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard web3={web3} account={account} />} />
        <Route path="/patient-dashboard" element={<PatientDashboard web3={web3} account={account} />} />
        <Route path="/login" element={<LoginPage web3={web3} account={account}/>} /> {/* Add the login page route */}
        <Route path="/records-list" element={<RecordsList web3={web3} account={account} />} />
      </Routes>
    </Router>
  );
};

export default App;
