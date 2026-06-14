import { useState, useEffect } from 'react';
import { ShoppingBag, Users, MessageSquare, Package } from 'lucide-react';
import axios from 'axios';
import AdminNavbar from '../../components/layout/AdminNavbar';

const API_URL = import.meta.env.VITE_API_URL;

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalCustomers: 0,
    totalInquiries: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = await window.firebase_auth_token;
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const [ordersRes, customersRes, inquiriesRes] = await Promise.allSettled([
          axios.get(`${API_URL}/orders`, { headers }),
          axios.get(`${API_URL}/customers`, { headers }),
          axios.get(`${API_URL}/inquiries`, { headers }),
        ]);

        const orders = ordersRes.status === 'fulfilled' ? ordersRes.value.data : [];
        const customers = customersRes.status === 'fulfilled' ? customersRes.value.data : [];
        const inquiries = inquiriesRes.status === 'fulfilled' ? inquiriesRes.value.data : [];

        setStats({
          totalOrders: orders.length,
          pendingOrders: orders.filter(o => o.orderStatus === 'Pending').length,
          totalCustomers: customers.length,
          totalInquiries: inquiries.length,
        });
        setRecentOrders(orders.slice(0, 5));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Orders" value={stats.totalOrders} icon={ShoppingBag} color="bg-amber-700" />
          <StatCard title="Pending Orders" value={stats.pendingOrders} icon={Package} color="bg-orange-500" />
          <StatCard title="Customers" value={stats.totalCustomers} icon={Users} color="bg-blue-500" />
          <StatCard title="Inquiries" value={stats.totalInquiries} icon={MessageSquare} color="bg-purple-500" />
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-400">Loading...</div>
            ) : recentOrders.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentOrders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-600">#{order.id?.slice(-6)}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{order.customerInfo?.name}</td>
                      <td className="px-6 py-4 text-sm font-medium text-amber-700">Rs. {order.total?.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-gray-400">No orders yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;