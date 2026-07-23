import { useEffect, useState } from "react";
import api from "../services/api";

function Orders() {

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    try {

      const token = localStorage.getItem("token");

     const res = await api.get("/orders/my-orders", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

      setOrders(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">

      <h1 className="text-4xl font-bold mb-8">
        📦 My Orders
      </h1>

      {orders.length === 0 ? (
        <h2 className="text-xl text-gray-500">
          No Orders Found
        </h2>
      ) : (
        <>
          {orders.map((order) => (

            <div
              key={order.id}
              className="bg-white shadow rounded-xl p-6 mb-6"
            >

              <div className="flex justify-between mb-5">

                <h2 className="text-xl font-bold">
                  Order #{order.id}
                </h2>

                <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded">
                  {order.status}
                </span>

              </div>

              {order.orderItems.map((item) => (

                <div
                  key={item.id}
                  className="flex items-center gap-5 border-b pb-4 mb-4"
                >

                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-24 h-24 rounded object-cover"
                  />

                  <div>

                    <h3 className="text-xl font-semibold">
                      {item.product.name}
                    </h3>

                    <p>Quantity : {item.quantity}</p>

                    <p>Price : ₹{item.price}</p>

                  </div>

                </div>

              ))}

              <h2 className="text-right text-2xl font-bold">
                Total : ₹{order.totalPrice}
              </h2>

            </div>

          ))}
        </>
      )}

    </div>
  );
}

export default Orders;