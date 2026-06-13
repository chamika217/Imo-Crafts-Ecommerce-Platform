import { useAuth } from '../../context/AuthContext';
import { Bell, User } from 'lucide-react';

const AdminNavbar = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <h1 className="text-lg font-semibold text-gray-800">Admin Panel</h1>
      <div className="flex items-center gap-4">
        <button className="relative text-gray-500 hover:text-gray-700">
          <Bell size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-700 rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <span className="text-sm text-gray-600">{user?.email}</span>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
// chore: update 9 - 2026-06-13T05:23:01

// chore: update 26 - 2026-06-12T05:25:15

// chore: update 42 - 2026-06-14T00:04:08
