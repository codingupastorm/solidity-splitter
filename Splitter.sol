pragma solidity ^0.4.6;

contract Splitter {
    address public sender;
    address[] public receivers; // could add more users
    bool active;

    function Splitter(address ethSender, address[] ethReceivers){
        sender = ethSender;
        receivers = ethReceivers;
        active = true;
    }

    function getContractBalance() constant returns (uint) {
        if (!active) throw;
        return this.balance;
    }

    function() payable {
        if (!active) throw;
        if (msg.sender == sender){
            for(uint i =0; i < receivers.length; i++){
                receivers[i].send(msg.value/receivers.length);
            }
        }
    }

    function kill(){
        if (msg.sender != sender) throw;
        active = false;
    }
}
