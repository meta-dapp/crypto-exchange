// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import './WalletContract.sol';

contract GeneratorFactoryContract {

    address private immutable owner;
    event WalletGenerated(address wallet);

    constructor(){
        owner = msg.sender;
    }

    function generate() external {
        require(msg.sender == owner);
        address wallet = address(
                new WalletContract());
        emit WalletGenerated(wallet);
    }
}