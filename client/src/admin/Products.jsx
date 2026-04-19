import { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../services/productService";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);

  // 🔍 Search & Filter states
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // 📄 Pagination
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 📦 Fetch products with params
  const fetchProducts = async () => {
    try {
      const data = await getProducts({
        keyword,
        category,
        minPrice,
        maxPrice,
        page,
      });

      setProducts(data.products);
      setPages(data.pages || 1);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [keyword, category, minPrice, maxPrice, page]);

  // ❌ Delete product
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id, token);
        fetchProducts();
      } catch (error) {
        console.error("Delete failed", error);
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Products</h2>

      {/* 🔍 SEARCH */}
      <input
        type="text"
        placeholder="Search by name..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        style={{ marginRight: "10px", padding: "5px" }}
      />

      {/* 🎯 FILTERS */}
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{ marginRight: "10px", padding: "5px" }}
      />

      <input
        type="number"
        placeholder="Min Price"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        style={{ marginRight: "10px", padding: "5px" }}
      />

      <input
        type="number"
        placeholder="Max Price"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        style={{ marginRight: "10px", padding: "5px" }}
      />

      {/* ➕ Add Product */}
      <div>
        <button
          onClick={() => navigate("/admin/add-product")}
          style={{
            margin: "15px 0",
            padding: "8px 15px",
            cursor: "pointer",
          }}
        >
          + Add Product
        </button>
      </div>

      {/* 📦 TABLE */}
      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="6" align="center">
                No Products Found
              </td>
            </tr>
          ) : (
            products.map((p) => (
              <tr key={p._id}>
                <td>
                  <img 
                    src={p.images && p.images.length > 0 ? (p.images[0].startsWith('http') || p.images[0].startsWith('blob') ? p.images[0] : p.images[0].startsWith('/') ? `http://localhost:5000${p.images[0]}` : `http://localhost:5000/uploads/${p.images[0]}`) : 'http://localhost:5000/uploads/default.png'} 
                    alt={p.name} 
                    style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "5px" }} 
                  />
                </td>
                <td>{p.name}</td>
                <td>₹{p.price || p.variants?.[0]?.price || 0}</td>
                <td>{p.category}</td>
                <td>{p.totalStock || 0}</td>

                <td>
                  {/* ✏️ Edit */}
                  <button
                    onClick={() => navigate(`/admin/edit-product/${p._id}`)}
                    style={{ marginRight: "10px", cursor: "pointer" }}
                  >
                    Edit
                  </button>

                  {/* ❌ Delete */}
                  <button
                    onClick={() => handleDelete(p._id)}
                    style={{ cursor: "pointer", color: "red" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 📄 PAGINATION */}
      <div style={{ marginTop: "20px" }}>
        {[...Array(pages).keys()].map((x) => (
          <button
            key={x + 1}
            onClick={() => setPage(x + 1)}
            style={{
              margin: "5px",
              padding: "6px 10px",
              background: page === x + 1 ? "black" : "lightgray",
              color: page === x + 1 ? "white" : "black",
            }}
          >
            {x + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Products;
