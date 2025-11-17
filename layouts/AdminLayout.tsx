
import React from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, ListOrdered, Home, Palette, LogOut } from 'lucide-react';

const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-brand-accent text-white'
        : 'text-gray-600 hover:bg-gray-200'
    }`;

  const handleLogout = () => {
    sessionStorage.removeItem('isAdminAuthenticated');
    navigate('/admin/login');
  };

  return (
    <aside className="w-64 bg-gray-50 border-l p-6 flex flex-col">
      <div className="mb-8">
        <Link to="/admin/dashboard" className="text-2xl font-black text-gray-800 tracking-wider">
          ADMIN
        </Link>
      </div>
      <nav className="flex-grow space-y-2">
        <NavLink to="/admin/dashboard" className={navLinkClass}>
          <LayoutDashboard className="ml-3 h-5 w-5" />
          <span>لوحة التحكم</span>
        </NavLink>
        <NavLink to="/admin/products" className={navLinkClass}>
          <ShoppingBag className="ml-3 h-5 w-5" />
          <span>المنتجات</span>
        </NavLink>
        <NavLink to="/admin/orders" className={navLinkClass}>
          <ListOrdered className="ml-3 h-5 w-5" />
          <span>الطلبات</span>
        </NavLink>
        <NavLink to="/admin/theme" className={navLinkClass}>
          <Palette className="ml-3 h-5 w-5" />
          <span>إعدادات الواجهة</span>
        </NavLink>
      </nav>
       <div className="space-y-2">
         <Link to="/" className="flex items-center px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors duration-200">
           <Home className="ml-3 h-5 w-5" />
           <span>العودة للمتجر</span>
        </Link>
        <button onClick={handleLogout} className="w-full flex items-center px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors duration-200">
           <LogOut className="ml-3 h-5 w-5" />
           <span>تسجيل الخروج</span>
        </button>
       </div>
    </aside>
  );
};

const AdminLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-white">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
