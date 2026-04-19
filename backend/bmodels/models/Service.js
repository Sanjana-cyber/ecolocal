const mongoose = require("mongoose");

/* 🕒 Optional service slot schema */
const slotSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ]
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  available: {
    type: Boolean,
    default: true
  }
});

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    /* 💰 Base service price */
    price: {
      type: Number,
      default: 0,
      min: 0
    },

    category: {
      type: String,
      enum: [
        "repair",
        "tutoring",
        "eco",
        "cleaning",
        "delivery",
        "consulting",
        "local-help"
      ],
      required: true
    },

    provider: {
      type: String,
      required: true,
      trim: true
    },

    location: {
      type: String,
      required: true
    },

    image: {
      type: String,
      default: "default-service.png"
    },

    availability: {
      type: String,
      enum: ["available", "busy", "unavailable"],
      default: "available"
    },

    /* 🕒 Optional time slots */
    slots: [slotSchema],

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
      enum: ["active", "inactive"],
      default: "active"
    }
  },
  { timestamps: true }
);

/* 🔍 Search index */
serviceSchema.index({
  name: "text",
  description: "text",
  provider: "text",
  location: "text"
});

module.exports = mongoose.model("Service", serviceSchema);