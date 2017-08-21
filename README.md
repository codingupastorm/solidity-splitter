# solidity-splitter

Ether is split among all designated receivers and anyone that would like to can join!

Still need to:
* Add unit tests for odd numbers (ensure that remainder is refunded correctly)
* Add unit tests for the adding and funding of extra users
* Handle fail cases for 'send' - especially in loops
* Test how high the gas costs will be for high amounts of receivers. Possibly implement a limit?
