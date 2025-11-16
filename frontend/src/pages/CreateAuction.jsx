import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DollarSign, Clock, FileText, Image } from 'lucide-react';
import { auctionAPI } from '../services/api';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import toast from 'react-hot-toast';

const CreateAuction = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startingPrice: '',
    duration: '1',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('startingPrice', formData.startingPrice);
      data.append('duration', formData.duration);
      if (formData.image) {
        data.append('image', formData.image);
      }

      await auctionAPI.create(data);
      toast.success('Auction created successfully!');
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create auction';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const durationOptions = [
    { value: '1', label: '1 Day' },
    { value: '2', label: '2 Days' },
    { value: '3', label: '3 Days' },
    { value: '5', label: '5 Days' },
    { value: '7', label: '7 Days' },
    { value: '10', label: '10 Days' },
    { value: '14', label: '14 Days' },
    { value: '30', label: '30 Days' },
  ];

  return (
    <div className="container mx-auto px-4 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <h1 className="text-3xl font-bold mb-6">Create New Auction</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <Input
              label="Auction Title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              icon={<FileText size={20} />}
              placeholder="e.g., Vintage Camera"
              required
            />

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input min-h-32 resize-none"
                placeholder="Describe your item..."
              />
            </div>

            {/* Starting Price */}
            <Input
              label="Starting Price ($)"
              type="number"
              step="0.01"
              min="0.01"
              name="startingPrice"
              value={formData.startingPrice}
              onChange={handleChange}
              icon={<DollarSign size={20} />}
              placeholder="10.00"
              required
            />

            {/* Duration */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Clock size={16} />
                Auction Duration
              </label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="input"
                required
              >
                {durationOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Image Upload */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Image size={16} />
                Item Image (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="block w-full p-6 glass rounded-xl cursor-pointer hover:bg-white/10 transition-colors border-2 border-dashed border-white/20"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-center">
                    <Image size={48} className="mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-400">Click to upload an image</p>
                  </div>
                )}
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                loading={loading}
              >
                Create Auction
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default CreateAuction;
