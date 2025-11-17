import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ShoppingBag, Search } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Animation/Graphic */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-brand-accent opacity-20">404</div>
          <div className="text-2xl font-semibold text-gray-800 mt-4">صفحة غير موجودة</div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <p className="text-gray-600 text-lg mb-4">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
          </p>
          <p className="text-gray-500">
            يمكنك العودة إلى الصفحة الرئيسية أو البحث عن المنتجات التي تريدها.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link 
            to="/"
            className="w-full bg-brand-accent hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center gap-2"
          >
            <Home size={20} />
            العودة للرئيسية
          </Link>
          
          <Link 
            to="/category/all"
            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center gap-2"
          >
            <ShoppingBag size={20} />
            تصفح المنتجات
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">روابط سريعة</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Link 
              to="/category/men"
              className="text-gray-600 hover:text-brand-accent transition"
            >
              ملابس رجالية
            </Link>
            <Link 
              to="/category/women"
              className="text-gray-600 hover:text-brand-accent transition"
            >
              ملابس نسائية
            </Link>
            <Link 
              to="/category/kids"
              className="text-gray-600 hover:text-brand-accent transition"
            >
              ملابس أطفال
            </Link>
            <Link 
              to="/cart"
              className="text-gray-600 hover:text-brand-accent transition"
            >
              سلة المشتريات
            </Link>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-center gap-2 text-blue-800 mb-2">
            <Search size={16} />
            <span className="font-semibold">تحتاج مساعدة؟</span>
          </div>
          <p className="text-blue-600 text-sm">
            إذا كنت تواجه مشكلة في العثور على ما تبحث عنه، 
            لا تتردد في التواصل معنا عبر البريد الإلكتروني أو الهاتف.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
