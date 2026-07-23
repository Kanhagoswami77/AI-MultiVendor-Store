import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const token = localStorage.getItem("token");
useEffect(() => {
  getProduct();
  getReviews();
}, []);

  const getProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const getReviews = async () => {
  try {
    const res = await api.get(`/reviews/${id}`);
    setReviews(res.data);
  } catch (err) {
    console.log(err);
  }
};
const addReview = async () => {
  try {
    const res = await api.post(
      "/reviews",
      {
        productId: id,
        rating,
        comment,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(res.data.message);

    setRating(5);
    setComment("");

    getReviews();

  } catch (err) {
    toast.error(err.response?.data?.message || "Failed");
  }
};

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
      toast.error(err.response?.data?.message || "Failed");
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
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  if (!product) {
    return (
      <h1 className="text-center text-3xl mt-20">
        Loading...
      </h1>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-10">

      <Link
        to="/"
        className="text-blue-600 font-bold"
      >
        ← Back
      </Link>

      <div className="grid md:grid-cols-2 gap-12 mt-8">

        <img
          src={product.image}
          alt={product.name}
          className="w-full rounded-xl shadow-lg"
        />

        <div>

          <h1 className="text-5xl font-bold">
            {product.name}
          </h1>

          <p className="text-gray-500 mt-5 text-lg">
            {product.description}
          </p>

          <h2 className="text-4xl text-blue-600 font-bold mt-6">
            ₹{product.price}
          </h2>

          <p className="mt-4">
            <b>Category :</b> {product.category}
          </p>

          <p className="mt-2">
            <b>Stock :</b> {product.stock}
          </p>

          <div className="flex gap-5 mt-8">

            <button
              onClick={addToCart}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
            >
              Add to Cart
            </button>

            <button
              onClick={addToWishlist}
              className="bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600"
            >
              ❤ Wishlist
            </button>

          </div>

        </div>

      </div>
     {/* Reviews Section */}
<div className="mt-16">

  <h2 className="text-3xl font-bold mb-6">
    ⭐ Reviews
  </h2>

  {token && (
    <div className="bg-gray-100 rounded-xl p-6 mb-8">

      <select
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        className="border rounded-lg p-2 mb-4"
      >
        <option value="5">⭐⭐⭐⭐⭐ (5)</option>
        <option value="4">⭐⭐⭐⭐ (4)</option>
        <option value="3">⭐⭐⭐ (3)</option>
        <option value="2">⭐⭐ (2)</option>
        <option value="1">⭐ (1)</option>
      </select>

      <textarea
        rows="4"
        placeholder="Write your review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full border rounded-lg p-3 mb-4"
      />

      <button
        onClick={addReview}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
        Submit Review
      </button>

    </div>
  )}

  {reviews.length === 0 ? (

    <p className="text-gray-500">
      No Reviews Yet
    </p>

  ) : (

    reviews.map((review) => (

      <div
        key={review.id}
        className="bg-white shadow rounded-xl p-5 mb-5"
      >

        <h3 className="font-bold text-xl">
          {review.user.name}
        </h3>

        <p className="text-yellow-500 text-lg">
          {"⭐".repeat(review.rating)}
        </p>

        <p className="mt-2">
          {review.comment}
        </p>

      </div>

    ))

  )}

</div>
    </div>
  );
}

export default ProductDetails;