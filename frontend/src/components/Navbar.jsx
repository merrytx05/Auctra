import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gavel, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navItems = isAuthenticated
    ? [
        { label: 'Home', path: '/' },
        { label: 'Dashboard', path: '/dashboard' },
        ...(user?.role === 'admin' ? [{ label: 'Admin', path: '/admin' }] : []),
      ]
    : [
        { label: 'Home', path: '/' },
        { label: 'Login', path: '/login' },
        { label: 'Register', path: '/register' },
      ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="glass-card fixed top-0 left-0 right-0 z-50 mx-4 mt-4 rounded-2xl"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 15 }}
              className="p-2 bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl"
            >
              <Gavel className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              Auctra
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
              >
                {item.label}
              </Link>
            ))}

            {isAuthenticated && (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/10">
                <div className="flex items-center gap-2">
                  <User size={20} className="text-primary-400" />
                  <span className="text-sm font-medium">{user?.username}</span>
                  <span className="px-2 py-1 rounded-full bg-primary-500/20 text-primary-400 text-xs font-semibold">
                    {user?.role}
                  </span>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleLogout}
                  icon={<LogOut size={16} />}
                >
                  Logout
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pt-4 border-t border-white/10"
          >
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-300 hover:text-white transition-colors duration-200 font-medium py-2"
                >
                  {item.label}
                </Link>
              ))}
              {isAuthenticated && (
                <>
                  <div className="flex items-center gap-2 py-2">
                    <User size={20} className="text-primary-400" />
                    <span className="text-sm font-medium">{user?.username}</span>
                    <span className="px-2 py-1 rounded-full bg-primary-500/20 text-primary-400 text-xs font-semibold">
                      {user?.role}
                    </span>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleLogout}
                    icon={<LogOut size={16} />}
                    className="w-full"
                  >
                    Logout
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
