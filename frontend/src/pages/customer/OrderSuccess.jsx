import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, ShoppingBag, Phone } from 'lucide-react';

const OrderSuccess = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <CheckCircle size={80} className="text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Order Placed!</h1>
        <p className="text-gray-500 mb-2">Thank you for your order.</p>
        {orderId && (
          <p className="text-sm text-gray-400 mb-6">
            Order ID: <span className="font-medium text-gray-600">{orderId}</span>
          </p>
        )}

        <div className="bg-amber-50 rounded-2xl p-6 mb-8 text-left">
          <h3 className="font-semibold text-gray-800 mb-3">What happens next?</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 bg-amber-700 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">1</span>
              <p>We will review your order and confirm availability.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 bg-amber-700 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">2</span>
              <p>We will contact you via phone to confirm the order.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 bg-amber-700 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">3</span>
              <p>Your order will be prepared and dispatched for delivery.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 bg-amber-700 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">4</span>
              <p>Pay cash when you receive your order.</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            to="/shop"
            className="bg-amber-700 text-white px-8 py-3 rounded-full font-medium hover:bg-amber-800 transition-colors flex items-center gap-2"
          >
            <ShoppingBag size={18} /> Continue Shopping
          </Link>
          <Link
            to="/contact"
            className="border-2 border-amber-700 text-amber-700 px-8 py-3 rounded-full font-medium hover:bg-amber-50 transition-colors flex items-center gap-2"
          >
            <Phone size={18} /> Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;