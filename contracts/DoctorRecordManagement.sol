// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./DataStandardizationAndInteroperability.sol"; // Import the standardization contract

contract DoctorRecordManagement {
    struct MedicalRecord {
        uint256 id;                       // Auto-generated ID for the record
        uint256 patientId;                // ID of the patient associated with the record
        string doctorName;                // Name of the doctor
        string diagnosis;                 // Diagnosis details
        string treatment;                 // Treatment details
        string prescription;              // Prescribed medication
        string notes;                     // Additional notes from the doctor
        string dateOfVisit;               // Date of the visit
        string[] allergies;               // List of allergies
        string[] medicalHistory;          // Patient's medical history
        bool isApproved;                  // Approval status from the patient
    }

    struct MedicalRecordRequest {
        uint256 requestId;                // ID for the record request
        uint256 patientId;                // ID of the patient for the request
        string doctorName;                // Name of the doctor requesting the record
        string diagnosis;                 // Diagnosis details
        string treatment;                 // Treatment details
        string prescription;              // Prescribed medication
        string notes;                     // Additional notes
        string dateOfVisit;               // Date of the visit
        string[] allergies;               // List of allergies
        string[] medicalHistory;          // Patient's medical history
        bool approved;                    // Track if the patient has approved the request
    }

    mapping(uint256 => MedicalRecordRequest) public medicalRecordRequests; // Mapping of request ID to record requests
    mapping(uint256 => MedicalRecord) public medicalRecords;               // Mapping from record ID to MedicalRecord struct
    mapping(uint256 => address) public recordOwners;                       // Mapping of record ID to the patient's address
    uint256 public requestCount;                                            // Counter for medical record requests
    uint256 public recordCount;                                             // Counter for stored medical records

    DataStandardizationAndInteroperability public standardizationContract; // Instance of the standardization contract

    event MedicalRecordRequested(uint256 requestId, uint256 patientId, string doctorName);
    event MedicalRecordAccepted(uint256 requestId);
    event MedicalRecordRevoked(uint256 requestId);
    event MedicalRecordShared(uint256 requestId, address recipient);

    constructor(address _standardizationContractAddress) {
        standardizationContract = DataStandardizationAndInteroperability(_standardizationContractAddress);
    }

    // Request to store a medical record for a patient
    function storeMedicalRecord(
        uint256 _patientId,
        string memory _doctorName,
        string memory _diagnosis,
        string memory _treatment,
        string memory _prescription,
        string memory _notes,
        string memory _dateOfVisit,
        string[] memory _allergies,
        string[] memory _medicalHistory
    ) public {
        requestCount++;
        medicalRecordRequests[requestCount] = MedicalRecordRequest(
            requestCount,
            _patientId,
            _doctorName,
            _diagnosis,
            _treatment,
            _prescription,
            _notes,
            _dateOfVisit,
            _allergies,
            _medicalHistory,
            false // Initially not approved
        );

        emit MedicalRecordRequested(requestCount, _patientId, _doctorName);
    }

    // Patient accepts the medical record request
    function acceptMedicalRecord(uint256 _requestId) public {
        MedicalRecordRequest storage request = medicalRecordRequests[_requestId];
        require(request.requestId != 0, "Request does not exist.");
        require(request.approved == false, "Request already accepted.");

        request.approved = true; // Mark request as approved
        recordCount++; // Increment record count
        medicalRecords[recordCount] = MedicalRecord(
            recordCount,
            request.patientId,
            request.doctorName,
            request.diagnosis,
            request.treatment,
            request.prescription,
            request.notes,
            request.dateOfVisit,
            request.allergies,
            request.medicalHistory,
            true // Mark the record as approved
        );

        // Create a standardized template upon acceptance
        standardizationContract.createStandardizedTemplate(
            request.patientId,
            request.diagnosis,
            request.treatment,
            request.dateOfVisit,
            request.allergies
        );

        emit MedicalRecordAccepted(_requestId);
    }

    // Function to share a record with another address
    function shareRecord(uint256 _requestId, address _recipient) public {
        require(medicalRecordRequests[_requestId].approved, "Record must be approved before sharing.");
        
        emit MedicalRecordShared(_requestId, _recipient);
        // Logic for sharing the record can be implemented here
    }

    // Function to revoke access of a medical record request
    function revokeAccess(uint256 _requestId) public {
        require(medicalRecordRequests[_requestId].requestId != 0, "Request does not exist.");
        
        delete medicalRecordRequests[_requestId]; // Remove the request from the mapping

        emit MedicalRecordRevoked(_requestId);
    }

    // Additional functions to view requests or records can be added as needed
}
