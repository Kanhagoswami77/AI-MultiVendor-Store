import { Link, useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaShoppingCart,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";

function Navbar({ search, setSearch }) {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  let role = null;

  if (token) {
    try {
      role = JSON.parse(atob(token.split(".")[1])).role;
    } catch (err) {
      console.log(err);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");

    toast.success("Logged out successfully");

    navigate("/login");

    window.location.reload();
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        <Link
          to="/"
          className="text-3xl font-bold text-blue-600"
        >
          AI Store
        </Link>

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-96 border rounded-lg px-4 py-2 outline-none"
        />

        <div className="flex items-center gap-6 text-2xl">

          <Link to="/wishlist">
            <FaHeart />
          </Link>

          <Link to="/cart">
            <FaShoppingCart />
          </Link>

          {!token ? (
            <Link to="/login">
              <FaUser />
            </Link>
          ) : (
            <>
              {role === "vendor" ? (
                <Link to="/vendor">
                  <FaUser />
                </Link>
              ) : (
                <Link to="/orders">
                  <FaUser />
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800"
                title="Logout"
              >
                <FaSignOutAlt />
              </button>
            </>
          )}

        </div>

      </div>
    </nav>
  );
}

export default Navbar;