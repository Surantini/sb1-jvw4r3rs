import { ethers } from 'ethers';
import contractAddresses from '../contracts/addresses.json';
import contractABIs from '../contracts/abis.json';

declare global {
  interface Window {
    ethereum?: any;
    BinanceChain?: any;
    okxwallet?: any;
    bitkeep?: any;
    trustWallet?: any;
  }
}

export class Web3Service {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private contracts: { [key: string]: ethers.Contract } = {};
  private currentWallet: string | null = null;

  async connectWallet(walletType: string = 'metamask'): Promise<string> {
    let ethereum;
    
    switch (walletType) {
      case 'metamask':
        ethereum = window.ethereum;
        break;
      case 'binance':
        ethereum = window.BinanceChain;
        break;
      case 'okx':
        ethereum = window.okxwallet;
        break;
      case 'bitget':
        ethereum = window.bitkeep?.ethereum;
        break;
      case 'trustwallet':
        ethereum = window.trustWallet;
        break;
      default:
        ethereum = window.ethereum;
    }

    if (!ethereum) {
      throw new Error(`${walletType} wallet not found. Please install the wallet extension.`);
    }

    try {
      // Request account access
      await ethereum.request({ method: 'eth_requestAccounts' });
      
      this.provider = new ethers.BrowserProvider(ethereum);
      this.signer = this.provider.getSigner();
      this.currentWallet = walletType;
      
      const address = await this.signer.getAddress();
      
      // Switch to BSC Testnet if not already
      await this.switchToBSCTestnet(ethereum);
      
      // Initialize contracts
      this.initializeContracts();
      
      return address;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  }

  async switchToBSCTestnet(ethereum: any) {
    if (!ethereum) return;

    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x61' }], // BSC Testnet
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x61',
                chainName: 'BSC Testnet',
                nativeCurrency: {
                  name: 'BNB',
                  symbol: 'BNB',
                  decimals: 18,
                },
                rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
                blockExplorerUrls: ['https://testnet.bscscan.com/'],
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding BSC Testnet:', addError);
          throw addError;
        }
      } else {
        throw switchError;
      }
    }
  }

  private initializeContracts() {
    if (!this.signer) return;

    console.log('Initializing contracts with addresses:', contractAddresses);

    this.contracts.txrToken = new ethers.Contract(
      contractAddresses.txrToken,
      contractABIs.TxRateToken,
      this.signer
    );

    this.contracts.lending = new ethers.Contract(
      contractAddresses.lending,
      contractABIs.TxRateLending,
      this.signer
    );

    // Initialize token contracts
    const tokens = ['mockUSDT', 'mockBTCB', 'mockETH'];
    tokens.forEach(token => {
      this.contracts[token] = new ethers.Contract(
        contractAddresses[token as keyof typeof contractAddresses],
        contractABIs.ERC20,
        this.signer
      );
    });

    // WBNB contract
    if (contractAddresses.wbnb) {
      this.contracts.wbnb = new ethers.Contract(
        contractAddresses.wbnb,
        contractABIs.ERC20,
        this.signer
      );
    }
  }

  // TxR Token functions
  async getTxRBalance(address: string): Promise<string> {
    if (!this.contracts.txrToken) throw new Error('Contract not initialized');
    try {
      const balance = await this.contracts.txrToken.balanceOf(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error getting TxR balance:', error);
      return '0';
    }
  }

  async getOffChainBalance(address: string): Promise<string> {
    if (!this.contracts.txrToken) throw new Error('Contract not initialized');
    try {
      const balance = await this.contracts.txrToken.getOffChainBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error getting off-chain balance:', error);
      return '0';
    }
  }

  async withdrawOffChain(amount: string): Promise<string> {
    if (!this.contracts.txrToken) throw new Error('Contract not initialized');
    try {
      const tx = await this.contracts.txrToken.withdrawOffChain(
        ethers.parseEther(amount)
      );
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error) {
      console.error('Error withdrawing off-chain:', error);
      throw error;
    }
  }

  // Lending functions
  async supply(tokenAddress: string, amount: string): Promise<string> {
    if (!this.contracts.lending) throw new Error('Contract not initialized');
    
    try {
      // First approve the lending contract to spend tokens
      const tokenContract = new ethers.Contract(tokenAddress, contractABIs.ERC20, this.signer);
      const approveTx = await tokenContract.approve(
        contractAddresses.lending,
        ethers.parseEther(amount)
      );
      await approveTx.wait();

      // Then supply to the pool
      const tx = await this.contracts.lending.supply(
        tokenAddress,
        ethers.parseEther(amount)
      );
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error) {
      console.error('Error supplying tokens:', error);
      throw error;
    }
  }

  async withdraw(tokenAddress: string, amount: string): Promise<string> {
    if (!this.contracts.lending) throw new Error('Contract not initialized');
    try {
      const tx = await this.contracts.lending.withdraw(
        tokenAddress,
        ethers.parseEther(amount)
      );
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error) {
      console.error('Error withdrawing tokens:', error);
      throw error;
    }
  }

  async borrow(tokenAddress: string, amount: string): Promise<string> {
    if (!this.contracts.lending) throw new Error('Contract not initialized');
    try {
      const tx = await this.contracts.lending.borrow(
        tokenAddress,
        ethers.parseEther(amount)
      );
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error) {
      console.error('Error borrowing tokens:', error);
      throw error;
    }
  }

  async repay(tokenAddress: string, amount: string): Promise<string> {
    if (!this.contracts.lending) throw new Error('Contract not initialized');
    
    try {
      // First approve the lending contract to spend tokens
      const tokenContract = new ethers.Contract(tokenAddress, contractABIs.ERC20, this.signer);
      const approveTx = await tokenContract.approve(
        contractAddresses.lending,
        ethers.parseEther(amount)
      );
      await approveTx.wait();

      // Then repay the loan
      const tx = await this.contracts.lending.repay(
        tokenAddress,
        ethers.parseEther(amount)
      );
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error) {
      console.error('Error repaying tokens:', error);
      throw error;
    }
  }

  async getUserPosition(userAddress: string, tokenAddress: string) {
    if (!this.contracts.lending) throw new Error('Contract not initialized');
    try {
      const position = await this.contracts.lending.getUserPosition(userAddress, tokenAddress);
      return {
        supplied: ethers.formatEther(position.supplied),
        borrowed: ethers.formatEther(position.borrowed),
        lastUpdateTime: Number(position.lastUpdateTime),
        accruedInterest: ethers.formatEther(position.accruedInterest)
      };
    } catch (error) {
      console.error('Error getting user position:', error);
      return {
        supplied: '0',
        borrowed: '0',
        lastUpdateTime: 0,
        accruedInterest: '0'
      };
    }
  }

  async getPoolInfo(tokenAddress: string) {
    if (!this.contracts.lending) throw new Error('Contract not initialized');
    try {
      const pool = await this.contracts.lending.getPoolInfo(tokenAddress);
      return {
        token: pool.token,
        totalSupply: ethers.formatEther(pool.totalSupply),
        totalBorrow: ethers.formatEther(pool.totalBorrow),
        supplyRate: Number(pool.supplyRate) / 100, // Convert from basis points
        borrowRate: Number(pool.borrowRate) / 100,
        collateralFactor: Number(pool.collateralFactor) / 100,
        isActive: pool.isActive
      };
    } catch (error) {
      console.error('Error getting pool info:', error);
      throw error;
    }
  }

  async getTokenBalance(tokenAddress: string, userAddress: string): Promise<string> {
    try {
      const tokenContract = new ethers.Contract(tokenAddress, contractABIs.ERC20, this.provider);
      const balance = await tokenContract.balanceOf(userAddress);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error getting token balance:', error);
      return '0';
    }
  }

  // Referral functions
  async getReferralInfo(address: string) {
    if (!this.contracts.txrToken) throw new Error('Contract not initialized');
    try {
      const [referrer, earnings, totalRefs] = await this.contracts.txrToken.getReferralInfo(address);
      return {
        referrer,
        earnings: ethers.formatEther(earnings),
        totalReferrals: Number(totalRefs)
      };
    } catch (error) {
      console.error('Error getting referral info:', error);
      return {
        referrer: '0x0000000000000000000000000000000000000000',
        earnings: '0',
        totalReferrals: 0
      };
    }
  }

  async getBNBBalance(address: string): Promise<string> {
    if (!this.provider) throw new Error('Provider not initialized');
    try {
      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error getting BNB balance:', error);
      return '0';
    }
  }

  getCurrentWallet(): string | null {
    return this.currentWallet;
  }

  isConnected(): boolean {
    return this.provider !== null && this.signer !== null;
  }

  getContractAddresses() {
    return contractAddresses;
  }
}

export const web3Service = new Web3Service();