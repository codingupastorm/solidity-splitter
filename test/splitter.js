var Splitter = artifacts.require('./Splitter.sol');

contract('Splitter', function(accounts) {
  var splitter;
  const alice = accounts[0];
  const bob = accounts[1];
  const carol = accounts[2];

  beforeEach("deploy a Splitter", function() {
      return Splitter.new({ from: alice })
          .then(_splitter => splitter = _splitter);
  });

  it("should split amount evenly between 2 accounts", function() {
    const toSplit = 1000;
    const afterSplit = 500;
    var bobBalance = web3.eth.getBalance(bob).toNumber();
    var carolBalance = web3.eth.getBalance(carol).toNumber();
    return Splitter.deployed().then(function(instance) {
      return instance.sendTransaction({from: alice, value: toSplit});
    }).then(function(tx) {
      assert.equal(web3.eth.getBalance(bob).toNumber(),
      bobBalance + afterSplit, "Balance didn't increase by " + afterSplit);
      assert.equal(web3.eth.getBalance(carol).toNumber(),
      carolBalance + afterSplit, "Balance didn't increase by " + afterSplit);
    });
  });
});
