import { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, query, orderBy, where } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Star, MessageSquare, CheckCircle } from 'lucide-react';
import SEO from '../../components/SEO';const Reviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [guestName, setGuestName] = useState('');
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    review: '',
    productName: '',
  });

  const fetchReviews = async () => {
    try {
      const q = query(
        collection(db, 'reviews'),
        where('approved', '==', true),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        ...formData,
        customerName: user?.displayName || user?.email?.split('@')[0] || guestName || 'Anonymous',
        customerEmail: user?.email || '',
        approved: false,
        createdAt: new Date().toISOString(),
      });
      setSubmitted(true);
      setShowForm(false);
      toast.success('Review submitted! It will appear after approval.');
    } catch (error) {
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    pct: reviews.length ? Math.round((reviews.filter(r => r.rating === star).length / reviews.length) * 100) : 0,
  }));

  const StarRating = ({ value, size = 20, interactive = false, onSelect, onHover }) => (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type={interactive ? 'button' : undefined}
          onClick={interactive ? () => onSelect(star) : undefined}
          onMouseEnter={interactive ? () => onHover(star) : undefined}
          onMouseLeave={interactive ? () => onHover(0) : undefined}
          style={{
            background: 'none', border: 'none', padding: '2px',
            cursor: interactive ? 'pointer' : 'default',
            color: star <= (interactive ? (hoverRating || value) : value) ? '#F59E0B' : '#E5E7EB',
          }}
        >
          <Star size={size} fill={star <= (interactive ? (hoverRating || value) : value) ? '#F59E0B' : 'none'} strokeWidth={1.5} />
        </button>
      ))}
    </div>
  );

  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      <SEO
        title="Customer Reviews"
        description={`Read ${reviews.length} real customer reviews for Imo Crafts. See what our happy customers say about our handmade crafts and gifts.`}
        url="/reviews"
      />

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #FFF8F0 0%, #FFF3E0 100%)', padding: '64px 0' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#FEF3C7', color: '#92400E', padding: '8px 16px', borderRadius: '999px', fontSize: '14px', fontWeight: '500', marginBottom: '20px' }}>
            ⭐ Customer Reviews
          </div>
          <h1 style={{ fontSize: '42px', fontWeight: '800', color: '#111827', marginBottom: '16px' }}>
            What Our Customers Say
          </h1>
          <p style={{ fontSize: '16px', color: '#6B7280', lineHeight: '1.7' }}>
            Real reviews from our happy customers across Sri Lanka
          </p>
        </div>
      </section>

      {/* Rating Summary */}
      {reviews.length > 0 && (
        <section style={{ padding: '40px 0', backgroundColor: 'white', borderBottom: '1px solid #F3F4F6' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '48px', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '72px', fontWeight: '800', color: '#1F2937', lineHeight: 1 }}>{avgRating}</div>
                <StarRating value={Math.round(avgRating)} size={24} />
                <div style={{ color: '#9CA3AF', fontSize: '14px', marginTop: '8px' }}>{reviews.length} reviews</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {ratingCounts.map(({ star, count, pct }) => (
                  <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '13px', color: '#6B7280', minWidth: '32px' }}>{star} ★</span>
                    <div style={{ flex: 1, height: '8px', backgroundColor: '#F3F4F6', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', backgroundColor: '#F59E0B', borderRadius: '999px', transition: 'width 0.5s' }} />
                    </div>
                    <span style={{ fontSize: '13px', color: '#9CA3AF', minWidth: '32px' }}>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section style={{ padding: '48px 0', backgroundColor: '#F9FAFB' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>

          {/* Write Review Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '32px' }}>
            {submitted ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16A34A', fontWeight: '500' }}>
                <CheckCircle size={18} /> Review submitted for approval!
              </div>
            ) : (
              <button
                onClick={() => {
                  if (!user) {
                    toast.error('Please login to write a review');
                    return;
                  }
                  setShowForm(!showForm);
                }}
                style={{ background: 'linear-gradient(135deg, #8B4513, #A0522D)', color: 'white', padding: '12px 28px', borderRadius: '999px', fontWeight: '600', fontSize: '15px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <MessageSquare size={16} /> Write a Review
              </button>
            )}
          </div>

          {/* Review Form */}
          {showForm && (
            <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '36px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1F2937', marginBottom: '24px' }}>Share Your Experience</h3>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* Guest name if not logged in */}
                {!user && (
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '8px' }}>Your Name *</label>
                    <input
                      type="text" value={guestName} required
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Enter your name"
                      style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #E5E7EB', borderRadius: '12px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                )}

                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '10px' }}>Your Rating *</label>
                  <StarRating
                    value={formData.rating} size={32} interactive
                    onSelect={(s) => setFormData({ ...formData, rating: s })}
                    onHover={setHoverRating}
                  />
                  {formData.rating > 0 && (
                    <span style={{ fontSize: '13px', color: '#8B4513', marginTop: '6px', display: 'block' }}>
                      {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent!'][formData.rating]}
                    </span>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '8px' }}>Review Title *</label>
                    <input
                      type="text" value={formData.title} required
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Summarize your experience"
                      style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #E5E7EB', borderRadius: '12px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '8px' }}>Product (Optional)</label>
                    <input
                      type="text" value={formData.productName}
                      onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                      placeholder="Which product did you buy?"
                      style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #E5E7EB', borderRadius: '12px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '8px' }}>Your Review *</label>
                  <textarea
                    value={formData.review} required rows={4}
                    onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                    placeholder="Tell others about your experience with Imo Crafts..."
                    style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #E5E7EB', borderRadius: '12px', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="submit" disabled={submitting}
                    style={{ flex: 1, background: submitting ? '#D1D5DB' : 'linear-gradient(135deg, #8B4513, #A0522D)', color: 'white', padding: '14px', borderRadius: '999px', fontWeight: '600', fontSize: '15px', border: 'none', cursor: submitting ? 'not-allowed' : 'pointer' }}
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                  <button
                    type="button" onClick={() => setShowForm(false)}
                    style={{ padding: '14px 24px', borderRadius: '999px', fontWeight: '500', fontSize: '15px', border: '1.5px solid #E5E7EB', background: 'white', cursor: 'pointer', color: '#6B7280' }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Reviews List */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#9CA3AF' }}>Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>⭐</div>
              <p style={{ fontSize: '20px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>No Reviews Yet</p>
              <p style={{ color: '#9CA3AF' }}>Be the first to share your experience!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {reviews.map(review => (
                <div key={review.id} style={{ backgroundColor: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #8B4513, #D4A574)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '18px', flexShrink: 0 }}>
                        {review.customerName?.[0]?.toUpperCase() || 'A'}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#1F2937', fontSize: '15px' }}>{review.customerName}</div>
                        {review.productName && (
                          <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>Bought: {review.productName}</div>
                        )}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <StarRating value={review.rating} size={16} />
                      <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>
                        {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  </div>
                  <h4 style={{ fontWeight: '600', color: '#1F2937', marginBottom: '8px', fontSize: '15px' }}>{review.title}</h4>
                  <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>{review.review}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Reviews;
