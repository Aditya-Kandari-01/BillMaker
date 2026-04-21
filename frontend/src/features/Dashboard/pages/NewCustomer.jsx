import React, { useEffect, useState } from "react";
import Field from "../../consignment/components/Fields";

const initialForm = {
  customerCompanyName: "",
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  customerAddress: "",
  customerCity: "",
  customerState: "",
  customerCountry: "India",
  customerPincode: "",
  customerPanNumber: "",
  customerGstNumber: "",
  pricePerKgDocument: "",
  pricePerKgNonDocument: "",
};

const NewCustomer = () => {
  const [form, setForm] = useState({ ...initialForm });
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch("http://localhost:10000/data/customer");
        const result = await res.json();

        if (res.ok && Array.isArray(result.data)) {
          setCustomers(result.data);
        }
      } catch (error) {
        console.log("Failed to load customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  const updateParameter = async (event) => {
    const { name, value } = event.target;

    if (name === "pricePerKgDocument" || name === "pricePerKgNonDocument") {
      setForm((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value),
      }));
      return;
    }

    if (name === "customerCompanyName") {
      const found = customers.find(
        (u) =>
          (u.customerCompanyName || "").toLowerCase() === value.toLowerCase()
      );

      setForm((prev) => ({
        ...prev,
        customerCompanyName: value,
        ...(found && {
          customerName: found.customerName || "",
          customerPhone: found.customerPhone || "",
          customerEmail: found.customerEmail || "",
          customerAddress: found.customerAddress || "",
          customerCity: found.customerCity || "",
          customerState: found.customerState || "",
          customerCountry: found.customerCountry || "India",
          customerPincode: found.customerPincode || "",
          customerPanNumber: found.customerPanNumber || "",
          customerGstNumber: found.customerGstNumber || "",
          pricePerKgDocument: found.pricePerKgDocument ?? "",
          pricePerKgNonDocument: found.pricePerKgNonDocument ?? "",
        }),
      }));

      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "customerPincode" && value.length === 6) {
      try {
        const res = await fetch(
          `https://api.postalpincode.in/pincode/${value}`
        );
        const result = await res.json();

        if (result?.[0]?.Status === "Success") {
          const post = result[0].PostOffice[0];
          setForm((prev) => ({
            ...prev,
            customerCity: post.District || prev.customerCity,
            customerState: post.State || prev.customerState,
          }));
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const checkRes = await fetch(
        `http://localhost:10000/data/customer/check?customerCompanyName=${encodeURIComponent(
          form.customerCompanyName
        )}&customerGstNumber=${encodeURIComponent(form.customerGstNumber)}`
      );

      const checkData = await checkRes.json();

      if (checkRes.ok && checkData.exists) {
        alert("Both company name and GST number already exists");
        setForm((prev) => ({
          ...prev,
          ...checkData.data,
        }));
        setLoading(false);
        return;
      }

      const payload = {
        customerCompanyName: form.customerCompanyName,
        customerName: form.customerName || form.customerCompanyName,
        customerPhone: form.customerPhone,
        customerEmail: form.customerEmail,
        customerAddress: form.customerAddress,
        customerCity: form.customerCity,
        customerState: form.customerState,
        customerCountry: form.customerCountry,
        customerPincode: form.customerPincode,
        customerPanNumber: form.customerPanNumber,
        customerGstNumber: form.customerGstNumber,
        pricePerKgDocument: form.pricePerKgDocument,
        pricePerKgNonDocument: form.pricePerKgNonDocument,
      };

      const res = await fetch("http://localhost:10000/data/customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.status === 409) {
        alert(result.message);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        alert(result.message || "Something went wrong");
        setLoading(false);
        return;
      }

      alert("Customer saved successfully");
      setForm({ ...initialForm });

      const refreshRes = await fetch("http://localhost:10000/data/customer");
      const refreshData = await refreshRes.json();
      if (refreshRes.ok && Array.isArray(refreshData.data)) {
        setCustomers(refreshData.data);
      }
    } catch (error) {
      console.log(error);
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <form className="sx-card sx-col-card" onSubmit={handleSubmit}>
      <div className="sx-section" style={{ paddingTop: 24 }}>
        <div className="sx-section-head">
          <span className="text-white text-3xl">Customer Details</span>
        </div>
      </div>

      <div className="sx-fields cols-1" style={{ paddingBottom: 20 }}>
        <Field label="Company Name">
          <input
            list="customerCompanyNames"
            className="sx-input"
            onChange={updateParameter}
            name="customerCompanyName"
            placeholder="Company name"
            value={form.customerCompanyName || ""}
          />
        </Field>

        <Field label="Customer Name">
          <input
            className="sx-input"
            onChange={updateParameter}
            name="customerName"
            placeholder="Contact person / customer name"
            value={form.customerName || ""}
          />
        </Field>

        <Field label="Phone">
          <input
            className="sx-input"
            onChange={updateParameter}
            name="customerPhone"
            placeholder="Mobile number"
            value={form.customerPhone || ""}
          />
        </Field>

        <Field label="Email">
          <input
            type="email"
            className="sx-input"
            onChange={updateParameter}
            name="customerEmail"
            placeholder="Email address"
            value={form.customerEmail || ""}
          />
        </Field>

        <Field label="Address">
          <input
            className="sx-input"
            onChange={updateParameter}
            name="customerAddress"
            placeholder="Full address"
            value={form.customerAddress || ""}
          />
        </Field>

        <Field label="Pincode">
          <input
            className="sx-input"
            onChange={updateParameter}
            name="customerPincode"
            placeholder="Postal code"
            value={form.customerPincode || ""}
            maxLength={6}
          />
        </Field>

        <Field label="City">
          <input
            className="sx-input"
            onChange={updateParameter}
            name="customerCity"
            placeholder="City"
            value={form.customerCity || ""}
          />
        </Field>

        <Field label="State">
          <input
            className="sx-input"
            onChange={updateParameter}
            name="customerState"
            placeholder="State"
            value={form.customerState || ""}
          />
        </Field>

        <Field label="Country">
          <input
            className="sx-input"
            onChange={updateParameter}
            name="customerCountry"
            placeholder="Country"
            value={form.customerCountry || ""}
          />
        </Field>

        <Field label="PAN Number">
          <input
            className="sx-input"
            onChange={updateParameter}
            name="customerPanNumber"
            placeholder="PAN number"
            value={form.customerPanNumber || ""}
          />
        </Field>

        <Field label="GST Number">
          <input
            className="sx-input"
            onChange={updateParameter}
            name="customerGstNumber"
            placeholder="GST number"
            value={form.customerGstNumber || ""}
          />
        </Field>

        <Field label="Price Per Kg - Document">
          <input
            type="number"
            className="sx-input"
            onChange={updateParameter}
            name="pricePerKgDocument"
            placeholder="Document price"
            value={form.pricePerKgDocument || ""}
          />
        </Field>

        <Field label="Price Per Kg - Non Document">
          <input
            type="number"
            className="sx-input"
            onChange={updateParameter}
            name="pricePerKgNonDocument"
            placeholder="Non-document price"
            value={form.pricePerKgNonDocument || ""}
          />
        </Field>
      </div>
            <div className="sx-confirm-wrap">
      <button type="submit" className="sx-confirm-btn" disabled={loading}>
        {loading ? "Saving..." : "Save Customer"}
      </button>
      </div>
    </form>
  );
};

export default NewCustomer;