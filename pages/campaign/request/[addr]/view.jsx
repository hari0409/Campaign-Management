import React, { useState, useEffect, Suspense } from "react";
import Layout from "../../../../Components/Layout";
import web3 from "../../../../ethereum/web3";
import { Button, Icon, Message } from "semantic-ui-react";
import compiledCampaign from "../../../../ethereum/build/Campaign.json";
import Requests from "../../../../Components/Requests";
import { useRouter } from "next/router";

function ViewRequests({ addr }) {
  const [valid, setValid] = useState(false);
  const [campaign, setCampaign] = useState({});
  const [loading, setLoading] = useState(true);
  const [userAddr, setUserAddr] = useState("");
  const [manager, setManager] = useState(false);
  const [errors, setErrors] = useState([
    "You are not a contributer to this campaign.",
    "Contribute & become a member to partispate in this voting",
  ]);

  const router = useRouter();

  const checkValidity = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      if (accounts[0]) {
        const camp = await new web3.eth.Contract(
          JSON.parse(compiledCampaign.interface),
          addr
        );
        setUserAddr(accounts[0]);
        const stats = await camp.methods.approvers(accounts[0]).call();
        stats ? setValid(true) : setValid(false);
        setCampaign(camp);
        const manager = await camp.methods.manager().call();
        manager === accounts[0] ? setManager(true) : setManager(false);
      } else {
        setErrors((errors) => {
          if (errors?.length < 3) {
            return [...errors, "Please connect to your wallet"];
          }
        });
      }
      setLoading(false);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    checkValidity();
  }, []);

  return (
    <Layout>
      {!loading ? (
        <>
          <Icon
            name="arrow left"
            onClick={() => {
              router.replace(`/campaign/${addr}`);
            }}
            style={{ cursor: "pointer" }}
          />
          <h2>View Requests</h2>
          {!valid ? (
            <>
              <Message error header="Invalid Access Request" list={errors} />
            </>
          ) : null}
          <Button
            onClick={() => {
              router.replace(`/campaign/request/${addr}`);
            }}
            floated="right"
            color="yellow"
            style={{ marginBottom: "10px" }}
          >
            Create New Request
          </Button>
          <Suspense
            fallback={
              <>
                <h2>Loading....</h2>
              </>
            }
          >
            {campaign && (
              <Requests
                valid={valid}
                campaign={campaign}
                manager={manager}
                userAddr={userAddr}
              />
            )}
          </Suspense>
        </>
      ) : (
        <>
          <h1>Loading</h1>
        </>
      )}
    </Layout>
  );
}

export default ViewRequests;

export async function getServerSideProps(context) {
  const { addr } = context.query;
  return {
    props: { addr },
  };
}
