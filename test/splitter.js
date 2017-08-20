var Splitter = artifacts.require('./Splitter.sol');

contract('Splitter', function(accounts) {
  it("should split amount between 2 accounts", function() {
    const amountToSplit = 1000;
    const increaseAmount = 500;
    var initialBalance1 = web3.eth.getBalance(accounts[1]).toNumber();
    var initialBalance2 = web3.eth.getBalance(accounts[2]).toNumber();
    return Splitter.deployed().then(function(instance) {
      return instance.sendTransaction({from: accounts[0], value: amountToSplit});
    }).then(function(tx) {
      assert.equal(web3.eth.getBalance(accounts[1]).toNumber(), initialBalance1 + increaseAmount, "Account didn't increase by " + increaseAmount);
      assert.equal(web3.eth.getBalance(accounts[2]).toNumber(), initialBalance2 + increaseAmount, "Account didn't increase by " + increaseAmount);
    });
  });
});
