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
        bool nomineeConfirmed;    // Confirmation status of nominee
        bytes32[] securityQuestions;  // Array of hashed security questions for nominee access
        bytes32[] securityAnswers;    // Array of hashed security answers for nominee access
    }

    struct NomineeRequest {
        uint256 patientId;
        address nomineeAddress;
        bool isPending;
    }

    mapping(uint256 => Patient) public patients;               // Mapping from patient ID to Patient struct
    mapping(bytes32 => uint256) public publicIdToPatientId;    // Mapping from public ID to patient ID
    mapping(address => NomineeRequest) public nomineeRequests; // Mapping from nominee address to their pending request
    mapping(uint256 => address[]) public patientNominees;      // Mapping from patient ID to their nominees
    uint256 public patientCount;                               // Counter for patients

    event PatientRegistered(uint256 id, string name, string contact, string patientAddress, address nominee, bytes32 publicId);
    event NomineeRequestSent(uint256 patientId, address nominee);
    event NomineeRequestAccepted(uint256 patientId, address nominee);
    event NomineeRequestRejected(uint256 patientId, address nominee);
    event NomineeCanceled(uint256 patientId, address nominee);
    event LoginSuccess(uint256 patientId, bytes32 publicId);

    // Register patient with optional nominee and additional details
    function registerPatient(
        string memory _name,
        string memory _contact,
        string memory _patientAddress,
        string memory _password,
        bytes32[] memory _securityQuestions,
        bytes32[] memory _securityAnswers
    ) public {
        require(bytes(_name).length > 0, "Patient name cannot be empty.");
        require(bytes(_contact).length > 0, "Contact cannot be empty.");
        require(bytes(_patientAddress).length > 0, "Address cannot be empty.");
        require(bytes(_password).length > 0, "Password cannot be empty.");
        require(_securityQuestions.length > 0, "At least one security question is required.");
        require(_securityQuestions.length == _securityAnswers.length, "Security questions and answers must match in length.");
        
        patientCount++;
        bytes32 publicId = keccak256(abi.encodePacked(_name, patientCount)); // Generate unique public ID

        // Ensure public ID is unique
        require(publicIdToPatientId[publicId] == 0, "Public ID already exists.");

        // Create the patient with nominee set to address(0) initially (no nominee)
        patients[patientCount] = Patient(
            patientCount, 
            _name, 
            _contact, 
            _patientAddress, 
            address(0), 
            publicId, 
            _password, 
            false, 
            _securityQuestions, 
            _securityAnswers
        );
        publicIdToPatientId[publicId] = patientCount;
        
        emit PatientRegistered(patientCount, _name, _contact, _patientAddress, address(0), publicId);
    }

    // Send a nominee request (patient initiates the request)
    function updateNominee(uint256 _patientId, address _newNominee) public {
        require(patients[_patientId].id != 0, "Patient does not exist.");
        require(_newNominee != address(0), "Nominee address cannot be zero.");
        require(patients[_patientId].nominee == address(0), "Nominee already assigned. Revoke the current nominee first.");

        // Create a pending nominee request
        nomineeRequests[_newNominee] = NomineeRequest(_patientId, _newNominee, true);
        emit NomineeRequestSent(_patientId, _newNominee);
    }

    // Nominee accepts the request
    function acceptNomineeRequest(bytes32[] memory _providedAnswers) public {
        NomineeRequest storage request = nomineeRequests[msg.sender];
        require(request.isPending, "No pending nominee request.");

        Patient storage patient = patients[request.patientId];
        require(verifySecurityQuestions(patient.id, _providedAnswers), "Security questions verification failed.");

        patient.nominee = msg.sender;
        patient.nomineeConfirmed = true;

        // Add nominee to patient's nominee list
        patientNominees[request.patientId].push(msg.sender);

        // Clear the pending request
        request.isPending = false;

        emit NomineeRequestAccepted(request.patientId, msg.sender);
    }

    // Nominee rejects the request
    function rejectNomineeRequest() public {
        NomineeRequest storage request = nomineeRequests[msg.sender];
        require(request.isPending, "No pending nominee request.");

        // Clear the pending request
        request.isPending = false;

        emit NomineeRequestRejected(request.patientId, msg.sender);
    }

    // Cancel nominee (done by the patient)
    function cancelNominee(uint256 _patientId) public {
        require(patients[_patientId].id != 0, "Patient does not exist.");
        require(patients[_patientId].nominee != address(0), "No nominee assigned.");
        
        address oldNominee = patients[_patientId].nominee;
        patients[_patientId].nominee = address(0);
        patients[_patientId].nomineeConfirmed = false;

        emit NomineeCanceled(_patientId, oldNominee);
    }

    // Get nominees for a patient
    function getNomineesCount(uint256 _patientId) public view returns (uint256) {
        require(patients[_patientId].id != 0, "Patient does not exist.");
        return patientNominees[_patientId].length;
    }

    function nominees(uint256 _patientId, uint256 index) public view returns (address) {
        require(patients[_patientId].id != 0, "Patient does not exist.");
        require(index < patientNominees[_patientId].length, "Index out of bounds.");
        return patientNominees[_patientId][index];
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

        emit LoginSuccess(patientId, _publicId);
        return patientId;
    }

    // Verify nominee (to check the nominee for a patient)
    function verifyNominee(uint256 _patientId) public view returns (address) {
        require(patients[_patientId].id != 0, "Patient does not exist.");
        require(patients[_patientId].nomineeConfirmed, "Nominee not confirmed.");
        return patients[_patientId].nominee;
    }

    // Verify security questions (nominee answers for accessing the patient's data)
    function verifySecurityQuestions(uint256 _patientId, bytes32[] memory _providedAnswers) internal view returns (bool) {
        Patient storage patient = patients[_patientId];
        require(_providedAnswers.length == patient.securityQuestions.length, "Mismatch in number of security questions.");

        for (uint256 i = 0; i < _providedAnswers.length; i++) {
            if (_providedAnswers[i] != patient.securityAnswers[i]) {
                return false;
            }
        }
        return true;
    }

    // Nominee can access patient’s data if they answer security questions correctly
    function nomineeAccessData(uint256 _patientId, bytes32[] memory _providedAnswers) public view returns (bool) {
        Patient storage patient = patients[_patientId];
        require(patient.nominee == msg.sender, "Only the nominee can access the data.");
        require(verifySecurityQuestions(_patientId, _providedAnswers), "Security questions verification failed.");
        
        // Nominee can now access the patient’s data (placeholder for data retrieval logic)
        return true;
    }
}
