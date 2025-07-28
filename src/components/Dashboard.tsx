import React from 'react';
import { TrendingUp, DollarSign, Users, Zap, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface DashboardProps {
  txrBalance: number;
}

const Dashboard: React.FC<DashboardProps> = ({ txrBalance }) => {
  const stats = [
    {
      title: 'Total TxR Earned',
      value: txrBalance.toLocaleString(),
      change: '+12.5%',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
    },
    {
      title: 'Total Lent',
      value: '$15,420',
      change: '+8.2%',
      icon: ArrowUpRight,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Total Borrowed',
      value: '$8,750',
      change: '+3.1%',
      icon: ArrowDownLeft,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Referral Earnings',
      value: '432 TxR',
      change: '+15.7%',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
    },
  ];

  const recentTransactions = [
    { type: 'lend', asset: 'BNB', amount: '2.5', apy: '8.5%', status: 'Active' },
    { type: 'borrow', asset: 'USDT', amount: '1,200', apy: '12.3%', status: 'Active' },
    { type: 'reward', asset: 'TxR', amount: '45.2', apy: '-', status: 'Completed' },
    { type: 'referral', asset: 'TxR', amount: '18.7', apy: '-', status: 'Completed' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-green-400 text-sm font-medium">{stat.change}</span>
              </div>
              <h3 className="text-gray-400 text-sm font-medium mb-2">{stat.title}</h3>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Chart */}
        <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
          <h3 className="text-xl font-bold text-white mb-6">TxR Earnings Over Time</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {[65, 85, 45, 95, 75, 105, 125, 90, 110, 130, 95, 125].map((height, index) => (
              <div
                key={index}
                className="bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t-sm flex-1 transition-all duration-300 hover:from-cyan-400 hover:to-blue-400"
                style={{ height: `${height}px` }}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-4">
            <span>Jan</span>
            <span>Dec</span>
          </div>
        </div>

        {/* Pool Distribution */}
        <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
          <h3 className="text-xl font-bold text-white mb-6">Asset Distribution</h3>
          <div className="space-y-4">
            {[
              { asset: 'BNB', percentage: 35, color: 'bg-yellow-500' },
              { asset: 'USDT', percentage: 28, color: 'bg-green-500' },
              { asset: 'BTCB', percentage: 20, color: 'bg-orange-500' },
              { asset: 'ETH', percentage: 17, color: 'bg-blue-500' },
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-12 text-gray-300 text-sm">{item.asset}</div>
                <div className="flex-1 bg-white/10 rounded-full h-3">
                  <div
                    className={`${item.color} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <div className="w-12 text-white text-sm font-medium">{item.percentage}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
        <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-gray-400 pb-4 font-medium">Type</th>
                <th className="text-left text-gray-400 pb-4 font-medium">Asset</th>
                <th className="text-left text-gray-400 pb-4 font-medium">Amount</th>
                <th className="text-left text-gray-400 pb-4 font-medium">APY</th>
                <th className="text-left text-gray-400 pb-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="space-y-4">
              {recentTransactions.map((tx, index) => (
                <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      tx.type === 'lend' ? 'bg-green-500/20 text-green-400' :
                      tx.type === 'borrow' ? 'bg-blue-500/20 text-blue-400' :
                      tx.type === 'reward' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-purple-500/20 text-purple-400'
                    }`}>
                      {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 text-white font-medium">{tx.asset}</td>
                  <td className="py-4 text-white">{tx.amount}</td>
                  <td className="py-4 text-gray-300">{tx.apy}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      tx.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;