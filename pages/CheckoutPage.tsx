
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import { ShippingInfo, Order } from '../types';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CheckoutPage: React.FC = () => {
  const { cart, createOrder, clearCart } = useStore();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'مصر',
    postalCode: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + (item.product.salePrice || item.product.price) * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    if (cart.length === 0) {
      alert("سلة المشتريات فارغة!");
      navigate('/cart');
      return;
    }
    setProcessing(true);

    try {
      // 1. Create Payment Intent on the server
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Math.round(total * 100) }) // Amount in cents
      });
      const { clientSecret } = await res.json();
      if (!clientSecret) throw new Error('Failed to create payment intent.');

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card element not found");

      // 2. Confirm the payment on the client side
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: shippingInfo.fullName,
            email: shippingInfo.email,
            phone: shippingInfo.phone,
          },
        },
      });

      if (paymentResult.error) {
        setError(paymentResult.error.message || 'An unexpected error occurred.');
        setProcessing(false);
      } else {
        if (paymentResult.paymentIntent.status === 'succeeded') {
          // 3. Create order in the database
          const orderData: Omit<Order, 'id' | 'date' | 'status'> = {
            items: cart,
            total,
            shippingInfo
          };
          // The createOrder function in useStore is updated to call the backend
          const newOrder = await createOrder(orderData, paymentResult.paymentIntent.id);
          clearCart();
          navigate(`/confirmation/${newOrder.id}`);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during checkout.');
      setProcessing(false);
    }
  };
  
  // FIX: Moved navigation logic into a useEffect hook to prevent side effects during render.
  useEffect(() => {
    // Redirect to home if cart is empty and not in the middle of processing.
    if (cart.length === 0 && !processing) {
      const timer = setTimeout(() => navigate('/'), 100);
      // Cleanup timer on component unmount or if dependencies change.
      return () => clearTimeout(timer);
    }
  }, [cart.length, processing, navigate]);
  
  if (cart.length === 0 && !processing) {
      return <div className="text-center py-20">سلتك فارغة, يتم تحويلك...</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">الدفع</h1>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">معلومات الشحن</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <input type="text" name="fullName" placeholder="الاسم الكامل" value={shippingInfo.fullName} onChange={handleInputChange} className="p-3 border rounded-md w-full" required />
              <input type="email" name="email" placeholder="البريد الإلكتروني" value={shippingInfo.email} onChange={handleInputChange} className="p-3 border rounded-md w-full" required />
              <input type="tel" name="phone" placeholder="رقم الهاتف" value={shippingInfo.phone} onChange={handleInputChange} className="p-3 border rounded-md w-full sm:col-span-2" required />
              <input type="text" name="address" placeholder="العنوان بالتفصيل" value={shippingInfo.address} onChange={handleInputChange} className="p-3 border rounded-md w-full sm:col-span-2" required />
              <input type="text" name="city" placeholder="المدينة" value={shippingInfo.city} onChange={handleInputChange} className="p-3 border rounded-md w-full" required />
              <input type="text" name="postalCode" placeholder="الرمز البريدي" value={shippingInfo.postalCode} onChange={handleInputChange} className="p-3 border rounded-md w-full" />
            </div>
             <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">بيانات الدفع</h2>
                <div className="p-4 border rounded-md bg-gray-50">
                    <CardElement options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#424770',
                          '::placeholder': { color: '#aab7c4' },
                        },
                        invalid: { color: '#9e2146' },
                      },
                      hidePostalCode: true,
                    }}/>
                </div>
            </div>
            {error && <div className="text-red-500 mt-4 text-center">{error}</div>}
            <button type="submit" disabled={processing || !stripe} className="w-full mt-8 bg-brand-accent text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition disabled:bg-gray-400">
              {processing ? 'جاري المعالجة...' : `ادفع ${total.toFixed(2)} جنيه`}
            </button>
          </form>
        </div>
        <div className="lg:col-span-2">
           <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
             <h2 className="text-xl font-bold mb-4">ملخص طلبك</h2>
             <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                        <div className="flex items-center">
                            <img src={item.product.images[0]} alt={item.product.name} className="w-12 h-12 rounded-md object-cover ml-3" />
                            <div>
                                <p className="font-semibold">{item.product.name} <span className="text-gray-600">x{item.quantity}</span></p>
                                <p className="text-xs text-gray-500">{item.size}, {item.color}</p>
                            </div>
                        </div>
                        <p className="font-semibold">{(item.product.salePrice || item.product.price) * item.quantity} ج.م</p>
                    </div>
                ))}
             </div>
             <div className="border-t mt-4 pt-4 space-y-2">
                 <div className="flex justify-between"><span>المجموع الفرعي</span><span>{subtotal.toFixed(2)} ج.م</span></div>
                 <div className="flex justify-between"><span>الشحن</span><span>{shipping === 0 ? 'مجاني' : `${shipping.toFixed(2)} ج.м`}</span></div>
                 <div className="flex justify-between font-bold text-lg"><span>الإجمالي</span><span>{total.toFixed(2)} ج.م</span></div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;