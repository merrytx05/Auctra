import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

const Timer = ({ endTime, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const difference = Math.max(0, end - now);
      return Math.floor(difference / 1000);
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (newTimeLeft === 0 && onExpire) {
        onExpire();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime, onExpire]);

  const formatTime = (seconds) => {
    if (seconds <= 0) return 'Ended';

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const getColorClass = () => {
    if (timeLeft === 0) return 'text-gray-400';
    if (timeLeft < 300) return 'text-red-400'; // Less than 5 minutes
    if (timeLeft < 3600) return 'text-yellow-400'; // Less than 1 hour
    return 'text-green-400';
  };

  return (
    <motion.div
      animate={timeLeft > 0 && timeLeft < 60 ? { scale: [1, 1.1, 1] } : {}}
      transition={{ duration: 1, repeat: Infinity }}
      className={`flex items-center gap-2 font-mono font-bold ${getColorClass()}`}
    >
      <Clock size={20} />
      <span className="text-lg">{formatTime(timeLeft)}</span>
    </motion.div>
  );
};

export default Timer;
