// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.10;

contract projectFundFactory {

    address[] public deployedprojectFund;

    function createProjectFund(uint minContrib) public {
        ProjectFund newProjectFund =  new ProjectFund(minContrib, msg.sender);
        deployedprojectFund.push(address(newProjectFund));
    }

    function getDeployedProjectFund() public view returns(address[] memory) {
        return deployedprojectFund;
    }

}

contract ProjectFund {

    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;

    uint numRequests;
    mapping(uint => Request) public requests;

    struct Request {

        string description;
        uint value;
        address recepientVendor;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;

    }

    uint public approvalCounter;

    modifier restrictedToManager(){
        require(msg.sender == manager);
        _;
    }

    constructor(uint minContri, address managerProject) {
        manager = managerProject;
        minimumContribution = minContri;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        approvalCounter++;
    }


    function createRequest(string memory description, 
        uint value, address recepient) public restrictedToManager {
        
            Request storage newRequest = requests[numRequests++];
            newRequest.description = description;
            newRequest.value = value;
            newRequest.recepientVendor = recepient;
            newRequest.approvalCount = 0;
    }

    function approveRequest(uint index) public {
        Request storage copyRequest = requests[index];
        require(approvers[msg.sender]);
        require(!requests[index].approvals[msg.sender]);
        copyRequest.approvals[msg.sender] = true;
        copyRequest.approvalCount++;
    }

    function finalizeRequest(uint index) public restrictedToManager {
        Request storage copyRequest = requests[index];
        require(!copyRequest.complete);
        require(copyRequest.approvalCount > (approvalCounter/2));
        payable(copyRequest.recepientVendor).transfer(copyRequest.value);
        copyRequest.complete = true;
    }

    function getSummary() public view returns(
        uint, uint, uint, uint, address
    ) {
        return (
            minimumContribution,
            numRequests,
            address(this).balance,
            approvalCounter,
            manager
        );
    }

    function getgetRequestsCount() public view returns(uint){
        return numRequests;
    }

}
