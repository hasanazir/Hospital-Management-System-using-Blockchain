// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.0;

// import "./PatientManagementAndNominee.sol";

// contract MedicalRecordManagementAndSecurity {
//     struct MedicalRecord {
//         uint256 id;
//         uint256 patientId;
//         string medicalHistory;
//         string currentTreatment;
//         bool isShared;
//     }

//     PatientManagementAndNominee patientContract;
    
//     mapping(uint256 => MedicalRecord) public medicalRecords;
//     mapping(uint256 => uint256[]) public patientToRecords;
//     uint256 public recordCount;

//     event MedicalRecordAdded(uint256 id, uint256 patientId);
//     event MedicalRecordAccessed(uint256 recordId, address accessedBy);

//     constructor(address _patientContractAddress) {
//         patientContract = PatientManagementAndNominee(_patientContractAddress);
//     }

//     modifier onlyPatientOrNominee(uint256 _patientId, address _nominee) {
//         (, , address nominee,) = patientContract.patients(_patientId);
//         require(msg.sender == nominee || msg.sender == _nominee, "Unauthorized access.");
//         _;
//     }

//     function addMedicalRecord(uint256 _patientId, string memory _medicalHistory, string memory _currentTreatment) public {
//         recordCount++;
//         medicalRecords[recordCount] = MedicalRecord(recordCount, _patientId, _medicalHistory, _currentTreatment, false);
//         patientToRecords[_patientId].push(recordCount);
//         emit MedicalRecordAdded(recordCount, _patientId);
//     }

//     function viewMedicalRecord(uint256 _recordId, address _nominee) public onlyPatientOrNominee(medicalRecords[_recordId].patientId, _nominee) {
//         emit MedicalRecordAccessed(_recordId, msg.sender);
//     }

//     function shareMedicalRecord(uint256 _recordId) public {
//         require(medicalRecords[_recordId].id != 0, "Medical record does not exist.");
//         medicalRecords[_recordId].isShared = true;
//     }

//     function revokeSharedMedicalRecord(uint256 _recordId) public {
//         require(medicalRecords[_recordId].id != 0, "Medical record does not exist.");
//         medicalRecords[_recordId].isShared = false;
//     }
// }
