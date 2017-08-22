pragma solidity ^0.4.6;

contract Splitter {
    address public owner;
    mapping(address => uint) public balances;
    bool isActive;

    function Splitter(){
      owner = msg.sender;
      isActive = true;
    }

    function split(address address1, address address2) payable returns (bool){
      require(msg.value > 1);
      assert(isActive);
      balances[address1] += msg.value/2;
      balances[address2] += msg.value/2;
      balances[msg.sender] += msg.value % 2;
      return true;
    }

    function claim() payable returns (bool){
      require(balances[msg.sender] > 0);
      return msg.sender.send(balances[msg.sender]);
    }

    function kill() returns (bool){
        require(msg.sender == owner);
        isActive = false;
        return true;
    }
}
