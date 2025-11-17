
require('dotenv').config({ path: require('path').resolve(process.cwd(), '.env') });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const Order = require('./models/Order');
const { sendOrderConfirmationEmail } = require('./utils/emailService');
const { validateProduct, validateOrder, validatePaymentIntent, validateAuth } = require('./middleware/validation');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


const app = express();
const PORT = process.env.PORT || 3001;

// Connect to Database
connectDB();

// CORS configuration for Vercel
app.use(cors({
  origin: process.env.VERCEL_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// --- API ROUTES ---

// Config
app.get('/api/config/stripe-key', (req, res) => {
  res.send({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
});

// Auth
app.post('/api/login', validateAuth, (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD || '01206155419') {
    res.status(200).json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid password' });
  }
});

// Products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

app.post('/api/products', validateProduct, async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

app.put('/api/products/:id', validateProduct, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) return res.status(404).send('Product not found');
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).send('Product not found');
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});


// Orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ date: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

app.post('/api/orders', validateOrder, async (req, res) => {
    try {
        const { items, total, shippingInfo, paymentIntentId } = req.body;

        // Verify payment intent
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        if (paymentIntent.status !== 'succeeded') {
            return res.status(400).json({ message: 'Payment not successful' });
        }

        const newOrder = new Order({
            items,
            total,
            shippingInfo,
            status: 'جاري التجهيز',
            paymentIntentId,
        });
        const savedOrder = await newOrder.save();
        
        // Send email notification
        try {
          await sendOrderConfirmationEmail(savedOrder);
        } catch (emailError) {
          console.error("Failed to send confirmation email:", emailError);
          // Don't fail the request, just log the error
        }

        res.status(201).json(savedOrder);
    } catch (error) {
        console.error("Order creation failed:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!updatedOrder) return res.status(404).send('Order not found');
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Payment
app.post('/api/create-payment-intent', validatePaymentIntent, async (req, res) => {
  try {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'egp',
    });
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Start Server (for local development)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel
module.exports = app;
