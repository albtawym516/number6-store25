
import React from 'react';
import { useStore } from '../../hooks/useStore';
import { DollarSign, ShoppingBag, ListOrdered } from 'lucide-react';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
        <div className="bg-brand-accent text-white p-4 rounded-full mr-6">
            {icon}
        </div>
        <div>
            <p className="text-gray-500 text-sm">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
        </div>
    </div>
);

const AdminDashboard: React.FC = () => {
  const { orders, products } = useStore();
  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">لوحة التحكم</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
            title="إجمالي المبيعات" 
            value={`${totalSales.toFixed(2)} جنيه`}
            icon={<DollarSign size={28} />}
        />
        <StatCard 
            title="عدد الطلبات" 
            value={orders.length}
            icon={<ListOrdered size={28} />}
        />
        <StatCard 
            title="عدد المنتجات" 
            value={products.length}
            icon={<ShoppingBag size={28} />}
        />
      </div>
      {/* Additional charts or recent activity could be added here */}
    </div>
  );
};

export default AdminDashboard;
