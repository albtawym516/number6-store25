
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { Product, CartItem, Order, OrderStatus, ThemeSettings } from '../types';

const defaultThemeSettings: ThemeSettings = {
  accentColor: '#FF6B35',
  announcementText: 'شحن مجاني للطلبات فوق 500 جنيه',
  hero: {
    headline: 'مجموعة الصيف الجديدة',
    subheading: 'اكتشف أحدث صيحات الموضة لجميع أفراد العائلة.',
    imageUrl: 'https://picsum.photos/seed/hero/1920/700',
    ctaText: 'تسوق الآن',
  },
  categoryImages: {
    men: 'https://picsum.photos/seed/men/800/600',
    women: 'https://picsum.photos/seed/women/800/600',
    kids: 'https://picsum.photos/seed/kids/800/600',
  },
  featuredProductsTitle: 'منتجات مختارة',
  features: [
    { title: 'شحن سريع', description: 'توصيل سريع وموثوق لجميع الطلبات.' },
    { title: 'ضمان الجودة', description: 'منتجات عالية الجودة مع ضمان الرضا.' },
    { title: 'إرجاع خلال 14 يوم', description: 'سياسة إرجاع سهلة ومرنة.' },
  ],
};

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  themeSettings: ThemeSettings;
  isLoading: boolean;
  error: string | null;
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId:string) => void;
  clearCart: () => void;
  createOrder: (orderData: Omit<Order, 'id' | 'date' | 'status'>, paymentIntentId: string) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  updateThemeSettings: (settings: ThemeSettings) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(defaultThemeSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [productsRes, ordersRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/orders')
        ]);

        if (!productsRes.ok || !ordersRes.ok) {
          throw new Error('Failed to fetch initial data from the server.');
        }
        
        const productsData = await productsRes.json();
        const ordersData = await ordersRes.json();
        
        setProducts(productsData);
        setOrders(ordersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error("Failed to fetch data:", err);
      } finally {
        setIsLoading(false);
      }
    }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addProduct = useCallback(async (productData: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({...productData, rating: 5, reviewCount: 0})
    });
    const newProduct = await res.json();
    setProducts(prev => [...prev, newProduct]);
  }, []);

  const updateProduct = useCallback(async (updatedProduct: Product) => {
    const res = await fetch(`/api/products/${updatedProduct.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProduct)
    });
    const returnedProduct = await res.json();
    setProducts(prev => prev.map(p => p.id === returnedProduct.id ? returnedProduct : p));
  }, []);

  const deleteProduct = useCallback(async (productId: string) => {
    await fetch(`/api/products/${productId}`, { method: 'DELETE' });
    setProducts(prev => prev.filter(p => p.id !== productId));
  }, []);

  const addToCart = useCallback((item: Omit<CartItem, 'id'>) => {
    setCart(prev => {
      const existingItem = prev.find(i => 
        i.product.id === item.product.id && i.size === item.size && i.color === item.color
      );
      if (existingItem) {
        return prev.map(i => 
          i.id === existingItem.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, { ...item, id: Date.now().toString() }];
    });
  }, []);

  const updateCartQuantity = useCallback((itemId: string, quantity: number) => {
    setCart(prev => prev.map(item => item.id === itemId ? { ...item, quantity } : item).filter(item => item.quantity > 0));
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  }, []);
  
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const createOrder = useCallback(async (orderData: Omit<Order, 'id' | 'date' | 'status'>, paymentIntentId: string): Promise<Order> => {
     const res = await fetch('/api/orders', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ ...orderData, paymentIntentId })
     });
     if(!res.ok) {
       const errorData = await res.json();
       throw new Error(errorData.message || 'Failed to create order');
     }
     const newOrder = await res.json();
     setOrders(prev => [newOrder, ...prev]);
     clearCart();
     return newOrder;
  }, [clearCart]);

  const updateOrderStatus = useCallback(async (orderId: string, status: OrderStatus) => {
    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const updatedOrder = await res.json();
    setOrders(prev => prev.map(order => order.id === updatedOrder.id ? updatedOrder : order));
  }, []);

  const updateThemeSettings = useCallback((settings: ThemeSettings) => {
    setThemeSettings(settings);
  }, []);

  const value = {
    products, cart, orders, themeSettings, isLoading, error,
    addProduct, updateProduct, deleteProduct, addToCart,
    updateCartQuantity, removeFromCart, clearCart, createOrder,
    updateOrderStatus, updateThemeSettings,
  };

  return React.createElement(StoreContext.Provider, { value }, children);
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
