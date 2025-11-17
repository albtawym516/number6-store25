const mongoose = require('mongoose');

const ShippingInfoSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  postalCode: { type: String },
}, { _id: false });

const CartItemSchema = new mongoose.Schema({
  product: { type: Object, required: true }, // Storing a snapshot of the product
  quantity: { type: Number, required: true },
  size: { type: String, required: true },
  color: { type: String, required: true },
}, { _id: false });


const OrderSchema = new mongoose.Schema({
  items: [CartItemSchema],
  total: { type: Number, required: true },
  status: { 
    type: String, 
    required: true, 
    enum: ['جاري التجهيز', 'جاري التوصيل', 'تم التوصيل', 'ملغي', 'عطل'],
    default: 'جاري التجهيز' 
  },
  date: { type: Date, default: Date.now },
  shippingInfo: ShippingInfoSchema,
  paymentIntentId: { type: String }
}, {
  timestamps: true,
   toJSON: {
    virtuals: true,
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      // Format date for consistency with old mock data if needed
      if (ret.date instanceof Date) {
        ret.date = ret.date.toISOString().split('T')[0];
      }
    }
  }
});

module.exports = mongoose.model('Order', OrderSchema);
