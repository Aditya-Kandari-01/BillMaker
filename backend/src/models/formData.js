const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    // Unique Customer Code
    customerCode: {
      type: String,
      unique: true,
      index: true,
    },

    sender: { type: String },
    senderPhone: { type: String, unique: true },
    pickupAddress: { type: String },
    city: String,
    state: String,
    pincode: String,
    awb: { type: String, default: "" },
    type: { type: String, default: "Document" },
    network: String,
    date: { type: Date, default: Date.now },
    weight: { type: Number, default: 0 },
    length: { type: Number, default: 0 },
    breadth: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    panNumber: String,
    gstNumber: String,
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