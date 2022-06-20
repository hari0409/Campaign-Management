const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("../ethereum/build/CampaignFactory.json");

const provider = new HDWalletProvider(
  "exit galaxy female pioneer small rural estate already guard portion friend reduce",
  "https://rinkeby.infura.io/v3/42b5dc962b7140409bdf3e7ce53a6877"
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log("Attempting to deploy from account", accounts[0]);
  const result = await new web3.eth.Contract(
    JSON.parse(compiledFactory.interface)
  )
    .deploy({ data: compiledFactory.bytecode })
    .send({
      from: accounts[0],
      gas: "1000000",
    });
  console.log("Contract deployed to", result.options.address);
  provider.engine.stop();
};
deploy();