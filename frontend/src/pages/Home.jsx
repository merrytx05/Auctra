import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { auctionAPI } from '../services/api';
import { useSocket } from '../context/SocketContext';
import AuctionCard from '../components/AuctionCard';
import Input from '../components/Input';
import toast from 'react-hot-toast';

const Home = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('active');
  const { socket } = useSocket();

  useEffect(() => {
    fetchAuctions();
  }, [filter]);

  useEffect(() => {
    if (!socket) return;

    // Listen for new auctions
    socket.on('auction_created', (newAuction) => {
      setAuctions((prev) => [newAuction, ...prev]);
      toast.success('New auction just listed!', {
        icon: '🔥',
      });
    });

    // Listen for new bids
    socket.on('new_bid', ({ auctionId, highestBid }) => {
      setAuctions((prev) =>
        prev.map((auction) =>
          auction._id === auctionId
            ? { ...auction, current_price: highestBid, bid_count: (auction.bid_count || 0) + 1 }
            : auction
        )
      );
    });

    // Listen for timer updates
    socket.on('timer_tick', ({ auctionId, status }) => {
      if (status === 'closed') {
        setAuctions((prev) =>
          prev.map((auction) =>
            auction._id === auctionId ? { ...auction, status: 'closed' } : auction
          )
        );
      }
    });

    return () => {
      socket.off('auction_created');
      socket.off('new_bid');
      socket.off('timer_tick');
    };
  }, [socket]);

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      const { data } = await auctionAPI.getAll({ status: filter === 'all' ? undefined : filter });
      setAuctions(data.auctions);
    } catch (error) {
      console.error('Error fetching auctions:', error);
      toast.error('Failed to load auctions');
    } finally {
      setLoading(false);
    }
  };

  const filteredAuctions = auctions.filter((auction) =>
    auction.title.toLowerCase().includes(search.toLowerCase()) ||
    auction.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-6">Live Auctions</h1>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search auctions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search size={20} />}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('active')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                filter === 'active'
                  ? 'bg-primary-600 text-white'
                  : 'glass hover:bg-white/10'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('closed')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                filter === 'closed'
                  ? 'bg-primary-600 text-white'
                  : 'glass hover:bg-white/10'
              }`}
            >
              Closed
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'glass hover:bg-white/10'
              }`}
            >
              All
            </button>
          </div>
        </div>

        {/* Auctions Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-card p-6 h-96 shimmer"></div>
            ))}
          </div>
        ) : filteredAuctions.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredAuctions.map((auction) => (
              <AuctionCard key={auction._id} auction={auction} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-gray-400">No auctions found</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Home;
