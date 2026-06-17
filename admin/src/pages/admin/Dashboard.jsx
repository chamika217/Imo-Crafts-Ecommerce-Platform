import { useState, useEffect } from 'react';
import { ShoppingBag, Users, MessageSquare, Package, TrendingUp, Archive, Tag, Star } from 'lucide-react';
import axios from 'axios';
import AdminNavbar from '../../components/layout/AdminNavbar';
import { auth } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const StatCard = ({ title, value, icon: Icon, color, sub }) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-3xl font-bold text-gray-800 mt-1">{value ?? '—'}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { userRole } = useAuth();
  const [stats, setStats] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getToken = async () => {
    const user = auth.currentUser;
    if (user) return await user.getIdToken();
    return null;
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = await getToken();
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const canSeeOrders = ['superAdmin', 'staff'].includes(userRole) || !userRole;
        const canSeeInventory = ['superAdmin', 'inventoryManager'].includes(userRole) || !userRole;
        const canSeeCustomers = ['superAdmin', 'staff'].includes(userRole) || !userRole;
        const canSeeInquiries = ['superAdmin', 'staff'].includes(userRole) || !userRole;
        const canSeeProducts = ['superAdmin', 'inventoryManager', 'contentManager'].includes(userRole) || !userRole;

        const results = await Promise.allSettled([
          canSeeOrders ? axios.get(`${API_URL}/orders`, { headers }) : Promise.resolve(null),
          canSeeCustomers ? axios.get(`${API_URL}/customers`, { headers }) : Promise.resolve(null),
          canSeeInquiries ? axios.get(`${API_URL}/inquiries`, { headers }) : Promise.resolve(null),
          canSeeProducts ? axios.get(`${API_URL}/products`) : Promise.resolve(null),
        ]);

        const orders = results[0].status === 'fulfilled' && results[0].value ? results[0].value.data : null;
        const customers = results[1].status === 'fulfilled' && results[1].value ? results[1].value.data : null;
        const inquiries = results[2].status === 'fulfilled' && results[2].value ? results[2].value.data : null;
        const products = results[3].status === 'fulfilled' && results[3].value ? results[3].value.data : null;

        setStats({
          totalOrders: orders ? orders.length : null,
          pendingOrders: orders ? orders.filter(o => o.orderStatus === 'Pending').length : null,
          totalCustomers: customers ? customers.length : null,
          totalInquiries: inquiries ? inquiries.filter(i => i.status === 'Pending').length : null,
          totalProducts: products ? products.length : null,
          lowStock: products ? products.filter(p => (p.stockQty || 0) <= 5 && p.stockQty > 0).length : null,
          outOfStock: products ? products.filter(p => p.stockQty === 0).length : null,
          totalRevenue: orders ? orders.filter(o => o.orderStatus !== 'Cancelled').reduce((s, o) => s + (o.total || 0), 0) : null,
        });

        if (orders) setRecentOrders(orders.slice(0, 5));
        if (products) setLowStockProducts(products.filter(p => (p.stockQty || 0) <= 5).slice(0, 5));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (userRole !== undefined) fetchStats();
  }, [userRole]);

  // Role-specific stat cards
  const getStatCards = () => {
    if (userRole === 'inventoryManager') {
      return [
        { title: 'Total Products', value: stats.totalProducts, icon: Package, color: 'bg-amber-700' },
        { title: 'Low Stock', value: stats.lowStock, icon: Archive, color: 'bg-amber-500', sub: '≤ 5 units remaining' },
        { title: 'Out of Stock', value: stats.outOfStock, icon: Archive, color: 'bg-red-500' },
      ];
    }
    if (userRole === 'contentManager') {
      return [
        { title: 'Total Products', value: stats.totalProducts, icon: Package, color: 'bg-amber-700' },
        { title: 'Promotions', value: null, icon: Tag, color: 'bg-purple-500', sub: 'Manage in Promotions page' },
        { title: 'Reviews', value: null, icon: Star, color: 'bg-yellow-500', sub: 'Manage in Reviews page' },
      ];
    }
    if (userRole === 'staff') {
      return [
        { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'bg-amber-700' },
        { title: 'Pending Orders', value: stats.pendingOrders, icon: Package, color: 'bg-orange-500' },
        { title: 'Customers', value: stats.totalCustomers, icon: Users, color: 'bg-blue-500' },
        { title: 'Pending Inquiries', value: stats.totalInquiries, icon: MessageSquare, color: 'bg-purple-500' },
      ];
    }
    // superAdmin / default - show everything
    return [
      { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'bg-amber-700' },
      { title: 'Pending Orders', value: stats.pendingOrders, icon: Package, color: 'bg-orange-500' },
      { title: 'Customers', value: stats.totalCustomers, icon: Users, color: 'bg-blue-500' },
      { title: 'Pending Inquiries', value: stats.totalInquiries, icon: MessageSquare, color: 'bg-purple-500' },
      { title: 'Total Products', value: stats.totalProducts, icon: Package, color: 'bg-green-600' },
      { title: 'Low Stock Items', value: stats.lowStock, icon: Archive, color: 'bg-red-500', sub: '≤ 5 units' },
      { title: 'Revenue', value: stats.totalRevenue != null ? `Rs. ${stats.totalRevenue.toLocaleString()}` : null, icon: TrendingUp, color: 'bg-emerald-500' },
    ];
  };

  const statCards = getStatCards();
  const cols = statCards.length <= 3 ? statCards.length : statCards.length <= 4 ? 4 : 4;

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

        {/* Stats */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse h-28" />
            ))}
          </div>
        ) : (
          <div className={`grid grid-cols-2 md:grid-cols-${cols} gap-6 mb-8`}>
            {statCards.map((card, i) => (
              <StatCard key={i} {...card} />
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders - show for superAdmin & staff */}
          {(userRole === 'superAdmin' || userRole === 'staff' || !userRole) && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm lg:col-span-2">
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Payment</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {recentOrders.map(order => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-600">#{order.id?.slice(-6).toUpperCase()}</td>
                          <td className="px-6 py-4 text-sm text-gray-800">{order.customerInfo?.name}</td>
                          <td className="px-6 py-4 text-sm font-medium text-amber-700">Rs. {order.total?.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.paymentMethod === 'CARD' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                              {order.paymentMethod === 'CARD' ? '💳 Card' : '💵 COD'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700'
                              : order.orderStatus === 'Pending' ? 'bg-yellow-100 text-yellow-700'
                              : order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-600'
                              : 'bg-blue-100 text-blue-700'
                            }`}>
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
          )}

          {/* Low Stock Alert - show for superAdmin & inventoryManager */}
          {(userRole === 'superAdmin' || userRole === 'inventoryManager' || !userRole) && lowStockProducts.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800">⚠️ Low Stock Alert</h2>
                <span className="text-xs text-gray-400">≤ 5 units</span>
              </div>
              <div className="divide-y divide-gray-100">
                {lowStockProducts.map(product => (
                  <div key={product.id} className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {product.images?.[0]
                          ? <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-sm">🎨</div>
                        }
                      </div>
                      <span className="text-sm font-medium text-gray-800">{product.name}</span>
                    </div>
                    <span className={`text-sm font-bold ${product.stockQty === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                      {product.stockQty === 0 ? 'Out of Stock' : `${product.stockQty} left`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Inventory manager - quick guide */}
          {userRole === 'inventoryManager' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">Quick Actions</h2>
              </div>
              <div className="p-6 flex flex-col gap-3">
                <a href="/admin/inventory" className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-medium text-sm hover:bg-amber-100 transition-colors">
                  <Archive size={18} /> Manage Inventory
                </a>
                <a href="/admin/products" className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-100 transition-colors">
                  <Package size={18} /> Manage Products
                </a>
              </div>
            </div>
          )}

          {/* Content manager - quick guide */}
          {userRole === 'contentManager' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">Quick Actions</h2>
              </div>
              <div className="p-6 flex flex-col gap-3">
                <a href="/admin/products" className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-medium text-sm hover:bg-amber-100">
                  <Package size={18} /> Manage Products
                </a>
                <a href="/admin/promotions" className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-100">
                  <Tag size={18} /> Manage Promotions
                </a>
                <a href="/admin/reviews" className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-100">
                  <Star size={18} /> Approve Reviews
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
