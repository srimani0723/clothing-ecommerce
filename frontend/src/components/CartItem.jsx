function CartItem({ item, onQtyChange, onRemove }) {
  return (
    <div className="flex items-center justify-between bg-white rounded shadow-sm p-3 mb-3">
      <div className="flex items-center gap-3">
        <img
          src={item.image}
          alt={item.name}
          className="w-16 h-16 object-cover rounded"
        />
        <div>
          <h3 className="text-sm font-semibold text-gray-800">{item.name}</h3>
          <p className="text-xs text-gray-500">
            Size: {item.size} • ₹{item.price}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="number"
          min="1"
          value={item.qty}
          onChange={(e) => onQtyChange(Number(e.target.value))}
          className="w-14 border rounded px-1 py-0.5 text-sm"
        />
        <button
          onClick={onRemove}
          className="text-xs text-red-500 hover:underline"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default CartItem;
