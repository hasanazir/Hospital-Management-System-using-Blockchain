// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HospitalAndHealthcareProfessionalManagement {
    
    struct Hospital {
        uint256 id;
        string name;
        string location;
    }

    struct HealthcareProfessional {
        uint256 id;
        string name;
        string specialty;
        uint256 hospitalId;
    }

    mapping(uint256 => Hospital) public hospitals;
    mapping(uint256 => HealthcareProfessional) public healthcareProfessionals;
    uint256 public hospitalCount;
    uint256 public healthcareProfessionalCount;

    event HospitalRegistered(uint256 id, string name, string location);
    event HealthcareProfessionalRegistered(uint256 id, string name, string specialty, uint256 hospitalId);

    // Constructor to initialize the contract state
    constructor() {
        // You can initialize any state variables here if needed.
        hospitalCount = 0;
        healthcareProfessionalCount = 0;
    }

    function registerHospital(string memory _name, string memory _location) public {
        hospitalCount++;
        hospitals[hospitalCount] = Hospital(hospitalCount, _name, _location);
        emit HospitalRegistered(hospitalCount, _name, _location);
    }

    function registerHealthcareProfessional(
        string memory _name,
        string memory _specialty,
        uint256 _hospitalId
    ) public {
        require(_hospitalId > 0 && _hospitalId <= hospitalCount, "Hospital does not exist.");
        healthcareProfessionalCount++;
        healthcareProfessionals[healthcareProfessionalCount] = HealthcareProfessional(
            healthcareProfessionalCount,
            _name,
            _specialty,
            _hospitalId
        );
        emit HealthcareProfessionalRegistered(healthcareProfessionalCount, _name, _specialty, _hospitalId);
    }

    function getHospital(uint256 _hospitalId) public view returns (Hospital memory) {
        return hospitals[_hospitalId];
    }

    function getHealthcareProfessional(uint256 _professionalId) public view returns (HealthcareProfessional memory) {
        return healthcareProfessionals[_professionalId];
    }
}
