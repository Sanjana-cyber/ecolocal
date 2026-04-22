const Product = require("../models/Product");


// ➕ ADD PRODUCT (ADMIN ONLY)
exports.addProduct = async (req, res) => {
  try {
    // 🔒 Check admin
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // ✅ Improved Validation
    const { name, price, colorVariants, description, category, brand } = req.body;

    if (!name || !description || !category || !brand || !colorVariants || colorVariants.length === 0) {
      return res.status(400).json({
        message: "Missing required fields",
        fields: { name: !!name, description: !!description, category: !!category, brand: !!brand, colorVariants: !!colorVariants?.length }
      });
    }

    const product = new Product({
      ...req.body,
      user: req.user._id,
    });

    await product.save();
    res.status(201).json(product);

  } catch (error) {
    console.error("ADD PRODUCT ERROR DETAILS:", error);

    // Catch Mongoose Validation Errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    }

    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};



// 📦 GET ALL PRODUCTS (WITH PAGINATION + FILTERS + SORT)
exports.getProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // 🔍 SEARCH (by name)
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: "i" } }
      : {};

    // 📂 FILTER (by category)
    const category = req.query.category
      ? { category: req.query.category }
      : {};

    // 💰 PRICE FILTER
    let priceFilter = {};
    if (req.query.minPrice && req.query.maxPrice) {
      priceFilter.price = {
        $gte: Number(req.query.minPrice),
        $lte: Number(req.query.maxPrice),
      };
    }

    // ⭐ FEATURED FILTER
    const featuredFilter = req.query.featured === 'true' ? { isFeatured: true } : {};

    // 🔗 Combine all filters
    const filter = {
      ...keyword,
      ...category,
      ...priceFilter,
      ...featuredFilter,
    };

    // 🔽 SORT
    let sortOption = { createdAt: -1 }; // default: newest
    if (req.query.sort === 'low-high') sortOption = { price: 1 };
    if (req.query.sort === 'high-low') sortOption = { price: -1 };
    if (req.query.sort === 'newest') sortOption = { createdAt: -1 };

    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      products,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// 🔍 GET SINGLE PRODUCT
exports.getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ✏️ UPDATE PRODUCT (ADMIN ONLY)
exports.updateProduct = async (req, res) => {
  try {
    // 🔒 Admin check
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Optional: Owner check
    // if (product.user.toString() !== req.user._id.toString()) {
    //   return res.status(401).json({ message: "Not authorized" });
    // }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ❌ DELETE PRODUCT (ADMIN ONLY)
exports.deleteProduct = async (req, res) => {
  try {
    // 🔒 Admin check
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();

    res.json({ message: "Product deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
