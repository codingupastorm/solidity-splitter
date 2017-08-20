var Splitter = artifacts.require("./Splitter.sol");

module.exports = function(deployer) {
  deployer.deploy(Splitter, ["0x0887a6d264eda2c3c821b68cade7bf63586f54d1", "0x40d56af3c2ad6b15a31c5b2e59a3f8e35b26e8fb"]);
};
