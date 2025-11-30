import { Link } from "react-router-dom";

function ProductCard({ product, onAddToCart }) {
  return (
    <div className="bg-white rounded shadow-sm p-3 flex flex-col">
      <img
        src={product.image}
        alt={product.name}
        className="h-48 w-full object-cover rounded"
      />
      <div className="mt-3 flex-1 flex flex-col">
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mt-1">{product.category}</p>
        <p className="text-indigo-600 font-bold mt-2">₹{product.price}</p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <Link
            to={`/product/${product._id}`}
            className="text-xs text-indigo-600 hover:underline"
          >
            View details
          </Link>
          <button
            onClick={onAddToCart}
            className="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700 cursor:pointer"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
