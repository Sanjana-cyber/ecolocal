import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById, updateProduct } from "../services/productService";
import { uploadImage } from "../services/uploadService.jsx";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

const [formData, setFormData] = useState({
  name: "",
  description: "",   // ✅ ADD
  brand: "",         // ✅ ADD
  price: "",
  category: "",
  images: [],
  variants: [
    { size: "", color: "", stock: 0, price: 0 } // ✅ ADD price
  ]
});


  // 📦 Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setFormData(data);
      } catch (error) {
        console.error("Error fetching product", error);
      }
    };

    fetchProduct();
  }, [id]);

  // 📝 Handle input
 const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData({
    ...formData,
    [name]: name === "price" ? Number(value) : value,
  });
};

  const [uploading, setUploading] = useState(false);

  // 🖼️ Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataObj = new FormData();
    formDataObj.append("image", file);

    setUploading(true);
    try {
      const urlPath = await uploadImage(formDataObj, token);
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), urlPath],
      }));
    } catch (error) {
      console.error(error);
      alert("Error uploading image ❌");
    } finally {
      setUploading(false);
    }
  };

  // ❌ Remove image
  const removeImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== indexToRemove),
    }));
  };

  // 🎨 Handle variant change
  const handleVariantChange = (index, e) => {
  const updatedVariants = [...formData.variants];

  updatedVariants[index][e.target.name] =
    e.target.name === "price" || e.target.name === "stock"
      ? Number(e.target.value)
      : e.target.value;

  setFormData({
    ...formData,
    variants: updatedVariants,
  });
};

  // ➕ Add variant
const addVariant = () => {
  setFormData({
    ...formData,
    variants: [...formData.variants, { size: "", color: "", stock: 0, price: 0 }]
  });
};


  // ❌ Remove variant
  const removeVariant = (index) => {
    const updatedVariants = formData.variants.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      variants: updatedVariants,
    });
  };

  // 🚀 Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateProduct(id, formData, token);
      alert("Product updated successfully ✅");
      navigate("/admin/products");
    } catch (error) {
      console.error("Update failed", error);
      alert("Error updating product ❌");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Edit Product</h2>

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <br /><br />

        {/* Price */}
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <br /><br />

       <select
  name="category"
  value={formData.category}
  onChange={handleChange}
  required
>
  <option value="">Select Category</option>
  <option value="farmers">Farmers</option>
  <option value="artisans">Artisans</option>
  <option value="repair">Repair</option>
  <option value="tutoring">Tutoring</option>
  <option value="eco">Eco</option>
  <option value="shops">Shops</option>
</select>
        <br /><br />

{/* 🖼️ Images */}
<h3>Images</h3>
<input type="file" onChange={handleImageUpload} disabled={uploading} />
{uploading && <span> Uploading...</span>}
<div style={{ display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
  {(formData.images || []).map((img, index) => {
    // Sometimes old default might be 'default.png' which doesn't have /uploads/ prefix
    const src = img.startsWith('http') || img.startsWith('blob') ? img : img.startsWith('/') ? `http://localhost:5000${img}` : `http://localhost:5000/uploads/${img}`;
    return (
      <div key={index} style={{ position: "relative" }}>
        <img src={src} alt={`Preview ${index}`} style={{ width: "100px", height: "100px", objectFit: "cover" }} />
        <button 
          type="button" 
          onClick={() => removeImage(index)}
          style={{ position: "absolute", top: 0, right: 0, background: "red", color: "white", border: "none", cursor: "pointer" }}
        >
          X
        </button>
      </div>
    );
  })}
</div>
<br />

        {/* Variants */}
        <h3>Variants</h3>

        {formData.variants.map((v, index) => (
          <div key={index}>
            <input
              type="text"
              name="size"
              value={v.size}
              onChange={(e) => handleVariantChange(index, e)}
            />

            <input
              type="text"
              name="color"
              value={v.color}
              onChange={(e) => handleVariantChange(index, e)}
            />

            <input
              type="number"
              name="stock"
              value={v.stock}
              onChange={(e) => handleVariantChange(index, e)}
            />
            {/* <input
  type="number"
  name="price"
  placeholder="Variant Price"
  value={v.price}
  onChange={(e) => handleVariantChange(index, e)}
  required
/> */}
<div style={{ display: "flex", alignItems: "center" }}>
  <span style={{ marginRight: "5px" }}>₹</span>
  <input
    type="number"
    name="price"
    placeholder="Price"
    value={formData.price}
    onChange={handleChange}
    required
  />
</div>

            {/* Description */}
<input
  type="text"
  name="description"
  placeholder="Description"
  value={formData.description}
  onChange={handleChange}
  required
/>
<br /><br />

{/* Brand */}
<input
  type="text"
  name="brand"
  placeholder="Brand"
  value={formData.brand}
  onChange={handleChange}
  required
/>
<br /><br />


            <button type="button" onClick={() => removeVariant(index)}>
              Remove
            </button>
          </div>
        ))}

        <br />

        <button type="button" onClick={addVariant}>
          + Add Variant
        </button>

        <br /><br />

        <button type="submit">Update Product</button>
      </form>
    </div>
  );
};

export default EditProduct;
