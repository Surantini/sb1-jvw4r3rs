import React, { useState, useEffect } from 'react';
import { Wallet, TrendingUp, Users, ArrowUpRight, ArrowDownLeft, Copy, ExternalLink, Shield, Zap } from 'lucide-react';
import WalletConnection from './components/WalletConnection';
import Dashboard from './components/Dashboard';
import LendingPools from './components/LendingPools';
import BorrowingPools from './components/BorrowingPools';
import ReferralSystem from './components/ReferralSystem';
import TransactionHistory from './components/TransactionHistory';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [txrBalance, setTxrBalance] = useState(1250.75);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'lending', label: 'Lending', icon: ArrowUpRight },
    { id: 'borrowing', label: 'Borrowing', icon: ArrowDownLeft },
    { id: 'referral', label: 'Referral', icon: Users },
    { id: 'history', label: 'History', icon: ExternalLink },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard txrBalance={txrBalance} />;
      case 'lending':
        return <LendingPools />;
      case 'borrowing':
        return <BorrowingPools />;
      case 'referral':
        return <ReferralSystem />;
      case 'history':
        return <TransactionHistory />;
      default:
        return <Dashboard txrBalance={txrBalance} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  TxRate
                </h1>
                <p className="text-xs text-gray-400">BSC Testnet</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {connectedWallet && (
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                  <div className="text-sm text-gray-300">TxR Balance</div>
                  <div className="text-lg font-bold text-white">{txrBalance.toLocaleString()}</div>
                </div>
              )}
              
              <WalletConnection 
                connectedWallet={connectedWallet}
                setConnectedWallet={setConnectedWallet}
                walletAddress={walletAddress}
                setWalletAddress={setWalletAddress}
              />
            </div>
          </div>
        </div>
      </header>

      {!connectedWallet ? (
        /* Landing Page */
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4">
          <div className="text-center max-w-4xl">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-full w-20 h-20 mx-auto mb-8">
              <Zap className="h-12 w-12 text-white" />
            </div>
            
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 bg-clip-text text-transparent">
              TxRate Protocol
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Earn TxR tokens with every transaction on BSC Testnet. 
              Lend, borrow, and multiply your crypto earnings through our innovative DeFi protocol.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                <Shield className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Secure Lending</h3>
                <p className="text-gray-400">Earn competitive APY on your crypto assets with smart contract security</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                <TrendingUp className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Transaction Rewards</h3>
                <p className="text-gray-400">Get paid TxR tokens for every smart contract interaction</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                <Users className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Referral System</h3>
                <p className="text-gray-400">Boost your earnings by referring friends to the platform</p>
              </div>
            </div>

            <WalletConnection 
              connectedWallet={connectedWallet}
              setConnectedWallet={setConnectedWallet}
              walletAddress={walletAddress}
              setWalletAddress={setWalletAddress}
            />
          </div>
        </div>
      ) : (
        /* Main Application */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation Tabs */}
          <div className="flex space-x-1 bg-white/5 backdrop-blur-sm p-1 rounded-xl mb-8 border border-white/10">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="hidden sm:block">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content */}
          {renderContent()}
        </div>
      )}
    </div>
  );
}

export default App;