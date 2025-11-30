import { Link } from "react-router-dom";

function Home() {
  return (
    <section className="text-center mt-10">
      <h1 className="text-3xl font-bold text-gray-800">Welcome to Clothify</h1>
      <p className="mt-3 text-gray-600">
        Simple MERN clothing store with auth, filters, cart, and orders.
      </p>
      <Link
        to="/products"
        className="inline-block mt-5 bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700 text-sm"
      >
        Browse products
      </Link>
    </section>
  );
}

export default Home;
