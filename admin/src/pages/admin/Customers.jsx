import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Search } from 'lucide-react';
import AdminNavbar from '../../components/layout/AdminNavbar';
import { auth } from '../../firebase/config';

const API_URL = import.meta.env.VITE_API_URL;

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const getToken = async () => {
    const user = auth.currentUser;
    if (user) return await user.getIdToken();
    return null;
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = await getToken();
        const res = await axios.get(`${API_URL}/customers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCustomers(res.data);
      } catch (error) {
        toast.error('Failed to load customers');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filtered = customers.filter(c =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone?.includes(searchQuery)
  );

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : filtered.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Orders</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Last Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(customer => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{customer.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{customer.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{customer.email || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{customer.orderCount || 0}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {customer.lastOrderDate
                        ? new Date(customer.lastOrderDate).toLocaleDateString()
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-gray-400">No customers found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Customers;
// chore: update 22 - 2026-06-13T19:45:26
