import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { bidAPI } from '../services/api';
import Card from '../components/Card';
import Timer from '../components/Timer';
import { ExternalLink, TrendingUp, DollarSign, Trophy, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const BuyerDashboard = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalBids: 0, winning: 0, outbid: 0, totalSpent: 0 });

  useEffect(() => {
    fetchBuyerBids();
  }, []);

  const fetchBuyerBids = async () => {
    try {
      const { data } = await bidAPI.getMyBids();
      setBids(data.bids);
      
      // Calculate stats
      const totalBids = data.bids.length;
      const winning = data.bids.filter(b => 
        b.auction_status === 'active' && parseFloat(b.amount) >= parseFloat(b.highest_bid || 0)
      ).length;
      const outbid = data.bids.filter(b => 
        b.auction_status === 'active' && parseFloat(b.amount) < parseFloat(b.highest_bid || 0)
      ).length;
      const totalSpent = data.bids
        .filter(b => b.auction_status === 'closed' && parseFloat(b.amount) >= parseFloat(b.highest_bid || 0))
        .reduce((sum, b) => sum + parseFloat(b.amount), 0);
      
      setStats({ totalBids, winning, outbid, totalSpent });
    } catch (error) {
      console.error('Error fetching bids:', error);
      toast.error('Failed to load your bids');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card p-6 h-24 shimmer"></div>
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-6 h-32 shimmer"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <p className="text-sm text-gray-400 mb-2">Total Bids</p>
          <p className="text-3xl font-bold text-primary-400">{stats.totalBids}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400 mb-2 flex items-center gap-1">
            <Trophy size={14} className="text-green-400" /> Winning
          </p>
          <p className="text-3xl font-bold text-green-400">{stats.winning}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400 mb-2">Outbid</p>
          <p className="text-3xl font-bold text-orange-400">{stats.outbid}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400 mb-2">Total Spent</p>
          <p className="text-3xl font-bold text-green-400">${stats.totalSpent.toFixed(2)}</p>
        </Card>
      </div>

      {/* Bids List */}
      {bids.length > 0 ? (
        <div className="space-y-4">
          {bids.map((bid) => {
            const isWinning = parseFloat(bid.amount) >= parseFloat(bid.highest_bid || 0);
            const isActive = bid.auction_status === 'active';
            
            return (
              <Card key={bid._id} hover={true}>
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <Link
                        to={`/auction/${bid.auction_id}`}
                        className="text-xl font-bold hover:text-primary-400 transition-colors flex items-center gap-2"
                      >
                        {bid.auction_title}
                        <ExternalLink size={16} />
                      </Link>
                      {isActive ? (
                        <span className="badge-active whitespace-nowrap">🔴 Active</span>
                      ) : (
                        <span className="badge-closed whitespace-nowrap">Closed</span>
                      )}
                    </div>

                    {/* Bid Details */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <div className="glass p-3 rounded-lg">
                        <p className="text-xs text-gray-400 mb-1">Your Bid</p>
                        <p className="text-lg font-bold text-primary-400">
                          ${parseFloat(bid.amount).toFixed(2)}
                        </p>
                      </div>
                      <div className="glass p-3 rounded-lg">
                        <p className="text-xs text-gray-400 mb-1">Current Price</p>
                        <p className="text-lg font-bold">
                          ${parseFloat(bid.highest_bid || bid.amount).toFixed(2)}
                        </p>
                      </div>
                      <div className="glass p-3 rounded-lg">
                        <p className="text-xs text-gray-400 mb-1">Total Bids</p>
                        <p className="text-lg font-bold flex items-center gap-1">
                          <TrendingUp size={14} /> {bid.bid_count || 1}
                        </p>
                      </div>
                    </div>

                    {/* Bid Status */}
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="text-sm">
                        <span className="text-gray-400">Placed: </span>
                        <span className="font-semibold">
                          {new Date(bid.bid_time || bid.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      
                      {isActive && (
                        <>
                          {isWinning ? (
                            <span className="flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
                              <Trophy size={14} /> Winning Bid!
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-semibold">
                              <TrendingUp size={14} /> Outbid by ${(parseFloat(bid.highest_bid) - parseFloat(bid.amount)).toFixed(2)}
                            </span>
                          )}
                        </>
                      )}
                      
                      {!isActive && isWinning && (
                        <span className="flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
                          <Trophy size={14} /> Won!
                        </span>
                      )}
                    </div>

                    {/* Timer for Active Auctions */}
                    {isActive && bid.auction_end_time && (
                      <div className="glass p-3 rounded-lg inline-block">
                        <Timer endTime={bid.auction_end_time} />
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <Link to={`/auction/${bid.auction_id}`}>
                    <button className="btn-primary whitespace-nowrap">
                      {isActive && !isWinning ? 'Bid Again' : 'View Auction'}
                    </button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 glass-card rounded-2xl">
          <p className="text-xl text-gray-400 mb-4">You haven't placed any bids yet</p>
          <p className="text-gray-500 mb-6">Browse auctions and start bidding!</p>
          <Link to="/">
            <button className="btn-primary">Browse Auctions</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default BuyerDashboard;
