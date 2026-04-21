const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    // Unique Customer Code
    customerCode: {
      type: String,
      unique: true,
      index: true,
    },
    // Customer Company Name
    customerCompanyName: {
      type: String,
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
      required: true,
      unique: true,
    },

    customerEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },

    // Address
    customerAddress: String,
    customerCity: String,
    customerState: String,
    customerCountry: {
      type: String,
      default: "India",
    },
    customerPincode: String,

    // KYC
    customerPanNumber: {
      type: String,
      uppercase: true,
      trim: true,
      sparse: true,
      unique: true,
    },

    customerGstNumber: {
      type: String,
      uppercase: true,
      trim: true,
      sparse: true,
      unique: true,
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

  let isUnique = false;

  while (!isUnique) {
    const shortTime = Date.now().toString().slice(-5);
    const random = Math.floor(1000 + Math.random() * 9000);
    const code = `CUST-${shortTime}-${random}`;

    const exists = await mongoose
      .model("Customer")
      .findOne({ customerCode: code });

    if (!exists) {
      this.customerCode = code;
      isUnique = true;
    }
  }
});

module.exports = mongoose.model("Customer", customerSchema);