import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Truck, Shield } from 'lucide-react';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';
import SEO from '../../components/SEO';

const API_URL = import.meta.env.VITE_API_URL;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_URL}/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error(error);
        navigate('/shop');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity, notes);
    toast.success('Added to cart!');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-100 rounded-2xl aspect-square animate-pulse" />
          <div className="space-y-4">
            <div className="bg-gray-100 h-8 rounded animate-pulse" />
            <div className="bg-gray-100 h-6 rounded animate-pulse w-1/3" />
            <div className="bg-gray-100 h-24 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <SEO
        title={product.name}
        description={product.description || `Buy ${product.name} - Rs. ${product.price?.toLocaleString()}. Handmade with love. Island-wide delivery available.`}
        image={product.images?.[0]}
        url={`/shop/${id}`}
        type="product"
        product={product}
        breadcrumbs={[
          { name: 'Home', path: '/home' },
          { name: 'Shop', path: '/shop' },
          { name: product.name, path: `/shop/${id}` },
        ]}
      />
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-4">
            {product.images?.[selectedImage] ? (
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">🎨</div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                    selectedImage === i ? 'border-amber-700' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
          <p className="text-3xl font-bold text-amber-700 mb-4">
            Rs. {product.price?.toLocaleString()}
          </p>

          <div className="mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              product.status === 'active'
                ? 'bg-green-100 text-green-700'
                : product.status === 'made_to_order'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {product.status === 'active' ? 'In Stock' :
               product.status === 'made_to_order' ? 'Made to Order' : 'Out of Stock'}
            </span>
          </div>

          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Quantity */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Quantity</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"
              >
                -
              </button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Customization Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requirements or customization..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-400 text-sm"
            />
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={product.status === 'out_of_stock'}
            className="w-full bg-amber-700 text-white py-4 rounded-full font-medium hover:bg-amber-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={20} />
            Add to Cart
          </button>

          {/* Info */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <Truck size={16} className="text-amber-700" />
              <span>Island-wide delivery available</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <Shield size={16} className="text-amber-700" />
              <span>Cash on Delivery - Pay when you receive</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
// chore: update 136 - 2026-06-14T04:50:14
