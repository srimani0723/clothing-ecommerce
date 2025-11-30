import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../Redux/api";

function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load order");
      }
    };
    loadOrder();
  }, [id]);

  if (error) return <p className="text-sm text-red-500">{error}</p>;
  if (!order) return <p className="text-sm text-gray-500">Loading...</p>;

  return (
    <section>
      <h2 className="text-xl font-semibold mb-3">Order placed!</h2>
      <p className="text-sm text-gray-700 mb-1">Order ID: {order._id}</p>
      <p className="text-sm text-gray-700 mb-3">
        Date: {new Date(order.orderDate).toLocaleString()}
      </p>
      <h3 className="text-sm font-semibold mb-2">Items:</h3>
      <ul className="bg-white rounded shadow-sm p-3 mb-4">
        {order.items.map((item) => (
          <li
            key={`${item.product}-${item.size}`}
            className="text-sm text-gray-700"
          >
            {item.name} ({item.size}) x {item.qty} - ₹{item.price}
          </li>
        ))}
      </ul>
      <p className="text-lg font-semibold text-gray-800 mb-4">
        Total: ₹{order.totalPrice}
      </p>
      <Link to="/products" className="text-sm text-indigo-600 hover:underline">
        Continue shopping
      </Link>
    </section>
  );
}

export default OrderSuccess;
