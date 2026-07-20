import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminNavbar from '../../components/layout/AdminNavbar';
import { auth } from '../../firebase/config';
import { Plus, Trash2, Edit2, X, Shield, UserCog } from 'lucide-react';
import { ROLES } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

// Build ROLES array for the form
const ROLE_LIST = Object.entries(ROLES).map(([value, cfg]) => ({
  value,
  label: cfg.label,
  colorClass: cfg.color,
  badgeClass: value === 'superAdmin' ? 'bg-amber-100 text-amber-800'
    : value === 'orderManager' ? 'bg-blue-100 text-blue-800'
    : value === 'inventoryManager' ? 'bg-green-100 text-green-800'
    : value === 'contentManager' ? 'bg-purple-100 text-purple-800'
    : value === 'customerSupport' ? 'bg-pink-100 text-pink-800'
    : 'bg-indigo-100 text-indigo-800',
  desc: cfg.desc,
  pages: cfg.pages,
}));

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'staff' });
  const [submitting, setSubmitting] = useState(false);

  const getToken = async () => {
    const user = auth.currentUser;
    if (user) return await user.getIdToken();
    return null;
  };

  const fetchUsers = async () => {
    try {
      const token = await getToken();
      const res = await axios.get(`${API_URL}/admin-users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = await getToken();
      if (editingUser) {
        await axios.put(`${API_URL}/admin-users/${editingUser.uid}`,
          { role: formData.role },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Role updated!');
      } else {
        await axios.post(`${API_URL}/admin-users`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('User created!');
      }
      setShowForm(false);
      setEditingUser(null);
      setFormData({ name: '', email: '', password: '', role: 'staff' });
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (uid) => {
    if (!confirm('Delete this user?')) return;
    try {
      const token = await getToken();
      await axios.delete(`${API_URL}/admin-users/${uid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('User deleted');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete');
    }
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, password: '', role: user.role });
    setShowForm(true);
  };

  const getRoleInfo = (role) => ROLE_LIST.find(r => r.value === role) || ROLE_LIST[0];

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Users</h1>
            <p className="text-sm text-gray-400 mt-1">Manage team access and permissions</p>
          </div>
          <button
            onClick={() => { setEditingUser(null); setFormData({ name: '', email: '', password: '', role: 'staff' }); setShowForm(true); }}
            className="bg-amber-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-amber-800 transition-colors text-sm"
          >
            <Plus size={16} /> Add User
          </button>
        </div>

        {/* Role Legend */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {ROLE_LIST.map(role => (
            <div key={role.value} className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-1.5 py-0.5 rounded text-xs font-semibold ${role.badgeClass}`}>{role.label}</span>
              </div>
              <p className="text-xs text-gray-400 leading-tight">{role.desc}</p>
            </div>
          ))}
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center">
              <UserCog size={40} className="mx-auto mb-3 text-gray-200" />
              <p className="text-gray-400">No users yet. Add your first team member.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Access</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Added</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map(user => {
                  const roleInfo = getRoleInfo(user.role);
                  return (
                    <tr key={user.uid} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
                            style={{ background: 'linear-gradient(135deg, #8B4513, #D4A574)' }}>
                            {user.name?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-800">{user.name}</div>
                            <div className="text-xs text-gray-400">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleInfo.color}`}>
                          {roleInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-gray-500">{roleInfo.desc}</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(user)} className="text-amber-700 hover:text-amber-800">
                            <Edit2 size={15} />
                          </button>
                          <button onClick={() => handleDelete(user.uid)} className="text-red-400 hover:text-red-600">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">
                {editingUser ? 'Edit User Role' : 'Add Admin User'}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!editingUser && (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name *</label>
                    <input
                      type="text" value={formData.name} required
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Email *</label>
                    <input
                      type="email" value={formData.email} required
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Password *</label>
                    <input
                      type="password" value={formData.password} required minLength={6}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Min. 6 characters"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Role *</label>
                <div className="space-y-2">
                  {ROLES.map(role => (
                    <label key={role.value} className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${formData.role === role.value ? 'border-amber-400 bg-amber-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input
                        type="radio" name="role" value={role.value}
                        checked={formData.role === role.value}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="mt-0.5 accent-amber-700"
                      />
                      <div>
                        <div className={`text-sm font-medium px-2 py-0.5 rounded-full inline-block ${role.color}`}>{role.label}</div>
                        <div className="text-xs text-gray-400 mt-1">{role.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit" disabled={submitting}
                className="w-full bg-amber-700 text-white py-3 rounded-full font-medium hover:bg-amber-800 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Saving...' : editingUser ? 'Update Role' : 'Create User'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
