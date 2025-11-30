import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../Redux/api";
import { fetchServerCart, clearLocalCart } from "../Redux/cartSlice";

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const localItems = useSelector((state) => state.cart.items);
  const serverCart = useSelector((state) => state.cart.serverCart);
  const loading = useSelector((state) => state.cart.loading);
  const error = useSelector((state) => state.cart.error);

  // If logged in, ensure latest server cart is loaded
  useEffect(() => {
    if (user) {
      dispatch(fetchServerCart());
    }
  }, [user, dispatch]);

  // Pick which cart to use
  const items = useMemo(() => {
    if (user) {
      // normalize server cart items
      return (
        serverCart?.items?.map((i) => ({
          productId: i.product._id,
          name: i.product.name,
          image: i.product.image,
          price: i.product.price,
          size: i.size,
          qty: i.qty,
        })) || []
      );
    }
    return localItems;
  }, [user, serverCart, localItems]);

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const handlePlaceOrder = async () => {
    if (!items.length) return;

    try {
      const res = await api.post("/orders");
      // clear only local cart; server cart was cleared by backend when order created
      if (!user) {
        dispatch(clearLocalCart());
      }
      navigate(`/order/${res.data.order._id}`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Order failed");
    }
  };

  if (user && loading && !serverCart) {
    return <p className="text-sm text-gray-500">Loading checkout...</p>;
  }

  if (!items.length) {
    return <p className="text-sm text-gray-600">Cart is empty.</p>;
  }

  return (
    <section>
      <h2 className="text-xl font-semibold mb-3">Checkout</h2>
      {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

      <ul className="bg-white rounded shadow-sm p-3 mb-4">
        {items.map((i) => (
          <li
            key={`${i.productId}-${i.size}`}
            className="text-sm text-gray-700"
          >
            {i.name} ({i.size}) x {i.qty} - ₹{i.price}
          </li>
        ))}
      </ul>

      <p className="text-lg font-semibold text-gray-800 mb-4">
        Total: ₹{total.toFixed(2)}
      </p>
      <button
        onClick={handlePlaceOrder}
        className="bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700 text-sm"
      >
        Place order
      </button>
    </section>
  );
}

export default Checkout;
