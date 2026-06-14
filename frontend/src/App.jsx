import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Customer Pages
import Landing from './pages/customer/Landing';
import CustomerLogin from './pages/customer/Login';
import Home from './pages/customer/Home';
import Shop from './pages/customer/Shop';
import ProductDetail from './pages/customer/ProductDetail';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import OrderSuccess from './pages/customer/OrderSuccess';
import CustomOrder from './pages/customer/CustomOrder';
import About from './pages/customer/About';
import Contact from './pages/customer/Contact';

// Admin Pages
import AdminLogin from './pages/admin/Login';
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
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AdminSidebar from './components/layout/AdminSidebar';

const CustomerLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);

const AdminLayout = ({ children }) => (
  <div className="flex">
    <AdminSidebar />
    <div className="flex-1">
      {children}
    </div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F7F2EC] text-[#8B4513]">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F7F2EC] text-[#8B4513]">
        Loading...
      </div>
    );
  }

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Toaster position="top-right" />
          <Routes>
            {/* Public Landing */}
            <Route path="/" element={<Landing />} />

            {/* Customer Login */}
            <Route path="/login" element={<GuestRoute><CustomerLogin /></GuestRoute>} />

            {/* Customer Routes (protected) */}
            <Route path="/home" element={<ProtectedRoute><CustomerLayout><Home /></CustomerLayout></ProtectedRoute>} />
            <Route path="/shop" element={<ProtectedRoute><CustomerLayout><Shop /></CustomerLayout></ProtectedRoute>} />
            <Route path="/shop/:id" element={<ProtectedRoute><CustomerLayout><ProductDetail /></CustomerLayout></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><CustomerLayout><Cart /></CustomerLayout></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><CustomerLayout><Checkout /></CustomerLayout></ProtectedRoute>} />
            <Route path="/order-success" element={<ProtectedRoute><CustomerLayout><OrderSuccess /></CustomerLayout></ProtectedRoute>} />
            <Route path="/custom-order" element={<ProtectedRoute><CustomerLayout><CustomOrder /></CustomerLayout></ProtectedRoute>} />
            <Route path="/about" element={<ProtectedRoute><CustomerLayout><About /></CustomerLayout></ProtectedRoute>} />
            <Route path="/contact" element={<ProtectedRoute><CustomerLayout><Contact /></CustomerLayout></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout><Dashboard /></AdminLayout>} />
            <Route path="/admin/products" element={<AdminLayout><Products /></AdminLayout>} />
            <Route path="/admin/orders" element={<AdminLayout><Orders /></AdminLayout>} />
            <Route path="/admin/customers" element={<AdminLayout><Customers /></AdminLayout>} />
            <Route path="/admin/inventory" element={<AdminLayout><Inventory /></AdminLayout>} />
            <Route path="/admin/inquiries" element={<AdminLayout><Inquiries /></AdminLayout>} />
            <Route path="/admin/media" element={<AdminLayout><Media /></AdminLayout>} />
            <Route path="/admin/promotions" element={<AdminLayout><Promotions /></AdminLayout>} />
            <Route path="/admin/reports" element={<AdminLayout><Reports /></AdminLayout>} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
