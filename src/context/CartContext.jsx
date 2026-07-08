import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {

  const { token } = useAuth();

  const [cart, setCart] = useState(() => {
    try {
      const guestCart = localStorage.getItem("guest_cart");
      const parsed = guestCart ? JSON.parse(guestCart) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      localStorage.removeItem("guest_cart");
      return [];
    }
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

    if (!guestCart || guestCart.length === 0) {
      await loadCart();
      return;
    }

    try {
      const existing = await api.get("/cart/");

      // STEP 2: REMOVE DUPLICATES BEFORE SENDING
      const uniqueCart = Array.from(
        new Map(guestCart.map(i => [i.book_id, i])).values()
      );

      await Promise.all(
        uniqueCart.map(item => {
          const serverItem = existing.data.find(i => i.book_id === item.book_id);
          return serverItem
            ? api.put(`/cart/${serverItem.id}`, { quantity: serverItem.quantity + item.quantity })
            : api.post("/cart/", { book_id: item.book_id, quantity: item.quantity });
        })
      );

      localStorage.removeItem("guest_cart");

      await loadCart();

    } catch (err) {
      console.log("Guest cart sync error", err);
    }
  };

  // ===============================
  // ADD TO CART
  // ===============================
  // ===============================
// ADD TO CART
// ===============================
const addToCart = async (book, qty = 1) => {

  // ---------- GUEST USER ----------
  if (!token) {
    setCart((currentCart) => {
      const existing = currentCart.find(i => i.book_id === book.id);
      const stock = Number(book.stock || 0);
      const safeQty = Math.max(1, Number(qty) || 1);
      let updatedCart;

      if (existing) {
        updatedCart = currentCart.map(i =>
          i.book_id === book.id
            ? { ...i, quantity: stock > 0 ? Math.min(i.quantity + safeQty, stock) : i.quantity }
            : i
        );
      } else if (stock > 0) {
        updatedCart = [
          ...currentCart,
          {
            book_id: book.id,
            title: book.title,
            price: Number(book.price),
            originalPrice: Number(book.original_price || book.price),
            image: book.image,
            stock,
            quantity: Math.min(safeQty, stock)
          }
        ];
      } else {
        return currentCart;
      }

      localStorage.setItem("guest_cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
    return;
  }

  // ---------- LOGGED USER (FIXED) ----------
  try {

    // 🔥 CHECK EXISTING ITEM
    const existing = cart.find(i => i.book_id === book.id);

    if (existing) {
      // 🔥 UPDATE QUANTITY INSTEAD OF ADD
      await api.put(`/cart/${existing.id}`, {
        quantity: existing.quantity + qty
      });

    } else {
      // 🔥 CREATE NEW ITEM
      await api.post("/cart/", {
        book_id: book.id,
        quantity: qty,
      });
    }

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
    if (Number(item.stock) > 0 && item.quantity >= Number(item.stock)) return;

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

  const clearCart = async () => {
    try {
      localStorage.removeItem("guest_cart");

      if (token) {
        const res = await api.get("/cart/");

        await Promise.all(
          res.data.map(item => api.delete(`/cart/${item.id}`))
        );
      }

      setCart([]);

    } catch (err) {
      console.log("clear cart error", err);
      setCart([]);
    }
  };

  // ===============================
  // LOGIN DETECT
  // ===============================
  useEffect(() => {
    if (token) {
      // Synchronize local cart state after authentication.
      syncGuestCart();
    }
    // The synchronization is keyed only to authentication changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);
