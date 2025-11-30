import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchServerCart,
  updateLocalCartItem,
  removeFromLocalCart,
  updateServerCartItem,
  removeFromServerCart,
} from "../Redux/cartSlice";
import CartItem from "../components/CartItem";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const localItems = useSelector((state) => state.cart.items);
  const serverCart = useSelector((state) => state.cart.serverCart);
  const loading = useSelector((state) => state.cart.loading);
  const error = useSelector((state) => state.cart.error);

  // Load server cart when logged in
  useEffect(() => {
    if (user) {
      dispatch(fetchServerCart());
    }
  }, [user, dispatch]);

  // Normalize items for UI
  const items = user
    ? serverCart?.items?.map((i) => ({
        productId: i.product._id,
        name: i.product.name,
        image: i.product.image,
        price: i.product.price,
        size: i.size,
        qty: i.qty,
      })) || []
    : localItems;

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const handleQtyChange = (item, qty) => {
    if (user) {
      dispatch(
        updateServerCartItem({
          productId: item.productId,
          size: item.size,
          qty,
        })
      );
    } else {
      dispatch(
        updateLocalCartItem({
          productId: item.productId,
          size: item.size,
          qty,
        })
      );
    }
  };

  const handleRemove = (item) => {
    if (user) {
      dispatch(
        removeFromServerCart({
          productId: item.productId,
          size: item.size,
        })
      );
    } else {
      dispatch(
        removeFromLocalCart({
          productId: item.productId,
          size: item.size,
        })
      );
    }
  };

  const handleCheckout = () => {
    if (!items.length) return;
    if (!user) {
      navigate("/login");
    } else {
      navigate("/checkout");
    }
  };

  if (loading && user) {
    return <p className="text-sm text-gray-500">Loading cart...</p>;
  }

  if (!items.length) {
    return (
      <section>
        <h2 className="text-xl font-semibold mb-3">Cart</h2>
        {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
        <p className="text-sm text-gray-600">Your cart is empty.</p>
        <Link
          to="/products"
          className="inline-block mt-3 text-sm text-indigo-600 hover:underline"
        >
          Continue shopping
        </Link>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-xl font-semibold mb-3">Cart</h2>
      {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
      {items.map((item) => (
        <CartItem
          key={`${item.productId}-${item.size}`}
          item={item}
          onQtyChange={(qty) => handleQtyChange(item, qty)}
          onRemove={() => handleRemove(item)}
        />
      ))}
      <div className="flex items-center justify-between mt-4">
        <p className="text-lg font-semibold text-gray-800">
          Total: ₹{total.toFixed(2)}
        </p>
        <button
          onClick={handleCheckout}
          className="bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700 text-sm"
        >
          Proceed to checkout
        </button>
      </div>
    </section>
  );
}

export default Cart;
