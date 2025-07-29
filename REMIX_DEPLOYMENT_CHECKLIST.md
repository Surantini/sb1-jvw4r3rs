# ✅ Remix Deployment Checklist

## 🔧 Pre-Deployment

- [ ] MetaMask installed dan connected ke BSC Testnet
- [ ] BNB Testnet balance cukup (minimal 0.1 BNB)
- [ ] Remix IDE terbuka di https://remix.ethereum.org/
- [ ] File contracts sudah di-upload ke Remix

## 📝 Deployment Steps

### 1. Compile Contracts
- [ ] Set compiler version ke 0.8.19
- [ ] Enable optimization (200 runs)
- [ ] Compile TxRateToken.sol ✅
- [ ] Compile TxRateLending.sol ✅  
- [ ] Compile MockTokens.sol ✅
- [ ] No compilation errors

### 2. Deploy TxRateToken
- [ ] Select TxRateToken contract
- [ ] Deploy dengan gas limit 3,000,000
- [ ] Transaction confirmed
- [ ] Copy contract address: `_________________`

### 3. Deploy Mock Tokens
- [ ] Deploy MockUSDT
  - Address: `_________________`
- [ ] Deploy MockBTCB  
  - Address: `_________________`
- [ ] Deploy MockETH
  - Address: `_________________`

### 4. Deploy TxRateLending
- [ ] Select TxRateLending contract
- [ ] Input TxRateToken address sebagai constructor parameter
- [ ] Deploy dengan gas limit 4,000,000
- [ ] Transaction confirmed
- [ ] Copy contract address: `_________________`

### 5. Setup Lending Pools
- [ ] Add BNB Pool (WBNB: 0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd)
- [ ] Add USDT Pool (MockUSDT address)
- [ ] Add BTCB Pool (MockBTCB address)  
- [ ] Add ETH Pool (MockETH address)

## 🔍 Verification

### BSCScan Verification
- [ ] TxRateToken verified: https://testnet.bscscan.com/address/_______________
- [ ] TxRateLending verified: https://testnet.bscscan.com/address/_______________
- [ ] MockUSDT verified: https://testnet.bscscan.com/address/_______________
- [ ] MockBTCB verified: https://testnet.bscscan.com/address/_______________
- [ ] MockETH verified: https://testnet.bscscan.com/address/_______________

### Contract Testing
- [ ] Mint mock tokens berhasil
- [ ] Approve token spending berhasil
- [ ] Supply tokens ke pool berhasil
- [ ] Borrow tokens berhasil
- [ ] Repay tokens berhasil
- [ ] TxR rewards diterima

## 📱 Frontend Integration

- [ ] Update `src/contracts/addresses.json` dengan addresses yang benar
- [ ] Test wallet connection
- [ ] Test lending functionality
- [ ] Test borrowing functionality  
- [ ] Test transaction history
- [ ] Test referral system

## 🧪 Final Testing

- [ ] Connect wallet ke aplikasi
- [ ] Supply beberapa mock tokens
- [ ] Borrow dengan collateral
- [ ] Check TxR balance bertambah
- [ ] Test withdraw TxR
- [ ] Test referral link
- [ ] Check transaction history

## 📋 Contract Addresses (Fill After Deployment)

```json
{
  "txrToken": "0x_________________",
  "lending": "0x_________________",
  "mockUSDT": "0x_________________", 
  "mockBTCB": "0x_________________",
  "mockETH": "0x_________________",
  "wbnb": "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd"
}
```

## 🚨 Troubleshooting

### Common Issues:
- **Gas limit too low**: Increase ke 3-5 million
- **Transaction failed**: Check BNB balance
- **Compilation error**: Verify Solidity version 0.8.19
- **Network error**: Ensure BSC Testnet selected

### Emergency Contacts:
- BSC Testnet Faucet: https://testnet.binance.org/faucet-smart
- BSCScan Testnet: https://testnet.bscscan.com/
- Remix Documentation: https://remix-ide.readthedocs.io/

## ✅ Deployment Complete!

Setelah semua checklist selesai:
1. Save semua contract addresses
2. Update frontend configuration  
3. Test end-to-end functionality
4. Monitor transactions di BSCScan
5. Ready untuk user testing!

---

**Deployment Date**: _______________  
**Deployed By**: _______________  
**Network**: BSC Testnet  
**Status**: ✅ Complete / ⏳ In Progress / ❌ Failed