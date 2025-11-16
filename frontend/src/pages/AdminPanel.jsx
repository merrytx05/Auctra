import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Gavel, Ban, Trash2 } from 'lucide-react';
import { adminAPI } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, auctionsRes] = await Promise.all([
        adminAPI.getAllUsers(),
        adminAPI.getAllAuctions(),
      ]);
      setUsers(usersRes.data.users);
      setAuctions(auctionsRes.data.auctions);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId, isBlocked) => {
    try {
      await adminAPI.blockUser(userId, !isBlocked);
      toast.success(`User ${!isBlocked ? 'blocked' : 'unblocked'} successfully`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleDeleteAuction = async (auctionId) => {
    if (!confirm('Are you sure you want to delete this auction?')) return;

    try {
      await adminAPI.deleteAuction(auctionId);
      toast.success('Auction deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete auction');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4">
        <div className="glass-card p-8 h-96 shimmer"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-8">Admin Panel</h1>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card hover={false}>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-primary-500/20 rounded-xl">
                <Users size={32} className="text-primary-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-3xl font-bold">{users.length}</p>
              </div>
            </div>
          </Card>
          <Card hover={false}>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-green-500/20 rounded-xl">
                <Gavel size={32} className="text-green-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Auctions</p>
                <p className="text-3xl font-bold">{auctions.length}</p>
              </div>
            </div>
          </Card>
          <Card hover={false}>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-red-500/20 rounded-xl">
                <Ban size={32} className="text-red-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Blocked Users</p>
                <p className="text-3xl font-bold">
                  {users.filter((u) => u.is_blocked).length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'users' ? 'bg-primary-600 text-white' : 'glass hover:bg-white/10'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('auctions')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'auctions' ? 'bg-primary-600 text-white' : 'glass hover:bg-white/10'
            }`}
          >
            Auctions
          </button>
        </div>

        {/* Content */}
        {activeTab === 'users' ? (
          <Card hover={false}>
            <h2 className="text-2xl font-bold mb-4">User Management</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4">Username</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Role</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b border-white/5">
                      <td className="py-3 px-4">{user.username}</td>
                      <td className="py-3 px-4 text-gray-400">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className="badge badge-active">{user.role}</span>
                      </td>
                      <td className="py-3 px-4">
                        {user.is_blocked ? (
                          <span className="text-red-400 font-semibold">Blocked</span>
                        ) : (
                          <span className="text-green-400 font-semibold">Active</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {user.role !== 'admin' && (
                          <Button
                            variant={user.is_blocked ? 'secondary' : 'danger'}
                            size="sm"
                            onClick={() => handleBlockUser(user._id, user.is_blocked)}
                            icon={<Ban size={16} />}
                          >
                            {user.is_blocked ? 'Unblock' : 'Block'}
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <Card hover={false}>
            <h2 className="text-2xl font-bold mb-4">Auction Management</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4">Title</th>
                    <th className="text-left py-3 px-4">Seller</th>
                    <th className="text-left py-3 px-4">Price</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Bids</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {auctions.map((auction) => (
                    <tr key={auction._id} className="border-b border-white/5">
                      <td className="py-3 px-4 font-semibold">{auction.title}</td>
                      <td className="py-3 px-4 text-gray-400">{auction.seller_username}</td>
                      <td className="py-3 px-4 text-primary-400">
                        ${parseFloat(auction.current_price).toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        {auction.status === 'active' ? (
                          <span className="badge-active">Active</span>
                        ) : (
                          <span className="badge-closed">Closed</span>
                        )}
                      </td>
                      <td className="py-3 px-4">{auction.bid_count || 0}</td>
                      <td className="py-3 px-4">
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteAuction(auction._id)}
                          icon={<Trash2 size={16} />}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

export default AdminPanel;
