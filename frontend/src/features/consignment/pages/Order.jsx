import { useState } from "react";
import generatePdf from "../utils/pdfGenerator";
import { Link } from "react-router-dom";
import PastOrders from "./PastOrders";
import Field from "../components/Fields";
import { useEffect } from "react";

const data = [
  {
    sender: "Aditya",
    senderPhone: "9876543210",
    pickupAddress: "Bangalore",
    weight: null,
    type: "Document",
    awb: "",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560001",
    price: 0,
    height: null,
    breadth: null,
    length: null,
    panNumber: "ABCDE1234F",
    gstNumber: "29ABCDE1234F1Z5",
  },
  {
    sender: "Neha",
    senderPhone: "9988776655",
    pickupAddress: "Delhi",
    weight: null,
    type: "Document",
    awb: "",
    city: "Delhi",
    state: "Delhi",
    pincode: "110001",
    price: 0,
    height: null,
    breadth: null,
    length: null,
    panNumber: "PQRSX5678L",
    gstNumber: "07PQRSX5678L1Z2",
  },
  {
    sender: "Ravi",
    senderPhone: "9090909090",
    pickupAddress: "Hyderabad",
    weight: null,
    type: "Document",
    awb: "",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500001",
    price: 0,
    height: null,
    breadth: null,
    length: null,
    panNumber: "LMNOP4321K",
    gstNumber: "36LMNOP4321K1Z7",
  },
  {
    sender: "Priya",
    senderPhone: "8888888888",
    pickupAddress: "Kolkata",
    weight: null,
    type: "Document",
    awb: "",
    city: "Kolkata",
    state: "West Bengal",
    pincode: "700001",
    price: 0,
    height: null,
    breadth: null,
    length: null,
    panNumber: "ZXCVB6789Q",
    gstNumber: "19ZXCVB6789Q1Z3",
  },
  {
    sender: "Vikram",
    senderPhone: "9777777777",
    pickupAddress: "Jaipur",
    weight: null,
    type: "Document",
    awb: "",
    city: "Jaipur",
    state: "Rajasthan",
    pincode: "302001",
    price: 0,
    height: null,
    breadth: null,
    length: null,
    panNumber: "ASDFG1122H",
    gstNumber: "08ASDFG1122H1Z9",
  },
  {
    sender: "Sneha",
    senderPhone: "9666666666",
    pickupAddress: "Bhopal",
    weight: null,
    type: "Document",
    awb: "",
    city: "Bhopal",
    state: "Madhya Pradesh",
    pincode: "462001",
    price: 0,
    height: null,
    breadth: null,
    length: null,
    panNumber: "GHJKL3344P",
    gstNumber: "23GHJKL3344P1Z1",
  },
  {
    sender: "Arjun",
    senderPhone: "9555555555",
    pickupAddress: "Nagpur",
    weight: null,
    type: "Document",
    awb: "",
    city: "Nagpur",
    state: "Maharashtra",
    pincode: "440001",
    price: 0,
    height: null,
    breadth: null,
    length: null,
    panNumber: "QWERT5566T",
    gstNumber: "27QWERT5566T1Z4",
  },
  {
    sender: "Pooja",
    senderPhone: "9444444444",
    pickupAddress: "Chandigarh",
    weight: null,
    type: "Document",
    awb: "",
    city: "Chandigarh",
    state: "Chandigarh",
    pincode: "160001",
    price: 0,
    height: null,
    breadth: null,
    length: null,
    panNumber: "YUIOP7788M",
    gstNumber: "04YUIOP7788M1Z6",
  },
  {
    sender: "Karan",
    senderPhone: "9333333333",
    pickupAddress: "Patna",
    weight: null,
    type: "Document",
    awb: "",
    city: "Patna",
    state: "Bihar",
    pincode: "800001",
    price: 0,
    height: null,
    breadth: null,
    length: null,
    panNumber: "BNMJK9900R",
    gstNumber: "10BNMJK9900R1Z8",
  },
  {
    sender: "Meera",
    senderPhone: "9222222222",
    pickupAddress: "Goa",
    weight: null,
    type: "Document",
    awb: "",
    city: "Panaji",
    state: "Goa",
    pincode: "403001",
    price: 0,
    height: null,
    breadth: null,
    length: null,
    panNumber: "PLMOK2233S",
    gstNumber: "30PLMOK2233S1Z0",
  },
];
const initialForm = {
  sender: "",
  senderPhone: "",
  pickupAddress: "",
  receiver: "",
  receiverPhone: "",
  deliveryAddress: "",
  weight: "",
  type: "Document",
  scity: "",
  sstate: "",
  spincode: "",
  rpincode: "",
  rcity: "",
  rstate: "",
  awbno: "",
  network: "",
  gstNumber: "",
  panNumber: "",
  height: null,
  breadth: null,
  length: null,
  date: "",
  price: 0,
};

