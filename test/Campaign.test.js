const assert = require("assert");
const Web3 = require("web3");
const ganache = require("ganache-cli");
const compiledCampaign = require("../ethereum/build/Campaign.json");
const compiledFactory = require("../ethereum/build/CampaignFactory.json");

const provider = ganache.provider();
const web3 = new Web3(provider);

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({
      data: compiledFactory.bytecode,
    })
    .send({
      from: accounts[0],
      gas: "1000000",
    });
  await factory.methods.createCampaign("100","Testing").send({
    from: accounts[0],
    gas: "1000000",
  });
  const deployedCampaigns = await factory.methods.getDeployedCampaigns().call();
  campaignAddress = deployedCampaigns[0];
  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  );
});

describe("Campaigns", () => {
  it("deploys a factory & a campaigns", async () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });
  it("marks caller as the campaign manager", async () => {
    assert(accounts[0], campaign.methods.manager().call());
  });
  it("allows people to contribute money and marks them as approvers", async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: "200",
    });
    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    assert(isContributor);
  });
  it("requires a minimum contribution", async () => {
    try {
      await campaign.methods.contribute().send({
        from: accounts[1],
        value: "100",
      });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });
  it("allows a manager to make a payment request", async () => {
    await campaign.methods
      .createRequest("Buy batteries", "100", accounts[1])
      .send({
        from: accounts[0],
        gas: "1000000",
      });
    const request = await campaign.methods.requests(0).call();
    assert(request.description, "Buy batteries");
  });
  it("votes for a requests", async () => {
    await campaign.methods
      .createRequest("Buy batteries", "100", accounts[1])
      .send({
        from: accounts[0],
        gas: "1000000",
      });
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: "150",
    });
    await campaign.methods.approveRequest(0).send({
      from: accounts[1],
    });
    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
    });
    const request = await campaign.methods.requests(0).call();
    assert(request.complete, true);
  });
});
