import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import addresses from '../contracts/addresses.json';

const ManageNominee = ({ web3, account }) => {
    const [nominees, setNominees] = useState([]);
    const [nomineesCount, setNomineesCount] = useState(0);
    const [newNomineeAddress, setNewNomineeAddress] = useState('');

    useEffect(() => {
        const loadNominees = async () => {
            const networkId = await web3.eth.net.getId();
            const contractAddress = address[networkId].PatientManagementAndNominee; // Fetch contract address
            const contract = new web3.eth.Contract(PatientManagementAndNominee.abi, contractAddress);
            
            const count = await contract.methods.getNomineesCount().call({ from: account });
            setNomineesCount(count);

            const nomineeAddresses = [];
            for (let i = 0; i < count; i++) {
                const nominee = await contract.methods.nominees(account, i).call();
                nomineeAddresses.push(nominee);
            }
            setNominees(nomineeAddresses);
        };

        loadNominees();
    }, [web3, account]);

    const assignNominee = async () => {
        const networkId = await web3.eth.net.getId();
        const contractAddress = address[networkId].PatientManagementAndNominee;
        const contract = new web3.eth.Contract(PatientManagementAndNominee.abi, contractAddress);

        await contract.methods.updateNominee(account, newNomineeAddress).send({ from: account });
        setNewNomineeAddress('');
        // Reload nominees after assignment
        loadNominees();
    };

    const revokeNominee = async (nominee) => {
        const networkId = await web3.eth.net.getId();
        const contractAddress = address[networkId].PatientManagementAndNominee;
        const contract = new web3.eth.Contract(PatientManagementAndNominee.abi, contractAddress);

        await contract.methods.cancelNominee(account).send({ from: account });
        // Reload nominees after revocation
        loadNominees();
    };

    return (
        <div>
            <h1>Manage Nominee</h1>
            <input
                type="text"
                value={newNomineeAddress}
                onChange={(e) => setNewNomineeAddress(e.target.value)}
                placeholder="Enter nominee address"
            />
            <button onClick={assignNominee}>Assign Nominee</button>
            <h2>Assigned Nominees</h2>
            {nomineesCount > 0 ? (
                <ul>
                    {nominees.map((nominee, index) => (
                        <li key={index}>
                            {nominee}
                            <button onClick={() => revokeNominee(nominee)}>Revoke</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No nominees assigned.</p>
            )}
        </div>
    );
};

export default ManageNominee;
