import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../Redux/authSlice";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(form));
  };

  return (
    <section className="max-w-md mx-auto bg-white rounded shadow-sm p-5">
      <h2 className="text-xl font-semibold mb-4">Register</h2>
      {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 text-sm"
            required
          />
        </div>
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
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>
      <p className="mt-3 text-xs text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-indigo-600 hover:underline">
          Login
        </Link>
      </p>
    </section>
  );
}

export default Register;
