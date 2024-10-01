// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AuditTrailAndDataAuditor {
    struct AuditLog {
        uint256 id;
        uint256 recordId;
        address accessedBy;
        uint256 timestamp;
    }

    mapping(uint256 => AuditLog[]) public auditLogs;
    uint256 public auditLogCount;

    event AuditLogged(uint256 id, uint256 recordId, address accessedBy, uint256 timestamp);

    function logAccess(uint256 _recordId, address _accessedBy) public {
        auditLogCount++;
        auditLogs[_recordId].push(AuditLog(auditLogCount, _recordId, _accessedBy, block.timestamp));
        emit AuditLogged(auditLogCount, _recordId, _accessedBy, block.timestamp);
    }

    function getAuditLogs(uint256 _recordId) public view returns (AuditLog[] memory) {
        return auditLogs[_recordId];
    }
}
