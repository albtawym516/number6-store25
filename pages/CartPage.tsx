
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import { Trash2 } from 'lucide-react';

const CartPage: React.FC = () => {
  const { cart, updateCartQuantity, removeFromCart } = useStore();
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + (item.product.salePrice || item.product.price) * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">سلة المشتريات</h1>
      {cart.length === 0 ? (
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-6">سلة مشترياتك فارغة.</p>
          <Link to="/" className="bg-brand-accent text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 transition">
            العودة للتسوق
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              <ul className="divide-y divide-gray-200">
                {cart.map(item => (
                  <li key={item.id} className="p-6 flex items-center space-x-6">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-24 h-24 object-cover rounded-md"/>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{item.product.name}</h3>
                      <p className="text-sm text-gray-500">المقاس: {item.size}, اللون: {item.color}</p>
                      <p className="font-bold mt-1">{(item.product.salePrice || item.product.price)} جنيه</p>
                    </div>
                    <div className="flex items-center border rounded-md w-28">
                      <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="px-3 py-1">-</button>
                      <span className="px-3 py-1 text-center flex-1">{item.quantity}</span>
                      <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="px-3 py-1">+</button>
                    </div>
                    <p className="font-bold w-24 text-center">
                      {(item.product.salePrice || item.product.price) * item.quantity} جنيه
                    </p>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-500 hover:text-red-600">
                      <Trash2 size={20} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">ملخص الطلب</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-gray-700">
                  <span>المجموع الفرعي</span>
                  <span>{subtotal.toFixed(2)} جنيه</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>الشحن</span>
                  <span>{shipping === 0 ? 'مجاني' : `${shipping.toFixed(2)} جنيه`}</span>
                </div>
                <div className="border-t pt-4 mt-4 flex justify-between font-bold text-xl">
                  <span>الإجمالي</span>
                  <span>{total.toFixed(2)} جنيه</span>
                </div>
              </div>
              <button 
                onClick={() => navigate('/checkout')}
                className="w-full mt-8 bg-brand-accent text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition"
              >
                المتابعة للدفع
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
