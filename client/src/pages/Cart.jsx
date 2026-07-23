import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

function Cart() {

  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    getCart();
  }, []);

  const getCart = async () => {
    try {

      const token = localStorage.getItem("token");

      const res = await api.get("/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCartItems(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  const checkout = async () => {
    try {

      const token = localStorage.getItem("token");

      const res = await api.post(
        "/orders/checkout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);

      // Checkout ke baad cart refresh ho jayega
      getCart();

    } catch (err) {

      console.log(err);

      toast.error(err.response?.data?.message || "Checkout Failed");
    }
  };

  const getTotal = () => {

    let total = 0;

    cartItems.forEach((item) => {
      total += item.quantity * item.product.price;
    });

    return total;
  };

  return (
    <div className="max-w-6xl mx-auto p-8">

      <h1 className="text-4xl font-bold mb-8">
        🛒 My Cart
      </h1>

      {cartItems.length === 0 ? (
        <h2 className="text-xl text-gray-500">
          Cart is Empty
        </h2>
      ) : (
        <>
          {cartItems.map((item) => (

            <div
              key={item.id}
              className="flex items-center justify-between bg-white shadow rounded-xl p-5 mb-5"
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

                  <p>
                    Quantity : {item.quantity}
                  </p>

                </div>

              </div>

            </div>

          ))}

          <div className="mt-8 text-right">

            <h2 className="text-3xl font-bold">
              Total : ₹{getTotal()}
            </h2>

            <button
              onClick={checkout}
              className="mt-5 bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700"
            >
              Checkout
            </button>

          </div>

        </>
      )}

    </div>
  );
}

export default Cart;