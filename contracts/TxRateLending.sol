// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./TxRateToken.sol";

contract TxRateLending is ReentrancyGuard, Ownable {
    TxRateToken public txrToken;
    
    struct Pool {
        IERC20 token;
        uint256 totalSupply;
        uint256 totalBorrow;
        uint256 supplyRate; // Annual rate in basis points (e.g., 850 = 8.5%)
        uint256 borrowRate; // Annual rate in basis points
        uint256 collateralFactor; // In basis points (e.g., 7500 = 75%)
        bool isActive;
    }
    
    struct UserPosition {
        uint256 supplied;
        uint256 borrowed;
        uint256 lastUpdateTime;
        uint256 accruedInterest;
    }
    
    mapping(address => Pool) public pools;
    mapping(address => mapping(address => UserPosition)) public userPositions; // user => token => position
    mapping(address => uint256) public userCollateralValue;
    
    address[] public supportedTokens;
    
    event Supply(address indexed user, address indexed token, uint256 amount);
    event Withdraw(address indexed user, address indexed token, uint256 amount);
    event Borrow(address indexed user, address indexed token, uint256 amount);
    event Repay(address indexed user, address indexed token, uint256 amount);
    
    constructor(address _txrToken) {
        txrToken = TxRateToken(_txrToken);
    }
    
    function addPool(
        address token,
        uint256 supplyRate,
        uint256 borrowRate,
        uint256 collateralFactor
    ) external onlyOwner {
        require(address(pools[token].token) == address(0), "Pool already exists");
        
        pools[token] = Pool({
            token: IERC20(token),
            totalSupply: 0,
            totalBorrow: 0,
            supplyRate: supplyRate,
            borrowRate: borrowRate,
            collateralFactor: collateralFactor,
            isActive: true
        });
        
        supportedTokens.push(token);
    }
    
    function supply(address token, uint256 amount) external nonReentrant {
        Pool storage pool = pools[token];
        require(pool.isActive, "Pool not active");
        require(amount > 0, "Amount must be greater than 0");
        
        // Update user position
        _updateUserPosition(msg.sender, token);
        
        // Transfer tokens
        pool.token.transferFrom(msg.sender, address(this), amount);
        
        // Update pool and user data
        pool.totalSupply += amount;
        userPositions[msg.sender][token].supplied += amount;
        
        // Update collateral value (simplified - in real implementation, use oracle)
        userCollateralValue[msg.sender] += amount;
        
        // Reward transaction
        txrToken.rewardTransaction(msg.sender);
        
        emit Supply(msg.sender, token, amount);
    }
    
    function withdraw(address token, uint256 amount) external nonReentrant {
        Pool storage pool = pools[token];
        UserPosition storage position = userPositions[msg.sender][token];
        
        require(position.supplied >= amount, "Insufficient supply balance");
        
        // Update user position
        _updateUserPosition(msg.sender, token);
        
        // Check if withdrawal maintains healthy collateral ratio
        uint256 newCollateralValue = userCollateralValue[msg.sender] - amount;
        require(_isHealthyPosition(msg.sender, newCollateralValue), "Would cause liquidation");
        
        // Update pool and user data
        pool.totalSupply -= amount;
        position.supplied -= amount;
        userCollateralValue[msg.sender] -= amount;
        
        // Transfer tokens
        pool.token.transfer(msg.sender, amount);
        
        // Reward transaction
        txrToken.rewardTransaction(msg.sender);
        
        emit Withdraw(msg.sender, token, amount);
    }
    
    function borrow(address token, uint256 amount) external nonReentrant {
        Pool storage pool = pools[token];
        require(pool.isActive, "Pool not active");
        require(pool.totalSupply >= pool.totalBorrow + amount, "Insufficient liquidity");
        
        // Update user position
        _updateUserPosition(msg.sender, token);
        
        // Check collateral
        uint256 borrowValue = amount; // Simplified - use oracle in real implementation
        require(_canBorrow(msg.sender, borrowValue), "Insufficient collateral");
        
        // Update pool and user data
        pool.totalBorrow += amount;
        userPositions[msg.sender][token].borrowed += amount;
        
        // Transfer tokens
        pool.token.transfer(msg.sender, amount);
        
        // Reward transaction
        txrToken.rewardTransaction(msg.sender);
        
        emit Borrow(msg.sender, token, amount);
    }
    
    function repay(address token, uint256 amount) external nonReentrant {
        Pool storage pool = pools[token];
        UserPosition storage position = userPositions[msg.sender][token];
        
        require(position.borrowed >= amount, "Repay amount exceeds debt");
        
        // Update user position
        _updateUserPosition(msg.sender, token);
        
        // Transfer tokens
        pool.token.transferFrom(msg.sender, address(this), amount);
        
        // Update pool and user data
        pool.totalBorrow -= amount;
        position.borrowed -= amount;
        
        // Reward transaction
        txrToken.rewardTransaction(msg.sender);
        
        emit Repay(msg.sender, token, amount);
    }
    
    function _updateUserPosition(address user, address token) internal {
        UserPosition storage position = userPositions[user][token];
        Pool storage pool = pools[token];
        
        if (position.lastUpdateTime == 0) {
            position.lastUpdateTime = block.timestamp;
            return;
        }
        
        uint256 timeElapsed = block.timestamp - position.lastUpdateTime;
        
        // Calculate interest (simplified calculation)
        if (position.borrowed > 0) {
            uint256 interest = (position.borrowed * pool.borrowRate * timeElapsed) / (365 days * 10000);
            position.accruedInterest += interest;
            position.borrowed += interest;
        }
        
        position.lastUpdateTime = block.timestamp;
    }
    
    function _canBorrow(address user, uint256 borrowValue) internal view returns (bool) {
        uint256 maxBorrow = (userCollateralValue[user] * 75) / 100; // 75% LTV
        uint256 currentBorrow = _getUserTotalBorrow(user);
        return currentBorrow + borrowValue <= maxBorrow;
    }
    
    function _isHealthyPosition(address user, uint256 newCollateralValue) internal view returns (bool) {
        uint256 currentBorrow = _getUserTotalBorrow(user);
        if (currentBorrow == 0) return true;
        
        uint256 maxBorrow = (newCollateralValue * 75) / 100;
        return currentBorrow <= maxBorrow;
    }
    
    function _getUserTotalBorrow(address user) internal view returns (uint256) {
        uint256 totalBorrow = 0;
        for (uint256 i = 0; i < supportedTokens.length; i++) {
            totalBorrow += userPositions[user][supportedTokens[i]].borrowed;
        }
        return totalBorrow;
    }
    
    function getUserPosition(address user, address token) external view returns (UserPosition memory) {
        return userPositions[user][token];
    }
    
    function getPoolInfo(address token) external view returns (Pool memory) {
        return pools[token];
    }
    
    function getSupportedTokens() external view returns (address[] memory) {
        return supportedTokens;
    }
}