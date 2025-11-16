import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const Input = forwardRef(({ 
  label, 
  error, 
  icon,
  className = '',
  ...props 
}, ref) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={`input ${icon ? 'pl-12' : ''} ${error ? 'ring-2 ring-red-500' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-1 text-sm text-red-400"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
});

Input.displayName = 'Input';

export default Input;
