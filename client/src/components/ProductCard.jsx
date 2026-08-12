import api from "../services/api";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function ProductCard({ product }) {
  const addToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.post(
        "/cart/add",
        {
          productId: product.id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const addToWishlist = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.post(
        "/wishlist/add",
        {
          productId: product.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">

      <Link to={`/product/${product.id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-56 object-cover hover:scale-105 transition duration-300"
        />
      </Link>

      <div className="p-4">

        <div className="flex justify-between items-center mb-2">

          <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-semibold">
            {product.category}
          </span>

          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              product.stock > 10
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {product.stock > 10 ? "In Stock" : "Limited"}
          </span>

        </div>

        <Link to={`/product/${product.id}`}>
          <h2 className="text-xl font-bold hover:text-blue-600 cursor-pointer line-clamp-1">
            {product.name}
          </h2>
        </Link>

        <div className="flex items-center gap-2 mt-2">

          <span className="text-yellow-500 font-bold">
            ⭐ {product.rating}
          </span>

          <span className="text-gray-500 text-sm">
            ({product.reviewCount} Reviews)
          </span>

        </div>

        <p className="text-gray-500 text-sm mt-2 line-clamp-2">
          {product.description}
        </p>

        <h3 className="text-blue-600 text-3xl font-bold mt-4">
          ₹{product.price}
        </h3>

        <div className="flex gap-3 mt-5">

          <button
            onClick={addToCart}
            className="flex-1 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
          >
            🛒 Add Cart
          </button>

          <button
            onClick={addToWishlist}
            className="bg-red-500 text-white px-4 rounded-xl hover:bg-red-600 transition"
          >
            ❤️
          </button>

        </div>

      </div>

    </div>
  );
}

export default ProductCard;