// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title TxRateToken
 * @dev TxRate token dengan sistem reward dan referral
 * @author TxRate Team
 */
contract TxRateToken is ERC20, Ownable, ReentrancyGuard {
    uint256 public constant INITIAL_SUPPLY = 1000000000 * 10**18; // 1 miliar token
    uint256 public constant TRANSACTION_REWARD = 25 * 10**17; // 2.5 TxR per transaksi
    uint256 public constant REFERRAL_PERCENTAGE = 10; // 10% untuk referrer

    // Mapping untuk saldo off-chain
    mapping(address => uint256) public offChainBalance;

    // Mapping untuk sistem referral
    mapping(address => address) public referrers;
    mapping(address => uint256) public referralEarnings;
    mapping(address => uint256) public totalReferrals;

    // Events
    event TransactionReward(address indexed user, uint256 amount);
    event ReferralReward(address indexed referrer, address indexed referee, uint256 amount);
    event OffChainDeposit(address indexed user, uint256 amount);
    event OffChainWithdraw(address indexed user, uint256 amount);
    event ReferrerSet(address indexed user, address indexed referrer);

    constructor() ERC20("TxRate", "TxR") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY);

        // Transfer sebagian token ke contract untuk reward
        uint256 rewardPool = INITIAL_SUPPLY / 2; // 50% untuk reward pool
        _transfer(msg.sender, address(this), rewardPool);
    }

    /**
     * @dev Memberikan reward untuk transaksi
     * @param user Address yang mendapat reward
     */
    function rewardTransaction(address user) external onlyOwner {
        require(user != address(0), "Invalid user address");
        require(balanceOf(address(this)) >= TRANSACTION_REWARD, "Insufficient reward pool");

        // Tambah ke saldo off-chain
        offChainBalance[user] += TRANSACTION_REWARD;

        // Reward referral jika ada
        address referrer = referrers[user];
        if (referrer != address(0)) {
            uint256 referralReward = TRANSACTION_REWARD * REFERRAL_PERCENTAGE / 100;
            offChainBalance[referrer] += referralReward;
            referralEarnings[referrer] += referralReward;
            emit ReferralReward(referrer, user, referralReward);
        }

        emit TransactionReward(user, TRANSACTION_REWARD);
    }

    /**
     * @dev Set referrer untuk user
     * @param user Address user
     * @param referrer Address referrer
     */
    function setReferrer(address user, address referrer) external onlyOwner {
        require(user != address(0), "Invalid user address");
        require(referrer != address(0), "Invalid referrer address");
        require(referrers[user] == address(0), "Referrer already set");
        require(referrer != user, "Cannot refer yourself");

        referrers[user] = referrer;
        totalReferrals[referrer]++;

        emit ReferrerSet(user, referrer);
    }

    /**
     * @dev Withdraw saldo off-chain ke on-chain
     * @param amount Jumlah yang akan di-withdraw
     */
    function withdrawOffChain(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(offChainBalance[msg.sender] >= amount, "Insufficient off-chain balance");
        require(balanceOf(address(this)) >= amount, "Insufficient contract balance");

        offChainBalance[msg.sender] -= amount;
        _transfer(address(this), msg.sender, amount);

        emit OffChainWithdraw(msg.sender, amount);
    }

    /**
     * @dev Deposit token ke saldo off-chain
     * @param amount Jumlah yang akan di-deposit
     */
    function depositOffChain(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");

        _transfer(msg.sender, address(this), amount);
        offChainBalance[msg.sender] += amount;

        emit OffChainDeposit(msg.sender, amount);
    }

    /**
     * @dev Get saldo off-chain user
     * @param user Address user
     * @return Saldo off-chain
     */
    function getOffChainBalance(address user) external view returns (uint256) {
        return offChainBalance[user];
    }

    /**
     * @dev Get informasi referral user
     * @param user Address user
     * @return referrer Address referrer
     * @return earnings Total earnings dari referral
     * @return totalRefs Total jumlah referral
     */
    function getReferralInfo(address user) external view returns (
        address referrer,
        uint256 earnings,
        uint256 totalRefs
    ) {
        return (referrers[user], referralEarnings[user], totalReferrals[user]);
    }

    /**
     * @dev Emergency function untuk withdraw token dari contract
     * @param amount Jumlah token
     */
    function emergencyWithdraw(uint256 amount) external onlyOwner {
        require(balanceOf(address(this)) >= amount, "Insufficient contract balance");
        _transfer(address(this), owner(), amount);
    }

    /**
     * @dev Get contract balance
     * @return Contract token balance
     */
    function getContractBalance() external view returns (uint256) {
        return balanceOf(address(this));
    }
}