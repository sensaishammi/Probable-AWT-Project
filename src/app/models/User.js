import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    minLength: [3, 'Name must be at least 3 characters long'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minLength: [6, 'Password must be at least 6 characters long'],
  },
  role: {
    type: String,
    enum: ['customer', 'restaurant', 'delivery'],
    default: 'customer',
  },
  address: {
    type: String,
    required: function() { return this.role === 'restaurant'; }
  },
  city: {
    type: String,
    required: function() { return this.role === 'restaurant'; }
  },
  contact: {
    type: String,
    required: function() { return this.role === 'restaurant' || this.role === 'delivery'; }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.User || mongoose.model('User', userSchema); 