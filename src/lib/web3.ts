import { ethers } from 'ethers';
import contractAddresses from '../contracts/addresses.json';
import contractABIs from '../contracts/abis.json';

export class Web3Service {
  private provider: ethers.providers.Web3Provider | null = null;
  private signer: ethers.Signer | null = null;
  private contracts: { [key: string]: ethers.Contract } = {};

  async connectWallet(): Promise<string> {
    if (!window.ethereum) {
      throw new Error('No wallet found. Please install MetaMask or another Web3 wallet.');
    }

    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.signer = this.provider.getSigner();
      
      const address = await this.signer.getAddress();
      
      // Switch to BSC Testnet if not already
      await this.switchToBSCTestnet();
      
      // Initialize contracts
      this.initializeContracts();
      
      return address;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  }

  async switchToBSCTestnet() {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x61' }], // BSC Testnet
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
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
    this.contracts.wbnb = new ethers.Contract(
      contractAddresses.wbnb,
      contractABIs.ERC20,
      this.signer
    );
  }

  // TxR Token functions
  async getTxRBalance(address: string): Promise<string> {
    if (!this.contracts.txrToken) throw new Error('Contract not initialized');
    const balance = await this.contracts.txrToken.balanceOf(address);
    return ethers.utils.formatEther(balance);
  }

  async getOffChainBalance(address: string): Promise<string> {
    if (!this.contracts.txrToken) throw new Error('Contract not initialized');
    const balance = await this.contracts.txrToken.getOffChainBalance(address);
    return ethers.utils.formatEther(balance);
  }

  async withdrawOffChain(amount: string): Promise<string> {
    if (!this.contracts.txrToken) throw new Error('Contract not initialized');
    const tx = await this.contracts.txrToken.withdrawOffChain(
      ethers.utils.parseEther(amount)
    );
    await tx.wait();
    return tx.hash;
  }

  // Lending functions
  async supply(tokenAddress: string, amount: string): Promise<string> {
    if (!this.contracts.lending) throw new Error('Contract not initialized');
    
    // First approve the lending contract to spend tokens
    const tokenContract = new ethers.Contract(tokenAddress, contractABIs.ERC20, this.signer);
    const approveTx = await tokenContract.approve(
      contractAddresses.lending,
      ethers.utils.parseEther(amount)
    );
    await approveTx.wait();

    // Then supply to the pool
    const tx = await this.contracts.lending.supply(
      tokenAddress,
      ethers.utils.parseEther(amount)
    );
    await tx.wait();
    return tx.hash;
  }

  async withdraw(tokenAddress: string, amount: string): Promise<string> {
    if (!this.contracts.lending) throw new Error('Contract not initialized');
    const tx = await this.contracts.lending.withdraw(
      tokenAddress,
      ethers.utils.parseEther(amount)
    );
    await tx.wait();
    return tx.hash;
  }

  async borrow(tokenAddress: string, amount: string): Promise<string> {
    if (!this.contracts.lending) throw new Error('Contract not initialized');
    const tx = await this.contracts.lending.borrow(
      tokenAddress,
      ethers.utils.parseEther(amount)
    );
    await tx.wait();
    return tx.hash;
  }

  async repay(tokenAddress: string, amount: string): Promise<string> {
    if (!this.contracts.lending) throw new Error('Contract not initialized');
    
    // First approve the lending contract to spend tokens
    const tokenContract = new ethers.Contract(tokenAddress, contractABIs.ERC20, this.signer);
    const approveTx = await tokenContract.approve(
      contractAddresses.lending,
      ethers.utils.parseEther(amount)
    );
    await approveTx.wait();

    // Then repay the loan
    const tx = await this.contracts.lending.repay(
      tokenAddress,
      ethers.utils.parseEther(amount)
    );
    await tx.wait();
    return tx.hash;
  }

  async getUserPosition(userAddress: string, tokenAddress: string) {
    if (!this.contracts.lending) throw new Error('Contract not initialized');
    const position = await this.contracts.lending.getUserPosition(userAddress, tokenAddress);
    return {
      supplied: ethers.utils.formatEther(position.supplied),
      borrowed: ethers.utils.formatEther(position.borrowed),
      lastUpdateTime: position.lastUpdateTime.toNumber(),
      accruedInterest: ethers.utils.formatEther(position.accruedInterest)
    };
  }

  async getPoolInfo(tokenAddress: string) {
    if (!this.contracts.lending) throw new Error('Contract not initialized');
    const pool = await this.contracts.lending.getPoolInfo(tokenAddress);
    return {
      token: pool.token,
      totalSupply: ethers.utils.formatEther(pool.totalSupply),
      totalBorrow: ethers.utils.formatEther(pool.totalBorrow),
      supplyRate: pool.supplyRate.toNumber() / 100, // Convert from basis points
      borrowRate: pool.borrowRate.toNumber() / 100,
      collateralFactor: pool.collateralFactor.toNumber() / 100,
      isActive: pool.isActive
    };
  }

  async getTokenBalance(tokenAddress: string, userAddress: string): Promise<string> {
    const tokenContract = new ethers.Contract(tokenAddress, contractABIs.ERC20, this.provider);
    const balance = await tokenContract.balanceOf(userAddress);
    return ethers.utils.formatEther(balance);
  }

  // Referral functions
  async getReferralInfo(address: string) {
    if (!this.contracts.txrToken) throw new Error('Contract not initialized');
    const [referrer, earnings, totalRefs] = await this.contracts.txrToken.getReferralInfo(address);
    return {
      referrer,
      earnings: ethers.utils.formatEther(earnings),
      totalReferrals: totalRefs.toNumber()
    };
  }

  getContractAddresses() {
    return contractAddresses;
  }
}

export const web3Service = new Web3Service();

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}