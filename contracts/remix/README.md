# 📁 Smart Contracts untuk Remix IDE

Folder ini berisi smart contracts yang sudah dioptimasi untuk deployment dengan Remix IDE.

## 📋 File Structure

```
contracts/remix/
├── TxRateToken.sol      # Main TxR token contract
├── TxRateLending.sol    # Lending & borrowing platform  
├── MockTokens.sol       # Mock tokens untuk testing
└── README.md           # File ini
```

## 🔧 Contracts Overview

### TxRateToken.sol
- **Purpose**: Main TxR token dengan sistem reward dan referral
- **Features**:
  - ERC20 token standard
  - Off-chain balance system
  - Transaction rewards (2.5 TxR per transaksi)
  - Referral system (10% reward untuk referrer)
  - Emergency functions untuk admin

### TxRateLending.sol  
- **Purpose**: Platform lending dan borrowing
- **Features**:
  - Multi-token lending pools
  - Collateral-based borrowing
  - Interest calculation
  - Health factor monitoring
  - Integration dengan TxRateToken untuk rewards

### MockTokens.sol
- **Purpose**: Mock tokens untuk testing di testnet
- **Includes**:
  - MockUSDT (Mock Tether)
  - MockBTCB (Mock Bitcoin BEP20)
  - MockETH (Mock Ethereum BEP20)

## 🚀 Quick Deploy

1. **Buka Remix IDE**: https://remix.ethereum.org/
2. **Upload files** ke workspace
3. **Compile** dengan Solidity 0.8.19
4. **Deploy** ke BSC Testnet
5. **Verify** di BSCScan

## ⚙️ Constructor Parameters

### TxRateToken
- No parameters needed

### TxRateLending  
- `_txrToken`: Address dari deployed TxRateToken

### Mock Tokens
- No parameters needed

## 🔍 Important Functions

### TxRateToken
- `rewardTransaction(address user)`: Berikan reward ke user
- `setReferrer(address user, address referrer)`: Set referrer
- `withdrawOffChain(uint256 amount)`: Withdraw off-chain balance
- `getOffChainBalance(address user)`: Check off-chain balance

### TxRateLending
- `addPool(...)`: Tambah lending pool baru
- `supply(address token, uint256 amount)`: Supply token ke pool
- `borrow(address token, uint256 amount)`: Borrow dari pool
- `repay(address token, uint256 amount)`: Repay pinjaman

## 🛡️ Security Features

- **ReentrancyGuard**: Proteksi dari reentrancy attacks
- **Ownable**: Access control untuk admin functions
- **Input validation**: Comprehensive parameter checking
- **Safe math**: Overflow protection dengan Solidity 0.8+

## 📊 Gas Optimization

- Optimized storage layout
- Efficient loops dan calculations
- Minimal external calls
- Batch operations where possible

## 🧪 Testing Checklist

- [ ] Deploy TxRateToken
- [ ] Deploy MockTokens  
- [ ] Deploy TxRateLending
- [ ] Setup lending pools
- [ ] Test mint mock tokens
- [ ] Test supply/borrow flow
- [ ] Test reward system
- [ ] Test referral system
- [ ] Verify all contracts

## ⚠️ Important Notes

1. **Testnet Only**: Contracts ini untuk BSC Testnet
2. **Mock Tokens**: Jangan gunakan di mainnet
3. **Oracle**: Implementasi ini menggunakan simplified pricing
4. **Audit**: Audit smart contract sebelum mainnet deployment

## 🔗 Useful Links

- [BSC Testnet Explorer](https://testnet.bscscan.com/)
- [BSC Testnet Faucet](https://testnet.binance.org/faucet-smart)
- [Remix IDE](https://remix.ethereum.org/)
- [OpenZeppelin Docs](https://docs.openzeppelin.com/)