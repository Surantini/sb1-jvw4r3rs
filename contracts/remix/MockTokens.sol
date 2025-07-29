// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockUSDT
 * @dev Mock USDT token untuk testing
 */
contract MockUSDT is ERC20, Ownable {
    constructor() ERC20("Mock USDT", "USDT") {
        _mint(msg.sender, 1000000 * 10**18); // 1 juta USDT
    }
    
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
    
    function decimals() public view virtual override returns (uint8) {
        return 18;
    }
}

/**
 * @title MockBTCB
 * @dev Mock BTCB token untuk testing
 */
contract MockBTCB is ERC20, Ownable {
    constructor() ERC20("Mock BTCB", "BTCB") {
        _mint(msg.sender, 10000 * 10**18); // 10 ribu BTCB
    }
    
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
    
    function decimals() public view virtual override returns (uint8) {
        return 18;
    }
}

/**
 * @title MockETH
 * @dev Mock ETH token untuk testing
 */
contract MockETH is ERC20, Ownable {
    constructor() ERC20("Mock ETH", "ETH") {
        _mint(msg.sender, 100000 * 10**18); // 100 ribu ETH
    }
    
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
    
    function decimals() public view virtual override returns (uint8) {
        return 18;
    }
}