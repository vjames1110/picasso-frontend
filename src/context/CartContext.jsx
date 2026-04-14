import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {

  const { token } = useAuth();

  const [cart, setCart] = useState(() => {
    const guestCart = localStorage.getItem("guest_cart");
    return guestCart ? JSON.parse(guestCart) : [];
  });

  // ===============================
  // LOAD CART (Logged in)
  // ===============================
  const loadCart = async () => {
    if (!token) return;

    try {
      const res = await api.get("/cart/");
      setCart(res.data);
    } catch (err) {
      console.log("Cart load error", err);
    }
  };

  // ===============================
  // SYNC GUEST CART AFTER LOGIN
  // ===============================
  const syncGuestCart = async () => {
    const guestCart = JSON.parse(localStorage.getItem("guest_cart"));

    if (!guestCart || guestCart.length === 0) return;

    try {
      for (const item of guestCart) {
        await api.post("/cart/", {
          book_id: item.book_id,
          quantity: item.quantity
        });
      }

      localStorage.removeItem("guest_cart");

    } catch (err) {
      console.log("Guest cart sync error", err);
    }
  };

  // ===============================
  // ADD TO CART
  // ===============================
  const addToCart = async (book, qty = 1) => {

    // ---------- GUEST USER ----------
    if (!token) {

      const existing = cart.find(i => i.book_id === book.id);

      let updatedCart;

      if (existing) {
        updatedCart = cart.map(i =>
          i.book_id === book.id
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      } else {
        updatedCart = [
          ...cart,
          {
            book_id: book.id,
            title: book.title,
            price: book.price,
            image: book.image,
            quantity: qty
          }
        ];
      }

      setCart(updatedCart);
      localStorage.setItem("guest_cart", JSON.stringify(updatedCart));
      return;
    }

    // ---------- LOGGED USER ----------
    try {
      await api.post("/cart/", {
        book_id: book.id,
        quantity: qty,
      });

      await loadCart();

    } catch (err) {
      console.log("Add cart error", err);
    }
  };

  // ===============================
  // UPDATE QUANTITY
  // ===============================
  const updateQuantity = async (itemId, qty) => {
    try {
      await api.put(`/cart/${itemId}`, {
        quantity: qty,
      });

      await loadCart();
    } catch (err) {
      console.log("Update quantity error", err);
    }
  };

  const removeFromCart = async (id, bookId) => {

    // ---------- GUEST USER ----------
    if (!token) {

      const updatedCart = cart.filter(i => i.book_id !== bookId);

      setCart(updatedCart);
      localStorage.setItem("guest_cart", JSON.stringify(updatedCart));

      return;
    }

    // ---------- LOGGED USER ----------
    try {
      await api.delete(`/cart/${id}`);
      await loadCart();
    } catch (err) {
      console.log("Remove error:", err);
    }
  };

  const increaseQuantity = async (item) => {

    // STOCK GUARD
    if (item.quantity >= item.stock) return;

    // GUEST
    if (!token) {
      const updatedCart = cart.map(i =>
        i.book_id === item.book_id
          ? { ...i, quantity: i.quantity + 1 }
          : i
      );

      setCart(updatedCart);
      localStorage.setItem("guest_cart", JSON.stringify(updatedCart));
      return;
    }

    // USER
    await updateQuantity(item.id, item.quantity + 1);
  };

  const decreaseQuantity = async (item) => {
    const newQty = item.quantity - 1;

    // GUEST
    if (!token) {
      if (newQty <= 0) {
        const updatedCart = cart.filter(i => i.book_id !== item.book_id);
        setCart(updatedCart);
        localStorage.setItem("guest_cart", JSON.stringify(updatedCart));
      } else {
        const updatedCart = cart.map(i =>
          i.book_id === item.book_id
            ? { ...i, quantity: newQty }
            : i
        );

        setCart(updatedCart);
        localStorage.setItem("guest_cart", JSON.stringify(updatedCart));
      }
      return;
    }

    // USER
    if (newQty <= 0) {
      await removeFromCart(item.id, item.book_id);
    } else {
      await updateQuantity(item.id, newQty);
    }
  };

  // ===============================
  // REMOVE
  // ===============================

  // ===============================
  // HELPERS
  // ===============================
  const getItemQuantity = (bookId) => {
    const item = cart.find((i) => i.book_id === bookId);
    return item ? item.quantity : 0;
  };

  const isInCart = (bookId) => {
    return cart.some((i) => i.book_id === bookId);
  };

  const getTotalPrice = () =>
    cart.reduce((t, i) => t + i.price * i.quantity, 0);

  const getTotalItems = () =>
    cart.reduce((t, i) => t + i.quantity, 0);

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("guest_cart");
  };

  // ===============================
  // LOGIN DETECT
  // ===============================
  useEffect(() => {
    if (token) {
      syncGuestCart();
      loadCart();
    }
  }, [token]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        increaseQuantity,
        decreaseQuantity,
        getTotalPrice,
        getTotalItems,
        clearCart,
        getItemQuantity,
        isInCart,
        loadCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);