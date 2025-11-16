import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Gavel, TrendingUp, Shield, Zap, ArrowRight } from 'lucide-react';
import Button from '../components/Button';

const Landing = () => {
  const features = [
    {
      icon: <Gavel size={32} />,
      title: 'Live Auctions',
      description: 'Participate in real-time auctions with instant updates',
    },
    {
      icon: <TrendingUp size={32} />,
      title: 'Competitive Bidding',
      description: 'Place bids and compete with other buyers seamlessly',
    },
    {
      icon: <Shield size={32} />,
      title: 'Secure Platform',
      description: 'Your data and transactions are protected with top security',
    },
    {
      icon: <Zap size={32} />,
      title: 'Real-time Updates',
      description: 'Get instant notifications for new bids and auctions',
    },
  ];

  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-6xl md:text-7xl font-black mb-6">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              Auctra
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            The modern online auction platform where buyers and sellers meet in real-time
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auctions">
              <Button variant="primary" size="lg" icon={<Gavel size={20} />}>
                Browse Auctions
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="secondary" size="lg" icon={<ArrowRight size={20} />}>
                Get Started
              </Button>
            </Link>
          </div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section className="py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-16"
        >
          Why Choose Auctra?
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-8 text-center hover:scale-105 transition-transform duration-300"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-500 text-white mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-20 text-center"
      >
        <div className="glass-card p-12 max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Bidding?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of users buying and selling on Auctra today
          </p>
          <Link to="/register">
            <Button variant="primary" size="lg">
              Create Your Account
            </Button>
          </Link>
        </div>
      </motion.section>
    </div>
  );
};

export default Landing;
