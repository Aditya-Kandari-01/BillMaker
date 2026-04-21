import React, { useEffect, useRef, useState } from "react";
import Field from "../../consignment/components/Fields";
import * as XLSX from "xlsx";

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
  const [bulkData, setBulkData] = useState([]);
  const [bulkErrors, setBulkErrors] = useState([]);   // rows skipped before upload (missing fields)
  const [bulkResult, setBulkResult] = useState(null); // result after upload attempt
  const fileInputRef = useRef(null);

  // Fetch customers on mount so company-name autofill works
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch("http://localhost:10000/data/customer");
        const data = await res.json();
        if (res.ok && Array.isArray(data.data)) {
          setCustomers(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch customers:", err);
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
        console.error("Pincode lookup failed:", err);
      }
    }
  };

  const handleExcelUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clear any previous result when a new file is picked
    setBulkResult(null);

    const reader = new FileReader();


    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      const valid = [];
      const skipped = [];

      jsonData.forEach((row, index) => {
        const companyName = String(row.customerCompanyName || "").trim();
        const gstNumber = String(row.customerGstNumber || "").trim();

        if (!companyName || !gstNumber) {
          skipped.push({ row: index + 2 });
          return;
        }

        valid.push({
          customerCompanyName: companyName,
          customerName: String(row.customerName || "").trim(),
          customerPhone: String(row.customerPhone || "").trim(),
          customerEmail: String(row.customerEmail || "").trim(),
          customerAddress: String(row.customerAddress || "").trim(),
          customerCity: String(row.customerCity || "").trim(),
          customerState: String(row.customerState || "").trim(),
          customerCountry: String(row.customerCountry || "India").trim(),
          customerPincode: String(row.customerPincode || "").trim(),
          customerPanNumber: String(row.customerPanNumber || "").trim(),
          customerGstNumber: gstNumber,
          pricePerKgDocument:
            row.pricePerKgDocument === "" || row.pricePerKgDocument == null
              ? ""
              : Number(row.pricePerKgDocument),
          pricePerKgNonDocument:
            row.pricePerKgNonDocument === "" ||
            row.pricePerKgNonDocument == null
              ? ""
              : Number(row.pricePerKgNonDocument),
        });
      });

      setBulkData(valid);
      setBulkErrors(skipped);
    };

    reader.readAsArrayBuffer(file);
  };

 const handleBulkSubmit = async () => {
  if (bulkData.length === 0) {
    alert("No valid data to upload");
    return;
  }

  try {
    const res = await fetch("http://localhost:10000/data/customer/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bulkData),
    });

    const text = await res.text();
    let result = {};

    try {
      result = text ? JSON.parse(text) : {};
    } catch (parseError) {
      console.log("Non-JSON response from backend:", text);
      throw new Error("Backend did not return valid JSON");
    }

    if (!res.ok) {
      alert(result.message || "Bulk upload failed");
      return;
    }

    setBulkResult(result);
    setBulkData([]);
    setBulkErrors([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    const refreshRes = await fetch("http://localhost:10000/data/customer");
    const refreshData = await refreshRes.json();
    if (refreshRes.ok && Array.isArray(refreshData.data)) {
      setCustomers(refreshData.data);
    }
  } catch (err) {
    console.error("Bulk upload error:", err);
    alert(err.message || "Network error during upload");
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
        alert("A customer with this company name and GST number already exists.");
        setForm((prev) => ({ ...prev, ...checkData.data }));
        setLoading(false);
        return;
      }

      const payload = {
        ...form,
        customerName: form.customerName || form.customerCompanyName,
      };

      const res = await fetch("http://localhost:10000/data/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        // Shows the specific duplicate field message from the backend
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
      console.error("Submit error:", error);
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="sx-card sx-col-card" onSubmit={handleSubmit}>
      {/* ── Header ── */}
      <div className="sx-section" style={{ paddingTop: 24 }}>
        <div className="sx-section-head">
          <span className="text-white text-3xl">Customer Details</span>
        </div>
      </div>

      {/* ── Bulk Upload Strip ── */}
      <div style={{ padding: "0 24px 12px" }}>
        <div className="sx-bulk-strip">
          <div className="sx-bulk-left">
            <span className="sx-bulk-label">📂 Bulk Upload</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.csv"
              onChange={handleExcelUpload}
              className="sx-bulk-file-input"
            />
          </div>

          <div className="sx-bulk-right">
            {bulkData.length > 0 && (
              <span className="sx-bulk-count">
                ✅ {bulkData.length} row{bulkData.length !== 1 ? "s" : ""} ready
              </span>
            )}
            {bulkErrors.length > 0 && (
              <span className="sx-bulk-warn">
                ⚠ {bulkErrors.length} skipped (missing company name or GST)
              </span>
            )}
            <button
              type="button"
              onClick={handleBulkSubmit}
              className="sx-confirm-btn"
              style={{ width: "auto", padding: "0 20px", height: 38, fontSize: 13 }}
              disabled={!bulkData.length}
            >
              Upload Excel
            </button>
          </div>
        </div>

        {/* ── Bulk upload result summary ── */}
        {bulkResult && (
          <div className="sx-bulk-result">
            <span className="sx-bulk-result-inserted">
              ✅ {bulkResult.insertedCount} inserted
            </span>
            {bulkResult.rejectedCount > 0 && (
              <span className="sx-bulk-result-rejected">
                ✗ {bulkResult.rejectedCount} skipped
                {bulkResult.duplicates?.length > 0 &&
                  ` (${bulkResult.duplicates.length} duplicate${bulkResult.duplicates.length !== 1 ? "s" : ""})`}
              </span>
            )}
            <button
              type="button"
              className="sx-bulk-result-close"
              onClick={() => setBulkResult(null)}
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* ── Form Fields ── */}
      <div className="sx-fields cols-1" style={{ paddingBottom: 20 }}>
        <Field label="Company Name">
          <input
            list="customerCompanyNames"
            className="sx-input"
            onChange={updateParameter}
            name="customerCompanyName"
            placeholder="Company name"
            value={form.customerCompanyName}
          />
          <datalist id="customerCompanyNames">
            {customers.map((c) => (
              <option
                key={c._id || c.customerGstNumber}
                value={c.customerCompanyName}
              />
            ))}
          </datalist>
        </Field>

        <Field label="Customer Name">
          <input
            className="sx-input"
            onChange={updateParameter}
            name="customerName"
            placeholder="Contact person / customer name"
            value={form.customerName}
          />
        </Field>

        <Field label="Phone">
          <input
            className="sx-input"
            onChange={updateParameter}
            name="customerPhone"
            placeholder="Mobile number"
            value={form.customerPhone}
          />
        </Field>

        <Field label="Email">
          <input
            type="email"
            className="sx-input"
            onChange={updateParameter}
            name="customerEmail"
            placeholder="Email address"
            value={form.customerEmail}
          />
        </Field>

        <Field label="Address">
          <input
            className="sx-input"
            onChange={updateParameter}
            name="customerAddress"
            placeholder="Full address"
            value={form.customerAddress}
          />
        </Field>

        <Field label="Pincode">
          <input
            className="sx-input"
            onChange={updateParameter}
            name="customerPincode"
            placeholder="Postal code"
            value={form.customerPincode}
            maxLength={6}
          />
        </Field>

        <Field label="City">
          <input
            className="sx-input"
            onChange={updateParameter}
            name="customerCity"
            placeholder="City"
            value={form.customerCity}
          />
        </Field>

        <Field label="State">
          <input
            className="sx-input"
            onChange={updateParameter}
            name="customerState"
            placeholder="State"
            value={form.customerState}
          />
        </Field>

        <Field label="Country">
          <input
            className="sx-input"
            onChange={updateParameter}
            name="customerCountry"
            placeholder="Country"
            value={form.customerCountry}
          />
        </Field>

        <Field label="PAN Number">
          <input
            className="sx-input"
            onChange={updateParameter}
            name="customerPanNumber"
            placeholder="PAN number"
            value={form.customerPanNumber}
          />
        </Field>

        <Field label="GST Number">
          <input
            className="sx-input"
            onChange={updateParameter}
            name="customerGstNumber"
            placeholder="GST number"
            value={form.customerGstNumber}
          />
        </Field>

        <Field label="Price Per Kg – Document">
          <input
            type="number"
            className="sx-input"
            onChange={updateParameter}
            name="pricePerKgDocument"
            placeholder="Document price"
            value={form.pricePerKgDocument}
          />
        </Field>

        <Field label="Price Per Kg – Non Document">
          <input
            type="number"
            className="sx-input"
            onChange={updateParameter}
            name="pricePerKgNonDocument"
            placeholder="Non-document price"
            value={form.pricePerKgNonDocument}
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
