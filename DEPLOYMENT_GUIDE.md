# 🚀 Panduan Deploy Smart Contract dengan Remix IDE

## 📋 Persiapan

### 1. Setup Wallet
- Install MetaMask atau wallet lain yang support BSC Testnet
- Tambahkan BSC Testnet network:
  - Network Name: BSC Testnet
  - RPC URL: `https://data-seed-prebsc-1-s1.binance.org:8545/`
  - Chain ID: `97`
  - Symbol: `BNB`
  - Block Explorer: `https://testnet.bscscan.com/`

### 2. Dapatkan BNB Testnet
- Kunjungi: https://testnet.binance.org/faucet-smart
- Masukkan address wallet Anda
- Claim BNB untuk gas fees

## 🔧 Deploy dengan Remix IDE

### Step 1: Buka Remix IDE
1. Kunjungi: https://remix.ethereum.org/
2. Buat workspace baru atau gunakan default

### Step 2: Upload Contract Files
1. Di file explorer, buat folder `contracts`
2. Upload file-file berikut ke folder `contracts`:
   - `TxRateToken.sol`
   - `TxRateLending.sol` 
   - `MockTokens.sol`

### Step 3: Install Dependencies
1. Klik tab "File Explorer"
2. Klik icon "+" untuk create new file
3. Buat file `package.json`:

```json
{
  "dependencies": {
    "@openzeppelin/contracts": "^4.9.0"
  }
}
```

4. Klik tab "Plugin Manager"
5. Activate plugin "Solidity Compiler" dan "Deploy & Run Transactions"

### Step 4: Compile Contracts
1. Klik tab "Solidity Compiler"
2. Set compiler version ke `0.8.19`
3. Enable optimization (200 runs)
4. Compile semua contracts:
   - Pilih `TxRateToken.sol` → Compile
   - Pilih `TxRateLending.sol` → Compile  
   - Pilih `MockTokens.sol` → Compile

### Step 5: Deploy Contracts
1. Klik tab "Deploy & Run Transactions"
2. Set Environment ke "Injected Provider - MetaMask"
3. Pastikan account dan network sudah benar (BSC Testnet)

#### Deploy Order:
1. **Deploy TxRateToken**
   - Select contract: `TxRateToken`
   - Klik "Deploy"
   - Copy address yang muncul

2. **Deploy Mock Tokens**
   - Deploy `MockUSDT` → Copy address
   - Deploy `MockBTCB` → Copy address  
   - Deploy `MockETH` → Copy address

3. **Deploy TxRateLending**
   - Select contract: `TxRateLending`
   - Constructor parameter: paste TxRateToken address
   - Klik "Deploy"
   - Copy address

### Step 6: Setup Lending Pools
1. Di deployed contracts, expand `TxRateLending`
2. Klik function `addPool` untuk setiap token:

**BNB Pool:**
```
token: 0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd (WBNB Testnet)
supplyRate: 850 (8.5%)
borrowRate: 1020 (10.2%)
collateralFactor: 7500 (75%)
```

**USDT Pool:**
```
token: [MockUSDT address]
supplyRate: 1230 (12.3%)
borrowRate: 1550 (15.5%)
collateralFactor: 8000 (80%)
```

**BTCB Pool:**
```
token: [MockBTCB address]
supplyRate: 680 (6.8%)
borrowRate: 890 (8.9%)
collateralFactor: 7000 (70%)
```

**ETH Pool:**
```
token: [MockETH address]
supplyRate: 720 (7.2%)
borrowRate: 950 (9.5%)
collateralFactor: 7500 (75%)
```

## ✅ Verifikasi Contract di BSCScan

### Method 1: Remix Plugin (Termudah)
1. Install plugin "Contract Verification - Etherscan"
2. Masukkan BSCScan API key (gratis dari bscscan.com)
3. Pilih contract yang sudah di-deploy
4. Klik "Verify" - otomatis!

### Method 2: Manual di BSCScan
1. Kunjungi: https://testnet.bscscan.com/
2. Search contract address Anda
3. Klik tab "Contract" → "Verify and Publish"
4. Pilih:
   - Compiler Type: Solidity (Single file)
   - Compiler Version: v0.8.19
   - License: MIT
5. Copy-paste source code
6. Klik "Verify and Publish"

## 📝 Update Frontend

Setelah deploy berhasil, update file `src/contracts/addresses.json`:

```json
{
  "txrToken": "0xYOUR_TXRTOKEN_ADDRESS",
  "lending": "0xYOUR_LENDING_ADDRESS", 
  "mockUSDT": "0xYOUR_USDT_ADDRESS",
  "mockBTCB": "0xYOUR_BTCB_ADDRESS",
  "mockETH": "0xYOUR_ETH_ADDRESS",
  "wbnb": "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd"
}
```

## 🧪 Testing

### Test Mock Tokens
1. Di Remix, expand deployed MockUSDT
2. Klik function `mint`:
   - to: [your wallet address]
   - amount: 1000000000000000000000 (1000 tokens)
3. Repeat untuk MockBTCB dan MockETH

### Test Lending
1. Approve token spending:
   - Contract: MockUSDT
   - Function: `approve`
   - spender: [TxRateLending address]
   - amount: 1000000000000000000000

2. Supply tokens:
   - Contract: TxRateLending  
   - Function: `supply`
   - token: [MockUSDT address]
   - amount: 100000000000000000000 (100 tokens)

## 🔍 Troubleshooting

### Gas Limit Issues
- Increase gas limit di MetaMask
- Atau set manual: 3,000,000

### Compilation Errors
- Pastikan compiler version 0.8.19
- Enable optimization
- Check import paths

### Transaction Failed
- Pastikan balance BNB cukup
- Check network (harus BSC Testnet)
- Verify contract addresses

## 📞 Support

Jika ada masalah:
1. Check console errors di browser
2. Verify transaction di BSCScan
3. Pastikan semua addresses sudah benar
4. Test dengan amount kecil dulu

## 🎉 Selesai!

Contract Anda sudah siap digunakan di BSC Testnet! 

**Next Steps:**
- Test semua fungsi di frontend
- Monitor transactions di BSCScan  
- Setup monitoring dan analytics
- Prepare untuk mainnet deployment