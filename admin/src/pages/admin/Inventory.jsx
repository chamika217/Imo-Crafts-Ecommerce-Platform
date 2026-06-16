import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminNavbar from '../../components/layout/AdminNavbar';
import { auth } from '../../firebase/config';
import { AlertTriangle, Package, XCircle, Bell } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;
const LOW_STOCK_THRESHOLD = 5;

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [newQty, setNewQty] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [filter, setFilter] = useState('all');

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

  const getStockLevel = (qty) => {
    if (qty === 0) return 'out';
    if (qty <= LOW_STOCK_THRESHOLD) return 'low';
    return 'ok';
  };

  const outOfStock = products.filter(p => p.stockQty === 0);
  const lowStock = products.filter(p => p.stockQty > 0 && p.stockQty <= LOW_STOCK_THRESHOLD);
  const inStock = products.filter(p => p.stockQty > LOW_STOCK_THRESHOLD);

  const filteredProducts = filter === 'all' ? products
    : filter === 'low' ? lowStock
    : filter === 'out' ? outOfStock
    : inStock;

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Inventory</h1>
          <div className="text-sm text-gray-400">Low stock threshold: ≤ {LOW_STOCK_THRESHOLD} units</div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => setFilter('out')}
            className={`rounded-2xl p-4 border text-left transition-all ${filter === 'out' ? 'ring-2 ring-red-400' : ''} ${outOfStock.length > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${outOfStock.length > 0 ? 'bg-red-100' : 'bg-gray-100'}`}>
                <XCircle size={20} className={outOfStock.length > 0 ? 'text-red-500' : 'text-gray-400'} />
              </div>
              <div>
                <div className={`text-2xl font-bold ${outOfStock.length > 0 ? 'text-red-600' : 'text-gray-800'}`}>{outOfStock.length}</div>
                <div className="text-xs text-gray-500">Out of Stock</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setFilter('low')}
            className={`rounded-2xl p-4 border text-left transition-all ${filter === 'low' ? 'ring-2 ring-amber-400' : ''} ${lowStock.length > 0 ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-100'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${lowStock.length > 0 ? 'bg-amber-100' : 'bg-gray-100'}`}>
                <AlertTriangle size={20} className={lowStock.length > 0 ? 'text-amber-500' : 'text-gray-400'} />
              </div>
              <div>
                <div className={`text-2xl font-bold ${lowStock.length > 0 ? 'text-amber-600' : 'text-gray-800'}`}>{lowStock.length}</div>
                <div className="text-xs text-gray-500">Low Stock</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setFilter('ok')}
            className={`rounded-2xl p-4 border text-left transition-all ${filter === 'ok' ? 'ring-2 ring-green-400' : ''} bg-white border-gray-100`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <Package size={20} className="text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{inStock.length}</div>
                <div className="text-xs text-gray-500">In Stock</div>
              </div>
            </div>
          </button>
        </div>

        {/* Alert Banner */}
        {(outOfStock.length > 0 || lowStock.length > 0) && (
          <div className={`rounded-2xl p-4 mb-6 flex items-start gap-3 ${outOfStock.length > 0 ? 'bg-red-50 border border-red-200' : 'bg-amber-50 border border-amber-200'}`}>
            <Bell size={18} className={outOfStock.length > 0 ? 'text-red-500 mt-0.5' : 'text-amber-500 mt-0.5'} />
            <div>
              <p className={`font-semibold text-sm ${outOfStock.length > 0 ? 'text-red-700' : 'text-amber-700'}`}>
                Inventory Alert
              </p>
              <p className={`text-sm mt-0.5 ${outOfStock.length > 0 ? 'text-red-600' : 'text-amber-600'}`}>
                {outOfStock.length > 0 && `${outOfStock.length} product${outOfStock.length > 1 ? 's' : ''} out of stock. `}
                {lowStock.length > 0 && `${lowStock.length} product${lowStock.length > 1 ? 's' : ''} running low. `}
                An email alert is sent automatically when you update stock to ≤{LOW_STOCK_THRESHOLD}.
              </p>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4">
          {[
            { key: 'all', label: `All (${products.length})` },
            { key: 'out', label: `Out of Stock (${outOfStock.length})` },
            { key: 'low', label: `Low Stock (${lowStock.length})` },
            { key: 'ok', label: `In Stock (${inStock.length})` },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === tab.key
                  ? 'bg-amber-700 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : filteredProducts.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Stock Qty</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Stock Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map(product => {
                  const level = getStockLevel(product.stockQty || 0);
                  return (
                    <tr key={product.id} className={`hover:bg-gray-50 ${level === 'out' ? 'bg-red-50/30' : level === 'low' ? 'bg-amber-50/30' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
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
                            type="number" min="0"
                            value={newQty}
                            onChange={(e) => setNewQty(e.target.value)}
                            className="w-20 px-2 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
                          />
                        ) : (
                          <span className={`text-sm font-bold ${
                            level === 'out' ? 'text-red-600' : level === 'low' ? 'text-amber-600' : 'text-gray-800'
                          }`}>
                            {product.stockQty || 0}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {level === 'out' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                            <XCircle size={12} /> Out of Stock
                          </span>
                        ) : level === 'low' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                            <AlertTriangle size={12} /> Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                            <Package size={12} /> In Stock
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
                  );
                })}
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
