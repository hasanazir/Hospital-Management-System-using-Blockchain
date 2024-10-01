const HospitalAndHealthcareProfessionalManagement = artifacts.require("HospitalAndHealthcareProfessionalManagement");
const PatientManagementAndNominee = artifacts.require("PatientManagementAndNominee");
const DataStandardizationAndInteroperabilityHub = artifacts.require("DataStandardizationAndInteroperabilityHub");
const MedicalRecordManagementAndSecurity = artifacts.require("MedicalRecordManagementAndSecurity");
const AuditTrailAndDataAuditor = artifacts.require("AuditTrailAndDataAuditor");

module.exports = function (deployer) {
    deployer.deploy(HospitalAndHealthcareProfessionalManagement, { gas: 5000000 });
    deployer.deploy(PatientManagementAndNominee, { gas: 5000000 });
    deployer.deploy(DataStandardizationAndInteroperabilityHub, { gas: 5000000 });
    // deployer.deploy(MedicalRecordManagementAndSecurity, { gas: 5000000 });
    // deployer.deploy(AuditTrailAndDataAuditor, { gas: 5000000 });
};
