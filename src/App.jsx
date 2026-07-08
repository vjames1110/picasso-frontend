import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";

import Header from "./components/Header/Header";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import BookSection from "./components/BookSection/BookSection";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminProtectedRoute from "./routes/AdminProtectedRoute";
import Footer from "./components/Footer/Footer";

const BookDetails = lazy(() => import("./pages/BookDetails/BookDetails"));
const Cart = lazy(() => import("./pages/Cart/Cart"));
const Checkout = lazy(() => import("./pages/Checkout/Checkout"));
const Payment = lazy(() => import("./pages/Payment/Payment"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess/OrderSuccess"));
const Login = lazy(() => import("./pages/Login/Login"));
const MyOrders = lazy(() => import("./pages/MyOrders/MyOrders"));
const OrderTracking = lazy(() => import("./pages/OrderTracking/OrderTracking"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard/AdminDashboard"));
const AdminLayout = lazy(() => import("./components/Admin/AdminLayout"));
const AdminBooks = lazy(() => import("./pages/admin/AdminBooks/AdminBooks"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders/AdminOrders"));
const About = lazy(() => import("./pages/Footer/About"));
const Contact = lazy(() => import("./pages/Footer/Contact"));
const Privacy = lazy(() => import("./pages/Footer/Privacy"));
const Terms = lazy(() => import("./pages/Footer/Terms"));
const Refund = lazy(() => import("./pages/Footer/Refund"));
const Shipping = lazy(() => import("./pages/Footer/Shipping"));
const Support = lazy(() => import("./pages/Footer/Support"));

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

      <Suspense fallback={<div className="route-loading">Loading page...</div>}>
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

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
      </Suspense>

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
