import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, TrendingUp, DollarSign, MessageCircle } from 'lucide-react';
import { auctionAPI, bidAPI } from '../services/api';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Timer from '../components/Timer';
import Button from '../components/Button';
import Input from '../components/Input';
import toast from 'react-hot-toast';

const AuctionDetails = () => {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const { socket } = useSocket();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchAuctionDetails();
    fetchBids();
  }, [id]);

  useEffect(() => {
    if (!socket) return;

    socket.on('new_bid', ({ auctionId, highestBid, buyerUsername }) => {
      if (auctionId === id) {
        setAuction((prev) => ({
          ...prev,
          current_price: highestBid,
          bid_count: (prev.bid_count || 0) + 1,
        }));
        fetchBids();
        
        if (user && buyerUsername !== user.username) {
          toast('New bid placed!', { icon: '📢' });
        }
      }
    });

    socket.on('timer_tick', ({ auctionId, status }) => {
      if (auctionId === id && status === 'closed') {
        setAuction((prev) => ({ ...prev, status: 'closed' }));
        toast.success('Auction has ended!');
      }
    });

    return () => {
      socket.off('new_bid');
      socket.off('timer_tick');
    };
  }, [socket, id, user]);

  const fetchAuctionDetails = async () => {
    try {
      const { data } = await auctionAPI.getById(id);
      setAuction(data.auction);
      setBidAmount(String(parseFloat(data.auction.current_price) + 1));
    } catch (error) {
      console.error('Error fetching auction:', error);
      toast.error('Failed to load auction details');
    } finally {
      setLoading(false);
    }
  };

  const fetchBids = async () => {
    try {
      const { data } = await auctionAPI.getBids(id);
      setBids(data.bids);
    } catch (error) {
      console.error('Error fetching bids:', error);
    }
  };

  const handlePlaceBid = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to place a bid');
      return;
    }

    if (user?.role !== 'buyer') {
      toast.error('Only buyers can place bids');
      return;
    }

    setPlacing(true);

    try {
      await bidAPI.place({
        auctionId: id,
        amount: parseFloat(bidAmount),
      });
      toast.success('Bid placed successfully!');
      setBidAmount(String(parseFloat(bidAmount) + 1));
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to place bid';
      toast.error(message);
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4">
        <div className="glass-card p-8 h-96 shimmer"></div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="container mx-auto px-4 text-center py-20">
        <p className="text-xl text-gray-400">Auction not found</p>
      </div>
    );
  }

  const isActive = auction.status === 'active';
  const currentPrice = auction.highest_bid || auction.current_price || auction.starting_price;

  return (
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid lg:grid-cols-3 gap-8"
      >
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            {/* Image */}
            <div className="relative h-96 rounded-xl overflow-hidden mb-6">
              {auction.image_url ? (
                <img
                  src={auction.image_url}
                  alt={auction.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-600/20 to-primary-800/20 flex items-center justify-center">
                  <DollarSign size={128} className="text-primary-400/30" />
                </div>
              )}
              <div className="absolute top-4 right-4">
                {isActive ? (
                  <span className="badge-live text-lg px-4 py-2">🔴 LIVE</span>
                ) : (
                  <span className="badge-closed text-lg px-4 py-2">CLOSED</span>
                )}
              </div>
            </div>

            {/* Title and Description */}
            <h1 className="text-3xl font-bold mb-4">{auction.title}</h1>
            {auction.description && (
              <p className="text-gray-400 mb-6 leading-relaxed">{auction.description}</p>
            )}

            {/* Auction Details Grid */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="glass p-4 rounded-xl">
                <p className="text-sm text-gray-400 mb-1">Starting Price</p>
                <p className="text-xl font-bold text-green-400">
                  ${parseFloat(auction.starting_price).toFixed(2)}
                </p>
              </div>
              <div className="glass p-4 rounded-xl">
                <p className="text-sm text-gray-400 mb-1">Current Price</p>
                <p className="text-xl font-bold text-primary-400">
                  ${parseFloat(currentPrice).toFixed(2)}
                </p>
              </div>
              <div className="glass p-4 rounded-xl">
                <p className="text-sm text-gray-400 mb-1">Started</p>
                <p className="text-sm font-semibold">
                  {new Date(auction.start_time).toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </p>
              </div>
              <div className="glass p-4 rounded-xl">
                <p className="text-sm text-gray-400 mb-1">Ends</p>
                <p className="text-sm font-semibold">
                  {new Date(auction.end_time).toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </p>
              </div>
              <div className="glass p-4 rounded-xl">
                <p className="text-sm text-gray-400 mb-1">Duration</p>
                <p className="text-sm font-semibold">{auction.duration} days</p>
              </div>
              <div className="glass p-4 rounded-xl">
                <p className="text-sm text-gray-400 mb-1">Total Bids</p>
                <p className="text-xl font-bold text-primary-400">{auction.bid_count || 0}</p>
              </div>
            </div>

            {/* Seller Info */}
            <div className="flex items-center gap-3 glass p-4 rounded-xl">
              <User className="text-primary-400" />
              <div>
                <p className="text-sm text-gray-400">Seller</p>
                <Link
                  to={`/profile/${auction.seller_id}`}
                  className="font-semibold hover:text-primary-400 transition-colors"
                >
                  {auction.seller_username}
                </Link>
              </div>
            </div>
          </Card>

          {/* Bid History */}
          <Card>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="text-primary-400" />
              Bid History ({bids.length})
            </h2>
            {bids.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {bids.map((bid, index) => (
                  <div
                    key={bid._id}
                    className={`flex justify-between items-center p-4 rounded-xl ${
                      index === 0 ? 'bg-primary-500/20 border border-primary-500/30' : 'glass'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <User size={20} className="text-gray-400" />
                      <div>
                        <p className="font-semibold">{bid.buyer_username}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(bid.bid_time || bid.created_at).toLocaleString('en-US', {
                            dateStyle: 'short',
                            timeStyle: 'short'
                          })}
                        </p>
                      </div>
                    </div>
                    <p className="text-xl font-bold text-primary-400">
                      ${parseFloat(bid.amount).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No bids yet. Be the first!</p>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price Card */}
          <Card>
            <h3 className="text-sm text-gray-400 mb-2">Current Price</h3>
            <p className="text-4xl font-bold text-primary-400 mb-4">
              ${parseFloat(currentPrice).toFixed(2)}
            </p>
            <div className="glass p-3 rounded-xl mb-4">
              <p className="text-sm text-gray-400">Bids</p>
              <p className="text-2xl font-bold">{auction.bid_count || 0}</p>
            </div>
            {isActive && (
              <div className="glass p-3 rounded-xl">
                <Timer endTime={auction.end_time} />
              </div>
            )}
          </Card>

          {/* Bid Form */}
          {isActive && isAuthenticated && user?.role === 'buyer' && (
            <Card>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MessageCircle className="text-primary-400" />
                Place Your Bid
              </h3>
              <form onSubmit={handlePlaceBid} className="space-y-4">
                <Input
                  type="number"
                  step="0.01"
                  min={parseFloat(currentPrice) + 0.01}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  icon={<DollarSign size={20} />}
                  placeholder="Enter bid amount"
                  required
                />
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  loading={placing}
                >
                  Place Bid
                </Button>
              </form>
              <p className="text-xs text-gray-400 mt-3">
                Minimum bid: ${(parseFloat(currentPrice) + 0.01).toFixed(2)}
              </p>
            </Card>
          )}

          {!isAuthenticated && isActive && (
            <Card>
              <p className="text-gray-400 mb-4">Login to place a bid</p>
              <Link to="/login">
                <Button variant="primary" className="w-full">
                  Login
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AuctionDetails;
