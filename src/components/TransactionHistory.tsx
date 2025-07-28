import React, { useState } from 'react';
import { ExternalLink, Filter, ArrowUpRight, ArrowDownLeft, Gift, Users } from 'lucide-react';

const TransactionHistory: React.FC = () => {
  const [filterType, setFilterType] = useState('all');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const transactions = [
    {
      id: '0x9a7f...3d2c',
      type: 'lend',
      asset: 'BNB',
      amount: '2.5',
      value: '$750.00',
      txrEarned: '5.2',
      timestamp: '2 hours ago',
      status: 'confirmed',
    },
    {
      id: '0x1b8e...4a9f',
      type: 'borrow',
      asset: 'USDT',
      amount: '1,200',
      value: '$1,200.00',
      txrEarned: '3.8',
      timestamp: '4 hours ago',
      status: 'confirmed',
    },
    {
      id: '0x5c2d...7e1a',
      type: 'referral',
      asset: 'TxR',
      amount: '18.7',
      value: '$37.40',
      txrEarned: '18.7',
      timestamp: '1 day ago',
      status: 'confirmed',
    },
    {
      id: '0x8f4a...2b6c',
      type: 'reward',
      asset: 'TxR',
      amount: '45.2',
      value: '$90.40',
      txrEarned: '45.2',
      timestamp: '2 days ago',
      status: 'confirmed',
    },
    {
      id: '0x3e9b...5d7f',
      type: 'withdraw',
      asset: 'TxR',
      amount: '100.0',
      value: '$200.00',
      txrEarned: '0',
      timestamp: '3 days ago',
      status: 'confirmed',
    },
  ];

  const filteredTransactions = filterType === 'all' 
    ? transactions 
    : transactions.filter(tx => tx.type === filterType);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lend':
        return <ArrowUpRight className="h-4 w-4 text-green-400" />;
      case 'borrow':
        return <ArrowDownLeft className="h-4 w-4 text-red-400" />;
      case 'referral':
        return <Users className="h-4 w-4 text-purple-400" />;
      case 'reward':
        return <Gift className="h-4 w-4 text-yellow-400" />;
      case 'withdraw':
        return <ExternalLink className="h-4 w-4 text-blue-400" />;
      default:
        return <ExternalLink className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lend':
        return 'bg-green-500/20 text-green-400';
      case 'borrow':
        return 'bg-red-500/20 text-red-400';
      case 'referral':
        return 'bg-purple-500/20 text-purple-400';
      case 'reward':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'withdraw':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const handleWithdraw = () => {
    if (!withdrawAmount) return;
    alert(`Withdrawing ${withdrawAmount} TxR to BSC Testnet - Transaction submitted`);
    setWithdrawAmount('');
    setShowWithdrawModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-white">Transaction History</h2>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Withdraw TxR</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-white/5 backdrop-blur-sm p-1 rounded-lg">
        {[
          { id: 'all', label: 'All' },
          { id: 'lend', label: 'Lending' },
          { id: 'borrow', label: 'Borrowing' },
          { id: 'referral', label: 'Referral' },
          { id: 'reward', label: 'Rewards' },
          { id: 'withdraw', label: 'Withdrawals' },
        ].map((filter) => (
          <button
            key={filter.id}
            onClick={() => setFilterType(filter.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              filterType === filter.id
                ? 'bg-white/20 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Transaction Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
          <div className="text-gray-400 text-sm">Total TxR Earned</div>
          <div className="text-2xl font-bold text-yellow-400">1,250.75</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
          <div className="text-gray-400 text-sm">Available to Withdraw</div>
          <div className="text-2xl font-bold text-green-400">1,150.75</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
          <div className="text-gray-400 text-sm">Total Volume</div>
          <div className="text-2xl font-bold text-white">$45,230</div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left text-gray-400 p-4 font-medium">Type</th>
                <th className="text-left text-gray-400 p-4 font-medium">Asset</th>
                <th className="text-left text-gray-400 p-4 font-medium">Amount</th>
                <th className="text-left text-gray-400 p-4 font-medium">TxR Earned</th>
                <th className="text-left text-gray-400 p-4 font-medium">Time</th>
                <th className="text-left text-gray-400 p-4 font-medium">Hash</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx, index) => (
                <tr key={index} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(tx.type)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(tx.type)}`}>
                        {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-white font-medium">{tx.asset}</td>
                  <td className="p-4">
                    <div className="text-white font-medium">{tx.amount}</div>
                    <div className="text-gray-400 text-sm">{tx.value}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-yellow-400 font-medium">
                      {tx.txrEarned !== '0' ? `+${tx.txrEarned} TxR` : '-'}
                    </div>
                  </td>
                  <td className="p-4 text-gray-300">{tx.timestamp}</td>
                  <td className="p-4">
                    <button className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors">
                      <span className="font-mono text-sm">{tx.id}</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-md">
            <div className="p-6 border-b border-slate-700">
              <h3 className="text-xl font-bold text-white">Withdraw TxR Tokens</h3>
              <p className="text-gray-400 text-sm mt-1">Transfer your off-chain TxR to BSC Testnet</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Amount (TxR)</label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0.0"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                />
                <div className="text-xs text-gray-400 mt-1">
                  Available: 1,150.75 TxR
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <h4 className="text-blue-400 font-medium mb-2">Withdrawal Info:</h4>
                <ul className="text-blue-400 text-sm space-y-1">
                  <li>• Minimum withdrawal: 10 TxR</li>
                  <li>• Network fee: ~0.001 BNB</li>
                  <li>• Processing time: 1-5 minutes</li>
                  <li>• Tokens will be sent to your connected wallet</li>
                </ul>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWithdraw}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 rounded-lg transition-all duration-200"
                >
                  Withdraw
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;