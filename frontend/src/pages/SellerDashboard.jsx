import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { auctionAPI } from '../services/api';
import Card from '../components/Card';
import Timer from '../components/Timer';
import { ExternalLink, TrendingUp, DollarSign, Clock, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const SellerDashboard = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0, closed: 0, totalRevenue: 0 });

  useEffect(() => {
    fetchSellerAuctions();
  }, []);

  const fetchSellerAuctions = async () => {
    try {
      const { data } = await auctionAPI.getSellerAuctions();
      setAuctions(data.auctions);
      
      // Calculate stats
      const total = data.auctions.length;
      const active = data.auctions.filter(a => a.status === 'active').length;
      const closed = data.auctions.filter(a => a.status === 'closed').length;
      const totalRevenue = data.auctions
        .filter(a => a.status === 'closed')
        .reduce((sum, a) => sum + parseFloat(a.current_price || a.starting_price), 0);
      
      setStats({ total, active, closed, totalRevenue });
    } catch (error) {
      console.error('Error fetching auctions:', error);
      toast.error('Failed to load your auctions');
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-6 h-96 shimmer"></div>
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
          <p className="text-sm text-gray-400 mb-2">Total Auctions</p>
          <p className="text-3xl font-bold text-primary-400">{stats.total}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400 mb-2">Active Auctions</p>
          <p className="text-3xl font-bold text-green-400">{stats.active}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400 mb-2">Closed Auctions</p>
          <p className="text-3xl font-bold text-gray-400">{stats.closed}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400 mb-2">Total Revenue</p>
          <p className="text-3xl font-bold text-green-400">${stats.totalRevenue.toFixed(2)}</p>
        </Card>
      </div>

      {/* Auctions List */}
      {auctions.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {auctions.map((auction) => (
            <Card key={auction._id} hover={true}>
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Image */}
                <div className="w-full lg:w-48 h-48 rounded-xl overflow-hidden flex-shrink-0">
                  {auction.image_url ? (
                    <img
                      src={auction.image_url}
                      alt={auction.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-600/20 to-primary-800/20 flex items-center justify-center">
                      <DollarSign size={64} className="text-primary-400/30" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link
                        to={`/auction/${auction._id}`}
                        className="text-2xl font-bold hover:text-primary-400 transition-colors flex items-center gap-2"
                      >
                        {auction.title}
                        <ExternalLink size={20} />
                      </Link>
                      {auction.description && (
                        <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                          {auction.description}
                        </p>
                      )}
                    </div>
                    {auction.status === 'active' ? (
                      <span className="badge-active whitespace-nowrap">🔴 Active</span>
                    ) : (
                      <span className="badge-closed whitespace-nowrap">Closed</span>
                    )}
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="glass p-3 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">Starting Price</p>
                      <p className="font-bold text-green-400">
                        ${parseFloat(auction.starting_price).toFixed(2)}
                      </p>
                    </div>
                    <div className="glass p-3 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">Current Price</p>
                      <p className="font-bold text-primary-400">
                        ${parseFloat(auction.current_price || auction.starting_price).toFixed(2)}
                      </p>
                    </div>
                    <div className="glass p-3 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                        <TrendingUp size={12} /> Bids
                      </p>
                      <p className="font-bold">{auction.bid_count || 0}</p>
                    </div>
                    <div className="glass p-3 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                        <Clock size={12} /> Duration
                      </p>
                      <p className="font-bold">{auction.duration} days</p>
                    </div>
                  </div>

                  {/* Date Info */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Started: </span>
                      <span className="font-semibold">
                        {new Date(auction.start_time).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Ends: </span>
                      <span className="font-semibold">
                        {new Date(auction.end_time).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Timer for Active Auctions */}
                  {auction.status === 'active' && (
                    <div className="glass p-3 rounded-lg inline-block">
                      <Timer endTime={auction.end_time} />
                    </div>
                  )}

                  {/* Action Button */}
                  <Link to={`/auction/${auction._id}`}>
                    <button className="btn-primary flex items-center gap-2">
                      <Eye size={16} />
                      View Details & Bids
                    </button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-20 glass-card rounded-2xl">
          <p className="text-xl text-gray-400 mb-4">You haven't created any auctions yet</p>
          <p className="text-gray-500">Start selling by creating your first auction!</p>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
