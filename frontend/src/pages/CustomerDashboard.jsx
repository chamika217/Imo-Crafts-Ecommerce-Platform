import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import {
  Package, Calendar, MapPin, Phone, Mail, X,
  ShoppingBag, Clock, CheckCircle, Truck, XCircle,
  ArrowRight, Tag, ChevronRight, Star
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

const API_URL = import.meta.env.VITE_API_URL;

const statusConfig = {
  'Pending':            { icon: Clock,         color: 'bg-yellow-100 text-yellow-800',  dot: 'bg-yellow-400' },
  'Confirmed':          { icon: CheckCircle,   color: 'bg-blue-100 text-blue-800',      dot: 'bg-blue-400' },
  'Processing':         { icon: Package,       color: 'bg-purple-100 text-purple-800',  dot: 'bg-purple-400' },
  'Ready for Delivery': { icon: ShoppingBag,   color: 'bg-indigo-100 text-indigo-800',  dot: 'bg-indigo-400' },
  'Dispatched':         { icon: Truck,         color: 'bg-amber-100 text-amber-800',    dot: 'bg-amber-400' },
  'Delivered':          { icon: CheckCircle,   color: 'bg-green-100 text-green-800',    dot: 'bg-green-400' },
  'Cancelled':          { icon: XCircle,       color: 'bg-red-100 text-red-800',        dot: 'bg-red-400' },
};

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.email) { setLoading(false); return; }
      try {
        const res = await axios.get(`${API_URL}/orders/customer?email=${user.email}`);
        setOrders(res.data);
      } catch {
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const getStatusBadge = (status) => {
    const cfg = statusConfig[status] || statusConfig['Pending'];
    const Icon = cfg.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
        <Icon size={12} /> {status}
      </span>
    );
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={56} className="mx-auto text-gray-200 mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Please Login First</h2>
          <Link to="/login" className="inline-block bg-amber-700 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-amber-800 transition-colors text-sm mt-2">
            Login
          </Link>
        </div>
      </div>
    );
  }

  const pendingCount = orders.filter(o => o.orderStatus === 'Pending').length;
  const deliveredCount = orders.filter(o => o.orderStatus === 'Delivered').length;

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <SEO title="My Orders — Imo Crafts" description="View and track your orders" url="/dashboard" />

      {/* Header banner - matches site theme */}
      <section style={{ background: 'linear-gradient(135deg, #FFF8F0 0%, #FFF3E0 50%, #FFE0B2 100%)', padding: '48px 0 40px' }}>
        <div className="page-container">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <p className="text-sm font-medium text-amber-700 mb-1">My Account</p>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                Welcome, {user.displayName || user.email?.split('@')[0]}!
              </h1>
              <p className="text-gray-500 text-sm mt-1">Track your orders and manage your account</p>
            </div>

            {/* Stats row */}
            <div className="flex gap-3">
              {[
                { label: 'Total Orders', value: orders.length, icon: ShoppingBag },
                { label: 'Pending', value: pendingCount, icon: Clock },
                { label: 'Delivered', value: deliveredCount, icon: CheckCircle },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-amber-100 text-center min-w-[80px]">
                  <div className="text-xl font-bold text-amber-700">{value}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Orders list */}
      <div className="page-container py-8">
        <h2 className="text-lg font-bold text-gray-800 mb-5">Order History</h2>

        {loading ? (
          <div className="grid grid-cols-1 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse h-28 border border-gray-100" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package size={32} className="text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">No Orders Yet</h3>
            <p className="text-gray-500 text-sm mb-5">Start shopping to see your order history here</p>
            <Link to="/shop"
              className="inline-flex items-center gap-2 bg-amber-700 text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-amber-800 transition-colors">
              Start Shopping <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => {
              const cfg = statusConfig[order.orderStatus] || statusConfig['Pending'];
              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      {/* Left - order meta */}
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cfg.color}`}>
                          <cfg.icon size={18} />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Order ID</p>
                          <p className="font-bold text-gray-800 text-sm">#{order.id?.slice(-8).toUpperCase()}</p>
                        </div>
                      </div>

                      {/* Right - price + status */}
                      <div className="text-right">
                        <p className="text-lg font-bold text-amber-700">Rs. {order.total?.toLocaleString()}</p>
                        <div className="mt-1">{getStatusBadge(order.orderStatus)}</div>
                      </div>
                    </div>

                    {/* Product images + date */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {order.items?.slice(0, 3).map((item, i) => (
                          <div key={i} className="w-12 h-12 rounded-xl overflow-hidden bg-amber-50 border border-amber-100 flex-shrink-0">
                            {item.image
                              ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              : <div className="w-full h-full flex items-center justify-center"><Package size={16} className="text-amber-300" /></div>
                            }
                          </div>
                        ))}
                        {order.items?.length > 3 && (
                          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500">
                            +{order.items.length - 3}
                          </div>
                        )}
                        <div className="ml-2">
                          <p className="text-xs text-gray-500">{order.items?.length} {order.items?.length === 1 ? 'item' : 'items'}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <Calendar size={11} />
                            {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </div>

                      <span className="text-xs text-amber-700 font-medium flex items-center gap-1">
                        View Details <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white w-full sm:rounded-3xl sm:max-w-lg max-h-[90vh] overflow-y-auto">

            {/* Modal header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-800">Order Details</h3>
                <p className="text-xs text-gray-400">#{selectedOrder.id?.slice(-8).toUpperCase()}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)}
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5">

              {/* Status + date */}
              <div className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  {getStatusBadge(selectedOrder.orderStatus)}
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">Order Date</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {new Date(selectedOrder.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Items Ordered</h4>
                <div className="space-y-2.5">
                  {selectedOrder.items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      {item.image
                        ? <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                        : <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center"><Package size={18} className="text-amber-400" /></div>
                      }
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-amber-700">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery info */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Delivery Info</h4>
                <div className="space-y-2.5 text-sm">
                  {[
                    { icon: MapPin, label: selectedOrder.customerInfo?.address },
                    { icon: Phone, label: selectedOrder.customerInfo?.phone },
                    { icon: Mail, label: selectedOrder.customerInfo?.email },
                  ].filter(i => i.label).map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-2.5 text-gray-600">
                      <Icon size={15} className="text-amber-600 shrink-0" /> {label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Coupon */}
              {selectedOrder.couponCode && (
                <div className="flex items-center gap-2 px-4 py-2.5 bg-green-50 rounded-xl border border-green-100 text-sm">
                  <Tag size={14} className="text-green-600" />
                  <span className="text-green-700 font-medium">{selectedOrder.couponCode}</span>
                  <span className="text-green-600 text-xs ml-auto">- Rs. {selectedOrder.discountAmount?.toLocaleString()}</span>
                </div>
              )}

              {/* Price breakdown */}
              <div className="bg-gray-50 rounded-2xl p-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>Rs. {selectedOrder.subtotal?.toLocaleString()}</span>
                </div>
                {selectedOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>- Rs. {selectedOrder.discountAmount?.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span>{selectedOrder.deliveryFee > 0 ? `Rs. ${selectedOrder.deliveryFee?.toLocaleString()}` : 'Free'}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span className="text-amber-700">Rs. {selectedOrder.total?.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button onClick={() => setSelectedOrder(null)}
                  className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                  Close
                </button>
                <Link to="/shop"
                  className="flex-1 py-3 rounded-xl bg-amber-700 text-white text-sm font-semibold text-center hover:bg-amber-800 transition-colors flex items-center justify-center gap-2">
                  <ShoppingBag size={16} /> Shop More
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
