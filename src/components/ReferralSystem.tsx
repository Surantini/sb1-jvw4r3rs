import React, { useState } from 'react';
import { Users, Copy, Share, Gift, TrendingUp } from 'lucide-react';

const ReferralSystem: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const referralCode = 'TXR-A7B9C2D1';
  const referralLink = `https://txrate.app/ref/${referralCode}`;

  const stats = [
    { label: 'Total Referrals', value: '23', icon: Users, color: 'text-blue-400' },
    { label: 'Active Referrals', value: '18', icon: TrendingUp, color: 'text-green-400' },
    { label: 'Total Earned', value: '432 TxR', icon: Gift, color: 'text-purple-400' },
    { label: 'This Month', value: '87 TxR', icon: Share, color: 'text-yellow-400' },
  ];

  const referralHistory = [
    { user: '0x7a3b...9f2c', joined: '2 days ago', earned: '15.5 TxR', status: 'Active' },
    { user: '0x9c4d...1a8e', joined: '5 days ago', earned: '23.2 TxR', status: 'Active' },
    { user: '0x2f8a...6b3d', joined: '1 week ago', earned: '41.8 TxR', status: 'Active' },
    { user: '0x8e1c...4f9a', joined: '2 weeks ago', earned: '62.3 TxR', status: 'Active' },
    { user: '0x5a9b...2c7e', joined: '3 weeks ago', earned: '38.7 TxR', status: 'Inactive' },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Referral Program</h2>
        <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg px-4 py-2">
          <span className="text-purple-400 text-sm">🎯 Earn 10% of referral earnings</span>
        </div>
      </div>

      {/* Referral Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10"
            >
              <div className="flex items-center space-x-3 mb-2">
                <Icon className={`h-6 w-6 ${stat.color}`} />
                <span className="text-gray-400 text-sm">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
            </div>
          );
        })}
      </div>

      {/* Referral Link Section */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm p-6 rounded-xl border border-purple-500/20">
        <h3 className="text-xl font-bold text-white mb-4">Your Referral Link</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Referral Code</label>
            <div className="flex items-center space-x-3">
              <div className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white font-mono">
                {referralCode}
              </div>
              <button
                onClick={() => copyToClipboard(referralCode)}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Copy className="h-4 w-4" />
                <span className="hidden sm:block">{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Referral Link</label>
            <div className="flex items-center space-x-3">
              <div className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm">
                {referralLink}
              </div>
              <button
                onClick={() => copyToClipboard(referralLink)}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Share className="h-4 w-4" />
                <span className="hidden sm:block">Share</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white/5 p-4 rounded-lg">
          <h4 className="text-white font-medium mb-2">How it works:</h4>
          <ul className="text-gray-400 text-sm space-y-1">
            <li>• Share your referral link with friends</li>
            <li>• When they sign up and start trading, you earn 10% of their TxR rewards</li>
            <li>• Your referrals also get bonus TxR tokens for joining</li>
            <li>• No limit on referrals - invite unlimited friends!</li>
          </ul>
        </div>
      </div>

      {/* Referral History */}
      <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
        <h3 className="text-xl font-bold text-white mb-6">Referral History</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-gray-400 pb-4 font-medium">User</th>
                <th className="text-left text-gray-400 pb-4 font-medium">Joined</th>
                <th className="text-left text-gray-400 pb-4 font-medium">Earned for You</th>
                <th className="text-left text-gray-400 pb-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {referralHistory.map((referral, index) => (
                <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 text-white font-mono text-sm">{referral.user}</td>
                  <td className="py-4 text-gray-300">{referral.joined}</td>
                  <td className="py-4 text-purple-400 font-medium">{referral.earned}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      referral.status === 'Active' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {referral.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Social Sharing */}
      <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">Share on Social Media</h3>
        <div className="flex space-x-4">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors">
            Share on Twitter
          </button>
          <button className="flex-1 bg-blue-800 hover:bg-blue-900 text-white py-3 rounded-lg transition-colors">
            Share on Facebook
          </button>
          <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors">
            Share on WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReferralSystem;