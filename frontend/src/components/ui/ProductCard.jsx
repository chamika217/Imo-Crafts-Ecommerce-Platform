import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Link to={`/shop/${product.id}`} className="group h-full">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 h-full flex flex-col">
        {/* Image */}
        <div className="relative overflow-hidden aspect-square bg-gray-50 flex-shrink-0">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <Package size={40} className="text-gray-200" />
            </div>
          )}
          {product.status === 'out_of_stock' && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">Out of Stock</span>
            </div>
          )}
          {product.featured && (
            <span className="absolute top-2 left-2 bg-amber-700 text-white text-xs px-2 py-1 rounded-full">
              Featured
            </span>
          )}
        </div>

        {/* Info - flex-col so price stays at bottom */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-medium text-gray-800 text-sm mb-2 line-clamp-2 flex-1">
            {product.name}
          </h3>
          {/* Price + Cart always at bottom */}
          <div className="mt-auto">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-800 text-sm">
                Rs. {product.price?.toLocaleString()}
              </span>
              <button
                onClick={handleAddToCart}
                disabled={product.status === 'out_of_stock'}
                className="p-2 bg-amber-700 text-white rounded-full hover:bg-amber-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={15} />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1.5 capitalize">
              {product.status?.replace('_', ' ')}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
// chore: update 39 - 2026-06-15T07:06:22

// chore: update 57 - 2026-06-10T19:02:06
