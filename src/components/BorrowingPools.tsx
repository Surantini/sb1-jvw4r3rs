import React, { useState } from 'react';
import { ArrowDownLeft, AlertTriangle } from 'lucide-react';

const BorrowingPools: React.FC = () => {
  const [selectedPool, setSelectedPool] = useState<string | null>(null);
  const [borrowAmount, setBorrowAmount] = useState('');

  const pools = [
    {
      id: 'bnb',
      asset: 'BNB',
      icon: '🟡',
      apy: '10.2%',
      totalBorrow: '$1.8M',
      available: '$600K',
      myBorrow: '0 BNB',
      collateral: '125%',
      maxLTV: '75%',
    },
    {
      id: 'usdt',
      asset: 'USDT',
      icon: '💚',
      apy: '15.5%',
      totalBorrow: '$1.4M',
      available: '$400K',
      myBorrow: '1,200 USDT',
      collateral: '125%',
      maxLTV: '80%',
    },
    {
      id: 'btcb',
      asset: 'BTCB',
      icon: '🟠',
      apy: '8.9%',
      totalBorrow: '$650K',
      available: '$300K',
      myBorrow: '0 BTCB',
      collateral: '125%',
      maxLTV: '70%',
    },
    {
      id: 'eth',
      asset: 'ETH',
      icon: '🔷',
      apy: '9.5%',
      totalBorrow: '$850K',
      available: '$250K',
      myBorrow: '0 ETH',
      collateral: '125%',
      maxLTV: '75%',
    },
  ];

  const handleBorrow = (poolId: string) => {
    if (!borrowAmount) return;
    
    // Simulate borrowing transaction
    alert(`Borrowing ${borrowAmount} ${pools.find(p => p.id === poolId)?.asset} - Transaction submitted to BSC Testnet`);
    setBorrowAmount('');
    setSelectedPool(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Borrowing Pools</h2>
        <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg px-4 py-2">
          <span className="text-orange-400 text-sm">⚠️ Collateral required for borrowing</span>
        </div>
      </div>

      {/* Collateral Status */}
      <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
        <h3 className="text-lg font-bold text-white mb-4">Your Collateral</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 p-4 rounded-lg">
            <div className="text-gray-400 text-sm">Total Collateral</div>
            <div className="text-xl font-bold text-white">$18,750</div>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <div className="text-gray-400 text-sm">Available to Borrow</div>
            <div className="text-xl font-bold text-green-400">$14,062</div>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <div className="text-gray-400 text-sm">Health Factor</div>
            <div className="text-xl font-bold text-green-400">2.15</div>
          </div>
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
                  <p className="text-gray-400 text-sm">Max LTV: {pool.maxLTV}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-red-400">{pool.apy}</div>
                <div className="text-gray-400 text-sm">Borrow APY</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 p-3 rounded-lg">
                <div className="text-gray-400 text-sm">Available</div>
                <div className="text-white font-medium">{pool.available}</div>
              </div>
              <div className="bg-white/5 p-3 rounded-lg">
                <div className="text-gray-400 text-sm">Total Borrowed</div>
                <div className="text-white font-medium">{pool.totalBorrow}</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">My Borrow</span>
                <span className="text-gray-400">Collateral Ratio</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white font-medium">{pool.myBorrow}</span>
                <span className="text-blue-400 font-medium">{pool.collateral}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedPool(pool.id)}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <ArrowDownLeft className="h-5 w-5" />
              <span>Borrow {pool.asset}</span>
            </button>
          </div>
        ))}
      </div>

      {/* Borrowing Modal */}
      {selectedPool && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-md">
            <div className="p-6 border-b border-slate-700">
              <h3 className="text-xl font-bold text-white">
                Borrow {pools.find(p => p.id === selectedPool)?.asset}
              </h3>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Amount</label>
                <input
                  type="number"
                  value={borrowAmount}
                  onChange={(e) => setBorrowAmount(e.target.value)}
                  placeholder="0.0"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500"
                />
                <div className="text-xs text-gray-400 mt-1">
                  Available: {pools.find(p => p.id === selectedPool)?.available}
                </div>
              </div>

              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-orange-400" />
                  <span className="text-orange-400 text-sm font-medium">Liquidation Risk</span>
                </div>
                <p className="text-orange-400 text-sm">
                  Make sure to maintain adequate collateral to avoid liquidation
                </p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-blue-400 text-sm">
                  💡 You'll earn 2.5 TxR tokens for this borrowing transaction
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
                  onClick={() => handleBorrow(selectedPool)}
                  className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-3 rounded-lg transition-all duration-200"
                >
                  Borrow
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowingPools;