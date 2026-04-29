import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/Header/Header";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import BookSection from "./components/BookSection/BookSection";
import BookDetails from "./pages/BookDetails/BookDetails";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import Payment from "./pages/Payment/Payment";
import OrderSuccess from "./pages/OrderSuccess/OrderSuccess";
import Login from "./pages/Login/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
import MyOrders from "./pages/MyOrders/MyOrders";
import OrderTracking from "./pages/OrderTracking/OrderTracking";
import AdminLogin from "./pages/admin/AdminLogin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard/AdminDashboard";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminProtectedRoute from "./routes/AdminProtectedRoute";
import AdminBooks from "./pages/admin/AdminBooks/AdminBooks";
import AdminOrders from "./pages/admin/AdminOrders/AdminOrders";
import Footer from "./components/Footer/Footer";
import About from "./pages/Footer/About";
import Contact from "./pages/Footer/Contact";
import Privacy from "./pages/Footer/Privacy";
import Terms from "./pages/Footer/Terms";
import Refund from "./pages/Footer/Refund";
import Shipping from "./pages/Footer/Shipping";
import Support from "./pages/Footer/Support";

function AppLayout() {
  const location = useLocation();

  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/payment" ||
    location.pathname.startsWith("/admin");

  return (
    <>
      {!hideLayout && <Header />}
      {!hideLayout && <Navbar />}

      <Routes>

        <Route
          path="/"
          element={
            <>
              <Hero />
              <BookSection />
            </>
          }
        />

        <Route path="/login" element={<Login />} />

        <Route path="/book/:id" element={<BookDetails />} />

        {/* Footer Pages */}

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/refund" element={<Refund />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/support" element={<Support />} />

        <Route path="/cart" element={<Cart />} />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/order-success/:orderId"
          element={
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/order/:orderId"
          element={
            <ProtectedRoute>
              <OrderTracking />
            </ProtectedRoute>
          }
        />

        {/* Admin Section */}

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin/"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="books" element={<AdminBooks />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>

        {/* Important Fallback */}

        <Route path="*" element={<Cart />} />

      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;