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
import Footer from "./components/Footer/Footer";

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
            <Route path="dashboard" element={AdminDashboard} />
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