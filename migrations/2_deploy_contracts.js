var Splitter = artifacts.require("./Splitter.sol");

module.exports = function(deployer) {
  deployer.deploy(Splitter, [web3.eth.accounts[1], web3.eth.accounts[2]]);
};
