import React, { useState } from "react";
import Layout from "../../Components/Layout";
import { Form, Button, Input, Message } from "semantic-ui-react";
import factory from "../../ethereum/Campaignfactory";
import web3 from "../../ethereum/web3";
import { useRouter } from "next/router";

function New() {
  const [contribution, setContribution] = useState("");
  const [name, setName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [status, setStatus] = useState(false);
  const [createMsg, setCreateMsg] = useState("");

  const router = useRouter();

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      setStatus(true);
      setErrorMsg("");
      setCreateMsg(
        "Creating your campaign...\nThis usually takes a 15 to 30 seconds."
      );
      const accounts = await web3.eth.getAccounts();
      await factory.methods
        .createCampaign(web3.utils.toWei(contribution, "ether"), name)
        .send({
          from: accounts[0],
        })
        .then(() => {
          setCreateMsg("");
          alert("Campaign created successfully!\nRouting to home page.");
          router.replace("/");
        });
      setStatus(false);
    } catch (error) {
      setErrorMsg(error.message);
      setStatus(false);
      setCreateMsg("");
    }
  };

  return (
    <>
      <Layout>
        <h3>Create a campaign</h3>
        <Form
          error={Boolean(errorMsg)}
          success={Boolean(createMsg)}
          onSubmit={submitHandler}
        >
          <Form.Field>
            <label>Campaign Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="field required"
              required={true}
            />
            <label>Minimum Contribution</label>
            <Input
              label="ether"
              labelPosition="right"
              value={contribution}
              onChange={(e) => setContribution(e.target.value)}
              required={true}
            />
          </Form.Field>
          <Message error header="Ooops! An Error occurred" content={errorMsg} />
          {createMsg && (
            <>
              <Message success header="Success" content={createMsg} />
            </>
          )}
          <Button primary type="submit" loading={status}>
            Create Campaign!
          </Button>
        </Form>
      </Layout>
    </>
  );
}

export default New;
