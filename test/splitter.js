var Splitter = artifacts.require('./Splitter.sol');
const Promise = require('bluebird');
Promise.promisifyAll(web3.eth, { suffix: "Promise" });

contract('Splitter', function(accounts) {
  var splitter;
  const alice = accounts[0];
  const bob = accounts[1];
  const carol = accounts[2];

  beforeEach("deploy a Splitter", function() {
      return Splitter.new({ from: alice })
          .then(_splitter => splitter = _splitter);
  });

  //Could look to use Promise.all here
  it("should split amount evenly between 2 accounts", function() {
    var bobBalance, carolBalance;
    const toSplit = 1000;
    const afterSplit = 500;
    return web3.eth.getBalancePromise(bob)
      .then(balance => bobBalance = balance.toNumber())
      .then(() => web3.eth.getBalancePromise(carol))
      .then(balance => carolBalance = balance.toNumber())
      .then(() => splitter.split.call(bob, carol, {from: alice, value: toSplit}))
      .then(result => web3.eth.getBalancePromise(bob))
      .then(newBalance => assert.equal(newBalance.toNumber(), bobBalance + afterSplit, "message"));
  });
});
