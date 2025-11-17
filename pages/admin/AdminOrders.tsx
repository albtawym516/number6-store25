import React from 'react';
import { useStore } from '../../hooks/useStore';
import { Order, OrderStatus } from '../../types';

const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus } = useStore();

  const handleStatusChange = (orderId: string, e: React.ChangeEvent<HTMLSelectElement>) => {
    updateOrderStatus(orderId, e.target.value as OrderStatus);
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Processing: return 'bg-blue-100 text-blue-800';
      case OrderStatus.Shipped: return 'bg-yellow-100 text-yellow-800';
      case OrderStatus.Delivered: return 'bg-green-100 text-green-800';
      case OrderStatus.Cancelled: return 'bg-red-100 text-red-800';
      case OrderStatus.Problem: return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">إدارة الطلبات</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">رقم الطلب</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">العميل</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">رقم العميل</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">عنوان العميل</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المنتجات المطلوبة</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التاريخ</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الإجمالي</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order: Order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.shippingInfo.fullName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.shippingInfo.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{`${order.shippingInfo.address}, ${order.shippingInfo.city}`}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <ul className="list-disc list-inside text-xs space-y-1">
                        {order.items.map(item => (
                            <li key={item.id}>
                                {item.product.name} (x{item.quantity})
                            </li>
                        ))}
                    </ul>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.total.toFixed(2)} جنيه</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e)}
                    className={`p-2 rounded-md border-none focus:ring-0 ${getStatusColor(order.status)}`}
                  >
                    {Object.values(OrderStatus).map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;