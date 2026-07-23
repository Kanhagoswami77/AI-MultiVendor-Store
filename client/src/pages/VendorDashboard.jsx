import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function VendorDashboard() {

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 0,
  });

  const [products, setProducts] = useState([]);

  useEffect(() => {
    getDashboard();
    getMyProducts();
  }, []);

  const getDashboard = async () => {
    try {

      const token = localStorage.getItem("token");

      const res = await api.get("/products/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStats(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  const getMyProducts = async () => {
    try {

      const token = localStorage.getItem("token");

      const res = await api.get("/products/my-products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  const deleteProduct = async (id) => {

    if (!window.confirm("Delete this product?")) return;

    try {

      const token = localStorage.getItem("token");

      await api.delete(`/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Product Deleted");

      getDashboard();
      getMyProducts();

    } catch (err) {

      console.log(err);

      toast.error(err.response?.data?.message || "Delete Failed");

    }

  };

  return (
    <div className="max-w-7xl mx-auto p-8">

      <h1 className="text-4xl font-bold mb-8">
        🏪 Vendor Dashboard
      </h1>

      <div className="grid md:grid-cols-2 gap-6 mb-10">

        <div className="bg-blue-600 text-white rounded-xl p-8">

          <h2 className="text-2xl font-bold">
            Total Products
          </h2>

          <h1 className="text-5xl mt-4">
            {stats.totalProducts}
          </h1>

        </div>

        <div className="bg-green-600 text-white rounded-xl p-8">

          <h2 className="text-2xl font-bold">
            Total Stock
          </h2>

          <h1 className="text-5xl mt-4">
            {stats.totalStock}
          </h1>

        </div>

      </div>

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-3xl font-bold">
          My Products
        </h2>

        <Link
          to="/add-product"
          className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
        >
          + Add Product
        </Link>

      </div>

      {products.length === 0 ? (

        <h2>No Products Found</h2>

      ) : (

        products.map((product) => (

          <div
            key={product.id}
            className="flex justify-between items-center bg-white shadow rounded-xl p-5 mb-5"
          >

            <div className="flex gap-5">

              <img
                src={product.image}
                alt={product.name}
                className="w-24 h-24 rounded-lg object-cover"
              />

              <div>

                <h2 className="text-2xl font-bold">
                  {product.name}
                </h2>

                <p>{product.category}</p>

                <p>₹{product.price}</p>

                <p>Stock : {product.stock}</p>

              </div>

            </div>

            <div className="flex gap-3">

              <Link
                to={`/edit-product/${product.id}`}
                className="bg-yellow-500 text-white px-5 py-2 rounded-lg hover:bg-yellow-600"
              >
                Edit
              </Link>

              <button
                onClick={() => deleteProduct(product.id)}
                className="bg-red-600 text-white px-5 py-2 rounded-lg"
              >
                Delete
              </button>

            </div>

          </div>

        ))

      )}

    </div>
  );
}

export default VendorDashboard;