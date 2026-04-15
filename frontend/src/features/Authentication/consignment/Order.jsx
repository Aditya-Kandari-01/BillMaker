import { useState } from "react";

const steps = ["Pickup", "Delivery", "Package", "Pricing", "Review"];
const data = [
  {
    sender: "Aditya",
    senderPhone: "9876543210",
    pickupAddress: "Bangalore",
    receiver: "Rahul",
    receiverPhone: "9123456780",
    deliveryAddress: "Mumbai",
    weight: "",
    type: ""
  },
  {
    sender: "Neha",
    senderPhone: "9988776655",
    pickupAddress: "Delhi",
    receiver: "Amit",
    receiverPhone: "9012345678",
    deliveryAddress: "Pune",
    weight: "",
    type: ""
  },
  {
    sender: "Ravi",
    senderPhone: "9090909090",
    pickupAddress: "Hyderabad",
    receiver: "Kiran",
    receiverPhone: "9345678901",
    deliveryAddress: "Chennai",
    weight: "",
    type: ""
  },
  {
    sender: "Priya",
    senderPhone: "8888888888",
    pickupAddress: "Kolkata",
    receiver: "Suresh",
    receiverPhone: "9765432109",
    deliveryAddress: "Ahmedabad",
    weight: "",
    type: ""
  },
  {
    sender: "Vikram",
    senderPhone: "9777777777",
    pickupAddress: "Jaipur",
    receiver: "Anjali",
    receiverPhone: "9456781234",
    deliveryAddress: "Lucknow",
    weight: "",
    type: ""
  },
  {
    sender: "Sneha",
    senderPhone: "9666666666",
    pickupAddress: "Bhopal",
    receiver: "Manish",
    receiverPhone: "9234567812",
    deliveryAddress: "Indore",
    weight: "",
    type: ""
  },
  {
    sender: "Arjun",
    senderPhone: "9555555555",
    pickupAddress: "Nagpur",
    receiver: "Deepak",
    receiverPhone: "9345612789",
    deliveryAddress: "Surat",
    weight: "",
    type: ""
  },
  {
    sender: "Pooja",
    senderPhone: "9444444444",
    pickupAddress: "Chandigarh",
    receiver: "Rohit",
    receiverPhone: "9123987654",
    deliveryAddress: "Amritsar",
    weight: "",
    type: ""
  },
  {
    sender: "Karan",
    senderPhone: "9333333333",
    pickupAddress: "Patna",
    receiver: "Nikhil",
    receiverPhone: "9988123456",
    deliveryAddress: "Ranchi",
    weight: "",
    type: ""
  },
  {
    sender: "Meera",
    senderPhone: "9222222222",
    pickupAddress: "Goa",
    receiver: "Varun",
    receiverPhone: "9876123450",
    deliveryAddress: "Mangalore",
    weight: "",
    type: ""
  },
];

export default function Order() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    sender: "",
    senderPhone: "",
    pickupAddress: "",
    receiver: "",
    receiverPhone: "",
    deliveryAddress: "",
    weight: "",
    type: "Document",
    price: 0,
  });
  const submitHandler = (event) => {
    event.preventDefault();
  };
  const updateParameter = (event) => {
    const { name, value } = event.target;
    if (name === "sender"){
      const found = data.find((user) => user.sender.toLowerCase() === value.toLowerCase());

      setForm((prevState) => ({
        ...prevState,
        [name]: value,
        // if user exists, then fill the fields
        ...(found && {
          senderPhone: found.senderPhone,
          pickupAddress: found.pickupAddress,
          receiver: found.receiver,
          receiverPhone: found.receiverPhone,
          deliveryAddress: found.deliveryAddress,
        })
      }));
    }else{
      setForm((prevState)=>({
        ...prevState,
        [name]:value
      }))
    }
  };

  return (
    <div className="login-page">
      {/* Background reused */}
      <div className="login-bg-grid" />
      <div className="login-bg-orb" />
      <div className="login-bg-orb2" />

      <div className="login-card max-w-2xl w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="login-brand">
            <div className="login-brand-icon">📦</div>
            <div className="login-brand-name">
              Ship<span>X</span>
            </div>
          </div>
          <div className="login-track-pill">
            <span className="login-dot-blink" />
            Step {step + 1}/5
          </div>
        </div>

        {/* Step Titles */}
        <div className="flex justify-between text-xs text-white/40 mb-6">
          {steps.map((s, i) => (
            <span key={i} className={i === step ? "text-orange-400" : ""}>
              {s}
            </span>
          ))}
        </div>

        {/* Content */}
        {step === 0 && (
          <div className="space-y-4">
            <input
              list="senderNames"
              onChange={updateParameter}
              name="sender"
              placeholder="Sender Name"
              value={form.sender || ""}
              className="login-input !pl-4"
            />
            <datalist id="senderNames">
              {data &&
                data.map((user, idx) => (
                  <option key={idx} value={user.sender}></option>
                ))}
            </datalist>
            <input
              onChange={updateParameter}
              name="senderPhone"
              placeholder="Phone"
              value={form.senderPhone || ""}
              className="login-input !pl-4"
            />
            <input
              name="pickupAddress"
              onChange={updateParameter}
              placeholder="Pickup Address"
              value={form.pickupAddress || ""}
              className="login-input !pl-4"
            />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <input
              onChange={updateParameter}
              value={form.receiver || ""}
              name="receiver"
              placeholder="Receiver Name"
              className="login-input !pl-4"
            />
            <input
              onChange={updateParameter}
              value={form.receiverPhone || ""}
              name="receiverPhone"
              placeholder="Phone"
              className="login-input !pl-4"
            />
            <input
              onChange={updateParameter}
              value={form.deliveryAddress || ""}
              name="deliveryAddress"
              placeholder="Delivery Address"
              className="login-input !pl-4"
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <select name="type" className="login-input !pl-4">
              <option>Standard</option>
              <option>Parcel</option>
              <option>Fragile</option>
            </select>
            <input
              onChange={updateParameter}
              value={form.weight || ""}
              name="weight"
              placeholder="Weight (kg)"
              className="login-input !pl-4"
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <input onChange={updateParameter} name="price" className="login-input !pl-4" placeholder="Enter Amount (per kg)">
            </input>
          </div>
        )}

        {step === 4 && (
          <div className="text-sm space-y-2 text-white/80">
            <p>
              <b>Sender:</b> {form.sender}
            </p>
            <p>
              <b>Pickup:</b> {form.pickupAddress}
            </p>
            <p>
              <b>Receiver:</b> {form.receiver}
            </p>
            <p>
              <b>Delivery:</b> {form.deliveryAddress}
            </p>
            <p>
              <b>Total amount:</b> {form.weight * form.price}
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => {
              setStep(step - 1);
            }}
            disabled={step === 0}
            className="px-6 py-4 bg-white/10 rounded text-sm disabled:opacity-30"
          >
            Back
          </button>

          {step < steps.length - 1 ? (
            <button
              onClick={() => {
                setStep(step + 1);
              }}
              className="bg-linear-to-br from-[#ff8c32] to-[#ff5a1f] rounded  w-auto px-6 py-4"
            >
              Next
            </button>
          ) : (
            <button className="bg-linear-to-br from-[#ff8c32] to-[#ff5a1f] rounded w-auto px-6 py-4">
              Confirm
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
