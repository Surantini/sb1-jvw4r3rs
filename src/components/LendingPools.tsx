import React, { useState } from 'react';
import { ArrowUpRight, Info } from 'lucide-react';

interface LendingPoolsProps {
  userAddress: string;
}

const LendingPools: React.FC<LendingPoolsProps> = ({ userAddress }) => {
  const [selectedPool, setSelectedPool] = useState<string | null>(null);
  const [lendAmount, setLendAmount] = useState('');

  const pools = [
    {
      id: 'bnb',
      asset: 'BNB',
      icon: '🟡',
      apy: '8.5%',
      totalSupply: '$2.4M',
      utilization: '75%',
      mySupply: '2.5 BNB',
      available: '12.8 BNB',
      description: 'Binance Coin lending pool with competitive returns'
    },
    {
      id: 'usdt',
      asset: 'USDT',
      icon: '💚',
      apy: '12.3%',
      totalSupply: '$1.8M',
      utilization: '82%',
      mySupply: '1,200 USDT',
      available: '5,420 USDT',
      description: 'Stable coin lending with high APY'
    },
    {
      id: 'btcb',
      asset: 'BTCB',
      icon: '🟠',
      apy: '6.8%',
      totalSupply: '$950K',
      utilization: '68%',
      mySupply: '0.05 BTCB',
      available: '2.1 BTCB',
      description: 'Bitcoin pegged token lending pool'
    },
    {
      id: 'eth',
      asset: 'ETH',
      icon: '🔷',
      apy: '7.2%',
      totalSupply: '$1.2M',
      utilization: '71%',
      mySupply: '0.8 ETH',
      available: '8.5 ETH',
      description: 'Ethereum lending pool with steady returns'
    },
  ];

  const handleLend = (poolId: string) => {
    if (!lendAmount) return;
    
    // Simulate lending transaction
    alert(`Lending ${lendAmount} ${pools.find(p => p.id === poolId)?.asset} - Transaction submitted to BSC Testnet`);
    setLendAmount('');
    setSelectedPool(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Lending Pools</h2>
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg px-4 py-2">
          <span className="text-blue-400 text-sm">💡 Earn TxR tokens on every lending transaction</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pools.map((pool) => (
          <div
            key={pool.id}
            className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{pool.icon}</span>
                <div>
                  <h3 className="text-xl font-bold text-white">{pool.asset}</h3>
                  <p className="text-gray-400 text-sm">{pool.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-400">{pool.apy}</div>
                <div className="text-gray-400 text-sm">APY</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 p-3 rounded-lg">
                <div className="text-gray-400 text-sm">Total Supply</div>
                <div className="text-white font-medium">{pool.totalSupply}</div>
              </div>
              <div className="bg-white/5 p-3 rounded-lg">
                <div className="text-gray-400 text-sm">Utilization</div>
                <div className="text-white font-medium">{pool.utilization}</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">My Supply</span>
                <span className="text-gray-400">Available</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white font-medium">{pool.mySupply}</span>
                <span className="text-green-400 font-medium">{pool.available}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedPool(pool.id)}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <ArrowUpRight className="h-5 w-5" />
              <span>Supply {pool.asset}</span>
            </button>
          </div>
        ))}
      </div>

      {/* Lending Modal */}
      {selectedPool && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-md">
            <div className="p-6 border-b border-slate-700">
              <h3 className="text-xl font-bold text-white">
                Supply {pools.find(p => p.id === selectedPool)?.asset}
              </h3>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Amount</label>
                <input
                  type="number"
                  value={lendAmount}
                  onChange={(e) => setLendAmount(e.target.value)}
                  placeholder="0.0"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
                />
                <div className="text-xs text-gray-400 mt-1">
                  Available: {pools.find(p => p.id === selectedPool)?.available}
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Info className="h-4 w-4 text-green-400" />
                  <span className="text-green-400 text-sm font-medium">Transaction Reward</span>
                </div>
                <p className="text-green-400 text-sm">
                  You'll earn approximately 2.5 TxR tokens for this lending transaction
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedPool(null)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleLend(selectedPool)}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 rounded-lg transition-all duration-200"
                >
                  Supply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LendingPools;