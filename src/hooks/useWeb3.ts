import { useState, useEffect } from 'react';
import { web3Service } from '../lib/web3';
import { supabase } from '../lib/supabase';

export const useWeb3 = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string>('');
  const [txrBalance, setTxrBalance] = useState<string>('0');
  const [offChainBalance, setOffChainBalance] = useState<string>('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const connectWallet = async () => {
    try {
      setLoading(true);
      setError('');
      
      const walletAddress = await web3Service.connectWallet();
      setAddress(walletAddress);
      setIsConnected(true);
      
      // Create or update user in database
      await createOrUpdateUser(walletAddress);
      
      // Load balances
      await loadBalances(walletAddress);
      
    } catch (err: any) {
      setError(err.message);
      console.error('Wallet connection error:', err);
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress('');
    setTxrBalance('0');
    setOffChainBalance('0');
  };

  const loadBalances = async (walletAddress: string) => {
    try {
      const [txrBal, offChainBal] = await Promise.all([
        web3Service.getTxRBalance(walletAddress),
        web3Service.getOffChainBalance(walletAddress)
      ]);
      
      setTxrBalance(txrBal);
      setOffChainBalance(offChainBal);
    } catch (err) {
      console.error('Error loading balances:', err);
    }
  };

  const createOrUpdateUser = async (walletAddress: string) => {
    try {
      // Check if user exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('wallet_address', walletAddress)
        .single();

      if (!existingUser) {
        // Generate referral code
        const referralCode = 'TXR-' + Math.random().toString(36).substr(2, 8).toUpperCase();
        
        // Create new user
        const { error } = await supabase
          .from('users')
          .insert({
            wallet_address: walletAddress,
            referral_code: referralCode,
            total_txr_earned: 0,
            total_referral_earnings: 0
          });

        if (error) {
          console.error('Error creating user:', error);
        }
      }
    } catch (err) {
      console.error('Error in createOrUpdateUser:', err);
    }
  };

  const withdrawOffChain = async (amount: string) => {
    try {
      setLoading(true);
      const txHash = await web3Service.withdrawOffChain(amount);
      
      // Record transaction in database
      await recordTransaction(address, txHash, 'withdraw', 'TxR', amount, '0');
      
      // Reload balances
      await loadBalances(address);
      
      return txHash;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const recordTransaction = async (
    userAddress: string,
    txHash: string,
    txType: string,
    asset: string,
    amount: string,
    txrEarned: string
  ) => {
    try {
      // Get user ID
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('wallet_address', userAddress)
        .single();

      if (user) {
        await supabase
          .from('transactions')
          .insert({
            user_id: user.id,
            tx_hash: txHash,
            tx_type: txType,
            asset: asset,
            amount: amount,
            txr_earned: txrEarned,
            status: 'confirmed'
          });
      }
    } catch (err) {
      console.error('Error recording transaction:', err);
    }
  };

  // Auto-connect if wallet was previously connected
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            await connectWallet();
          }
        } catch (err) {
          console.error('Error checking wallet connection:', err);
        }
      }
    };

    checkConnection();
  }, []);

  return {
    isConnected,
    address,
    txrBalance,
    offChainBalance,
    loading,
    error,
    connectWallet,
    disconnectWallet,
    withdrawOffChain,
    loadBalances,
    recordTransaction
  };
};