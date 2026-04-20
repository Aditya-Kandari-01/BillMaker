import { useState } from "react";
import generatePdf from "../utils/pdfGenerator";
import { Link } from "react-router-dom";
import PastOrders from "./PastOrders";

const data = [
  {
    sender: "Aditya",
    senderPhone: "9876543210",
    pickupAddress: "Bangalore",
    receiver: "Rahul",
    receiverPhone: "9123456780",
    deliveryAddress: "Mumbai",
    weight: "",
    type: "Document",
    awb: "",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560001",
    price: 0,
  },
  {
    sender: "Neha",
    senderPhone: "9988776655",
    pickupAddress: "Delhi",
    receiver: "Amit",
    receiverPhone: "9012345678",
    deliveryAddress: "Pune",
    weight: "",
    type: "Document",
    awb: "",
    city: "Delhi",
    state: "Delhi",
    pincode: "110001",
    price: 0,
  },
  {
    sender: "Ravi",
    senderPhone: "9090909090",
    pickupAddress: "Hyderabad",
    receiver: "Kiran",
    receiverPhone: "9345678901",
    deliveryAddress: "Chennai",
    weight: "",
    type: "Document",
    awb: "",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500001",
    price: 0,
  },
  {
    sender: "Priya",
    senderPhone: "8888888888",
    pickupAddress: "Kolkata",
    receiver: "Suresh",
    receiverPhone: "9765432109",
    deliveryAddress: "Ahmedabad",
    weight: "",
    type: "Document",
    awb: "",
    city: "Kolkata",
    state: "West Bengal",
    pincode: "700001",
    price: 0,
  },
  {
    sender: "Vikram",
    senderPhone: "9777777777",
    pickupAddress: "Jaipur",
    receiver: "Anjali",
    receiverPhone: "9456781234",
    deliveryAddress: "Lucknow",
    weight: "",
    type: "Document",
    awb: "",
    city: "Jaipur",
    state: "Rajasthan",
    pincode: "302001",
    price: 0,
  },
  {
    sender: "Sneha",
    senderPhone: "9666666666",
    pickupAddress: "Bhopal",
    receiver: "Manish",
    receiverPhone: "9234567812",
    deliveryAddress: "Indore",
    weight: "",
    type: "Document",
    awb: "",
    city: "Bhopal",
    state: "Madhya Pradesh",
    pincode: "462001",
    price: 0,
  },
  {
    sender: "Arjun",
    senderPhone: "9555555555",
    pickupAddress: "Nagpur",
    receiver: "Deepak",
    receiverPhone: "9345612789",
    deliveryAddress: "Surat",
    weight: "",
    type: "Document",
    awb: "",
    city: "Nagpur",
    state: "Maharashtra",
    pincode: "440001",
    price: 0,
  },
  {
    sender: "Pooja",
    senderPhone: "9444444444",
    pickupAddress: "Chandigarh",
    receiver: "Rohit",
    receiverPhone: "9123987654",
    deliveryAddress: "Amritsar",
    weight: "",
    type: "Document",
    awb: "",
    city: "Chandigarh",
    state: "Chandigarh",
    pincode: "160001",
    price: 0,
  },
  {
    sender: "Karan",
    senderPhone: "9333333333",
    pickupAddress: "Patna",
    receiver: "Nikhil",
    receiverPhone: "9988123456",
    deliveryAddress: "Ranchi",
    weight: "",
    type: "Document",
    awb: "",
    city: "Patna",
    state: "Bihar",
    pincode: "800001",
    price: 0,
  },
  {
    sender: "Meera",
    senderPhone: "9222222222",
    pickupAddress: "Goa",
    receiver: "Varun",
    receiverPhone: "9876123450",
    deliveryAddress: "Mangalore",
    weight: "",
    type: "Document",
    awb: "",
    city: "Panaji",
    state: "Goa",
    pincode: "403001",
    price: 0,
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
  sawbno: "",
  rawbno: "",
  scity: "",
  sstate: "",
  spincode: "",
  rpincode: "",
  rcity: "",
  rstate: "",
  network: "",
  date: "",
  price: 0,
};

function Field({ label, children }) {
  return (
    <div className="sx-field">
      <label className="sx-label">{label}</label>
      {children}
    </div>
  );
}

export default function Order() {
  const today = new Date().toISOString().split("T")[0];
  const [active, setActive] = useState("order");
  const [form, setForm] = useState({ ...initialForm });
  const [date, setDate] = useState(today);
  const [selectedRow, setSelectedRow] = useState(null);
  const [orders, setOrders] = useState(
    () => JSON.parse(localStorage.getItem("consignments")) || [],
  );

  const submitHandler = () => {
    const consignmentData = {
      sender: {
        name: form.sender,
        phone: form.senderPhone,
        address: form.pickupAddress,
        awb: form.sawbno,
        city: form.scity,
        state: form.sstate,
        pincode: form.spincode,
      },
      receiver: {
        name: form.receiver,
        phone: form.receiverPhone,
        address: form.deliveryAddress,
        awb: form.rawbno,
        city: form.rcity,
        state: form.rstate,
        pincode: form.rpincode,
      },
      package: { type: form.type, weight: form.weight, pricePerKg: form.price },
      amount: (form.weight || 0) * (form.price || 0),
      date: date,
    };
    generatePdf(consignmentData);
  };

  const addOrder = () => {
    const consignmentData = {
      sender: {
        name: form.sender,
        phone: form.senderPhone,
        address: form.pickupAddress,
        awb: form.sawbno,
        city: form.scity,
        state: form.sstate,
        pincode: form.spincode,
      },
      receiver: {
        name: form.receiver,
        phone: form.receiverPhone,
        address: form.deliveryAddress,
        awb: form.rawbno,
        city: form.rcity,
        state: form.rstate,
        pincode: form.rpincode,
      },
      package: { type: form.type, weight: form.weight, pricePerKg: form.price },
      amount: (form.weight || 0) * (form.price || 0),
      date: date,
    };

    const existingData = JSON.parse(localStorage.getItem("consignments")) || [];
    const updatedData = [...existingData, consignmentData];

    localStorage.setItem("consignments", JSON.stringify(updatedData));
    setOrders(updatedData);
    window.alert("Data added successfully")
  };

  // ── Click a past-order row → fill receiver fields ──
  const handleRowClick = (item, idx) => {
    setSelectedRow(idx);
    setForm((prev) => ({
      ...prev,
      receiver: item.receiver.name || "",
      receiverPhone: item.receiver.phone || "",
      deliveryAddress: item.receiver.address || "",
      rawbno: item.receiver.awb || "",
      rcity: item.receiver.city || "",
      rstate: item.receiver.state || "",
      rpincode: item.receiver.pincode || "",
    }));
    // Scroll / switch to order tab so user can see the filled fields
    setActive("order");
  };

  const updateParameter = async (event) => {
    const { name, value } = event.target;

    if (name === "price" || name === "weight") {
      setForm((p) => ({ ...p, [name]: value === "" ? "" : Number(value) }));
      return;
    }

    if (name === "sender") {
      const found = data.find(
        (u) => u.sender.toLowerCase() === value.toLowerCase(),
      );
      setForm((p) => ({
        ...p,
        [name]: value,
        ...(found && {
          senderPhone: found.senderPhone,
          pickupAddress: found.pickupAddress,
          receiver: found.receiver,
          receiverPhone: found.receiverPhone,
          deliveryAddress: found.deliveryAddress,
          scity: found.city,
          sstate: found.state,
          spincode: found.pincode,
          network: found.network,
        }),
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

  const totalAmount = (form.weight || 0) * (form.price || 0);

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
                      {data.map((u, i) => (
                        <option key={i} value={u.sender} />
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
                  <Field label="AWB No.">
                    <input
                      className="sx-input"
                      onChange={updateParameter}
                      name="sawbno"
                      placeholder="Air Ways Number"
                      value={form.sawbno || ""}
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
                </div>
              </div>

              {/* Col 2: Receiver */}
              <div className="sx-card sx-col-card">
                <div className="sx-section" style={{ paddingTop: 24 }}>
                  <div className="sx-section-head">
                    <div className="sx-section-badge blue">↓</div>
                    <span className="sx-section-title">Receiver Details</span>
                    {selectedRow !== null && (
                      <span
                        style={{
                          marginLeft: "auto",
                          fontSize: 10,
                          color: "var(--green)",
                          background: "rgba(62,207,142,0.1)",
                          border: "1px solid rgba(62,207,142,0.2)",
                          borderRadius: 6,
                          padding: "2px 8px",
                          fontWeight: 600,
                          letterSpacing: "0.4px",
                        }}
                      >
                        ✓ Auto-filled
                      </span>
                    )}
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
                  <Field label="AWB No.">
                    <input
                      className="sx-input"
                      onChange={updateParameter}
                      name="rawbno"
                      placeholder="Air Ways Number"
                      value={form.rawbno || ""}
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
                    <Field label="Weight (kg)">
                      <input
                        type="number"
                        className="sx-input"
                        onChange={updateParameter}
                        value={form.weight || ""}
                        name="weight"
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
            <PastOrders
              orders={orders}
              selectedRow={selectedRow}
              setSelectedRow={setSelectedRow}
              handleRowClick={handleRowClick}
            />
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
                    <div className="sx-review-key">Sender AWB</div>
                    <div className="sx-review-val">{form.sawbno || "—"}</div>
                  </div>
                  <div className="sx-review-cell">
                    <div className="sx-review-key">Receiver AWB</div>
                    <div className="sx-review-val">{form.rawbno || "—"}</div>
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
