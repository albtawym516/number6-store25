const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  salePrice: { type: Number },
  category: { type: String, required: true, enum: ['men', 'women', 'kids'] },
  description: { type: String, required: true },
  images: { type: [String], required: true },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  sizes: { type: [String], required: true },
  colors: { type: [String], required: true },
  stock: { type: Number, required: true, default: 0 },
  isFeatured: { type: Boolean, default: false },
}, {
  timestamps: true,
  // Mongoose automatically maps 'id' to '_id'. This ensures the frontend can use 'id'
  toJSON: {
    virtuals: true,
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

module.exports = mongoose.model('Product', ProductSchema);
