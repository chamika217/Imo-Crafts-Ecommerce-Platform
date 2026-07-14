import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Package, Calendar, MapPin, Phone, Mail, X, ChevronRight, ShoppingBag, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

const API_URL = import.meta.env.VITE_API_URL;

const statusConfig = {
  'Pending': { icon: Clock, color: 'bg-yellow-100 text-yellow-800', borderColor: 'border-yellow-200' },
  'Confirmed': { icon: CheckCircle, color: 'bg-blue-100 text-blue-800', borderColor: 'border-blue-200' },
  'Processing': { icon: Package, color: 'bg-purple-100 text-purple-800', borderColor: 'border-purple-200' },
  'Ready for Delivery': { icon: ShoppingBag, color: 'bg-indigo-100 text-indigo-800', borderColor: 'border-indigo-200' },
  'Dispatched': { icon: Truck, color: 'bg-orange-100 text-orange-800', borderColor: 'border-orange-200' },
  'Delivered': { icon: CheckCircle, color: 'bg-green-100 text-green-800', borderColor: 'border-green-200' },
  'Cancelled': { icon: XCircle, color: 'bg-red-100 text-red-800', borderColor: 'border-red-200' },
};

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/orders/customer?email=${user.email}`);
        setOrders(res.data);
      } catch (error) {
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusBadge = (status) => {
    const config = statusConfig[status] || statusConfig['Pending'];
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${config.color} ${config.borderColor} border`}>
        <Icon size={14} />
        {status}
      </span>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="text-center">
          <ShoppingBag size={64} className="mx-auto text-amber-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Please Login First</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your orders</p>
          <a href="/login" className="inline-block bg-amber-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-amber-700 transition-colors">
            Login to Continue
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50">
      <SEO
        title="My Dashboard — Imo Crafts"
        description="View and track your orders at Imo Crafts"
        url="/dashboard"
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-500 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome, {user.displayName || 'Customer'}!</h1>
              <p className="text-amber-100">Track your orders and manage your account</p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <ShoppingBag className="text-amber-600" size={24} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{orders.length}</div>
                    <div className="text-xs text-amber-100">Total Orders</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-600 border-t-transparent"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package size={48} className="text-amber-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No Orders Yet</h3>
            <p className="text-gray-600 mb-6">Start shopping to see your order history here</p>
            <a href="/shop" className="inline-flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-amber-700 transition-colors">
              Start Shopping <ChevronRight size={20} />
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const StatusIcon = statusConfig[order.orderStatus]?.icon || Clock;
              const statusColor = statusConfig[order.orderStatus]?.color || 'bg-gray-100 text-gray-800';
              
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${statusColor}`}>
                          <StatusIcon size={28} />
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Order #{order.id?.slice(-8).toUpperCase()}</div>
                          <div className="text-lg font-semibold text-gray-800">
                            {order.items?.length} {order.items?.length === 1 ? 'Item' : 'Items'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {getStatusBadge(order.orderStatus)}
                        <div className="text-right">
                          <div className="text-2xl font-bold text-amber-600">Rs. {order.total?.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Items Preview */}
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {order.items?.slice(0, 4).map((item, index) => (
                        <div
                          key={index}
                          className="flex-shrink-0 w-20 h-20 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center border border-amber-100"
                        >
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            <Package size={24} className="text-amber-400" />
                          )}
                        </div>
                      ))}
                      {order.items?.length > 4 && (
                        <div className="flex-shrink-0 w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 font-semibold">
                          +{order.items.length - 4}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-end text-amber-600 font-medium">
                      View Details <ChevronRight size={20} />
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Order Details</h3>
                <p className="text-sm text-gray-500">#{selectedOrder.id?.slice(-8).toUpperCase()}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Current Status</div>
                  {getStatusBadge(selectedOrder.orderStatus)}
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-1">Order Date</div>
                  <div className="font-semibold text-gray-800">
                    {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                          <Package size={24} className="text-amber-500" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">{item.name}</div>
                        <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                      </div>
                      <div className="font-semibold text-amber-600">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Details */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Shipping Details</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-amber-600 mt-1" size={20} />
                    <div>
                      <div className="text-sm text-gray-500">Delivery Address</div>
                      <div className="text-gray-800">{selectedOrder.customerInfo?.address}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="text-amber-600" size={20} />
                    <div>
                      <div className="text-sm text-gray-500">Phone</div>
                      <div className="text-gray-800">{selectedOrder.customerInfo?.phone}</div>
                    </div>
                  </div>
                  {selectedOrder.customerInfo?.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="text-amber-600" size={20} />
                      <div>
                        <div className="text-sm text-gray-500">Email</div>
                        <div className="text-gray-800">{selectedOrder.customerInfo.email}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment */}
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-800">Rs. {selectedOrder.subtotal?.toLocaleString()}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-semibold text-green-600">-Rs. {selectedOrder.discount?.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-semibold text-gray-800">Rs. {selectedOrder.deliveryFee?.toLocaleString()}</span>
                </div>
                <div className="border-t border-green-200 pt-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-800">Total</span>
                    <span className="text-2xl font-bold text-amber-600">Rs. {selectedOrder.total?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
