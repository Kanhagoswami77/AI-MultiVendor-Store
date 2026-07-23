import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    getProduct();
  }, []);

  const getProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);

      setName(res.data.name);
      setDescription(res.data.description);
      setPrice(res.data.price);
      setStock(res.data.stock);
      setCategory(res.data.category);

    } catch (err) {
      console.log(err);
    }
  };

  const updateProduct = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await api.put(
        `/products/${id}`,
        {
          name,
          description,
          price,
          stock,
          category,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);

      navigate("/vendor");

    } catch (err) {
      console.log(err);

      toast.error(err.response?.data?.message || "Update Failed");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">

      <h1 className="text-4xl font-bold mb-8">
        ✏ Edit Product
      </h1>

      <form
        onSubmit={updateProduct}
        className="bg-white shadow-lg rounded-xl p-8 space-y-5"
      >

        <input
          className="w-full border p-3 rounded-lg"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          className="w-full border p-3 rounded-lg"
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="number"
          className="w-full border p-3 rounded-lg"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          type="number"
          className="w-full border p-3 rounded-lg"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />

        <input
          className="w-full border p-3 rounded-lg"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <button
          className="w-full bg-yellow-500 text-white p-3 rounded-lg hover:bg-yellow-600"
        >
          Update Product
        </button>

      </form>

    </div>
  );
}

export default EditProduct;