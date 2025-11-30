function Filters({ filters, setFilters }) {
  const handleChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="bg-white rounded shadow-sm p-3 mb-4 flex flex-wrap gap-3">
      <input
        name="search"
        placeholder="Search..."
        value={filters.search}
        onChange={handleChange}
        className="border rounded px-2 py-1 text-sm w-full sm:w-40"
      />
      <select
        name="category"
        value={filters.category}
        onChange={handleChange}
        className="border rounded px-2 py-1 text-sm w-full sm:w-32"
      >
        <option value="All">All</option>
        <option value="Men">Men</option>
        <option value="Women">Women</option>
        <option value="Kids">Kids</option>
      </select>
      <select
        name="size"
        value={filters.size}
        onChange={handleChange}
        className="border rounded px-2 py-1 text-sm w-full sm:w-24"
      >
        <option value="">Size</option>
        <option value="S">S</option>
        <option value="M">M</option>
        <option value="L">L</option>
        <option value="XL">XL</option>
      </select>
      <input
        name="minPrice"
        type="number"
        placeholder="Min price"
        value={filters.minPrice}
        onChange={handleChange}
        className="border rounded px-2 py-1 text-sm w-full sm:w-24"
      />
      <input
        name="maxPrice"
        type="number"
        placeholder="Max price"
        value={filters.maxPrice}
        onChange={handleChange}
        className="border rounded px-2 py-1 text-sm w-full sm:w-24"
      />
    </div>
  );
}

export default Filters;
