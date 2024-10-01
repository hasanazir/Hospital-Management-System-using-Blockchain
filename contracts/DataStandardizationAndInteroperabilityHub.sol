// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DataStandardizationAndInteroperabilityHub {
    struct StandardizedData {
        uint256 id;
        uint256 hospitalId;
        uint256 patientId;
        string standardizedTemplate;
    }

    mapping(uint256 => StandardizedData) public standardizedData;
    uint256 public dataCount;

    event DataStandardized(uint256 id, uint256 hospitalId, uint256 patientId, string standardizedTemplate);
    event DataShared(uint256 id, uint256 fromHospitalId, uint256 toHospitalId);

    function standardizeData(
        uint256 _hospitalId,
        uint256 _patientId,
        string memory _template
    ) public {
        dataCount++;
        standardizedData[dataCount] = StandardizedData(dataCount, _hospitalId, _patientId, _template);
        emit DataStandardized(dataCount, _hospitalId, _patientId, _template);
    }

    function shareData(
        uint256 _dataId,
        uint256 _fromHospitalId,
        uint256 _toHospitalId
    ) public {
        require(standardizedData[_dataId].id != 0, "Data not found.");
        emit DataShared(_dataId, _fromHospitalId, _toHospitalId);
    }
}
