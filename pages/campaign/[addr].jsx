import React, { useState, useEffect, Suspense } from "react";
import web3 from "../../ethereum/web3";
import { Card, Button, Grid, Message, Accordion } from "semantic-ui-react";
import Layout from "../../Components/Layout";
import compiledCampaign from "../../ethereum/build/Campaign.json";
import Contribute from "../../Components/Contribute";
import { useRouter } from "next/router";

function Campaign({ fdata, addr }) {
  const [contribution, setContribution] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [contributeMsg, setContributeMsg] = useState("");
  const [status, setStatus] = useState(false);
  const [userAddr, setuserAddr] = useState("");
  const [campaign, setCampaign] = useState({});
  const [contrib, setContrib] = useState(false);

  const router = useRouter();

  const renderItems = () => {
    const its = [
      {
        header: fdata.manager,
        description: "Manager",
        meta: "Address of the manager maintaing the campaign",
        fluid: true,
      },
      {
        header: fdata.minimumContribution,
        description: "Minimum Contribution (ether)",
        meta: "Minimum amount of ether required to contribute to be a member",
      },
      {
        header: web3.utils.fromWei(fdata.balance, "ether"),
        description: "Balance (ether)",
        meta: "Amount of ether contributed to the campaign",
      },
      {
        header: fdata.requestLength,
        description: "Number of Requests",
        meta: "Total number of requests made to the campaign",
      },
      {
        header: fdata.totalContributers,
        description: "Approvers",
        meta: "Number of People partispating in the campaign",
      },
    ];
    return <Card.Group items={its} />;
  };

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      setStatus(true);
      setErrorMsg("");
      setContributeMsg("Your transaction for contribution is pending...");
      await campaign.methods.contribute().send({
        from: userAddr,
        value: web3.utils.toWei(contribution, "ether"),
      });
      router.reload();
    } catch (error) {
      setStatus(false);
      setErrorMsg(error.message);
      setContributeMsg("");
    }
  };

  const setAddr = async () => {
    try {
      const account = await web3.eth.getAccounts();
      if (account[0]) {
        setuserAddr(account[0]);
        const camp = await new web3.eth.Contract(
          JSON.parse(compiledCampaign.interface),
          addr
        );
        setCampaign(camp);
        const res = await camp.methods.approvers(account[0]).call();
        setContrib(res);
      } else {
        alert("Please connect to your wallet");
      }
    } catch (error) {}
  };

  useEffect(() => {
    setAddr();
  }, []);

  return (
    <>
      <Layout>
        <h1>{fdata.name}</h1>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>{renderItems()}</Grid.Column>
            <Grid.Column width={6}>
              <h3>Contribute & become a member of this campaign</h3>
              <Contribute
                contribution={contribution}
                min={fdata.minimumContribution}
                submitHandler={submitHandler}
                setContribution={setContribution}
                errorMsg={errorMsg}
                contributeMsg={contributeMsg}
                status={status}
              />
              <Suspense
                fallback={
                  <>
                    <h4>Loading</h4>
                  </>
                }
              >
                {contrib && (
                  <Message
                    success
                    header="You are a member of this campaign but you can still contribute."
                  />
                )}
              </Suspense>

              {fdata.manager === userAddr ? (
                <>
                  <hr />
                  <h3>
                    Create a request for spening your donated ether for your
                    product by creating a request.
                  </h3>
                  <Button
                    primary
                    style={{ marginTop: "10px" }}
                    href={`request/${addr}`}
                    color="yellow"
                  >
                    Create a Request
                  </Button>
                </>
              ) : null}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={10}>
              <h3>Requests</h3>
              <span>
                View financial request created by the manager & approve them
              </span>
              <br />
              <span>
                <a href={`request/${addr}/view`}>View Request</a>
              </span>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    </>
  );
}

export default Campaign;

export async function getServerSideProps(context) {
  const { addr } = context.query;
  const camp = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    addr
  );
  const udata = await camp.methods.getSummary().call();
  let fdata = {
    balance: udata[0],
    minimumContribution: web3.utils.fromWei(udata[1], "ether"),
    requestLength: udata[2],
    totalContributers: udata[3],
    manager: udata[4],
    name: udata[5],
  };
  return {
    props: { fdata, addr },
  };
}
