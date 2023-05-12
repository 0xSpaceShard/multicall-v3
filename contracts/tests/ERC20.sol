// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Mock is ERC20 {
    constructor() ERC20("Mock ERC20", "MCK") {}

    function mint(address receiver, uint256 amount) external {
        _mint(receiver, amount);
    }
}
