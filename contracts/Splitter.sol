pragma solidity ^0.4.6;

contract Splitter {
    address public sender;
    address[] public receivers;
    mapping(address => bool) receiverSearch;
    bool active;

    function Splitter(address[] ethReceivers){
        sender = msg.sender;
        receivers = ethReceivers;
        for(uint i = 0; i < ethReceivers.length; i++){
            receiverSearch[ethReceivers[i]] = true;
        }
        active = true;
    }

    function join(){
        if (!active) throw;
        if (msg.sender == sender) throw; //optional - whether to allow owner
        if (receiverSearch[msg.sender]) throw; //don't add same twice
        receiverSearch[msg.sender] = true;
        receivers.push(msg.sender);
    }

    function kill(){
        if (!active) throw;
        if (msg.sender != sender) throw;
        active = false;
    }

    // use default function so it works with only sendTransaction
    function() payable {
        if (!active) throw;
        if (msg.sender == sender){
            for(uint i =0; i < receivers.length; i++){
                receivers[i].send(msg.value/receivers.length);
            }
            sender.send(msg.value % receivers.length);
        }
    }
}
