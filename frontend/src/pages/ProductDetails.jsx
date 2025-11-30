import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../Redux/productsSlice";
import { addToLocalCart } from "../Redux/cartSlice";

function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const {
    currentProduct: product,
    loading,
    error,
  } = useSelector((state) => state.products);
  const [selectedSize, setSelectedSize] = useState("");

  // Load product
  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  // Initialize default size once per product
  useEffect(() => {
    if (product?.sizes?.length && !selectedSize) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product, selectedSize]);

  const handleAddToCart = () => {
    if (!product || !selectedSize) return;
    dispatch(
      addToLocalCart({
        productId: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        size: selectedSize,
      })
    );
  };

  if (loading || !product) {
    return <p className="text-sm text-gray-500">Loading...</p>;
  }
  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  return (
    <section className="grid md:grid-cols-2 gap-6">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-80 object-cover rounded"
      />
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
        <p className="text-gray-600 mt-2">{product.description}</p>
        <p className="text-indigo-600 text-xl font-semibold mt-3">
          ₹{product.price}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Category: {product.category}
        </p>

        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-1">Select size:</p>
          <div className="flex gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(s)}
                className={`px-3 py-1 rounded border text-sm ${
                  selectedSize === s
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-800 border-gray-300"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          className="mt-5 bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700 text-sm"
        >
          Add to cart
        </button>
      </div>
    </section>
  );
}

export default ProductDetails;
