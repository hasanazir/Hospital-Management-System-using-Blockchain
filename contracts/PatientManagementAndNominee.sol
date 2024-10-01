// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PatientManagementAndNominee {
    struct Patient {
        uint256 id;
        string name;
        address nominee; // Nominee can be set to address(0) to indicate no nominee
        bytes32 publicId;
    }

    mapping(uint256 => Patient) public patients;
    mapping(bytes32 => uint256) public publicIdToPatientId;
    uint256 public patientCount;

    event PatientRegistered(uint256 id, string name, address nominee, bytes32 publicId);
    event NomineeUpdated(uint256 patientId, address newNominee);

    // Register patient with an optional nominee
    function registerPatient(string memory _name, address _nominee) public {
        require(bytes(_name).length > 0, "Patient name cannot be empty."); // Ensure name is not empty
        
        patientCount++;
        bytes32 publicId = keccak256(abi.encodePacked(_name, patientCount));
        
        // Create the patient, nominee can be address(0) if not provided
        patients[patientCount] = Patient(patientCount, _name, _nominee, publicId);
        publicIdToPatientId[publicId] = patientCount;
        
        emit PatientRegistered(patientCount, _name, _nominee, publicId);
    }

    // Update the nominee for an existing patient
    function updateNominee(uint256 _patientId, address _newNominee) public {
        require(patients[_patientId].id != 0, "Patient does not exist.");
        patients[_patientId].nominee = _newNominee;
        emit NomineeUpdated(_patientId, _newNominee);
    }

    // Get patient details by public ID
    function getPatientByPublicId(bytes32 _publicId) public view returns (Patient memory) {
        uint256 patientId = publicIdToPatientId[_publicId];
        require(patientId != 0, "Patient not found.");
        return patients[patientId];
    }
}
