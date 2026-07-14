import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Lazy load all admin pages - reduces initial bundle size
const Login = lazy(() => import('./pages/admin/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Products = lazy(() => import('./pages/admin/Products'));
const Orders = lazy(() => import('./pages/admin/Orders'));
const Customers = lazy(() => import('./pages/admin/Customers'));
const Inventory = lazy(() => import('./pages/admin/Inventory'));
const Inquiries = lazy(() => import('./pages/admin/Inquiries'));
const Media = lazy(() => import('./pages/admin/Media'));
const Promotions = lazy(() => import('./pages/admin/Promotions'));
const Reports = lazy(() => import('./pages/admin/Reports'));
const Reviews = lazy(() => import('./pages/admin/Reviews'));
const Users = lazy(() => import('./pages/admin/Users'));

import AdminSidebar from './components/layout/AdminSidebar';
import { startKeepAlive } from './utils/keepAlive';

// Start keep-alive on app load
startKeepAlive();

// Page loader
const PageLoader = () => (
  <div className="flex-1 flex items-center justify-center min-h-screen bg-gray-50">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-2 border-amber-700 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-gray-400">Loading...</p>
    </div>
  </div>
);

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

  // Push a dummy state so back button hits it before leaving admin
  useEffect(() => {
    if (user) {
      window.history.pushState(null, '', window.location.href);
      const handlePop = () => {
        window.history.pushState(null, '', window.location.href);
      };
      window.addEventListener('popstate', handlePop);
      return () => window.removeEventListener('popstate', handlePop);
    }
  }, [user]);

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

// Redirect logged-in users away from login page
const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-500">Loading...</div>
  );
  if (user) return <Navigate to="/admin" replace />;
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
          <Route path="/admin/login" element={<GuestRoute><Suspense fallback={<PageLoader />}><Login /></Suspense></GuestRoute>} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Suspense fallback={<PageLoader />}><Dashboard /></Suspense>} />
            <Route path="products" element={<Suspense fallback={<PageLoader />}><Products /></Suspense>} />
            <Route path="orders" element={<Suspense fallback={<PageLoader />}><Orders /></Suspense>} />
            <Route path="customers" element={<Suspense fallback={<PageLoader />}><Customers /></Suspense>} />
            <Route path="inventory" element={<Suspense fallback={<PageLoader />}><Inventory /></Suspense>} />
            <Route path="inquiries" element={<Suspense fallback={<PageLoader />}><Inquiries /></Suspense>} />
            <Route path="media" element={<Suspense fallback={<PageLoader />}><Media /></Suspense>} />
            <Route path="promotions" element={<Suspense fallback={<PageLoader />}><Promotions /></Suspense>} />
            <Route path="reports" element={<Suspense fallback={<PageLoader />}><Reports /></Suspense>} />
            <Route path="reviews" element={<Suspense fallback={<PageLoader />}><Reviews /></Suspense>} />
            <Route path="users" element={<Suspense fallback={<PageLoader />}><Users /></Suspense>} />
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

// chore: update 70 - 2026-06-10T12:35:24
