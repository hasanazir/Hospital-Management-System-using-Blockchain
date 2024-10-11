// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DataStandardizationAndInteroperability {
    struct StandardizedRecord {
        uint256 recordId;               // ID of the standardized record
        string majorDiagnosis;           // Major diagnosis
        string treatment;                // Standardized treatment
        string dateOfVisit;              // Date of the visit
        string[] allergies;              // Standardized allergies
    }

    mapping(uint256 => StandardizedRecord) public standardizedRecords; // Mapping of standardized record ID to StandardizedRecord
    uint256 public standardizedRecordCount;                            // Counter for standardized records

    event StandardizedRecordCreated(uint256 recordId);

    // Function to create a standardized template from the actual medical record
    function createStandardizedTemplate(
        uint256 _patientId,
        string memory _majorDiagnosis,
        string memory _treatment,
        string memory _dateOfVisit,
        string[] memory _allergies
    ) public {
        standardizedRecordCount++;
        standardizedRecords[standardizedRecordCount] = StandardizedRecord(
            standardizedRecordCount,
            _majorDiagnosis,
            _treatment,
            _dateOfVisit,
            _allergies
        );

        emit StandardizedRecordCreated(standardizedRecordCount);
    }

    // Function to retrieve a standardized record for sharing
    function getStandardizedRecord(uint256 _recordId) public view returns (
        uint256,
        string memory,
        string memory,
        string[] memory
    ) {
        StandardizedRecord memory record = standardizedRecords[_recordId];
        require(record.recordId != 0, "Record does not exist.");

        return (
            record.recordId,
            record.majorDiagnosis,
            record.treatment,
            record.allergies
        );
    }
}
