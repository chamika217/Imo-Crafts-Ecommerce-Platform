import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Orders from './pages/admin/Orders';
import Customers from './pages/admin/Customers';
import Inventory from './pages/admin/Inventory';
import Inquiries from './pages/admin/Inquiries';
import Media from './pages/admin/Media';
import Promotions from './pages/admin/Promotions';
import Reports from './pages/admin/Reports';

// Layout
import AdminSidebar from './components/layout/AdminSidebar';

const AdminLayout = () => (
  <div className="flex min-h-screen">
    <AdminSidebar />
    <div className="flex-1 flex flex-col">
      <Outlet />
    </div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-500">
        Loading...
      </div>
    );
  }
  if (!user) return <Navigate to="/admin/login" replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Navigate to="/admin/login" replace />} />
          <Route path="/login" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<Login />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="customers" element={<Customers />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="inquiries" element={<Inquiries />} />
            <Route path="media" element={<Media />} />
            <Route path="promotions" element={<Promotions />} />
            <Route path="reports" element={<Reports />} />
          </Route>

          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

// chore: update 55 - 2026-06-12T16:19:55

// chore: update 61 - 2026-06-10T09:57:32

// chore: update 66 - 2026-06-11T16:10:17
