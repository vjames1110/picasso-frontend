import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./CartItem.css";

const money = (value) => `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

const CartItem = ({ item }) => {
  const { removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
  const navigate = useNavigate();
  const originalPrice = Number(item.originalPrice || item.original_price || item.price || 0);
  const price = Number(item.price || 0);
  const stock = Number(item.stock || 0);
  const hasStockLimit = Number.isFinite(stock) && stock > 0;

  return (
    <article className="cart-item">
      <button className="cart-item-remove" onClick={() => removeFromCart(item.id || null, item.book_id)} aria-label={`Remove ${item.title} from cart`}>
        <FaTrashAlt />
      </button>

      <button className="cart-item-cover" onClick={() => navigate(`/book/${item.book_id}`)} aria-label={`View ${item.title}`}>
        <img src={item.image} alt="" />
      </button>

      <div className="cart-item-details">
        <p>Picasso Publications</p>
        <h2 onClick={() => navigate(`/book/${item.book_id}`)}>{item.title}</h2>
        <div className="cart-item-price">
          <strong>{money(price)}</strong>
          {originalPrice > price && <span>{money(originalPrice)}</span>}
        </div>
        {hasStockLimit && <span className="cart-item-stock">{stock} in stock</span>}

        <div className="cart-item-qty" aria-label={`Quantity for ${item.title}`}>
          <button onClick={() => decreaseQuantity(item)} aria-label="Decrease quantity">-</button>
          <span>{item.quantity}</span>
          <button onClick={() => increaseQuantity(item)} disabled={hasStockLimit && item.quantity >= stock} aria-label="Increase quantity">+</button>
        </div>
      </div>

      <div className="cart-item-total">
        <span>Item total</span>
        <strong>{money(price * item.quantity)}</strong>
      </div>
    </article>
  );
};

export default CartItem;
