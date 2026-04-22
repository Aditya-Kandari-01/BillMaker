const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    // Unique Customer Code
    customerCode: {
      type: String,
      unique: true,
    },
    // Customer Company Name
    customerCompanyName: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    // Basic Info
    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    // Contact Details
    customerPhone: {
      type: String,
      trim: true
    },

    customerEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },

    // Address
    customerAddress: {
      type: String,
      trim: true
    },
    customerCity: {
      type: String,
      trim: true
    },
    customerState: {
      type: String,
      trim: true
    },
    customerCountry: {
      type: String,
      trim: true,
      default: "India"
    },
    customerPincode: {
      type: String,
      trim: true
    },

    // KYC
    customerPanNumber: {
      type: String,
      uppercase: true,
      trim: true
    },

    customerGstNumber: {
      type: String,
      uppercase: true,
      trim: true,
      unique: true
    },

    // Pricing
    pricePerKgDocument: {
      type: Number,
      default: 0,
    },

    pricePerKgNonDocument: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);


// 🔹 Pre-save hook to generate customerCode
customerSchema.pre("save", async function () {
  if (this.customerCode) return;

  const counter = await mongoose
    .model("CustomerCounter")
    .findOneAndUpdate(
      { key: "customerCode" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

  const number = counter.seq.toString().padStart(10, "0");
  this.customerCode = `CUST-${number}`;
}

);

module.exports = mongoose.model("Customer", customerSchema);