export default function Order() {
  const today = new Date().toISOString().split("T")[0];
  const [active, setActive] = useState("order");
  const [form, setForm] = useState({ ...initialForm });
  const [date, setDate] = useState(today);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState(
    () => JSON.parse(localStorage.getItem("consignments")) || [],
  );
  const fetchCustomers = async () => {
  try {
    const res = await fetch("http://localhost:10000/data/customer");
    const result = await res.json();

    if (res.ok) {
      setCustomers(result.data || []);
    }
  } catch (err) {
    console.log(err);
  }
};

  useEffect(() => {
    fetchCustomers();
  }, []);

  const submitHandler = () => {
    const volumetricWeight =
      form.length && form.breadth && form.height
        ? (Number(form.length) * Number(form.breadth) * Number(form.height)) /
          5000
        : 0;

    const consignmentData = {
      company: {
        name: "R. S COURIER",
        address: "M.J Market Kicha Road Near Axis Bank, Sitarganj",
        city: "Sitarganj",
        state: "Uttarakhand",
        pincode: "262405",
        gstNo: form.gstNumber || "—",
        panNo: form.panNumber || "—",
        email: "sanmukhsupplychain@gmail.com",
        contact: "9810064478",
      },

      invoice: {
        number: form.invoiceNo || "1977",
        date: form.date || new Date().toLocaleDateString("en-GB"),
        stateCode: form.stateCode || "05",
        placeOfSupply: form.placeOfSupply || form.rcity || "—",
        hsnSac: "996812",
      },

      billTo: {
        name: form.sender || "—",
        address: form.pickupAddress || "—",
        gstNo: form.gstNumber || "—",
        panNo: form.panNumber || "—",
      },

      shipTo: {
        name: form.receiver || "—",
        address: form.deliveryAddress || "—",
        placeOfSupply: form.rcity || "—",
        stateCode: form.stateCode || "—",
      },

      shipments: [
        {
          sno: 1,
          awb: form.awb || "—",
          date: form.date || new Date().toLocaleDateString("en-GB"),
          destination: form.rcity || "—",
          pcs: form.pcs || 1,
          weight: form.weight || volumetricWeight || 0,
          amount: form.price || 0,
          network: form.network || "—",
          mode: form.type || "—",
          origin: form.scity || "—",
          consignee: form.receiver || "—",
        },
      ],

      totals: {
        totalShipments: 1,
        totalAwb: 1,
        subtotal: Number(form.price || 0),
        grandTotal: Number(form.price || 0),
      },

      charges: {
        fuelSurcharge: 0,
        otherCharges: 0,
      },

      amountInWords: `INR ${Number(form.price || 0)} ONLY`,
      fileName: `invoice_${form.awb || "receipt"}.pdf`,
    };

    generatePdf(consignmentData);
  };

  const addOrder = () => {
    const consignmentData = {
      sender: {
        name: form.sender,
        phone: form.senderPhone,
        address: form.pickupAddress,
        city: form.scity,
        state: form.sstate,
        pincode: form.spincode,
      },
      receiver: {
        name: form.receiver,
        phone: form.receiverPhone,
        address: form.deliveryAddress,
        city: form.rcity,
        state: form.rstate,
        pincode: form.rpincode,
      },
      package: { type: form.type, weight: form.weight, pricePerKg: form.price },
      amount:
        form.length && form.breadth && form.height
          ? (form.length * form.breadth * form.height) / 5000
          : 0,
      awbno: form.awb,
      date: date,
    };

    const existingData = JSON.parse(localStorage.getItem("consignments")) || [];
    const updatedData = [...existingData, consignmentData];

    localStorage.setItem("consignments", JSON.stringify(updatedData));
    setOrders(updatedData);
    window.alert("Data added successfully");
  };

  const updateParameter = async (event) => {
    const { name, value } = event.target;

    if (name === "price" || name === "weight") {
      setForm((p) => ({ ...p, [name]: value === "" ? "" : Number(value) }));
      return;
    }

    if (name === "sender") {
  const selected = value.trim();

  const found = customers.find((u) => {
    const label = `${u.customerName} (${u.customerCode})`;
    return (
      label.toLowerCase() === selected.toLowerCase() ||
      u.customerName?.toLowerCase() === selected.toLowerCase() ||
      u.customerCode?.toLowerCase() === selected.toLowerCase()
    );
  });

  setForm((p) => ({
    ...p,
    sender: value,
    senderPhone: found?.customerPhone || "",
    pickupAddress: found?.customerAddress || "",
    scity: found?.customerCity || "",
    sstate: found?.customerState || "",
    spincode: found?.customerPincode || "",
    gstNumber: found?.customerGstNumber || "",
    panNumber: found?.customerPanNumber || "",
    network: found?.customerCompanyName || found?.customerName || "",
  }));

  return;
}

    setForm((p) => ({ ...p, [name]: value }));

    if (name === "spincode" && value.length === 6) {
      try {
        const res = await fetch(
          `https://api.postalpincode.in/pincode/${value}`,
        );
        const result = await res.json();
        if (result[0].Status === "Success") {
          const post = result[0].PostOffice[0];
          setForm((prev) => ({
            ...prev,
            scity: post.District,
            sstate: post.State,
          }));
        }
      } catch (err) {
        console.log(err);
      }
    }

    if (name === "rpincode" && value.length === 6) {
      try {
        const res = await fetch(
          `https://api.postalpincode.in/pincode/${value}`,
        );
        const result = await res.json();
        if (result[0].Status === "Success") {
          const post = result[0].PostOffice[0];
          setForm((prev) => ({
            ...prev,
            rcity: post.District,
            rstate: post.State,
          }));
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const totalAmount =
    form.length && form.breadth && form.height
      ? (form.length * form.breadth * form.height) / 5000
      : 0;

  return (
    <>
      <div className="sx-page">
        {/* ── top bar ── */}
        <div className="sx-topbar">
          <div className="sx-brand">
            <div className="sx-brand-icon">📦</div>
            <div className="sx-brand-name">
              <Link to={"/"}>
                Ship<span>X</span>
              </Link>
            </div>
          </div>
          <div className="sx-tabs">
            <button
              className={`sx-tab ${active === "order" ? "active" : ""}`}
              onClick={() => setActive("order")}
            >
              New Order
            </button>
            <button
              className={`sx-tab ${active === "review" ? "active" : ""}`}
              onClick={() => setActive("review")}
            >
              Review
            </button>
          </div>
        </div>

        {/* ════════ ORDER VIEW ════════ */}
        {active === "order" && (
          <>
            <div className="sx-three-col-layout">
              {/* Col 1: Sender */}
              <div className="sx-card sx-col-card">
                <div className="sx-section" style={{ paddingTop: 24 }}>
                  <div className="sx-section-head">
                    <div className="sx-section-badge orange">↑</div>
                    <span className="sx-section-title">Sender Details</span>
                  </div>
                </div>
                <div className="sx-fields cols-1" style={{ paddingBottom: 20 }}>
                  <Field label="Full Name">
                    <input
                      list="senderNames"
                      className="sx-input"
                      onChange={updateParameter}
                      name="sender"
                      placeholder="Sender name"
                      value={form.sender || ""}
                    />
                    <datalist id="senderNames">
                      {customers.map((u, i) => (
                        <option
                          key={i}
                          value={`${u.customerName} (${u.customerCode})`}
                        />
                      ))}
                    </datalist>
                  </Field>
                  <Field label="Phone">
                    <input
                      className="sx-input"
                      onChange={updateParameter}
                      name="senderPhone"
                      placeholder="Mobile number"
                      value={form.senderPhone || ""}
                    />
                  </Field>
                  <Field label="Pickup Address">
                    <input
                      className="sx-input"
                      onChange={updateParameter}
                      name="pickupAddress"
                      placeholder="City / full address"
                      value={form.pickupAddress || ""}
                    />
                  </Field>
                  <Field label="Pincode">
                    <input
                      className="sx-input"
                      onChange={updateParameter}
                      name="spincode"
                      placeholder="Postal Code"
                      value={form.spincode || ""}
                    />
                  </Field>
                  <Field label="City">
                    <input
                      className="sx-input"
                      onChange={updateParameter}
                      name="scity"
                      placeholder="City"
                      value={form.scity || ""}
                    />
                  </Field>
                  <Field label="State">
                    <input
                      className="sx-input"
                      onChange={updateParameter}
                      name="sstate"
                      placeholder="State"
                      value={form.sstate || ""}
                    />
                  </Field>
                  <Field label="GST Number">
                    <input
                      type="string"
                      className="sx-input"
                      onChange={updateParameter}
                      value={form.gstNumber || ""}
                      name="gstNumber"
                      placeholder="GST Number"
                    />
                  </Field>
                  <Field label="PAN Number">
                    <input
                      type="string"
                      className="sx-input"
                      onChange={updateParameter}
                      value={form.panNumber || ""}
                      name="panNumber"
                      placeholder="PAN Number"
                    />
                  </Field>
                </div>
              </div>

              {/* Col 2: Receiver */}
              <div className="sx-card sx-col-card">
                <div className="sx-section" style={{ paddingTop: 24 }}>
                  <div className="sx-section-head">
                    <div className="sx-section-badge blue">↓</div>
                    <span className="sx-section-title">Receiver Details</span>
                  </div>
                </div>
                <div className="sx-fields cols-1" style={{ paddingBottom: 20 }}>
                  <Field label="Full Name">
                    <input
                      className="sx-input"
                      onChange={updateParameter}
                      name="receiver"
                      placeholder="Receiver name"
                      value={form.receiver || ""}
                    />
                  </Field>
                  <Field label="Phone">
                    <input
                      className="sx-input"
                      onChange={updateParameter}
                      name="receiverPhone"
                      placeholder="Mobile number"
                      value={form.receiverPhone || ""}
                    />
                  </Field>
                  <Field label="Delivery Address">
                    <input
                      className="sx-input"
                      onChange={updateParameter}
                      name="deliveryAddress"
                      placeholder="City / full address"
                      value={form.deliveryAddress || ""}
                    />
                  </Field>
                  <Field label="Pincode">
                    <input
                      className="sx-input"
                      onChange={updateParameter}
                      name="rpincode"
                      placeholder="Postal Code"
                      value={form.rpincode || ""}
                    />
                  </Field>
                  <Field label="City">
                    <input
                      className="sx-input"
                      onChange={updateParameter}
                      name="rcity"
                      placeholder="City"
                      value={form.rcity || ""}
                    />
                  </Field>
                  <Field label="State">
                    <input
                      className="sx-input"
                      onChange={updateParameter}
                      name="rstate"
                      placeholder="State"
                      value={form.rstate || ""}
                    />
                  </Field>
                </div>
              </div>

              {/* Col 3: Package + Pricing */}
              <div className="sx-col-card sx-col-right">
                <div className="sx-card" style={{ flex: 1 }}>
                  <div className="sx-section" style={{ paddingTop: 24 }}>
                    <div className="sx-section-head">
                      <div className="sx-section-badge green">□</div>
                      <span className="sx-section-title">
                        Package & Pricing
                      </span>
                    </div>
                  </div>
                  <div
                    className="sx-fields cols-1"
                    style={{ paddingBottom: 20 }}
                  >
                    <Field label="Delivery Date">
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="sx-input-date"
                      />
                    </Field>
                    <Field label="AWB No.">
                      <input
                        className="sx-input"
                        onChange={updateParameter}
                        name="awbno"
                        placeholder="Air Ways Number"
                        value={form.awbno || ""}
                      />
                    </Field>
                    <Field label="Network">
                      <input
                        className="sx-input"
                        onChange={updateParameter}
                        name="network"
                        placeholder="Company name"
                        value={form.network || ""}
                      />
                    </Field>
                    <Field label="Type">
                      <select
                        className="sx-select"
                        name="type"
                        value={form.type}
                        onChange={updateParameter}
                      >
                        <option>Document</option>
                        <option>Non-Document</option>
                      </select>
                    </Field>
                    <Field label="Actual Weight (kg)">
                      <input
                        type="number"
                        className="sx-input"
                        onChange={updateParameter}
                        value={form.actualWeight || ""}
                        name="actualWeight"
                        placeholder="0.00"
                      />
                    </Field>
                    <Field label="Volume Weight (kg)">
                      <label htmlFor="length">Length(in cm)</label>
                      <input
                        id="length"
                        type="number"
                        className="sx-input"
                        onChange={updateParameter}
                        value={form.length || ""}
                        name="length"
                        placeholder="0.00"
                      />
                      <label htmlFor="breadth">Breadth(in cm)</label>
                      <input
                        id="breadth"
                        type="number"
                        className="sx-input"
                        onChange={updateParameter}
                        value={form.breadth || ""}
                        name="breadth"
                        placeholder="0.00"
                      />
                      <label htmlFor="height">Height(in cm)</label>
                      <input
                        id="height"
                        type="number"
                        className="sx-input"
                        onChange={updateParameter}
                        value={form.height || ""}
                        name="height"
                        placeholder="0.00"
                      />
                    </Field>
                    <Field label="Rate / kg (₹)">
                      <input
                        type="number"
                        className="sx-input"
                        onChange={updateParameter}
                        value={form.price || ""}
                        name="price"
                        placeholder="0.00"
                      />
                    </Field>
                  </div>
                </div>
                <div className="sx-pricing-strip">
                  <span className="sx-pricing-label">Estimated Total</span>
                  <span className="sx-pricing-value">
                    ₹ {totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
                <button
                  className="sx-confirm-btn"
                  onClick={() => setActive("review")}
                >
                  Review Order →
                </button>
              </div>
            </div>
            {/* ════════ Past Orders Table ════════ */}
            <PastOrders orders={orders} />
          </>
        )}

        {/* ════════ REVIEW VIEW ════════ */}
        {active === "review" && (
          <div className="sx-card" style={{ width: "100%", maxWidth: 700 }}>
            {!form.sender && !form.receiver ? (
              <div className="sx-empty">Fill in the order details first.</div>
            ) : (
              <>
                <div className="sx-top">
                  <div className="sx-review-key">Network</div>
                  <div className="sx-review-val">{form.network || "—"}</div>
                </div>
                <div className="sx-route" style={{ marginTop: 24 }}>
                  <div className="sx-route-city">
                    <div className="sx-review-key">From</div>
                    <div className="sx-review-val">
                      {form.pickupAddress || "—"}
                    </div>
                  </div>
                  <div className="sx-route-arrow">→</div>
                  <div className="sx-route-city">
                    <div className="sx-review-key">To</div>
                    <div className="sx-review-val">
                      {form.deliveryAddress || "—"}
                    </div>
                  </div>
                </div>
                <div className="sx-review-grid">
                  <div className="sx-review-cell">
                    <div className="sx-review-key">Sender</div>
                    <div className="sx-review-val">{form.sender || "—"}</div>
                  </div>
                  <div className="sx-review-cell">
                    <div className="sx-review-key">Sender Phone</div>
                    <div className="sx-review-val">
                      {form.senderPhone || "—"}
                    </div>
                  </div>
                  <div className="sx-review-cell">
                    <div className="sx-review-key">Receiver</div>
                    <div className="sx-review-val">{form.receiver || "—"}</div>
                  </div>
                  <div className="sx-review-cell">
                    <div className="sx-review-key">Receiver Phone</div>
                    <div className="sx-review-val">
                      {form.receiverPhone || "—"}
                    </div>
                  </div>
                  <div className="sx-review-cell">
                    <div className="sx-review-key">AWB Number</div>
                    <div className="sx-review-val">{form.awbno || "—"}</div>
                  </div>
                  <div className="sx-review-cell">
                    <div className="sx-review-key">Package Type</div>
                    <div className="sx-review-val">{form.type || "—"}</div>
                  </div>
                  <div className="sx-review-cell">
                    <div className="sx-review-key">Weight</div>
                    <div className="sx-review-val">
                      {form.weight ? `${form.weight} kg` : "—"}
                    </div>
                  </div>
                  <div className="sx-review-cell">
                    <div className="sx-review-key">Date</div>
                    <div className="sx-review-val">{date || "—"}</div>
                  </div>
                  <div className="sx-review-cell">
                    <div className="sx-review-key">Rate / kg</div>
                    <div className="sx-review-val">
                      {form.price ? `₹${form.price}` : "—"}
                    </div>
                  </div>
                  <div
                    className="sx-review-cell full"
                    style={{
                      borderTop: "1px solid var(--border)",
                      background: "rgba(255,140,50,0.04)",
                    }}
                  >
                    <div className="sx-review-key">Total Amount</div>
                    <div className="sx-review-val mono">
                      ₹ {totalAmount.toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>
                <div className="sx-confirm-wrap">
                  <button className="sx-confirm-btn" onClick={submitHandler}>
                    ✓ &nbsp;Confirm &amp; Generate PDF
                  </button>
                </div>
                <div className="sx-confirm-wrap">
                  <button onClick={addOrder} className="sx-confirm-btn">
                    Add Data
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
