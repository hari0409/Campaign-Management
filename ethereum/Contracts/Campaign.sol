pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint256 minimum, string name)
        public
        returns (address)
    {
        address newCampaign = new Campaign(minimum, msg.sender, name);
        deployedCampaigns.push(newCampaign);
        return newCampaign;
    }

    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint256 value;
        address recipient;
        bool complete;
        uint256 approvalCount;
        mapping(address => bool) approvals;
    }

    Request[] public requests;
    address public manager;
    uint256 public minimumContribution;
    mapping(address => bool) public approvers;
    uint256 public approversCount;
    string name;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function Campaign(
        uint256 minimum,
        address creator,
        string nam
    ) public {
        manager = creator;
        minimumContribution = minimum;
        name = nam;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        if (approvers[msg.sender]) {} else {
            approvers[msg.sender] = true;
            approversCount++;
        }
    }

    function createRequest(
        string description,
        uint256 value,
        address recipient
    ) public restricted {
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });

        requests.push(newRequest);
    }

    function approveRequest(uint256 index) public {
        Request storage request = requests[index];
        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);
        request.approvals[msg.sender] = true; 
        request.approvalCount++;
    }

    function finalizeRequest(uint256 index) public restricted {
        Request storage request = requests[index];

        require(request.approvalCount > (approversCount / 2));
        require(!request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary()
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            address,
            string
        )
    {
        return (
            this.balance,
            minimumContribution,
            requests.length,
            approversCount,
            manager,
            name
        );
    }

    function getRequestCount() public view returns (uint256) {
        return requests.length;
    }
}
