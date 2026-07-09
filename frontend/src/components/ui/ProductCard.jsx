import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ShoppingCart, Package } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tiltStyle, setTiltStyle] = useState({ transform: 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)' });

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

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)'
    });
  };

  const isOutOfStock = product.status === 'out_of_stock';

  return (
    <Link to={`/shop/${product.id}`} className="group flex flex-col h-full">
      <div 
        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col h-full cursor-tilt"
        style={tiltStyle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >

        {/* Fixed-height image area */}
        <div className="relative overflow-hidden bg-gray-50 flex-shrink-0" style={{ paddingBottom: '100%', position: 'relative' }}>
          <div className="absolute inset-0">
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package size={40} className="text-gray-200" />
              </div>
            )}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white font-semibold text-xs px-3 py-1 bg-black/50 rounded-full">Out of Stock</span>
              </div>
            )}
            {product.featured && (
              <span className="absolute top-2 left-2 bg-amber-700 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Card body - flex-1 so all cards stretch equally */}
        <div className="p-3 flex flex-col flex-1">

          {/* Product name - takes available space, max 2 lines */}
          <h3 className="font-medium text-gray-800 text-sm line-clamp-2 flex-1 mb-3 leading-snug">
            {product.name}
          </h3>

          {/* Footer - always pinned at bottom */}
          <div className="flex items-center justify-between gap-2 mt-auto">
            <div>
              <span className="font-bold text-amber-800 text-sm block">
                Rs. {product.price?.toLocaleString()}
              </span>
              <span className="text-xs text-gray-400 capitalize leading-none">
                {product.status?.replace('_', ' ')}
              </span>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="flex-shrink-0 w-8 h-8 bg-amber-700 text-white rounded-full flex items-center justify-center hover:bg-amber-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Add to cart"
            >
              <ShoppingCart size={14} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
