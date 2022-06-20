import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Card, Button, Segment } from "semantic-ui-react";
import Layout from "../Components/Layout";
import factory from "../ethereum/Campaignfactory";

function Index({ campaigns }) {
  const [campaignsList, setCampaignsList] = useState();

  useEffect(() => {
    if (campaigns) {
      const items = campaigns.map((addr) => {
        return {
          header: addr,
          description: <Link href={`/campaign/${addr}`}>View More</Link>,
          fluid: true,
        };
      });
      setCampaignsList(items);
    }
  }, []);

  return (
    <>
      <Layout>
        <h3>Open Campaigns</h3>
        <Button
          content="Create Campaign"
          icon="add square"
          labelPosition="left"
          primary
          floated="right"
          href="/campaign/new"
        />
        <Card.Group items={campaignsList} style={{ cursor: "pointer" }} />
      </Layout>
    </>
  );
}

export default Index;

export const getServerSideProps = async () => {
  const campaigns = await factory.methods.getDeployedCampaigns().call();
  return { props: { campaigns } };
};
