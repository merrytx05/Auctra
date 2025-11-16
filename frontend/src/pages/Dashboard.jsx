import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gavel, ShoppingBag, PlusCircle } from 'lucide-react';
import Button from '../components/Button';
import SellerDashboard from './SellerDashboard';
import BuyerDashboard from './BuyerDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Welcome, {user?.username}!
            </h1>
            <p className="text-gray-400">
              {user?.role === 'seller' ? 'Manage your auctions' : 'View your bids'}
            </p>
          </div>
          {user?.role === 'seller' && (
            <Link to="/create-auction">
              <Button variant="primary" icon={<PlusCircle size={20} />}>
                Create Auction
              </Button>
            </Link>
          )}
        </div>

        {user?.role === 'seller' ? <SellerDashboard /> : <BuyerDashboard />}
      </motion.div>
    </div>
  );
};

export default Dashboard;
