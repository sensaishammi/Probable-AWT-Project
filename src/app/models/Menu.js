import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide item name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide item description'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Please provide item price'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Please provide item category'],
    enum: ['appetizer', 'main course', 'dessert', 'beverage', 'side dish']
  },
  image: {
    type: String,
    default: '/default-food-image.jpg'
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  preparationTime: {
    type: Number,
    required: [true, 'Please provide preparation time in minutes'],
    min: [1, 'Preparation time must be at least 1 minute']
  }
});

const menuSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [menuItemSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Update lastUpdated timestamp before saving
menuSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

export default mongoose.models.Menu || mongoose.model('Menu', menuSchema); 