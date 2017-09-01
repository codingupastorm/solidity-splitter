var Splitter = artifacts.require('./Splitter.sol');
const Promise = require('bluebird');
Promise.promisifyAll(web3.eth, {suffix: "Promise"});


// Note that these tests rely on bob and carol not being miners.

contract('Splitter', function(accounts) {
  var splitter;
  const alice = accounts[0];
  const bob = accounts[1];
  const carol = accounts[2];

  beforeEach("deploy a Splitter", function() {
    return Splitter.new({from: alice}).then(_splitter => splitter = _splitter);
  });

  // it("should save ether between two accounts", function() {
  //   const toSplit = 1000;
  //   const afterSplit = 500;
  //   return splitter.split(bob, carol, {
  //     from: alice,
  //     value: toSplit
  //   }).then(result => splitter.balances.call(bob)).then(bobBalance => assert.equal(bobBalance, afterSplit)).then(() => splitter.balances.call(carol)).then(carolBalance => assert.equal(carolBalance, afterSplit));
  // });
  //
  // it("should split odd amount correctly", function() {
  //   const toSplit = 3;
  //   const afterSplit = 1;
  //   return splitter.split(bob, carol, {
  //     from: alice,
  //     value: toSplit
  //   }).then(result => splitter.balances.call(bob)).then(bobBalance => assert.equal(bobBalance, afterSplit)).then(() => splitter.balances.call(carol)).then(carolBalance => assert.equal(carolBalance, afterSplit)).then(() => splitter.balances.call(alice)).then(aliceBalance => assert.equal(aliceBalance, 1));
  // });
  //
  // it("should withdraw correctly", function() {
  //   const toSplit = 1000;
  //   const afterSplit = 500;
  //   const gasPrice = 10;
  //   var bobStartBalance,
  //     cost;
  //   return web3.eth.getBalancePromise(bob).then((bobBalance) => {
  //     bobStartBalance = bobBalance.toNumber();
  //     return splitter.split(bob, carol, {
  //       from: alice,
  //       value: toSplit
  //     });
  //   }).then(result => splitter.claim({from: bob, gasPrice: gasPrice})).then(tx => {
  //     cost = gasPrice * tx.receipt.gasUsed;
  //     return web3.eth.getBalancePromise(bob);
  //   }).then(bobFinalBalance => {
  //     assert.equal(bobStartBalance + afterSplit - cost, bobFinalBalance.toNumber());
  //   });
  // });

  it('should fail on amount too small', function() {
    const toSplit = 1;
    return expectedExceptionPromise(function(){
      return splitter.split(bob, carol, {from: alice,value: toSplit, gas: 3000000});
    }, 3000000);
  });

  // it("should fail on empty address", function() {
  //   const toSplit = 1000;
  //   return splitter.split(bob, "0x0", {
  //     from: alice,
  //     value: toSplit
  //   }).then(result => assert.fail("Should have thrown error.")).catch(() => assert(true)); // Again, need to check for out of gas error
  // });

});

// Found here https://gist.github.com/xavierlepretre/88682e871f4ad07be4534ae560692ee6
web3.eth.getTransactionReceiptMined = function (txnHash, interval) {
  var transactionReceiptAsync;
  interval = interval ? interval : 500;
  transactionReceiptAsync = function(txnHash, resolve, reject) {
    try {
      var receipt = web3.eth.getTransactionReceipt(txnHash);
      if (receipt == null) {
        setTimeout(function () {
          transactionReceiptAsync(txnHash, resolve, reject);
        }, interval);
      } else {
        resolve(receipt);
      }
    } catch(e) {
      reject(e);
    }
  };

  return new Promise(function (resolve, reject) {
      transactionReceiptAsync(txnHash, resolve, reject);
  });
};

// Found here https://gist.github.com/xavierlepretre/afab5a6ca65e0c52eaf902b50b807401
var getEventsPromise = function (myFilter, count) {
  return new Promise(function (resolve, reject) {
    count = count ? count : 1;
    var results = [];
    myFilter.watch(function (error, result) {
      if (error) {
        reject(error);
      } else {
        count--;
        results.push(result);
      }
      if (count <= 0) {
        resolve(results);
        myFilter.stopWatching();
      }
    });
  });
};

// Found here https://gist.github.com/xavierlepretre/d5583222fde52ddfbc58b7cfa0d2d0a9
var expectedExceptionPromise = function (action, gasToUse) {
  return new Promise(function (resolve, reject) {
      try {
        resolve(action());
      } catch(e) {
        reject(e);
      }
    })
    .then(function (txn) {
      console.log(txn);
      return web3.eth.getTransactionReceiptMined(txn);
    })
    .then(function (receipt) {
      // We are in Geth
      assert.equal(receipt.gasUsed, gasToUse, "should have used all the gas");
    })
    .catch(function (e) {
      if ((e + "").indexOf("invalid JUMP") > -1) {
        // We are in TestRPC
      } else {
        throw e;
      }
    });
};
