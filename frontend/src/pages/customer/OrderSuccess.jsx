import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, ShoppingBag, Phone } from 'lucide-react';

const OrderSuccess = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;
  const pending = location.state?.pending;

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 py-16">
      <div className="page-container--text text-center">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">

          {/* Icon */}
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${pending ? 'bg-blue-50' : 'bg-green-50'}`}>
            <CheckCircle size={44} className={pending ? 'text-blue-500' : 'text-green-500'} />
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            {pending ? 'Order Saved!' : 'Order Placed!'}
          </h1>
          <p className="text-gray-500 mb-2">Thank you for your order.</p>

          {orderId && (
            <div className="inline-block bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 mb-6">
              <p className="text-sm text-gray-500">
                Order ID: <span className="font-semibold text-gray-700">#{orderId.slice(-8).toUpperCase()}</span>
              </p>
            </div>
          )}

          {/* Steps */}
          <div className="bg-amber-50 rounded-2xl p-6 mb-8 text-left border border-amber-100">
            <h3 className="font-semibold text-gray-800 mb-4 text-sm uppercase tracking-wide">What happens next?</h3>
            <div className="space-y-4">
              {[
                'We will review your order and confirm availability.',
                'We will contact you via phone to confirm the order.',
                'Your order will be prepared and dispatched for delivery.',
                'Pay cash when you receive your order.',
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-amber-700 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-gray-600 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              to="/shop"
              className="bg-amber-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-amber-800 transition-colors flex items-center gap-2 text-sm"
            >
              <ShoppingBag size={16} /> Continue Shopping
            </Link>
            <Link
              to="/contact"
              className="border-2 border-amber-700 text-amber-700 px-8 py-3 rounded-full font-semibold hover:bg-amber-50 transition-colors flex items-center gap-2 text-sm"
            >
              <Phone size={16} /> Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
