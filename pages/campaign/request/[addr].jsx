import React, { useEffect, useState } from "react";
import Layout from "../../../Components/Layout";
import { useRouter } from "next/router";
import web3 from "../../../ethereum/web3";
import { Form, Button, Input, Message } from "semantic-ui-react";
import compiledCampaign from "../../../ethereum/build/Campaign.json";

function NewRequest({ addr }) {
  const router = useRouter();
  const [campaign, setCampaign] = useState({});
  const [desc, setDesc] = useState("");
  const [ether, setEther] = useState("");
  const [vendor, setVendor] = useState("");
  const [status, setStatus] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [userAddr, setUserAddr] = useState("");
  const [done, setDone] = useState(false);

  const verify = async () => {
    const accounts = await web3.eth.getAccounts();
    const camp = await new web3.eth.Contract(
      JSON.parse(compiledCampaign.interface),
      addr
    );
    const manager = await camp.methods.manager().call();
    if (accounts[0] === manager) {
      setCampaign(camp);
      setUserAddr(accounts[0]);
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (!verify()) {
      router.push("/");
    }
  }, []);

  const submitHandler = async () => {
    try {
      setStatus(true);
      setSuccessMsg("Creating a request...");
      setErrorMsg("");
      await campaign.methods
        .createRequest(desc, web3.utils.toWei(ether, "ether"), vendor)
        .send({
          from: userAddr,
        });
      setSuccessMsg("Request Created.");
      setStatus(false);
      setDone(true);
    } catch (error) {
      setStatus(false);
      setSuccessMsg("");
      setErrorMsg(error.message);
    }
  };

  return (
    <Layout>
      <Form
        error={Boolean(errorMsg)}
        success={Boolean(successMsg)}
        onSubmit={submitHandler}
      >
        <Form.Field>
          <label>Description of your Request</label>
          <Input
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            required={true}
          />
          <label>Ether Required</label>
          <Input
            label="ether"
            labelPosition="right"
            value={ether}
            onChange={(e) => setEther(e.target.value)}
            required={true}
          />
          <label>Vendor</label>
          <Input
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
            required={true}
          />
        </Form.Field>
        <Message error header="Ooops! An Error occurred" content={errorMsg} />
        {successMsg && (
          <>
            <Message success header="Success" content={successMsg} />
          </>
        )}

        {done ? (
          <Button
            primary
            href={`
            /campaign/${addr}
          `}
          >
            Go Home
          </Button>
        ) : (
          <Button primary type="submit" loading={status}>
            Create Request!
          </Button>
        )}
      </Form>
    </Layout>
  );
}

export default NewRequest;

export async function getServerSideProps(context) {
  const { addr } = context.query;
  return {
    props: { addr },
  };
}
