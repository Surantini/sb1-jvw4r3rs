# TxRate - DeFi Borrowing & Lending Platform

TxRate adalah platform DeFi yang memberikan reward TxR token untuk setiap transaksi smart contract di BSC Testnet. Platform ini menyediakan layanan lending, borrowing, dan sistem referral.

## 🚀 Features

- **Multi-Wallet Support**: MetaMask, Bitget, OKX, Trust Wallet, Binance Wallet, WalletConnect
- **Lending Pools**: Supply crypto assets dan earn APY + TxR rewards
- **Borrowing**: Pinjam crypto dengan collateral
- **Referral System**: Earn 10% dari TxR rewards referral Anda
- **Off-chain Balance**: Saldo TxR off-chain dengan withdrawal on-chain
- **Real-time Analytics**: Dashboard dengan metrics dan charts

## 🛠 Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Blockchain**: BSC Testnet, Solidity, Ethers.js
- **Database**: Supabase (PostgreSQL)
- **Smart Contracts**: OpenZeppelin, Hardhat

## 📋 Prerequisites

1. Node.js 18+
2. MetaMask atau wallet lain yang support BSC Testnet
3. BNB Testnet untuk gas fees
4. Supabase account

## 🔧 Installation

### 1. Clone dan Install Dependencies

```bash
git clone <repository-url>
cd txrate-platform
npm install
```

### 2. Setup Environment Variables

```bash
cp .env.example .env
```

Edit `.env` file:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Setup Supabase Database

1. Buat project baru di [Supabase](https://supabase.com)
2. Jalankan migrations:
   - Copy isi file `supabase/migrations/*.sql`
   - Paste di Supabase SQL Editor
   - Execute satu per satu

### 4. Deploy Smart Contracts

```bash
cd contracts
npm install

# Edit hardhat.config.js - tambahkan private key Anda
# Edit deploy.js jika perlu

# Deploy ke BSC Testnet
npm run deploy
```

Setelah deploy, copy contract addresses ke `src/contracts/addresses.json`

### 5. Start Development Server

```bash
npm run dev
```

## 📝 Smart Contract Deployment

### Setup Hardhat

1. Masuk ke folder contracts:
```bash
cd contracts
npm install
```

2. Edit `hardhat.config.js`:
```javascript
networks: {
  bscTestnet: {
    url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
    chainId: 97,
    accounts: ["YOUR_PRIVATE_KEY_HERE"] // Tanpa 0x prefix
  }
}
```

3. Deploy contracts:
```bash
npx hardhat run scripts/deploy.js --network bscTestnet
```

4. Verify contracts (optional):
```bash
npx hardhat verify --network bscTestnet CONTRACT_ADDRESS
```

## 🔗 Contract Addresses (BSC Testnet)

Setelah deployment, update file `src/contracts/addresses.json`:

```json
{
  "txrToken": "0x...",
  "lending": "0x...",
  "mockUSDT": "0x...",
  "mockBTCB": "0x...",
  "mockETH": "0x...",
  "wbnb": "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd"
}
```

## 🎯 How to Use

### 1. Connect Wallet
- Klik "Connect Wallet"
- Pilih wallet (MetaMask, Bitget, OKX, dll)
- Approve connection ke BSC Testnet

### 2. Get Test Tokens
- BNB Testnet: [BSC Testnet Faucet](https://testnet.binance.org/faucet-smart)
- Mock tokens: Gunakan function `mint()` di contract mock tokens

### 3. Supply/Lend
- Pilih asset yang ingin di-supply
- Enter amount
- Approve token spending
- Confirm transaction
- Earn APY + TxR rewards

### 4. Borrow
- Pastikan ada collateral
- Pilih asset yang ingin dipinjam
- Enter amount (max 75% dari collateral)
- Confirm transaction

### 5. Referral System
- Copy referral link dari dashboard
- Share dengan teman
- Earn 10% dari TxR rewards mereka

### 6. Withdraw TxR
- TxR balance adalah off-chain
- Klik "Withdraw TxR" untuk transfer ke wallet
- Pay gas fee untuk on-chain transaction

## 🔒 Security Features

- **Smart Contract Security**: Menggunakan OpenZeppelin libraries
- **ReentrancyGuard**: Proteksi dari reentrancy attacks
- **Access Control**: Owner-only functions untuk admin
- **Collateral Management**: Automatic liquidation protection
- **Rate Limiting**: Transaction limits untuk prevent spam

## 🐛 Troubleshooting

### Wallet Connection Issues
- Pastikan wallet terinstall dan unlocked
- Switch ke BSC Testnet network
- Clear browser cache jika perlu

### Transaction Failures
- Pastikan balance cukup untuk gas fees
- Check allowance untuk token spending
- Verify contract addresses

### Database Issues
- Check Supabase connection
- Verify RLS policies
- Check environment variables

## 📊 Database Schema

### Users Table
- `wallet_address`: Alamat wallet user
- `referral_code`: Kode referral unik
- `referred_by`: Referral code yang digunakan
- `total_txr_earned`: Total TxR yang diperoleh
- `total_referral_earnings`: Total dari referral

### Transactions Table
- `tx_hash`: Hash transaksi blockchain
- `tx_type`: lend, borrow, withdraw, referral, reward
- `asset`: Asset yang ditransaksikan
- `amount`: Jumlah asset
- `txr_earned`: TxR yang diperoleh

### Referrals Table
- `referrer_id`: ID user yang mereferral
- `referee_id`: ID user yang direferral
- `txr_earned`: TxR yang diperoleh referrer

## 🚀 Deployment to Production

### Frontend Deployment
```bash
npm run build
# Deploy dist folder ke hosting (Vercel, Netlify, dll)
```

### Smart Contract Mainnet
1. Change network di hardhat.config.js ke BSC Mainnet
2. Use real BNB untuk gas fees
3. Deploy dengan private key yang secure
4. Verify contracts di BSCScan

## 📞 Support

Jika ada pertanyaan atau issues:
1. Check troubleshooting section
2. Review smart contract code
3. Check Supabase logs
4. Verify BSC Testnet connection

## ⚠️ Disclaimer

Ini adalah testnet implementation. Jangan gunakan private keys atau funds yang real. Selalu audit smart contracts sebelum mainnet deployment.