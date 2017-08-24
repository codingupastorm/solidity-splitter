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

  it("should save ether between two accounts", function() {
    const toSplit = 1000;
    const afterSplit = 500;
    return splitter.split(bob, carol, {from: alice, value: toSplit})
      .then(result => splitter.balances.call(bob))
      .then(bobBalance => assert.equal(bobBalance, afterSplit))
      .then(() => splitter.balances.call(carol))
      .then(carolBalance => assert.equal(carolBalance, afterSplit));;
  });
  //
  // it("should split odd amount correctly", function() {
  //   var aliceBalance, bobBalance, carolBalance;
  //   const toSplit = 3;
  //   const afterSplit = 1;
  //   return web3.eth.getBalancePromise(alice)
  //     .then(balance => aliceBalance = balance.toNumber())
  //     .then(web3.eth.getBalancePromise(bob))
  //     .then(balance => bobBalance = balance.toNumber())
  //     .then(() => web3.eth.getBalancePromise(carol))
  //     .then(balance => carolBalance = balance.toNumber())
  //     .then(() => splitter.split.call(bob, carol, {from: alice, value: toSplit}))
  //     .then(result => web3.eth.getBalancePromise(bob))
  //     .then(newBalance => assert.equal(newBalance.toNumber(), bobBalance + afterSplit,
  //      "balance should have increased by half of split amount - 1."))
  //     .then(result => web3.eth.getBalancePromise(carol))
  //     .then(newBalance => assert.equal(newBalance.toNumber(), carolBalance + afterSplit,
  //      "balance should have increased by half of split amount - 1."))
  //     .then(result => web3.eth.getBalancePromise(alice))
  //     .then(newBalance => assert.equal(newBalance.toNumber(), aliceBalance + 1,
  //       "balance should have increased by remainder."));
  // });


});
