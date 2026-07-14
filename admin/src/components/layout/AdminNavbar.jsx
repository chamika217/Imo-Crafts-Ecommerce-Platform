import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../firebase/config';
import axios from 'axios';
import { Bell, User, ShoppingBag, AlertTriangle, MessageSquare, X, Check } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const AdminNavbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);

  const getToken = async () => {
    const u = auth.currentUser;
    return u ? await u.getIdToken() : null;
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const headers = { Authorization: `Bearer ${token}` };

      const [ordersRes, inquiriesRes, productsRes] = await Promise.allSettled([
        axios.get(`${API_URL}/orders`, { headers }),
        axios.get(`${API_URL}/inquiries`, { headers }),
        axios.get(`${API_URL}/products`),
      ]);

      const notifs = [];

      // New pending orders (last 24h)
      if (ordersRes.status === 'fulfilled') {
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const newOrders = ordersRes.value.data.filter(
          o => o.orderStatus === 'Pending' && o.createdAt > yesterday
        );
        if (newOrders.length > 0) {
          notifs.push({
            id: 'new-orders',
            type: 'order',
            icon: ShoppingBag,
            color: 'text-amber-600 bg-amber-50',
            title: `${newOrders.length} New Order${newOrders.length > 1 ? 's' : ''}`,
            desc: 'Pending orders in the last 24 hours',
            link: '/admin/orders',
          });
        }

        // Unpaid card orders
        const unpaidCard = ordersRes.value.data.filter(
          o => o.paymentMethod === 'CARD' && o.paymentStatus === 'Pending'
        );
        if (unpaidCard.length > 0) {
          notifs.push({
            id: 'unpaid-card',
            type: 'order',
            icon: ShoppingBag,
            color: 'text-blue-600 bg-blue-50',
            title: `${unpaidCard.length} Unpaid Card Order${unpaidCard.length > 1 ? 's' : ''}`,
            desc: 'Card payments pending confirmation',
            link: '/admin/orders',
          });
        }
      }

      // Low stock products
      if (productsRes.status === 'fulfilled') {
        const lowStock = productsRes.value.data.filter(p => (p.stockQty || 0) <= 5 && (p.stockQty || 0) > 0);
        const outOfStock = productsRes.value.data.filter(p => p.stockQty === 0 && p.status !== 'draft');

        if (outOfStock.length > 0) {
          notifs.push({
            id: 'out-of-stock',
            type: 'stock',
            icon: AlertTriangle,
            color: 'text-red-600 bg-red-50',
            title: `${outOfStock.length} Out of Stock`,
            desc: outOfStock.slice(0, 2).map(p => p.name).join(', ') + (outOfStock.length > 2 ? '...' : ''),
            link: '/admin/inventory',
          });
        }
        if (lowStock.length > 0) {
          notifs.push({
            id: 'low-stock',
            type: 'stock',
            icon: AlertTriangle,
            color: 'text-orange-600 bg-orange-50',
            title: `${lowStock.length} Low Stock`,
            desc: lowStock.slice(0, 2).map(p => `${p.name} (${p.stockQty} left)`).join(', '),
            link: '/admin/inventory',
          });
        }
      }

      // Pending inquiries
      if (inquiriesRes.status === 'fulfilled') {
        const pending = inquiriesRes.value.data.filter(i => i.status === 'Pending');
        if (pending.length > 0) {
          notifs.push({
            id: 'pending-inquiries',
            type: 'inquiry',
            icon: MessageSquare,
            color: 'text-purple-600 bg-purple-50',
            title: `${pending.length} Pending Inquir${pending.length > 1 ? 'ies' : 'y'}`,
            desc: 'Custom order requests awaiting response',
            link: '/admin/inquiries',
          });
        }
      }

      setNotifications(notifs);
    } catch (error) {
      console.error('Notification fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on open
  useEffect(() => {
    if (open) fetchNotifications();
  }, [open]);

  // Auto-refresh every 5 minutes (was 60s - too frequent)
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleNotifClick = (link) => {
    navigate(link);
    setOpen(false);
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
      <h1 className="text-lg font-semibold text-gray-800">Admin Panel</h1>

      <div className="flex items-center gap-4">

        {/* Notification Bell */}
        <div className="relative" ref={panelRef}>
          <button
            onClick={() => setOpen(!open)}
            className="relative text-gray-500 hover:text-gray-700 transition-colors p-1.5 rounded-xl hover:bg-gray-100"
          >
            <Bell size={22} />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white">
                {notifications.length > 9 ? '9+' : notifications.length}
              </span>
            )}
          </button>

          {/* Dropdown Panel */}
          {open && (
            <div className="absolute right-0 top-10 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800 text-sm">Notifications</h3>
                <div className="flex items-center gap-2">
                  {notifications.length > 0 && (
                    <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                      {notifications.length}
                    </span>
                  )}
                  <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="max-h-80 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-8 text-gray-400 text-sm">
                    Loading...
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                    <Check size={32} className="mb-2 text-green-400" />
                    <p className="text-sm font-medium">All caught up!</p>
                    <p className="text-xs mt-1">No pending notifications</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {notifications.map((notif) => {
                      const Icon = notif.icon;
                      return (
                        <button
                          key={notif.id}
                          onClick={() => handleNotifClick(notif.link)}
                          className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                        >
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${notif.color}`}>
                            <Icon size={16} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800">{notif.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                <button
                  onClick={() => { fetchNotifications(); }}
                  className="text-xs text-amber-700 hover:text-amber-800 font-medium transition-colors"
                >
                  Refresh notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-700 rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <span className="text-sm text-gray-600 hidden sm:block">{user?.email}</span>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
