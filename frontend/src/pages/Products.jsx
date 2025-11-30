import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../Redux/productsSlice";
import { addToLocalCart, addToServerCart } from "../Redux/cartSlice";
import ProductCard from "../components/ProductCard";
import Filters from "../components/Filters";

function Products() {
  const dispatch = useDispatch();
  const { items, loading, error, page, totalPages } = useSelector(
    (state) => state.products
  );
  const user = useSelector((state) => state.auth.user);

  const [filters, setFilters] = useState({
    search: "",
    category: "All",
    size: "",
    minPrice: "",
    maxPrice: "",
  });

  // load products
  useEffect(() => {
    dispatch(
      fetchProducts({
        search: filters.search || undefined,
        category: filters.category !== "All" ? filters.category : undefined,
        size: filters.size || undefined,
        minPrice: filters.minPrice || undefined,
        maxPrice: filters.maxPrice || undefined,
        page,
        limit: 12,
      })
    );
  }, [dispatch, filters, page]);

  const handleAddToCart = (product) => {
    const size = product.sizes?.[0];
    if (!size) return;

    if (user) {
      // logged-in → backend cart
      dispatch(
        addToServerCart({
          productId: product._id,
          size,
          qty: 1,
        })
      );
    } else {
      // guest → localStorage cart
      dispatch(
        addToLocalCart({
          productId: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          size,
        })
      );
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    dispatch(
      fetchProducts({
        search: filters.search || undefined,
        category: filters.category !== "All" ? filters.category : undefined,
        size: filters.size || undefined,
        minPrice: filters.minPrice || undefined,
        maxPrice: filters.maxPrice || undefined,
        page: newPage,
        limit: 12,
      })
    );
  };

  return (
    <section>
      <h2 className="text-xl font-semibold mb-3">Products</h2>
      <Filters filters={filters} setFilters={setFilters} />
      {loading && <p className="text-sm text-gray-500">Loading...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((p) => (
          <ProductCard
            key={p._id}
            product={p}
            onAddToCart={() => handleAddToCart(p)}
          />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-5">
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

export default Products;
