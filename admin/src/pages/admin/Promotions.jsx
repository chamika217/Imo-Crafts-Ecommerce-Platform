import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus, X } from 'lucide-react';
import AdminNavbar from '../../components/layout/AdminNavbar';
import { auth } from '../../firebase/config';
import { db } from '../../firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    couponCode: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: '',
    startDate: '',
    endDate: '',
    active: true,
  });

  const fetchPromotions = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'promotions'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPromotions(data);
    } catch (error) {
      toast.error('Failed to load promotions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPromotions(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'promotions'), {
        ...formData,
        couponCode: formData.couponCode.toUpperCase().trim(),
        discountValue: parseFloat(formData.discountValue),
        minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : 0,
        createdAt: new Date().toISOString(),
      });
      toast.success('Promotion created!');
      setShowForm(false);
      setFormData({
        title: '', description: '', couponCode: '', discountType: 'percentage',
        discountValue: '', minOrderAmount: '', startDate: '', endDate: '', active: true,
      });
      fetchPromotions();
    } catch (error) {
      toast.error('Failed to create promotion');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'promotions', id));
      toast.success('Promotion deleted!');
      fetchPromotions();
    } catch (error) {
      toast.error('Failed to delete promotion');
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Promotions</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-amber-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-amber-800 transition-colors text-sm"
          >
            <Plus size={16} /> Add Promotion
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading...</div>
        ) : promotions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {promotions.map(promo => (
              <div key={promo.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-gray-800">{promo.title}</h3>
                  <button
                    onClick={() => handleDelete(promo.id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
                <p className="text-gray-500 text-sm mb-3">{promo.description}</p>
                {promo.couponCode && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3 flex items-center gap-2">
                    <span className="text-xs text-amber-600 font-medium">Coupon Code:</span>
                    <span className="font-mono font-bold text-amber-800 tracking-wider">{promo.couponCode}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-amber-700 font-bold text-lg">
                    {promo.discountValue}
                    {promo.discountType === 'percentage' ? '%' : ' Rs.'} OFF
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    promo.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {promo.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {promo.minOrderAmount > 0 && (
                  <p className="text-xs text-gray-400 mt-2">Min. order: Rs. {promo.minOrderAmount?.toLocaleString()}</p>
                )}
                {promo.endDate && (
                  <p className="text-xs text-gray-400 mt-1">Ends: {promo.endDate}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <p>No promotions yet</p>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">Add Promotion</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Title *</label>
                <input
                  type="text" name="title" value={formData.title}
                  onChange={handleChange} required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
                <textarea
                  name="description" value={formData.description}
                  onChange={handleChange} rows={2}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Coupon Code *</label>
                <input
                  type="text" name="couponCode" value={formData.couponCode}
                  onChange={handleChange} required placeholder="e.g. SAVE20"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-400 uppercase font-mono tracking-wider"
                />
                <p className="text-xs text-gray-400 mt-1">Customers will enter this code at checkout</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Discount Type</label>
                  <select
                    name="discountType" value={formData.discountType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none bg-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (Rs.)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Discount Value *</label>
                  <input
                    type="number" name="discountValue" value={formData.discountValue}
                    onChange={handleChange} required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Minimum Order Amount (Rs.)</label>
                <input
                  type="number" name="minOrderAmount" value={formData.minOrderAmount}
                  onChange={handleChange} placeholder="0 = no minimum"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Start Date</label>
                  <input
                    type="date" name="startDate" value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">End Date</label>
                  <input
                    type="date" name="endDate" value={formData.endDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox" name="active" id="active"
                  checked={formData.active} onChange={handleChange}
                  className="w-4 h-4 accent-amber-700"
                />
                <label htmlFor="active" className="text-sm text-gray-700">Active</label>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-700 text-white py-3 rounded-full font-medium hover:bg-amber-800 transition-colors"
              >
                Create Promotion
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Promotions;
// chore: update 88 - 2026-06-13T14:28:31

// chore: update 117 - 2026-06-14T10:01:02
