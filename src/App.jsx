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


function AppLayout() {
  const location = useLocation();
  const hideLayout = location.pathname === "/login";

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

        <Route path="/payment" element={<Payment />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/my-orders" element={
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
      </Routes>
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