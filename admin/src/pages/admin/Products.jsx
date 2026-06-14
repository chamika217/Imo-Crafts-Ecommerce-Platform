import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import AdminNavbar from '../../components/layout/AdminNavbar';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { auth } from '../../firebase/config';

const API_URL = import.meta.env.VITE_API_URL;

const emptyForm = {
  name: '', price: '', description: '', categoryId: '',
  stockQty: '', status: 'active', featured: false, images: [],
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const getToken = async () => {
    const user = auth.currentUser;
    if (user) return await user.getIdToken();
    return null;
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/products`);
      setProducts(res.data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const token = await getToken();
      const data = new FormData();
      data.append('image', file);
      const res = await axios.post(`${API_URL}/upload`, data, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      setFormData(prev => ({ ...prev, images: [...prev.images, res.data.url] }));
      toast.success('Image uploaded!');
    } catch (error) {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();
      if (!token) {
        toast.error('Please log in again');
        return;
      }
      const headers = { Authorization: `Bearer ${token}` };
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        stockQty: formData.stockQty === '' ? 0 : parseInt(formData.stockQty, 10),
      };

      if (editProduct) {
        await axios.put(`${API_URL}/products/${editProduct.id}`, data, { headers });
        toast.success('Product updated!');
      } else {
        await axios.post(`${API_URL}/products`, data, { headers });
        toast.success('Product created!');
      }
      setShowForm(false);
      setEditProduct(null);
      setFormData(emptyForm);
      fetchProducts();
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to save product';
      toast.error(message);
      console.error('Save product error:', error.response?.data || error);
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setFormData({
      name: product.name || '',
      price: product.price || '',
      description: product.description || '',
      categoryId: product.categoryId || '',
      stockQty: product.stockQty || '',
      status: product.status || 'active',
      featured: product.featured || false,
      images: product.images || [],
    });
    setShowForm(true);
  };

  const handleDelete = async () => {
    try {
      const token = await getToken();
      await axios.delete(`${API_URL}/products/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Product deleted!');
      setDeleteId(null);
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <button
            onClick={() => { setShowForm(true); setEditProduct(null); setFormData(emptyForm); }}
            className="bg-amber-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-amber-800 transition-colors text-sm"
          >
            <Plus size={16} /> Add Product
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : products.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl">🎨</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{product.name}</td>
                    <td className="px-6 py-4 text-sm text-amber-700 font-medium">Rs. {product.price?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{product.stockQty}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.status === 'active' ? 'bg-green-100 text-green-700' :
                        product.status === 'draft' ? 'bg-gray-100 text-gray-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(product)} className="text-blue-500 hover:text-blue-700">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => setDeleteId(product.id)} className="text-red-400 hover:text-red-600">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-gray-400">No products yet. Add your first product!</div>
          )}
        </div>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">
                {editProduct ? 'Edit Product' : 'Add Product'}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Product Name *</label>
                <input
                  type="text" name="name" value={formData.name}
                  onChange={handleChange} required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Price (Rs.) *</label>
                  <input
                    type="number" name="price" value={formData.price}
                    onChange={handleChange} required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Stock Qty</label>
                  <input
                    type="number" name="stockQty" value={formData.stockQty}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Category</label>
                <select
                  name="categoryId" value={formData.categoryId} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-400 bg-white"
                >
                  <option value="">Select Category</option>
                  <option value="handmade-gifts">Handmade Gifts</option>
                  <option value="event-crafts">Event & Party Crafts</option>
                  <option value="home-decor">Home & Decor</option>
                  <option value="custom-orders">Custom Orders</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Status</label>
                <select
                  name="status" value={formData.status} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-400 bg-white"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="made_to_order">Made to Order</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
                <textarea
                  name="description" value={formData.description}
                  onChange={handleChange} rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Product Images</label>
                <input
                  type="file" accept="image/*" onChange={handleImageUpload}
                  className="w-full text-sm text-gray-500"
                />
                {uploading && <p className="text-xs text-amber-600 mt-1">Uploading...</p>}
                <div className="flex gap-2 mt-2 flex-wrap">
                  {formData.images.map((img, i) => (
                    <img key={i} src={img} alt="" className="w-16 h-16 rounded-lg object-cover" />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox" name="featured" id="featured"
                  checked={formData.featured} onChange={handleChange}
                  className="w-4 h-4 accent-amber-700"
                />
                <label htmlFor="featured" className="text-sm text-gray-700">Featured Product</label>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-700 text-white py-3 rounded-full font-medium hover:bg-amber-800 transition-colors"
              >
                {editProduct ? 'Update Product' : 'Add Product'}
              </button>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Product"
        message="Are you sure you want to delete this product?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default Products;
// chore: update 38 - 2026-06-14T23:52:20
