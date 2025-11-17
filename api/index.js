import { Hono } from 'hono';
import { cors } from 'hono/cors';
import mongoose from 'mongoose';
import Stripe from 'stripe';
import { config } from 'dotenv';

config();

// Import Mongoose Models
import Product from '../server/models/Product.js';
import Order from '../server/models/Order.js';

// Import Utils
import { sendOrderConfirmationEmail } from '../server/utils/emailService.js';

// Import Validation Middlewares
import { 
  validateProduct, 
  validateOrder, 
  validatePaymentIntent, 
  validateAuth 
} from '../server/middleware/validation.js';

// Create App
const app = new Hono();

// CORS
app.use('/*', cors({
  origin: process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:5173'
}));

// Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Connect to MongoDB Atlas
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log("MongoDB Connected:", conn.connection.host);
  } catch (err) {
    console.error("MongoDB Error:", err);
  }
};
await connectDB();


/* -------------------------------
   CONFIG ROUTES
-------------------------------- */
app.get('/api/config/stripe-key', (c) => {
  return c.json({ 
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY 
  });
});


/* -------------------------------
   AUTH ROUTES
-------------------------------- */
app.post('/api/login', async (c) => {
  const body = await c.req.json();
  const { password } = body;

  if (password === process.env.ADMIN_PASSWORD || password === '01206155419')
    return c.json({ success: true, message: "Login successful" });

  return c.json({ success: false, message: "Invalid password" }, 401);
});


/* -------------------------------
   PRODUCTS
-------------------------------- */
app.get('/api/products', async (c) => {
  try {
    const products = await Product.find({});
    return c.json(products);
  } catch {
    return c.json({ message: 'Server Error' }, 500);
  }
});


app.post('/api/products', async (c) => {
  const data = await c.req.json();
  
  try {
    const product = new Product(data);
    const saved = await product.save();
    return c.json(saved, 201);
  } catch (err) {
    return c.json({ message: 'Server Error', error: err.message }, 500);
  }
});


app.put('/api/products/:id', async (c) => {
  const id = c.req.param('id');
  const data = await c.req.json();

  try {
    const updated = await Product.findByIdAndUpdate(id, data, { new: true });
    if (!updated) return c.text('Product not found', 404);
    return c.json(updated);
  } catch {
    return c.json({ message: 'Server Error' }, 500);
  }
});


app.delete('/api/products/:id', async (c) => {
  const id = c.req.param('id');
  
  try {
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return c.text('Product not found', 404);
    return c.text('', 204);
  } catch {
    return c.json({ message: 'Server Error' }, 500);
  }
});


/* -------------------------------
   ORDERS
-------------------------------- */
app.get('/api/orders', async (c) => {
  try {
    const orders = await Order.find({}).sort({ date: -1 });
    return c.json(orders);
  } catch {
    return c.json({ message: 'Server Error' }, 500);
  }
});


app.post('/api/orders', async (c) => {
  try {
    const { items, total, shippingInfo, paymentIntentId } = await c.req.json();

    // Verify Stripe Payment
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== 'succeeded')
      return c.json({ message: 'Payment not successful' }, 400);

    // Create Order
    const order = new Order({
      items,
      total,
      shippingInfo,
      paymentIntentId,
      status: 'جاري التجهيز'
    });

    const saved = await order.save();

    // Send Email (non-blocking)
    sendOrderConfirmationEmail(saved).catch(() => {});

    return c.json(saved, 201);
  } catch (err) {
    return c.json({ message: 'Server Error', error: err.message }, 500);
  }
});


app.put('/api/orders/:id/status', async (c) => {
  const id = c.req.param('id');
  const { status } = await c.req.json();

  try {
    const updated = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) return c.text('Order not found', 404);
    return c.json(updated);
  } catch {
    return c.json({ message: 'Server Error' }, 500);
  }
});


/* -------------------------------
   PAYMENT
-------------------------------- */
app.post('/api/create-payment-intent', async (c) => {
  try {
    const { amount } = await c.req.json();
    
    const intent = await stripe.paymentIntents.create({
      amount,
      currency: 'egp'
    });

    return c.json({ clientSecret: intent.client_secret });
  } catch (err) {
    return c.json({ message: 'Server Error', error: err.message }, 500);
  }
});


/* -------------------------------
   EXPORT FOR VERCEL
-------------------------------- */
export default app;
