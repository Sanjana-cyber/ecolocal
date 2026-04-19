const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  size: { type: String, required: true },
  color: { type: String, required: true },
  stock: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },

  // ✅ Top-level base price (used for display / filtering)
  price: { type: Number, default: 0, min: 0 },

  category: {
    type: String,
    enum: ["farmers", "artisans", "repair", "tutoring", "eco", "shops"],
    required: true
  },

  brand: { type: String, required: true },

  images: {
    type: [String],
    default: ["default.png"]
  },

  variants: [variantSchema],

  totalStock: {
    type: Number,
    default: 0
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  isFeatured: {
    type: Boolean,
    default: false
  },

  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }

}, { timestamps: true });

/* 🔥 Auto calculate stock */
// ✅ Fixed: no `next` needed
productSchema.pre("save", function () {
  if (this.variants && this.variants.length > 0) {
    this.totalStock = this.variants.reduce((sum, v) => sum + v.stock, 0);
  } else {
    this.totalStock = 0;
  }
});

/* 🔍 Search index */
productSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model('Product', productSchema);