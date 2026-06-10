import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminNavbar from '../../components/layout/AdminNavbar';
import { auth } from '../../firebase/config';

const API_URL = import.meta.env.VITE_API_URL;

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [newQty, setNewQty] = useState('');
  const [newStatus, setNewStatus] = useState('');

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
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleUpdate = async (productId) => {
    try {
      const token = await getToken();
      await axios.put(
        `${API_URL}/products/${productId}`,
        { stockQty: parseInt(newQty), status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Inventory updated!');
      setEditingId(null);
      fetchProducts();
    } catch (error) {
      toast.error('Failed to update inventory');
    }
  };

  const statusColors = {
    active: 'bg-green-100 text-green-700',
    out_of_stock: 'bg-red-100 text-red-600',
    made_to_order: 'bg-blue-100 text-blue-700',
    draft: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Inventory</h1>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : products.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Stock Qty</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-lg">🎨</div>
                          )}
                        </div>
                        <span className="text-sm font-medium text-gray-800">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {editingId === product.id ? (
                        <input
                          type="number"
                          value={newQty}
                          onChange={(e) => setNewQty(e.target.value)}
                          className="w-20 px-2 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
                        />
                      ) : (
                        <span className={`text-sm font-medium ${
                          product.stockQty <= 3 ? 'text-red-500' : 'text-gray-800'
                        }`}>
                          {product.stockQty || 0}
                          {product.stockQty <= 3 && product.stockQty > 0 && (
                            <span className="ml-2 text-xs text-red-400">Low Stock</span>
                          )}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === product.id ? (
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="px-2 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none bg-white"
                        >
                          <option value="active">Active</option>
                          <option value="out_of_stock">Out of Stock</option>
                          <option value="made_to_order">Made to Order</option>
                          <option value="draft">Draft</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[product.status] || 'bg-gray-100 text-gray-600'}`}>
                          {product.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === product.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdate(product.id)}
                            className="px-3 py-1 bg-amber-700 text-white rounded-lg text-xs hover:bg-amber-800"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs hover:bg-gray-200"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingId(product.id);
                            setNewQty(product.stockQty || 0);
                            setNewStatus(product.status || 'active');
                          }}
                          className="text-amber-700 hover:text-amber-800 text-sm font-medium"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-gray-400">No products found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
// chore: update 67 - 2026-06-11T05:11:56
