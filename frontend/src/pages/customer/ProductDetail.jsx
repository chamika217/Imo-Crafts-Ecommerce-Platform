import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Truck, Shield, Minus, Plus, Package } from 'lucide-react';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import SEO from '../../components/SEO';
import ProductCard from '../../components/ui/ProductCard';

const API_URL = import.meta.env.VITE_API_URL;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/products/${id}`);
        setProduct(res.data);

        // Fetch related products (same category)
        const allRes = await axios.get(`${API_URL}/products`);
        const related = allRes.data
          .filter(p => p.id !== id && p.categoryId === res.data.categoryId && p.status === 'active')
          .slice(0, 4);
        setRelatedProducts(related);
      } catch (error) {
        console.error(error);
        navigate('/shop');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    setSelectedImage(0);
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    addToCart(product, quantity, notes);
    toast.success('Added to cart!');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-gray-100 rounded-3xl aspect-square animate-pulse" />
          <div className="space-y-4 pt-4">
            <div className="bg-gray-100 h-8 rounded-xl animate-pulse" />
            <div className="bg-gray-100 h-6 rounded-xl animate-pulse w-1/3" />
            <div className="bg-gray-100 h-24 rounded-xl animate-pulse" />
            <div className="bg-gray-100 h-12 rounded-full animate-pulse mt-8" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const statusConfig = {
    active: { label: 'In Stock', className: 'bg-green-100 text-green-700' },
    made_to_order: { label: 'Made to Order', className: 'bg-blue-100 text-blue-700' },
    out_of_stock: { label: 'Out of Stock', className: 'bg-red-100 text-red-600' },
  };
  const status = statusConfig[product.status] || statusConfig.out_of_stock;

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <SEO
        title={product.name}
        description={product.description || `Buy ${product.name} - Rs. ${product.price?.toLocaleString()}. Handmade with love.`}
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

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="page-container py-3">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Link to="/home" className="hover:text-amber-700 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-amber-700 transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-gray-700 font-medium truncate max-w-[200px]">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="page-container py-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Shop
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

            {/* Images */}
            <div className="p-8 bg-gray-50 border-r border-gray-100">
              <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-sm mb-4">
                {product.images?.[selectedImage] ? (
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package size={64} className="text-gray-200" />
                  </div>
                )}
              </div>
              {product.images?.length > 1 && (
                <div className="flex gap-3 flex-wrap">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage === i ? 'border-amber-600 shadow-md' : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-8 lg:p-10 flex flex-col">
              <div className="flex-1">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${status.className}`}>
                  {status.label}
                </span>

                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 leading-tight">{product.name}</h1>
                <p className="text-3xl font-bold text-amber-700 mb-6">Rs. {product.price?.toLocaleString()}</p>

                {product.description && (
                  <p className="text-gray-600 leading-relaxed mb-8 text-sm">{product.description}</p>
                )}

                {/* Divider */}
                <div className="border-t border-gray-100 mb-6" />

                {/* Quantity */}
                <div className="mb-5">
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">Quantity</label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-12 text-center font-semibold text-gray-900">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <span className="text-sm text-gray-400">Rs. {(product.price * quantity).toLocaleString()} total</span>
                  </div>
                </div>

                {/* Notes */}
                <div className="mb-8">
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Customization Notes <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special requirements or customization..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-400 text-sm resize-none transition-colors"
                  />
                </div>
              </div>

              {/* CTA */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.status === 'out_of_stock'}
                  className="w-full bg-amber-700 text-white py-4 rounded-2xl font-semibold hover:bg-amber-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-sm"
                >
                  <ShoppingCart size={18} />
                  {product.status === 'out_of_stock' ? 'Out of Stock' : 'Add to Cart'}
                </button>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-xl px-4 py-3">
                    <Truck size={14} className="text-amber-700 shrink-0" />
                    <span>Island-wide delivery</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-xl px-4 py-3">
                    <Shield size={14} className="text-amber-700 shrink-0" />
                    <span>Cash on Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">You May Also Like</h2>
              <Link to="/shop" className="text-sm text-amber-700 hover:text-amber-800 font-medium transition-colors">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
