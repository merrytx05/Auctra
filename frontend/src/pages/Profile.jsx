import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, User } from 'lucide-react';
import { ratingAPI } from '../services/api';
import Card from '../components/Card';
import toast from 'react-hot-toast';

const Profile = () => {
  const { userId } = useParams();
  const [ratings, setRatings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRatings();
  }, [userId]);

  const fetchRatings = async () => {
    try {
      const { data } = await ratingAPI.getBySeller(userId);
      setRatings(data.ratings);
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching ratings:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4">
        <div className="glass-card p-8 h-96 shimmer"></div>
      </div>
    );
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={20}
        className={i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}
      />
    ));
  };

  return (
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="mb-8">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center">
              <User size={40} className="text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">Seller Profile</h1>
              {stats && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {renderStars(Math.round(stats.averageRating))}
                    <span className="text-2xl font-bold text-yellow-400">
                      {stats.averageRating}
                    </span>
                  </div>
                  <span className="text-gray-400">
                    ({stats.totalRatings} {stats.totalRatings === 1 ? 'rating' : 'ratings'})
                  </span>
                </div>
              )}
            </div>
          </div>

          {stats && stats.totalRatings > 0 && (
            <div className="grid grid-cols-5 gap-4 mb-6">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="glass p-3 rounded-xl text-center">
                  <p className="text-sm text-gray-400 mb-1">{star} ★</p>
                  <p className="text-xl font-bold">
                    {stats.breakdown[`${['one', 'two', 'three', 'four', 'five'][star - 1]}Star`] || 0}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>

        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        
        {ratings.length > 0 ? (
          <div className="space-y-4">
            {ratings.map((rating) => (
              <Card key={rating._id} hover={false}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <User size={20} className="text-gray-400" />
                    <div>
                      <p className="font-semibold">{rating.buyer_username}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(rating.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {renderStars(rating.rating)}
                  </div>
                </div>
                {rating.comment && (
                  <p className="text-gray-300">{rating.comment}</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Auction: {rating.auction_title}
                </p>
              </Card>
            ))}
          </div>
        ) : (
          <Card hover={false}>
            <p className="text-center text-gray-400 py-8">No ratings yet</p>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

export default Profile;
