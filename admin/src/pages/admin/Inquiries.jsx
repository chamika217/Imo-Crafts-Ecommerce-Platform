import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminNavbar from '../../components/layout/AdminNavbar';
import { auth } from '../../firebase/config';

const API_URL = import.meta.env.VITE_API_URL;

const Inquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const getToken = async () => {
    const user = auth.currentUser;
    if (user) return await user.getIdToken();
    return null;
  };

  const fetchInquiries = async () => {
    try {
      const token = await getToken();
      const res = await axios.get(`${API_URL}/inquiries`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInquiries(res.data);
    } catch (error) {
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInquiries(); }, []);

  const updateStatus = async (id, status, adminNotes) => {
    try {
      const token = await getToken();
      await axios.put(
        `${API_URL}/inquiries/${id}`,
        { status, adminNotes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Inquiry updated!');
      setSelected(null);
      fetchInquiries();
    } catch (error) {
      toast.error('Failed to update inquiry');
    }
  };

  const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Reviewing: 'bg-blue-100 text-blue-800',
    Quoted: 'bg-purple-100 text-purple-800',
    Confirmed: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Custom Inquiries</h1>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : inquiries.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Event Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Budget</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {inquiries.map(inquiry => (
                  <tr key={inquiry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {inquiry.customerInfo?.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{inquiry.customerInfo?.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{inquiry.eventDate || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{inquiry.budget || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[inquiry.status] || 'bg-gray-100 text-gray-600'}`}>
                        {inquiry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelected(inquiry)}
                        className="text-amber-700 hover:text-amber-800 text-sm font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-gray-400">No inquiries yet</div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <InquiryModal
          inquiry={selected}
          onClose={() => setSelected(null)}
          onUpdate={updateStatus}
          statusColors={statusColors}
        />
      )}
    </div>
  );
};

const InquiryModal = ({ inquiry, onClose, onUpdate, statusColors }) => {
  const [status, setStatus] = useState(inquiry.status);
  const [adminNotes, setAdminNotes] = useState(inquiry.adminNotes || '');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-screen overflow-y-auto">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Inquiry Details</h3>

        <div className="space-y-3 mb-6">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-400">Customer</p>
              <p className="font-medium">{inquiry.customerInfo?.name}</p>
            </div>
            <div>
              <p className="text-gray-400">Phone</p>
              <p className="font-medium">{inquiry.customerInfo?.phone}</p>
            </div>
            <div>
              <p className="text-gray-400">Email</p>
              <p className="font-medium">{inquiry.customerInfo?.email || '-'}</p>
            </div>
            <div>
              <p className="text-gray-400">Event Date</p>
              <p className="font-medium">{inquiry.eventDate || '-'}</p>
            </div>
            <div>
              <p className="text-gray-400">Budget</p>
              <p className="font-medium">{inquiry.budget || '-'}</p>
            </div>
            <div>
              <p className="text-gray-400">Quantity</p>
              <p className="font-medium">{inquiry.quantity || '-'}</p>
            </div>
          </div>

          <div>
            <p className="text-gray-400 text-sm">Description</p>
            <p className="text-sm mt-1 bg-gray-50 p-3 rounded-xl">{inquiry.description}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none bg-white"
            >
              {['Pending', 'Reviewing', 'Quoted', 'Confirmed', 'Cancelled'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Admin Notes</label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={3}
              placeholder="Add notes about this inquiry..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onUpdate(inquiry.id, status, adminNotes)}
              className="flex-1 bg-amber-700 text-white py-3 rounded-full font-medium hover:bg-amber-800 transition-colors"
            >
              Update
            </button>
            <button
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inquiries;