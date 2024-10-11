// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HospitalManagement {
    struct Hospital {
        uint256 hospitalId;     // Auto-generated hospital ID
        string govHospitalId;   // Government-assigned hospital ID
        string name;            // Name of the hospital
        string addressInfo;     // Address of the hospital
        string contact;         // Contact information of the hospital
        string password;        // Password for login
    }

    mapping(uint256 => Hospital) public hospitals;
    uint256 public hospitalCount;

    event HospitalRegistered(uint256 hospitalId, string govHospitalId, string name, string addressInfo, string contact);
    event LoginSuccess(uint256 hospitalId, string govHospitalId);   // Event for successful login

    constructor() {
        hospitalCount = 0; // Initialize count
    }

    // Function to register hospital, with plain-text password
    function registerHospital(
        string memory _govHospitalId,
        string memory _name,
        string memory _addressInfo,
        string memory _contact,
        string memory _password   // New password field
    ) public {
        hospitalCount++;
        hospitals[hospitalCount] = Hospital(hospitalCount, _govHospitalId, _name, _addressInfo, _contact, _password);
        emit HospitalRegistered(hospitalCount, _govHospitalId, _name, _addressInfo, _contact);
    }

    // Function to login hospital with govHospitalId and password
    function loginHospital(string memory _govHospitalId, string memory _password) public returns (bool) {
        for (uint256 i = 1; i <= hospitalCount; i++) {
            if (
                keccak256(abi.encodePacked(hospitals[i].govHospitalId)) == keccak256(abi.encodePacked(_govHospitalId)) &&
                keccak256(abi.encodePacked(hospitals[i].password)) == keccak256(abi.encodePacked(_password))
            ) {
                // Emit the login success event with hospitalId and govHospitalId
                emit LoginSuccess(hospitals[i].hospitalId, _govHospitalId);
                return true;
            }
        }
        return false; // Return false if login fails
    }

    // Function to get hospital details
    function getHospital(uint256 _hospitalId) public view returns (Hospital memory) {
        require(hospitals[_hospitalId].hospitalId != 0, "Hospital does not exist.");
        return hospitals[_hospitalId];
    }
}
