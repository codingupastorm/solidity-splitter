pragma solidity ^0.4.6;

contract Splitter {
    address public owner;
    mapping(address => uint) public balances;
    bool public isActive;

    event LogSplitSent(address indexed from, address add1, address add2, uint256 amount);
    event LogWithdrawal(address indexed caller, uint256 amount);
    event LogKilled();

    function Splitter(){
      owner = msg.sender;
      isActive = true;
    }

    function split(address address1, address address2) payable returns (bool){
      require(msg.value > 1);
      assert(address1 != address(0));
      assert(address2 != address(0));
      assert(isActive);
      balances[address1] += msg.value/2;
      balances[address2] += msg.value/2;
      if (msg.value % 2 > 0)
        balances[msg.sender] += 1;
      LogSplitSent(msg.sender, address1, address2, msg.value);
      return true;
    }

    function claim() payable returns (bool){
      require(balances[msg.sender] > 0);
      uint toSend = balances[msg.sender];
      balances[msg.sender] = 0;
      bool success = msg.sender.send(toSend);
      if (success){
        LogWithdrawal(msg.sender, toSend);
      } else {
        balances[msg.sender] = toSend;
      }
      return success;
    }

    function kill() returns (bool){
        require(msg.sender == owner);
        isActive = false;
        LogKilled();
        return true;
    }

    function() {
      throw;
    }
}
