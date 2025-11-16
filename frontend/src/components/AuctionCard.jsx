import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { DollarSign, User, Clock } from 'lucide-react';
import Card from './Card';
import Timer from './Timer';
import Button from './Button';

const AuctionCard = ({ auction, showBidButton = true }) => {
  const navigate = useNavigate();

  const isActive = auction.status === 'active';
  const currentPrice = auction.highest_bid || auction.current_price || auction.starting_price;
  const bidCount = auction.bid_count || 0;

  const handleViewDetails = () => {
    navigate(`/auction/${auction._id}`);
  };

  return (
    <Card className="overflow-hidden group cursor-pointer" onClick={handleViewDetails}>
      {/* Image */}
      <div className="relative h-48 overflow-hidden rounded-xl mb-4">
        {auction.image_url ? (
          <img
            src={auction.image_url}
            alt={auction.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-600/20 to-primary-800/20 flex items-center justify-center">
            <DollarSign size={64} className="text-primary-400/30" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          {isActive ? (
            <span className="badge-live">
              🔴 LIVE
            </span>
          ) : (
            <span className="badge-closed">
              CLOSED
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {/* Title */}
        <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors line-clamp-2">
          {auction.title}
        </h3>

        {/* Description */}
        {auction.description && (
          <p className="text-gray-400 text-sm line-clamp-2">
            {auction.description}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center justify-between py-3 px-4 glass rounded-xl">
          <div>
            <p className="text-xs text-gray-400 mb-1">Current Price</p>
            <p className="text-2xl font-bold text-primary-400">
              ${parseFloat(currentPrice).toFixed(2)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 mb-1">Bids</p>
            <p className="text-xl font-bold text-white">{bidCount}</p>
          </div>
        </div>

        {/* Timer */}
        {isActive && (
          <div className="flex items-center justify-center py-3 px-4 glass rounded-xl">
            <Timer endTime={auction.end_time} />
          </div>
        )}

        {/* Seller Info */}
        {auction.seller_username && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <User size={16} />
            <span>by {auction.seller_username}</span>
          </div>
        )}

        {/* Action Button */}
        {showBidButton && isActive && (
          <Button
            variant="primary"
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails();
            }}
          >
            Place Bid
          </Button>
        )}
      </div>
    </Card>
  );
};

export default AuctionCard;
