const compiledfactory = require("./build/CampaignFactory.json");
import web3 from "./web3";

const instance = new web3.eth.Contract(
  JSON.parse(compiledfactory.interface),
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
);

export default instance;
