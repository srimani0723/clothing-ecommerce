import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { loginUser } from "../Redux/authSlice";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, loading, error } = useSelector((state) => state.auth);
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  return (
    <section className="max-w-md mx-auto bg-white rounded shadow-sm p-5">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 text-sm"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded text-sm hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="mt-3 text-xs text-gray-600">
        Don't have an account?{" "}
        <Link to="/register" className="text-indigo-600 hover:underline">
          Register
        </Link>
      </p>
    </section>
  );
}

export default Login;
