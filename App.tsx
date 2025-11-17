
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './hooks/useStore';
import StoreLayout from './layouts/StoreLayout';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import ProductForm from './pages/admin/ProductForm';
import ThemeSettings from './pages/admin/ThemeSettings';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import NotFoundPage from './pages/NotFoundPage';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const App: React.FC = () => {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);

  useEffect(() => {
    fetch('/api/config/stripe-key')
      .then(async (res) => {
        if (res.ok) {
          const { publishableKey } = await res.json();
          setStripePromise(loadStripe(publishableKey));
        } else {
          console.error("Failed to fetch Stripe publishable key.");
        }
      })
      .catch(err => {
        console.error("Error fetching Stripe key:", err);
      });
  }, []);

  if (!stripePromise) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <StoreProvider>
      <Elements stripe={stripePromise}>
        <HashRouter>
          <Routes>
            {/* Storefront Routes */}
            <Route path="/" element={<StoreLayout />}>
              <Route index element={<HomePage />} />
              <Route path="category/:category" element={<CategoryPage />} />
              <Route path="product/:productId" element={<ProductDetailPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="confirmation/:orderId" element={<OrderConfirmationPage />} />
            </Route>
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/new" element={<ProductForm />} />
              <Route path="products/edit/:productId" element={<ProductForm />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="theme" element={<ThemeSettings />} />
            </Route>
            
            {/* 404 Catch-all Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </HashRouter>
      </Elements>
    </StoreProvider>
  );
};

export default App;
