import React, { useState } from 'react';
import { Wallet, ChevronDown, X } from 'lucide-react';
import { web3Service } from '../lib/web3';

interface WalletConnectionProps {
  connectedWallet: string | null;
  setConnectedWallet: (wallet: string | null) => void;
  walletAddress: string;
  setWalletAddress: (address: string) => void;
}

const wallets = [
  { id: 'metamask', name: 'MetaMask', icon: '🦊' },
  { id: 'binance', name: 'Binance Wallet', icon: '🟡' },
  { id: 'okx', name: 'OKX Wallet', icon: '⭕' },
  { id: 'bitget', name: 'Bitget Wallet', icon: '🚀' },
  { id: 'trustwallet', name: 'Trust Wallet', icon: '🛡️' },
  { id: 'walletconnect', name: 'WalletConnect', icon: '🔗' },
];

const WalletConnection: React.FC<WalletConnectionProps> = ({
  connectedWallet,
  setConnectedWallet,
  walletAddress,
  setWalletAddress,
}) => {
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string>('');

  const connectWallet = async (walletId: string) => {
    if (connecting) return;
    
    setConnecting(true);
    setError('');
    
    try {
      const address = await web3Service.connectWallet(walletId);
      setConnectedWallet(walletId);
      setWalletAddress(address);
      setShowWalletModal(false);
      console.log('Wallet connected:', walletId, address);
    } catch (err: any) {
      console.error('Wallet connection error:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setConnectedWallet(null);
    setWalletAddress('');
  };

  if (connectedWallet) {
    const wallet = wallets.find(w => w.id === connectedWallet);
    return (
      <div className="relative">
        <button
          onClick={() => setShowWalletModal(true)}
          className="flex items-center space-x-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 shadow-lg"
        >
          <span className="text-lg">{wallet?.icon}</span>
          <div className="text-left">
            <div className="text-sm font-medium">{wallet?.name}</div>
            <div className="text-xs opacity-90">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </div>
          </div>
          <ChevronDown className="h-4 w-4" />
        </button>

        {showWalletModal && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
            <div className="p-4 border-b border-slate-700">
              <h3 className="text-white font-medium">Connected Wallet</h3>
              <p className="text-gray-400 text-sm break-all">{walletAddress}</p>
            </div>
            <div className="p-2">
              <button
                onClick={disconnectWallet}
                className="w-full text-left px-3 py-2 text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Disconnect Wallet
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowWalletModal(true)}
        className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 shadow-lg"
      >
        <Wallet className="h-5 w-5" />
        <span>Connect Wallet</span>
      </button>

      {showWalletModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">Connect Wallet</h2>
              <button
                onClick={() => setShowWalletModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-3">
              <p className="text-gray-400 text-sm mb-4">
                Choose your preferred wallet to connect to BSC Testnet
              </p>
              
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {wallets.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => connectWallet(wallet.id)}
                  disabled={connecting}
                  className="w-full flex items-center space-x-4 p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg border border-slate-600 hover:border-slate-500 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-2xl">{wallet.icon}</span>
                  <div className="flex-1 text-left">
                    <div className="text-white font-medium group-hover:text-cyan-400 transition-colors">
                      {connecting ? 'Connecting...' : wallet.name}
                    </div>
                    <div className="text-gray-400 text-sm">Connect using {wallet.name}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="p-6 pt-0">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-blue-400 text-sm">
                  ⚠️ Make sure you're connected to BSC Testnet network (Chain ID: 97)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WalletConnection;