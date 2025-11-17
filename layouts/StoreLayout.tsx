
import React, { useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import { ShoppingCart, Menu, X, Facebook, Instagram, MessageSquare } from 'lucide-react';

const DynamicGlobalStyles: React.FC = () => {
    const { themeSettings } = useStore();
    useEffect(() => {
      const styleId = 'dynamic-theme-styles';
      let styleElement = document.getElementById(styleId);
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }
      
      const newColor = themeSettings.accentColor;
      // Basic brightness check to darken the color for hover state
      let hoverColor = newColor;
      try {
          if (newColor.startsWith('#')) {
              let r = parseInt(newColor.slice(1, 3), 16);
              let g = parseInt(newColor.slice(3, 5), 16);
              let b = parseInt(newColor.slice(5, 7), 16);
              r = Math.max(0, r - 20);
              g = Math.max(0, g - 20);
              b = Math.max(0, b - 20);
              hoverColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
          }
      } catch (e) { console.error("Could not parse color for hover state", e); }


      styleElement.innerHTML = `
        :root { --brand-accent: ${newColor}; }
        .bg-brand-accent { background-color: var(--brand-accent) !important; }
        .text-brand-accent { color: var(--brand-accent) !important; }
        .border-brand-accent { border-color: var(--brand-accent) !important; }
        .hover\\:bg-orange-600:hover, .hover\\:bg-brand-accent:hover { background-color: ${hoverColor} !important; }
        .hover\\:text-brand-accent:hover { color: var(--brand-accent) !important; }
        .focus\\:ring-brand-accent:focus { --tw-ring-color: var(--brand-accent) !important; }
      `;
    }, [themeSettings.accentColor]);
  
    return null;
};


const Header: React.FC = () => {
    const { cart, themeSettings } = useStore();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <header className="bg-white shadow-md sticky top-0 z-40">
            <div className="bg-brand-accent text-white text-center py-2 text-sm font-semibold">
                {themeSettings.announcementText}
            </div>
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-black text-gray-800 tracking-wider">
                            NUMBER 6
                        </Link>
                    </div>
                    <div className="hidden md:flex md:items-center md:space-x-8">
                        <Link to="/category/men" className="text-gray-600 hover:text-brand-accent transition">رجالي</Link>
                        <Link to="/category/women" className="text-gray-600 hover:text-brand-accent transition">نسائي</Link>
                        <Link to="/category/kids" className="text-gray-600 hover:text-brand-accent transition">أطفال</Link>
                        <Link to="/admin" className="text-gray-600 hover:text-brand-accent transition">لوحة التحكم</Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link to="/cart" className="relative text-gray-600 hover:text-brand-accent transition">
                            <ShoppingCart size={24} />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-brand-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartItemCount}
                                </span>
                            )}
                        </Link>
                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-brand-accent">
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            {isMenuOpen && (
                <div className="md:hidden bg-white py-4 px-2 space-y-2">
                    <Link to="/category/men" className="block text-gray-600 hover:text-brand-accent transition py-2 px-3 rounded-md">رجالي</Link>
                    <Link to="/category/women" className="block text-gray-600 hover:text-brand-accent transition py-2 px-3 rounded-md">نسائي</Link>
                    <Link to="/category/kids" className="block text-gray-600 hover:text-brand-accent transition py-2 px-3 rounded-md">أطفال</Link>
                    <Link to="/admin" className="block text-gray-600 hover:text-brand-accent transition py-2 px-3 rounded-md">لوحة التحكم</Link>
                </div>
            )}
        </header>
    );
};


const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 border-t mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">NUMBER 6</h3>
            <p className="text-gray-600">متجر الملابس العصرية لجميع أفراد العائلة.</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 mb-3">روابط سريعة</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-brand-accent">عنا</a></li>
              <li><a href="#" className="text-gray-600 hover:text-brand-accent">سياسة الاسترجاع</a></li>
              <li><a href="#" className="text-gray-600 hover:text-brand-accent">الشحن والتوصيل</a></li>
              <li><a href="#" className="text-gray-600 hover:text-brand-accent">تواصل معنا</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 mb-3">الأقسام</h4>
             <ul className="space-y-2">
              <li><Link to="/category/men" className="text-gray-600 hover:text-brand-accent">رجالي</Link></li>
              <li><Link to="/category/women" className="text-gray-600 hover:text-brand-accent">نسائي</Link></li>
              <li><Link to="/category/kids" className="text-gray-600 hover:text-brand-accent">أطفال</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 mb-3">تابعنا</h4>
            <div className="flex space-x-4">
                <a href="https://wa.me/201206155419" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-gray-500 hover:text-green-500 transition-colors duration-300">
                    <MessageSquare size={24} />
                </a>
                <a href="https://www.facebook.com/share/1Ag2BuXvbh/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-500 hover:text-blue-600 transition-colors duration-300">
                    <Facebook size={24} />
                </a>
                <a href="https://www.instagram.com/mo_elbatawy?igsh=aWQxNjhkcGhzazF1" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-500 hover:text-pink-500 transition-colors duration-300">
                    <Instagram size={24} />
                </a>
            </div>
          </div>
        </div>
        <div className="text-center text-gray-500 mt-12 border-t pt-6">
          <p>&copy; {new Date().getFullYear()} NUMBER 6. كل الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};


const StoreLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <DynamicGlobalStyles />
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default StoreLayout;
