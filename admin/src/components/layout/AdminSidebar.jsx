import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, ROLES } from '../../context/AuthContext';
import {
  LayoutDashboard, Package, ShoppingBag, Users,
  Archive, MessageSquare, Image, Tag, BarChart2, LogOut, Star, UserCog
} from 'lucide-react';

const allMenuItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', key: 'dashboard', exact: true },
  { path: '/admin/products', icon: Package, label: 'Products', key: 'products' },
  { path: '/admin/orders', icon: ShoppingBag, label: 'Orders', key: 'orders' },
  { path: '/admin/customers', icon: Users, label: 'Customers', key: 'customers' },
  { path: '/admin/inventory', icon: Archive, label: 'Inventory', key: 'inventory' },
  { path: '/admin/inquiries', icon: MessageSquare, label: 'Inquiries', key: 'inquiries' },
  { path: '/admin/media', icon: Image, label: 'Media', key: 'media' },
  { path: '/admin/promotions', icon: Tag, label: 'Promotions', key: 'promotions' },
  { path: '/admin/reviews', icon: Star, label: 'Reviews', key: 'reviews' },
  { path: '/admin/reports', icon: BarChart2, label: 'Reports', key: 'reports' },
  { path: '/admin/users', icon: UserCog, label: 'Users', key: 'users' },
];

const roleLabels = {
  superAdmin: 'Super Admin',
  staff: 'Staff',
  inventoryManager: 'Inventory Manager',
  contentManager: 'Content Manager',
};

const roleColors = {
  superAdmin: 'bg-amber-500',
  staff: 'bg-blue-500',
  inventoryManager: 'bg-green-500',
  contentManager: 'bg-purple-500',
};

const AdminSidebar = () => {
  const { logout, userRole, hasPermission } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = allMenuItems.filter(item => hasPermission(item.key));

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-bold text-amber-400">Imo Crafts</h2>
        <p className="text-gray-400 text-xs mt-1">Admin Panel</p>
        {userRole && (
          <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium text-white ${ROLES[userRole]?.color || 'bg-gray-600'}`}>
            {ROLES[userRole]?.label || userRole}
          </span>
        )}
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-amber-700 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors w-full"
        >
          <LogOut size={18} />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
// chore: update 28 - 2026-06-14T23:19:24

// chore: update 72 - 2026-06-12T17:20:05

// chore: update 116 - 2026-06-13T09:20:43
