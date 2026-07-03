import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import AdminNavbar from '../../components/layout/AdminNavbar';
import { db } from '../../firebase/config';
import { collection, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { Star, Check, X, Trash2 } from 'lucide-react';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  const fetchReviews = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'reviews'));
      const data = snapshot.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setReviews(data);
    } catch (error) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleApprove = async (id) => {
    try {
      await updateDoc(doc(db, 'reviews', id), { approved: true });
      toast.success('Review approved!');
      fetchReviews();
    } catch {
      toast.error('Failed to approve');
    }
  };

  const handleReject = async (id) => {
    try {
      await updateDoc(doc(db, 'reviews', id), { approved: false });
      toast.success('Review rejected');
      fetchReviews();
    } catch {
      toast.error('Failed to reject');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'reviews', id));
      toast.success('Review deleted');
      fetchReviews();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const StarDisplay = ({ rating }) => (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} size={14} fill={s <= rating ? '#F59E0B' : 'none'} stroke={s <= rating ? '#F59E0B' : '#D1D5DB'} strokeWidth={1.5} />
      ))}
    </div>
  );

  const pending = reviews.filter(r => !r.approved);
  const approved = reviews.filter(r => r.approved);
  const filtered = filter === 'pending' ? pending : filter === 'approved' ? approved : reviews;

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Reviews</h1>
          <div className="flex items-center gap-2 text-sm">
            {pending.length > 0 && (
              <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-medium">
                {pending.length} pending approval
              </span>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'pending', label: `Pending (${pending.length})` },
            { key: 'approved', label: `Approved (${approved.length})` },
            { key: 'all', label: `All (${reviews.length})` },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === tab.key
                  ? 'bg-amber-700 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Star size={40} className="mx-auto mb-3 text-gray-200" />
            <p>No reviews found</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map(review => (
              <div key={review.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Avatar */}
                    <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #8B4513, #D4A574)' }}>
                      {review.customerName?.[0]?.toUpperCase() || 'A'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <span className="font-semibold text-gray-800">{review.customerName}</span>
                        <StarDisplay rating={review.rating} />
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          review.approved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {review.approved ? 'Approved' : 'Pending'}
                        </span>
                      </div>
                      {review.productName && (
                        <p className="text-xs text-gray-400 mb-2">Product: {review.productName}</p>
                      )}
                      <h4 className="font-semibold text-gray-800 mb-1">{review.title}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{review.review}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        {review.customerEmail && ` · ${review.customerEmail}`}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                    {!review.approved && (
                      <button
                        onClick={() => handleApprove(review.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-xl text-xs font-medium hover:bg-green-200 transition-colors"
                      >
                        <Check size={14} /> Approve
                      </button>
                    )}
                    {review.approved && (
                      <button
                        onClick={() => handleReject(review.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-xl text-xs font-medium hover:bg-gray-200 transition-colors"
                      >
                        <X size={14} /> Unpublish
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-600 rounded-xl text-xs font-medium hover:bg-red-200 transition-colors"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
