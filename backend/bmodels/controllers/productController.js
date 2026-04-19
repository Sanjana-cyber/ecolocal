const Product = require("../models/Product");


// ➕ ADD PRODUCT (ADMIN ONLY)
exports.addProduct = async (req, res) => {
  try {
    // 🔒 Check admin
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // ✅ Basic validation
    const { name, price, variants } = req.body;

    if (!name || !price || !variants || variants.length === 0) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const product = new Product({
      ...req.body,
      user: req.user._id,
    });

    await product.save();

    res.status(201).json(product);

  }catch (error) {
  console.log("FULL ERROR:", error);
  res.status(500).json({ message: error.message });
}

};



// 📦 GET ALL PRODUCTS (WITH PAGINATION)
exports.getProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 5;
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

    // 🔗 Combine all filters
    const filter = {
      ...keyword,
      ...category,
      ...priceFilter,
    };

    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
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
