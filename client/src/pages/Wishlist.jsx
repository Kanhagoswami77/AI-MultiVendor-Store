import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

function Wishlist() {

  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    getWishlist();
  }, []);

  const getWishlist = async () => {
    try {

      const token = localStorage.getItem("token");

      const res = await api.get("/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWishlist(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  const removeWishlist = async (id) => {

    try {

      const token = localStorage.getItem("token");

      await api.delete(`/wishlist/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Removed Successfully");

      getWishlist();

    } catch (err) {

      console.log(err);

      toast.error(err.response?.data?.message || "Something went wrong");

    }

  };

  return (
    <div className="max-w-6xl mx-auto p-8">

      <h1 className="text-4xl font-bold mb-8">
        ❤️ My Wishlist
      </h1>

      {wishlist.length === 0 ? (
        <h2 className="text-xl text-gray-500">
          Wishlist is Empty
        </h2>
      ) : (
        <>
          {wishlist.map((item) => (

            <div
              key={item.id}
              className="flex justify-between items-center bg-white shadow rounded-xl p-5 mb-5"
            >

              <div className="flex gap-5">

                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-28 h-28 rounded-lg object-cover"
                />

                <div>

                  <h2 className="text-2xl font-bold">
                    {item.product.name}
                  </h2>

                  <p className="text-gray-500">
                    {item.product.description}
                  </p>

                  <h3 className="text-blue-600 font-bold mt-2">
                    ₹{item.product.price}
                  </h3>

                </div>

              </div>

              <button
                onClick={() => removeWishlist(item.id)}
                className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
              >
                Remove
              </button>

            </div>

          ))}
        </>
      )}

    </div>
  );
}

export default Wishlist;