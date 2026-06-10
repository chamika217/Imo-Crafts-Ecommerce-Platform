import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Download } from 'lucide-react';
import AdminNavbar from '../../components/layout/AdminNavbar';
import { auth } from '../../firebase/config';

const API_URL = import.meta.env.VITE_API_URL;

const Reports = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getToken = async () => {
    const user = auth.currentUser;
    if (user) return await user.getIdToken();
    return null;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();
        const headers = { Authorization: `Bearer ${token}` };
        const [ordersRes, productsRes] = await Promise.allSettled([
          axios.get(`${API_URL}/orders`, { headers }),
          axios.get(`${API_URL}/products`),
        ]);
        if (ordersRes.status === 'fulfilled') setOrders(ordersRes.value.data);
        if (productsRes.status === 'fulfilled') setProducts(productsRes.value.data);
      } catch (error) {
        toast.error('Failed to load reports');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalRevenue = orders
    .filter(o => o.orderStatus === 'Delivered')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const pendingOrders = orders.filter(o => o.orderStatus === 'Pending').length;
  const completedOrders = orders.filter(o => o.orderStatus === 'Delivered').length;
  const cancelledOrders = orders.filter(o => o.orderStatus === 'Cancelled').length;

  const productSales = products.map(p => {
    const sales = orders.flatMap(o => o.items || [])
      .filter(item => item.productId === p.id)
      .reduce((sum, item) => sum + (item.quantity || 0), 0);
    return { ...p, totalSales: sales };
  }).sort((a, b) => b.totalSales - a.totalSales);

  const exportCSV = () => {
    const headers = ['Order ID', 'Customer', 'Phone', 'Total', 'Status', 'Date'];
    const rows = orders.map(o => [
      o.id?.slice(-6),
      o.customerInfo?.name,
      o.customerInfo?.phone,
      o.total,
      o.orderStatus,
      new Date(o.createdAt).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'imo-crafts-orders.csv';
    a.click();
    toast.success('Report exported!');
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="p-8 text-center text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
          <button
            onClick={exportCSV}
            className="bg-amber-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-amber-800 transition-colors text-sm"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-sm">Total Revenue</p>
            <p className="text-2xl font-bold text-amber-700 mt-1">
              Rs. {totalRevenue.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-sm">Total Orders</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{orders.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-sm">Completed</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{completedOrders}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-sm">Cancelled</p>
            <p className="text-2xl font-bold text-red-500 mt-1">{cancelledOrders}</p>
          </div>
        </div>

        {/* Best Selling Products */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">Best Selling Products</h2>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Units Sold</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {productSales.slice(0, 10).map(product => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-amber-700">Rs. {product.price?.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.totalSales}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
// chore: update 128 - 2026-06-10T09:35:39
