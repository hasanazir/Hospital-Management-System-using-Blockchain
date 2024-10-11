// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PatientManagementAndNominee {
    struct Patient {
        uint256 id;               // Auto-generated ID for the patient
        string name;              // Patient's name
        string contact;           // Patient's contact number
        string patientAddress;    // Patient's address
        address nominee;          // Nominee's address (can be address(0) if not provided)
        bytes32 publicId;         // Public ID for the patient
        string password;          // Patient's password for login
    }

    mapping(uint256 => Patient) public patients;               // Mapping from patient ID to Patient struct
    mapping(bytes32 => uint256) public publicIdToPatientId;    // Mapping from public ID to patient ID
    uint256 public patientCount;                               // Counter for patients

    event PatientRegistered(uint256 id, string name, string contact, string patientAddress, address nominee, bytes32 publicId);
    event NomineeUpdated(uint256 patientId, address newNominee);
    event LoginSuccess(uint256 patientId, bytes32 publicId);

    // Register patient with optional nominee and additional details
    function registerPatient(
        string memory _name,
        string memory _contact,
        string memory _patientAddress,
        string memory _password // New parameter for password
    ) public {
        require(bytes(_name).length > 0, "Patient name cannot be empty.");     // Ensure name is not empty
        require(bytes(_contact).length > 0, "Contact cannot be empty.");       // Ensure contact is not empty
        require(bytes(_patientAddress).length > 0, "Address cannot be empty.");  // Ensure address is not empty
        require(bytes(_password).length > 0, "Password cannot be empty.");     // Ensure password is not empty
        
        patientCount++;
        bytes32 publicId = keccak256(abi.encodePacked(_name, patientCount)); // Generate unique public ID

        // Ensure public ID is unique
        require(publicIdToPatientId[publicId] == 0, "Public ID already exists.");

        // Create the patient; nominee can be address(0) initially (no nominee)
        patients[patientCount] = Patient(patientCount, _name, _contact, _patientAddress, address(0), publicId, _password);
        publicIdToPatientId[publicId] = patientCount;
        
        emit PatientRegistered(patientCount, _name, _contact, _patientAddress, address(0), publicId);
    }

    // Update the nominee for an existing patient
    function updateNominee(uint256 _patientId, address _newNominee) public {
        require(patients[_patientId].id != 0, "Patient does not exist.");
        patients[_patientId].nominee = _newNominee;
        emit NomineeUpdated(_patientId, _newNominee);
    }

    // Login function using public ID and password
    function loginPatient(bytes32 _publicId, string memory _password) public returns (uint256) {
        uint256 patientId = publicIdToPatientId[_publicId];
        require(patientId != 0, "Invalid public ID.");
        
        Patient storage patient = patients[patientId];
        require(
            keccak256(abi.encodePacked(patient.password)) == keccak256(abi.encodePacked(_password)),
            "Invalid password."
        );

        emit LoginSuccess(patientId, _publicId); // Emit successful login event
        return patientId;
    }

    // Function to verify nominee (could be called by the patient)
    function verifyNominee(uint256 _patientId) public returns (address) {
        require(patients[_patientId].id != 0, "Patient does not exist.");
        return patients[_patientId].nominee;
    }
}
