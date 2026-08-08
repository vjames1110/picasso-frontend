import { FaArrowLeft, FaArrowRight, FaLock, FaShoppingBag, FaTruck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CartItem from "../../components/CartItem/CartItem";
import { useCart } from "../../context/CartContext";
import "./Cart.css";

const money = (value) => `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

const Cart = () => {
  const { cart, getTotalPrice, getTotalItems } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <main className="cart-empty">
        <div className="cart-empty-icon"><FaShoppingBag /></div>
        <p>Your reading list is waiting</p>
        <h1>Your cart is empty</h1>
        <span>Explore our latest books and add the right title for your preparation.</span>
        <button onClick={() => navigate("/")}>Browse books <FaArrowRight /></button>
      </main>
    );
  }

  const totalItems = getTotalItems();
  const totalMRP = cart.reduce(
    (total, item) => total + Number(item.originalPrice || item.original_price || item.price || 0) * item.quantity,
    0
  );
  const sellingPrice = Number(getTotalPrice());
  const discount = Math.max(totalMRP - sellingPrice, 0);
  const shipping = totalItems * 100;
  const finalPrice = sellingPrice + shipping;

  return (
    <main className="cart-page">
      <button className="cart-back" onClick={() => navigate("/")}>
        <FaArrowLeft /> Continue shopping
      </button>

      <header className="cart-page-header">
        <div>
          <p>Your selection</p>
          <h1>Shopping cart</h1>
        </div>
        <span>{totalItems} {totalItems === 1 ? "item" : "items"}</span>
      </header>

      <div className="cart-layout">
        <section className="cart-list" aria-label="Cart items">
          {cart.map((item) => (
            <CartItem key={`${item.id || "guest"}-${item.book_id}`} item={item} />
          ))}
        </section>

        <aside className="cart-summary">
          <p className="cart-summary-eyebrow">Order summary</p>
          <h2>Price details</h2>

          <div className="cart-summary-lines">
            <div><span>Subtotal ({totalItems} items)</span><strong>{money(totalMRP)}</strong></div>
            {discount > 0 && <div className="cart-discount"><span>Book discount</span><strong>- {money(discount)}</strong></div>}
            <div><span>Order value</span><strong>{money(sellingPrice)}</strong></div>
            <div><span>Shipping</span><strong>{money(shipping)}</strong></div>
          </div>

          <div className="cart-total">
            <span>You pay</span>
            <strong>{money(finalPrice)}</strong>
          </div>

          {discount > 0 && <div className="cart-savings">You save {money(discount)} on this order</div>}

          <button className="cart-checkout" onClick={() => navigate("/checkout")}>Proceed to checkout <FaArrowRight /></button>

          <div className="cart-assurance">
            <span><FaLock /> Secure checkout</span>
            <span><FaTruck /> Reliable delivery</span>
          </div>
          <p className="cart-shipping-note">Shipping is calculated at Rs. 100 per item.</p>
        </aside>
      </div>
    </main>
  );
};

export default Cart;
