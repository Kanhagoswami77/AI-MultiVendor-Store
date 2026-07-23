import { useEffect, useState } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

function Home({ search }) {

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    getProducts();
  }, [search, category, price, sort]);

  const getProducts = async () => {
    try {

      let url = "/products";

      if (search.trim() !== "") {
        url = `/products/search?q=${search}`;
      }
      else if (category !== "" || price !== "" || sort !== "") {

        let minPrice = "";
        let maxPrice = "";

        if (price === "0-500") {
          minPrice = 0;
          maxPrice = 500;
        }

        if (price === "500-5000") {
          minPrice = 500;
          maxPrice = 5000;
        }

        if (price === "5000+") {
          minPrice = 5000;
        }

        url = `/products/filter?category=${category}&minPrice=${minPrice}&maxPrice=${maxPrice}&sort=${sort}`;
      }
      console.log(url);

      const res = await api.get(url);

      setProducts(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">

      {/* Hero */}
      <div className="bg-blue-600 rounded-xl text-white p-12 mb-10">

        <h1 className="text-5xl font-bold">
          Welcome to AI MultiVendor Store
        </h1>

        <p className="mt-4 text-xl">
          Best Deals on Electronics, Fashion and More
        </p>

      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-8">

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded-lg p-3"
        >
          <option value="">All Categories</option>
          <option value="Mobile">Mobile</option>
          <option value="Laptop">Laptop</option>
          <option value="Fashion">Fashion</option>
          <option value="Electronics">Electronics</option>
          <option value="Books">Books</option>
        </select>

        <select
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border rounded-lg p-3"
        >
          <option value="">All Prices</option>
          <option value="0-500">₹0 - ₹500</option>
          <option value="500-5000">₹500 - ₹5000</option>
          <option value="5000+">₹5000+</option>
        </select>
        <select
  value={sort}
  onChange={(e) => setSort(e.target.value)}
  className="border rounded-lg p-3"
>
  <option value="">Sort By</option>
  <option value="low-high">Price: Low to High</option>
  <option value="high-low">Price: High to Low</option>
  <option value="newest">Newest</option>
  <option value="oldest">Oldest</option>
</select>

      </div>

      <h1 className="text-4xl font-bold mb-8">
        🛍️ Latest Products
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {products.length > 0 ? (

          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))

        ) : (

          <p className="text-gray-500 text-lg">
            No products found.
          </p>

        )}

      </div>

    </div>
  );
}

export default Home;