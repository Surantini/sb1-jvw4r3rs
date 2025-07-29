// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface ITxRateToken {
    function rewardTransaction(address user) external;
}

/**
 * @title TxRateLending
 * @dev Platform lending dan borrowing dengan reward TxR
 * @author TxRate Team
 */
contract TxRateLending is ReentrancyGuard, Ownable {
    ITxRateToken public txrToken;
    
    struct Pool {
        IERC20 token;
        uint256 totalSupply;
        uint256 totalBorrow;
        uint256 supplyRate; // Annual rate dalam basis points (850 = 8.5%)
        uint256 borrowRate; // Annual rate dalam basis points
        uint256 collateralFactor; // Dalam basis points (7500 = 75%)
        bool isActive;
    }
    
    struct UserPosition {
        uint256 supplied;
        uint256 borrowed;
        uint256 lastUpdateTime;
        uint256 accruedInterest;
    }
    
    // Mappings
    mapping(address => Pool) public pools;
    mapping(address => mapping(address => UserPosition)) public userPositions; // user => token => position
    mapping(address => uint256) public userCollateralValue;
    
    address[] public supportedTokens;
    
    // Constants
    uint256 public constant LIQUIDATION_THRESHOLD = 8500; // 85%
    uint256 public constant LIQUIDATION_BONUS = 500; // 5%
    uint256 public constant BASIS_POINTS = 10000;
    
    // Events
    event Supply(address indexed user, address indexed token, uint256 amount);
    event Withdraw(address indexed user, address indexed token, uint256 amount);
    event Borrow(address indexed user, address indexed token, uint256 amount);
    event Repay(address indexed user, address indexed token, uint256 amount);
    event PoolAdded(address indexed token, uint256 supplyRate, uint256 borrowRate, uint256 collateralFactor);
    event PoolUpdated(address indexed token, uint256 supplyRate, uint256 borrowRate);
    event Liquidation(address indexed liquidator, address indexed borrower, address indexed token, uint256 amount);
    
    constructor(address _txrToken) {
        require(_txrToken != address(0), "Invalid TxR token address");
        txrToken = ITxRateToken(_txrToken);
    }
    
    /**
     * @dev Tambah pool baru
     * @param token Address token
     * @param supplyRate Supply APY dalam basis points
     * @param borrowRate Borrow APY dalam basis points
     * @param collateralFactor Collateral factor dalam basis points
     */
    function addPool(
        address token,
        uint256 supplyRate,
        uint256 borrowRate,
        uint256 collateralFactor
    ) external onlyOwner {
        require(token != address(0), "Invalid token address");
        require(address(pools[token].token) == address(0), "Pool already exists");
        require(collateralFactor <= BASIS_POINTS, "Invalid collateral factor");
        require(supplyRate <= 5000, "Supply rate too high"); // Max 50%
        require(borrowRate <= 10000, "Borrow rate too high"); // Max 100%
        
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
        
        emit PoolAdded(token, supplyRate, borrowRate, collateralFactor);
    }
    
    /**
     * @dev Update pool rates
     * @param token Address token
     * @param supplyRate Supply APY baru
     * @param borrowRate Borrow APY baru
     */
    function updatePoolRates(
        address token,
        uint256 supplyRate,
        uint256 borrowRate
    ) external onlyOwner {
        require(address(pools[token].token) != address(0), "Pool does not exist");
        require(supplyRate <= 5000, "Supply rate too high");
        require(borrowRate <= 10000, "Borrow rate too high");
        
        pools[token].supplyRate = supplyRate;
        pools[token].borrowRate = borrowRate;
        
        emit PoolUpdated(token, supplyRate, borrowRate);
    }
    
    /**
     * @dev Supply token ke pool
     * @param token Address token
     * @param amount Jumlah token
     */
    function supply(address token, uint256 amount) external nonReentrant {
        Pool storage pool = pools[token];
        require(pool.isActive, "Pool not active");
        require(amount > 0, "Amount must be greater than 0");
        
        // Update posisi user
        _updateUserPosition(msg.sender, token);
        
        // Transfer token
        pool.token.transferFrom(msg.sender, address(this), amount);
        
        // Update data pool dan user
        pool.totalSupply += amount;
        userPositions[msg.sender][token].supplied += amount;
        
        // Update nilai collateral (simplified - gunakan oracle di implementasi nyata)
        userCollateralValue[msg.sender] += amount;
        
        // Reward transaksi
        txrToken.rewardTransaction(msg.sender);
        
        emit Supply(msg.sender, token, amount);
    }
    
    /**
     * @dev Withdraw token dari pool
     * @param token Address token
     * @param amount Jumlah token
     */
    function withdraw(address token, uint256 amount) external nonReentrant {
        Pool storage pool = pools[token];
        UserPosition storage position = userPositions[msg.sender][token];
        
        require(position.supplied >= amount, "Insufficient supply balance");
        
        // Update posisi user
        _updateUserPosition(msg.sender, token);
        
        // Check apakah withdrawal tidak menyebabkan liquidation
        uint256 newCollateralValue = userCollateralValue[msg.sender] - amount;
        require(_isHealthyPosition(msg.sender, newCollateralValue), "Would cause liquidation");
        
        // Update data pool dan user
        pool.totalSupply -= amount;
        position.supplied -= amount;
        userCollateralValue[msg.sender] -= amount;
        
        // Transfer token
        pool.token.transfer(msg.sender, amount);
        
        // Reward transaksi
        txrToken.rewardTransaction(msg.sender);
        
        emit Withdraw(msg.sender, token, amount);
    }
    
    /**
     * @dev Borrow token dari pool
     * @param token Address token
     * @param amount Jumlah token
     */
    function borrow(address token, uint256 amount) external nonReentrant {
        Pool storage pool = pools[token];
        require(pool.isActive, "Pool not active");
        require(pool.totalSupply >= pool.totalBorrow + amount, "Insufficient liquidity");
        require(amount > 0, "Amount must be greater than 0");
        
        // Update posisi user
        _updateUserPosition(msg.sender, token);
        
        // Check collateral
        uint256 borrowValue = amount; // Simplified - gunakan oracle di implementasi nyata
        require(_canBorrow(msg.sender, borrowValue), "Insufficient collateral");
        
        // Update data pool dan user
        pool.totalBorrow += amount;
        userPositions[msg.sender][token].borrowed += amount;
        
        // Transfer token
        pool.token.transfer(msg.sender, amount);
        
        // Reward transaksi
        txrToken.rewardTransaction(msg.sender);
        
        emit Borrow(msg.sender, token, amount);
    }
    
    /**
     * @dev Repay pinjaman
     * @param token Address token
     * @param amount Jumlah token
     */
    function repay(address token, uint256 amount) external nonReentrant {
        Pool storage pool = pools[token];
        UserPosition storage position = userPositions[msg.sender][token];
        
        require(position.borrowed >= amount, "Repay amount exceeds debt");
        require(amount > 0, "Amount must be greater than 0");
        
        // Update posisi user
        _updateUserPosition(msg.sender, token);
        
        // Transfer token
        pool.token.transferFrom(msg.sender, address(this), amount);
        
        // Update data pool dan user
        pool.totalBorrow -= amount;
        position.borrowed -= amount;
        
        // Reward transaksi
        txrToken.rewardTransaction(msg.sender);
        
        emit Repay(msg.sender, token, amount);
    }
    
    /**
     * @dev Update posisi user (hitung bunga)
     * @param user Address user
     * @param token Address token
     */
    function _updateUserPosition(address user, address token) internal {
        UserPosition storage position = userPositions[user][token];
        Pool storage pool = pools[token];
        
        if (position.lastUpdateTime == 0) {
            position.lastUpdateTime = block.timestamp;
            return;
        }
        
        uint256 timeElapsed = block.timestamp - position.lastUpdateTime;
        
        // Hitung bunga (simplified calculation)
        if (position.borrowed > 0) {
            uint256 interest = (position.borrowed * pool.borrowRate * timeElapsed) / (365 days * BASIS_POINTS);
            position.accruedInterest += interest;
            position.borrowed += interest;
        }
        
        position.lastUpdateTime = block.timestamp;
    }
    
    /**
     * @dev Check apakah user bisa borrow
     * @param user Address user
     * @param borrowValue Nilai yang ingin dipinjam
     * @return bool
     */
    function _canBorrow(address user, uint256 borrowValue) internal view returns (bool) {
        uint256 maxBorrow = (userCollateralValue[user] * 75) / 100; // 75% LTV
        uint256 currentBorrow = _getUserTotalBorrow(user);
        return currentBorrow + borrowValue <= maxBorrow;
    }
    
    /**
     * @dev Check apakah posisi masih sehat
     * @param user Address user
     * @param newCollateralValue Nilai collateral baru
     * @return bool
     */
    function _isHealthyPosition(address user, uint256 newCollateralValue) internal view returns (bool) {
        uint256 currentBorrow = _getUserTotalBorrow(user);
        if (currentBorrow == 0) return true;
        
        uint256 maxBorrow = (newCollateralValue * 75) / 100;
        return currentBorrow <= maxBorrow;
    }
    
    /**
     * @dev Get total borrow user
     * @param user Address user
     * @return Total borrow value
     */
    function _getUserTotalBorrow(address user) internal view returns (uint256) {
        uint256 totalBorrow = 0;
        for (uint256 i = 0; i < supportedTokens.length; i++) {
            totalBorrow += userPositions[user][supportedTokens[i]].borrowed;
        }
        return totalBorrow;
    }
    
    // View functions
    function getUserPosition(address user, address token) external view returns (UserPosition memory) {
        return userPositions[user][token];
    }
    
    function getPoolInfo(address token) external view returns (Pool memory) {
        return pools[token];
    }
    
    function getSupportedTokens() external view returns (address[] memory) {
        return supportedTokens;
    }
    
    function getUserHealthFactor(address user) external view returns (uint256) {
        uint256 totalBorrow = _getUserTotalBorrow(user);
        if (totalBorrow == 0) return type(uint256).max;
        
        uint256 maxBorrow = (userCollateralValue[user] * LIQUIDATION_THRESHOLD) / BASIS_POINTS;
        return (maxBorrow * BASIS_POINTS) / totalBorrow;
    }
}