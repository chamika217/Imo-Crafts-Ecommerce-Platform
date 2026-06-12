import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Upload, Trash2 } from 'lucide-react';
import AdminNavbar from '../../components/layout/AdminNavbar';
import { auth } from '../../firebase/config';
import ConfirmModal from '../../components/ui/ConfirmModal';

const API_URL = import.meta.env.VITE_API_URL;

const Media = () => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [deletePublicId, setDeletePublicId] = useState(null);

  const getToken = async () => {
    const user = auth.currentUser;
    if (user) return await user.getIdToken();
    return null;
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const token = await getToken();
      const data = new FormData();
      data.append('image', file);
      const res = await axios.post(`${API_URL}/upload`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setImages(prev => [res.data, ...prev]);
      toast.success('Image uploaded!');
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const token = await getToken();
      await axios.delete(
        `${API_URL}/upload/${encodeURIComponent(deletePublicId)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setImages(prev => prev.filter(img => img.publicId !== deletePublicId));
      toast.success('Image deleted!');
      setDeletePublicId(null);
    } catch (error) {
      toast.error('Failed to delete image');
    }
  };

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied!');
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Media Library</h1>
          <label className="bg-amber-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-amber-800 transition-colors text-sm cursor-pointer">
            <Upload size={16} />
            {uploading ? 'Uploading...' : 'Upload Image'}
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>

        {images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {images.map((img, i) => (
              <div key={i} className="relative group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                <img
                  src={img.url}
                  alt=""
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => copyUrl(img.url)}
                    className="bg-white text-gray-800 px-2 py-1 rounded-lg text-xs font-medium"
                  >
                    Copy URL
                  </button>
                  <button
                    onClick={() => setDeletePublicId(img.publicId)}
                    className="bg-red-500 text-white p-1 rounded-lg"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <Upload size={48} className="mx-auto mb-4 opacity-50" />
            <p>No images uploaded yet</p>
            <p className="text-sm mt-1">Upload images to use in products and banners</p>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deletePublicId}
        title="Delete Image"
        message="Are you sure you want to delete this image?"
        onConfirm={handleDelete}
        onCancel={() => setDeletePublicId(null)}
      />
    </div>
  );
};

export default Media;
// chore: update 16 - 2026-06-13T15:00:41

// chore: update 65 - 2026-06-12T17:21:48
