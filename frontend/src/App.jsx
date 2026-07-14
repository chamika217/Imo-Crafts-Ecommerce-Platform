import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
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
import Reviews from './pages/customer/Reviews';
import CustomerDashboard from './pages/CustomerDashboard';

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
import ScrollToTop from './components/ScrollToTop';

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

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Toaster position="top-right" />
          <ScrollToTop />
          <Routes>
            {/* Landing → directly to home/shop */}
            <Route path="/" element={<Navigate to="/home" replace />} />

            {/* Optional login (not required) */}
            <Route path="/login" element={<CustomerLayout><CustomerLogin /></CustomerLayout>} />

            {/* All customer routes are PUBLIC - no login required */}
            <Route path="/home" element={<CustomerLayout><Home /></CustomerLayout>} />
            <Route path="/shop" element={<CustomerLayout><Shop /></CustomerLayout>} />
            <Route path="/shop/:id" element={<CustomerLayout><ProductDetail /></CustomerLayout>} />
            <Route path="/cart" element={<CustomerLayout><Cart /></CustomerLayout>} />
            <Route path="/checkout" element={<CustomerLayout><Checkout /></CustomerLayout>} />
            <Route path="/order-success" element={<CustomerLayout><OrderSuccess /></CustomerLayout>} />
            <Route path="/custom-order" element={<CustomerLayout><CustomOrder /></CustomerLayout>} />
            <Route path="/about" element={<CustomerLayout><About /></CustomerLayout>} />
            <Route path="/contact" element={<CustomerLayout><Contact /></CustomerLayout>} />
            <Route path="/reviews" element={<CustomerLayout><Reviews /></CustomerLayout>} />
            <Route path="/dashboard" element={<CustomerLayout><CustomerDashboard /></CustomerLayout>} />

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
