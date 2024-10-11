// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./HospitalManagement.sol";

contract HealthcareProfessionalManagement {
    struct HealthcareProfessional {
        uint256 professionalId;    // Auto-generated ID for the healthcare professional
        string name;               // Name of the healthcare professional
        uint256 hospitalId;        // References hospitalId from HospitalManagement contract
        string gocDoctorId;        // The ID given by the government
        string password;           // Password for the healthcare professional
        bool isApproved;           // Tracks if the hospital has approved the registration
    }

    HospitalManagement public hospitalManagement; // Reference to the hospital management contract
    mapping(uint256 => HealthcareProfessional) public healthcareProfessionals; // Mapping from professional ID to HealthcareProfessional
    uint256 public professionalCount; // Counter for healthcare professionals

    event ProfessionalRegistered(uint256 professionalId, string name, uint256 hospitalId, string gocDoctorId);
    event ProfessionalApproved(uint256 professionalId);
    event LoginSuccess(uint256 professionalId, string gocDoctorId); // Correctly declare event

    constructor(address _hospitalContractAddress) {
        hospitalManagement = HospitalManagement(_hospitalContractAddress); // Link to the hospital contract
        professionalCount = 0; // Initialize count
    }

    // Function to register healthcare professional
    function registerProfessional(
        string memory _name,
        uint256 _hospitalId,
        string memory _gocDoctorId,
        string memory _password // New parameter for password
    ) public {
        require(hospitalManagement.getHospital(_hospitalId).hospitalId != 0, "Hospital does not exist."); // Ensure valid hospitalId
        professionalCount++; // Increment the count for a new professional
        healthcareProfessionals[professionalCount] = HealthcareProfessional(
            professionalCount,
            _name,
            _hospitalId,
            _gocDoctorId,
            _password, // Store the password
            false // Default to not approved
        );
        emit ProfessionalRegistered(professionalCount, _name, _hospitalId, _gocDoctorId); // Emit registration event
    }

    // Hospital approves the healthcare professional registration
    function approveProfessional(uint256 _professionalId) public {
        HealthcareProfessional storage professional = healthcareProfessionals[_professionalId];
        require(professional.professionalId != 0, "Healthcare professional does not exist."); // Ensure professional exists
        uint256 hospitalId = professional.hospitalId;
        require(hospitalManagement.getHospital(hospitalId).hospitalId != 0, "Invalid hospital."); // Check if hospital exists
        professional.isApproved = true; // Approve the professional
        emit ProfessionalApproved(_professionalId); // Emit approval event
    }

    // Function to get professional details
    function getProfessional(uint256 _professionalId) public view returns (HealthcareProfessional memory) {
        require(healthcareProfessionals[_professionalId].professionalId != 0, "Healthcare professional does not exist.");
        return healthcareProfessionals[_professionalId]; // Return the professional details
    }

    // Login function using gocDoctorId and password without view modifier
    function loginProfessional(string memory _gocDoctorId, string memory _password) public returns (uint256) {
        for (uint256 i = 1; i <= professionalCount; i++) {
            if (
                keccak256(abi.encodePacked(healthcareProfessionals[i].gocDoctorId)) == keccak256(abi.encodePacked(_gocDoctorId)) &&
                keccak256(abi.encodePacked(healthcareProfessionals[i].password)) == keccak256(abi.encodePacked(_password))
            ) {
                // Emit successful login event
                emit LoginSuccess(healthcareProfessionals[i].professionalId, _gocDoctorId);
                return healthcareProfessionals[i].professionalId;
            }
        }
        revert("Invalid credentials."); // Revert if login fails
    }
}
