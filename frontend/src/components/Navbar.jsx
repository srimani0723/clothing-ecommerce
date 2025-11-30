import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../Redux/authSlice";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const localItems = useSelector((state) => state.cart.items);
  const serverCart = useSelector((state) => state.cart.serverCart);

  // Decide which cart to use
  const items = user
    ? serverCart?.items?.map((i) => ({
        qty: i.qty,
      })) || []
    : localItems;

  const cartCount = items.reduce((sum, i) => sum + i.qty, 0);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-indigo-600">
          Clothify
        </Link>
        <div className="flex items-center gap-4">
          <NavLink
            to="/products"
            className="text-gray-700 hover:text-indigo-600 text-sm"
          >
            Products
          </NavLink>
          <NavLink
            to="/cart"
            className="relative text-gray-700 hover:text-indigo-600 text-sm"
          >
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full px-1">
                {cartCount}
              </span>
            )}
          </NavLink>
          <NavLink
            to="/orders"
            className="text-sm text-gray-700 hover:text-indigo-600"
          >
            Orders
          </NavLink>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">
                Hi, {user.name.split(" ")[0]}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:underline"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink
                to="/login"
                className="text-sm text-gray-700 hover:text-indigo-600"
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="text-sm text-white bg-indigo-600 px-3 py-1 rounded hover:bg-indigo-700"
              >
                Sign up
              </NavLink>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
