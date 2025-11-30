import { useEffect, useState } from "react";
import api from "../Redux/api";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadOrders = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/orders/my-orders", {
        params: { page: pageNum, limit: 10 },
      });
      setOrders(res.data.orders);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders(1);
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    loadOrders(newPage);
  };

  if (loading && !orders.length) {
    return <p className="text-sm text-gray-500">Loading orders...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  if (!orders.length) {
    return (
      <section>
        <h2 className="text-xl font-semibold mb-3">Order history</h2>
        <p className="text-sm text-gray-600">No orders yet.</p>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-xl font-semibold mb-3">Order history</h2>
      <div className="bg-white rounded shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-3 py-2">Order ID</th>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Items</th>
              <th className="px-3 py-2">Total (₹)</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-t">
                <td className="px-3 py-2 text-xs text-gray-700">{order._id}</td>
                <td className="px-3 py-2 text-xs text-gray-700">
                  {new Date(order.orderDate).toLocaleString()}
                </td>
                <td className="px-3 py-2 text-xs text-gray-700">
                  {order.items
                    .map((item) => `${item.name} (${item.size}) x${item.qty}`)
                    .join(", ")}
                </td>
                <td className="px-3 py-2 text-xs font-semibold text-gray-800">
                  {order.totalPrice}
                </td>
                <td className="px-3 py-2 text-xs text-gray-700">
                  {order.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={() => handlePageChange(page - 1)}
            className="px-3 py-1 bg-gray-200 rounded text-xs"
          >
            Prev
          </button>
          <span className="text-xs text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            className="px-3 py-1 bg-gray-200 rounded text-xs"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}

export default OrderHistory;
