
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-2xl mx-auto flex flex-col items-center">
        <CheckCircle className="text-green-500 w-24 h-24 mb-6" />
        <h1 className="text-4xl font-bold text-gray-800 mb-4">شكرًا لك! تم استلام طلبك.</h1>
        <p className="text-lg text-gray-600 mb-2">لقد تم إنشاء طلبك بنجاح.</p>
        <p className="text-lg text-gray-600 mb-8">
          رقم طلبك هو: <span className="font-bold text-brand-accent">{orderId}</span>
        </p>
        <Link 
          to="/" 
          className="bg-brand-accent text-white font-bold py-3 px-8 rounded-lg hover:bg-orange-600 transition"
        >
          العودة للصفحة الرئيسية
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
