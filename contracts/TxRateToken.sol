// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract TxRateToken is ERC20, Ownable, ReentrancyGuard {
    uint256 public constant INITIAL_SUPPLY = 1000000000 * 10**18; // 1 billion tokens
    uint256 public constant TRANSACTION_REWARD = 25 * 10**17; // 2.5 TxR per transaction
    
    mapping(address => uint256) public offChainBalance;
    mapping(address => address) public referrers;
    mapping(address => uint256) public referralEarnings;
    mapping(address => uint256) public totalReferrals;
    
    event TransactionReward(address indexed user, uint256 amount);
    event ReferralReward(address indexed referrer, address indexed referee, uint256 amount);
    event OffChainDeposit(address indexed user, uint256 amount);
    event OffChainWithdraw(address indexed user, uint256 amount);
    
    constructor() ERC20("TxRate", "TxR") {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
    
    function rewardTransaction(address user) external onlyOwner {
        offChainBalance[user] += TRANSACTION_REWARD;
        
        // Referral reward (10% of transaction reward)
        address referrer = referrers[user];
        if (referrer != address(0)) {
            uint256 referralReward = TRANSACTION_REWARD / 10;
            offChainBalance[referrer] += referralReward;
            referralEarnings[referrer] += referralReward;
            emit ReferralReward(referrer, user, referralReward);
        }
        
        emit TransactionReward(user, TRANSACTION_REWARD);
    }
    
    function setReferrer(address user, address referrer) external onlyOwner {
        require(referrers[user] == address(0), "Referrer already set");
        require(referrer != user, "Cannot refer yourself");
        
        referrers[user] = referrer;
        totalReferrals[referrer]++;
    }
    
    function withdrawOffChain(uint256 amount) external nonReentrant {
        require(offChainBalance[msg.sender] >= amount, "Insufficient off-chain balance");
        require(balanceOf(address(this)) >= amount, "Insufficient contract balance");
        
        offChainBalance[msg.sender] -= amount;
        _transfer(address(this), msg.sender, amount);
        
        emit OffChainWithdraw(msg.sender, amount);
    }
    
    function depositOffChain(uint256 amount) external nonReentrant {
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        _transfer(msg.sender, address(this), amount);
        offChainBalance[msg.sender] += amount;
        
        emit OffChainDeposit(msg.sender, amount);
    }
    
    function getOffChainBalance(address user) external view returns (uint256) {
        return offChainBalance[user];
    }
    
    function getReferralInfo(address user) external view returns (address referrer, uint256 earnings, uint256 totalRefs) {
        return (referrers[user], referralEarnings[user], totalReferrals[user]);
    }
}