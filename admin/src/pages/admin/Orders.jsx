import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminNavbar from '../../components/layout/AdminNavbar';
import OrderStatusBadge from '../../components/ui/OrderStatusBadge';
import { auth } from '../../firebase/config';

const API_URL = import.meta.env.VITE_API_URL;

const orderStatuses = [
  'Pending', 'Confirmed', 'Processing',
  'Ready for Delivery', 'Dispatched', 'Delivered', 'Cancelled',
];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');

  const getToken = async () => {
    const user = auth.currentUser;
    if (user) return await user.getIdToken();
    return null;
  };

  const fetchOrders = async () => {
    try {
      const token = await getToken();
      const res = await axios.get(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      const token = await getToken();
      await axios.put(`${API_URL}/orders/${orderId}`,
        { orderStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Order status updated!');
      fetchOrders();
      setSelectedOrder(null);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredOrders = filterStatus
    ? orders.filter(o => o.orderStatus === filterStatus)
    : orders;

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none"
          >
            <option value="">All Orders</option>
            {orderStatuses.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : filteredOrders.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-600">#{order.id?.slice(-6)}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{order.customerInfo?.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{order.customerInfo?.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{order.items?.length} items</td>
                    <td className="px-6 py-4 text-sm font-medium text-amber-700">
                      Rs. {order.total?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <OrderStatusBadge status={order.orderStatus} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-amber-700 hover:text-amber-800 text-sm font-medium"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-gray-400">No orders found</div>
          )}
        </div>
      </div>

      {/* Update Status Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Update Order Status</h3>
            <p className="text-gray-500 text-sm mb-4">
              Order #{selectedOrder.id?.slice(-6)} - {selectedOrder.customerInfo?.name}
            </p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {orderStatuses.map(status => (
                <button
                  key={status}
                  onClick={() => updateStatus(selectedOrder.id, status)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    selectedOrder.orderStatus === status
                      ? 'bg-amber-700 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;