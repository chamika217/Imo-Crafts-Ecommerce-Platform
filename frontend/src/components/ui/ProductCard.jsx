import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Link to={`/shop/${product.id}`} className="group">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
        {/* Image */}
        <div className="relative overflow-hidden aspect-square bg-gray-50">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <span className="text-4xl">🎨</span>
            </div>
          )}
          {product.status === 'out_of_stock' && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
          {product.featured && (
            <span className="absolute top-2 left-2 bg-amber-700 text-white text-xs px-2 py-1 rounded-full">
              Featured
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-medium text-gray-800 text-sm mb-1 line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center justify-between mt-2">
            <span className="font-bold text-amber-800">
              Rs. {product.price?.toLocaleString()}
            </span>
            <button
              onClick={handleAddToCart}
              disabled={product.status === 'out_of_stock'}
              className="p-2 bg-amber-700 text-white rounded-full hover:bg-amber-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={16} />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1 capitalize">
            {product.status?.replace('_', ' ')}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;