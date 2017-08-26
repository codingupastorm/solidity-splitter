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
      .then(carolBalance => assert.equal(carolBalance, afterSplit));
  });

  it("should split odd amount correctly", function() {
    const toSplit = 3;
    const afterSplit = 1;
    return splitter.split(bob, carol, {from: alice, value: toSplit})
      .then(result => splitter.balances.call(bob))
      .then(bobBalance => assert.equal(bobBalance, afterSplit))
      .then(() => splitter.balances.call(carol))
      .then(carolBalance => assert.equal(carolBalance, afterSplit))
      .then(() => splitter.balances.call(alice))
      .then(aliceBalance => assert.equal(aliceBalance, 1));
  });

  it("should withdraw correctly", function() {
    const toSplit = 1000;
    const afterSplit = 500;
    return splitter.split(bob, carol, {from: alice, value: toSplit})
      .then(result => splitter.withdraw({from: bob})
      .then(result => assert.isTrue(result));
      //need to get the gas cost here and remove it from balance and add the split amount
  });

  it("should fail on amount too small", function() {
    const toSplit = 1;
    //test how this reacts
    return splitter.split(bob, carol, {from: alice, value: toSplit})
  });

});
