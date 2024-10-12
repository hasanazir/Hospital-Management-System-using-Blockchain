const fs = require('fs');
const path = require('path');

const HospitalManagement = artifacts.require("HospitalManagement");
const HealthcareProfessionalManagement = artifacts.require("HealthcareProfessionalManagement");
const PatientManagementAndNominee = artifacts.require("PatientManagementAndNominee");
const DataStandardizationAndInteroperability= artifacts.require("DataStandardizationAndInteroperability");
const DoctorRecordManagement= artifacts.require("DoctorRecordManagement");

module.exports = async function (deployer) {
    await deployer.deploy(HospitalManagement, { gas: 5000000 });
    const hospitalManagement = await HospitalManagement.deployed();

    // Get the deployed address of the HospitalManagement contract
    const hospitalContractAddress = hospitalManagement.address;

    // Deploy the HealthcareProfessionalManagement contract and pass the hospitalContractAddress
    await deployer.deploy(HealthcareProfessionalManagement, hospitalContractAddress, { gas: 5000000 });
    const healthcareProfessionalManagement = await HealthcareProfessionalManagement.deployed();
    const healthcareProfessionalManagementAddress = healthcareProfessionalManagement.address;

    // Deploy the PatientManagementAndNominee contract
    await deployer.deploy(PatientManagementAndNominee, { gas: 5000000 });
    const patientManagementAndNominee = await PatientManagementAndNominee.deployed();
    const patientManagementAndNomineeAddress = patientManagementAndNominee.address;

    await deployer.deploy(DataStandardizationAndInteroperability, { gas: 5000000 });
    const dataStandardizationAndInteroperability = await DataStandardizationAndInteroperability.deployed();
    const dataStandardizationAndInteroperabilityAddress = dataStandardizationAndInteroperability.address;

    await deployer.deploy(DoctorRecordManagement, { gas: 5000000 });
    const doctorRecordManagement = await DoctorRecordManagement.deployed();
    const doctorRecordManagementAddress = doctorRecordManagement.address;

    // Prepare the addresses object
    const addresses = {
        HospitalManagement: hospitalContractAddress,
        HealthcareProfessionalManagement: healthcareProfessionalManagementAddress,
        PatientManagementAndNominee: patientManagementAndNomineeAddress,
        DataStandardizationAndInteroperability: dataStandardizationAndInteroperabilityAddress,
        DoctorRecordManagement: doctorRecordManagementAddress
    };

    // Write addresses to the addresses.json file
    const filePath = path.resolve(__dirname, '../client/src/contracts/addresses.json'); // Adjusted path

    fs.writeFileSync(filePath, JSON.stringify(addresses, null, 2), 'utf8');
};
