import React from "react";

const PastOrders = ({ orders, selectedRow, setSelectedRow, handleRowClick }) => {
  return (
    <div
      className="sx-orders-section"
      style={{ marginTop: "57px", marginLeft: "120px" }}
    >
      <div className="sx-orders-header">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            className="sx-section-badge green"
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              background: "rgba(62,207,142,0.1)",
              flexShrink: 0,
            }}
          >
            📋
          </div>
          <span
            className="sx-section-title"
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.8px",
              textTransform: "uppercase",
              color: "var(--muted)",
            }}
          >
            Customer Records
          </span>
        </div>
        <span className="sx-orders-count">{orders.length} entries</span>
      </div>

      {orders.length === 0 ? (
        <div className="sx-orders-empty">
          <div style={{ fontSize: 32, marginBottom: 10 }}>📭</div>
          <div style={{ fontSize: 14, color: "var(--muted)" }}>
            No past orders yet. Add one above.
          </div>
        </div>
      ) : (
        <div className="sx-table-wrap">
          <table className="sx-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Receiver Name</th>
                <th>Delivery Address</th>
                <th>Phone</th>
                <th>State</th>
                <th>Pincode</th>
                <th>AWB</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((item, idx) => (
                <tr
                  key={idx}
                  className={selectedRow === idx ? "sx-tr-selected" : ""}
                  onClick={() => handleRowClick(item, idx)}
                  title="Click to fill receiver fields"
                >
                  <td>
                    <span className="sx-row-num">{idx + 1}</span>
                  </td>
                  <td>
                    <span className="sx-name-pill">
                      {item.receiver.name || "—"}
                    </span>
                  </td>
                  <td>{item.receiver.address || "—"}</td>
                  <td>
                    <span className="sx-mono-text">
                      {item.receiver.phone || "—"}
                    </span>
                  </td>
                  <td>{item.receiver.state || "—"}</td>
                  <td>
                    <span className="sx-mono-text">
                      {item.receiver.pincode || "—"}
                    </span>
                  </td>
                  <td>
                    <span className="sx-awb-badge">
                      {item.receiver.awb || "—"}
                    </span>
                  </td>
                  <td>
                    <span className="sx-amount-text">
                      ₹ {(
                        (item.package?.weight || 0) *
                        (item.package?.pricePerKg || 0)
                      ).toLocaleString("en-IN")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedRow !== null && (
        <div className="sx-autofill-toast">
          <span>✓</span>
          <span>
            Receiver details from row {selectedRow + 1} filled into the form
          </span>
          <button
            onClick={() => setSelectedRow(null)}
            style={{
              marginLeft: "auto",
              background: "none",
              border: "none",
              color: "var(--green)",
              cursor: "pointer",
              fontSize: 16,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default PastOrders;