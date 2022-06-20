import React, { useEffect, useState } from "react";
import { Button, Table } from "semantic-ui-react";
import web3 from "../ethereum/web3";

function Requests({ valid, campaign, manager, userAddr }) {
  const [requests, setRequests] = useState([]);
  const [total, settotal] = useState(0);
  const [reqCount, setReqCount] = useState(0);
  const [currentOp2, setCurrentOp2] = useState(-1);
  const [currentOp, setCurrentOp] = useState(-1);

  const getRequests = async () => {
    try {
      const len = await campaign.methods.getRequestCount().call();
      const reqs = await Promise.all(
        Array(parseInt(len))
          .fill()
          .map(async (_, i) => {
            const request = await campaign.methods.requests(i).call();
            return request;
          })
      );
      setReqCount(len);
      const tot = await campaign.methods.approversCount().call();
      settotal(tot);
      setRequests(reqs);
    } catch (error) {
      alert(error.message);
    }
  };

  const onApprove = async (id) => {
    try {
      setCurrentOp(id);
      await campaign.methods.approveRequest(id).send({
        from: userAddr,
      });
      getRequests();
      setCurrentOp(-1);
    } catch (error) {
      alert(error.message);
      setCurrentOp(-1);
    }
  };

  const onFinalise = async (id) => {
    try {
      setCurrentOp2(id);
      await campaign.methods.finalizeRequest(id).send({
        from: userAddr,
      });
      getRequests();
      setCurrentOp2(-1);
    } catch (error) {
      alert(error.message);
      setCurrentOp2(-1);
    }
  };

  useEffect(() => {
    if (campaign.methods) {
      getRequests();
    }
  }, [campaign]);

  return (
    <>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Value (ether)</Table.HeaderCell>
            <Table.HeaderCell>Approved</Table.HeaderCell>
            <Table.HeaderCell>Vendor</Table.HeaderCell>
            {valid && <Table.HeaderCell>Approve Request</Table.HeaderCell>}
            {manager && <Table.HeaderCell>Finalise Request</Table.HeaderCell>}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {requests.map((request, index) => (
            <Table.Row disabled={request.complete} key={index}>
              <Table.Cell>{index + 1}</Table.Cell>
              <Table.Cell>{request.description}</Table.Cell>
              <Table.Cell>
                {web3.utils.fromWei(request.value, "ether")}
              </Table.Cell>
              <Table.Cell>
                {request.approvalCount}/{total}
              </Table.Cell>
              <Table.Cell>{request.recipient}</Table.Cell>
              {valid && !request.complete && (
                <Table.Cell>
                  <Button
                    onClick={() => {
                      onApprove(index);
                    }}
                    color="green"
                    loading={currentOp === index}
                  >
                    Approve
                  </Button>
                </Table.Cell>
              )}
              {manager && !request.complete && (
                <Table.Cell>
                  <Button
                    color="blue"
                    onClick={() => {
                      onFinalise(index);
                    }}
                    loading={currentOp2 === index}
                    disabled={request.approvalCount / total < 0.5}
                  >
                    Finalise
                  </Button>
                </Table.Cell>
              )}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <span>Found {reqCount} request</span>
    </>
  );
}

export default Requests;
