import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(false);
  const [activeDelivery, setActiveDelivery] = useState(null);

  return (
    <>

      <div className="hx-root">
        <div className="hx-orb1" />
        <div className="hx-orb2" />

        {/* ── NAV ── */}
        <nav className="hx-nav">
          <Link to="/" className="hx-brand">
            <div className="hx-brand-icon">📦</div>
            <div className="hx-brand-name">Ship<span>X</span></div>
          </Link>

          <div className="hx-nav-links">
            <button className="hx-nav-btn" onClick={() => navigate("/consignment")}>
              Consignment
            </button>
            <button className="hx-nav-btn">
              Past Orders
            </button>
          </div>

          <button className="hx-logout-btn" onClick={() => navigate("/login")}>
            Logout
          </button>
        </nav>

        {/* ── BODY ── */}
        <div className="hx-body">

          {/* Hero row */}
          <div className="hx-hero">
            <div>
              <div className="hx-greeting-sub">Dashboard</div>
              <div className="hx-greeting-name">Hi, Aditya 👋</div>
              <div className="hx-greeting-loc">
                <span>📍</span> Whitefield, Bangalore
              </div>
            </div>

            <button
              className={`hx-online-toggle ${isOnline ? "online" : "offline"}`}
              onClick={() => setIsOnline(!isOnline)}
            >
              <span className="hx-toggle-dot" />
              {isOnline ? "Online" : "Offline"}
            </button>
          </div>

          {/* Stats */}
          <div className="hx-stats">
            <div className="hx-stat">
              <div className="hx-stat-label">Orders</div>
              <div className="hx-stat-value">5</div>
            </div>
            <div className="hx-stat">
              <div className="hx-stat-label">Earnings</div>
              <div className="hx-stat-value accent">₹850</div>
            </div>
            <div className="hx-stat">
              <div className="hx-stat-label">Rating</div>
              <div className="hx-stat-value green">4.8★</div>
            </div>
          </div>

          {/* Status banner */}
          {!isOnline && (
            <div className="hx-status-banner">
              <div className="hx-status-icon">🚚</div>
              <div className="hx-status-text">
                <div className="hx-status-title">You're currently offline</div>
                <div className="hx-status-sub">Go online to receive new delivery requests</div>
              </div>
              <button className="hx-go-online-btn" onClick={() => setIsOnline(true)}>
                Go Online
              </button>
            </div>
          )}

          {isOnline && (
            <div className="hx-status-banner" style={{ borderColor: "rgba(62,207,142,0.2)", background: "rgba(62,207,142,0.04)" }}>
              <div className="hx-status-icon" style={{ background: "rgba(62,207,142,0.1)" }}>✅</div>
              <div className="hx-status-text">
                <div className="hx-status-title" style={{ color: "var(--green)" }}>You're online</div>
                <div className="hx-status-sub">Waiting for new delivery requests…</div>
              </div>
            </div>
          )}

          {/* Quick actions */}
          <div>
            <div className="hx-section-label">Quick Actions</div>
            <div className="hx-actions">
              <div className="hx-action-card" onClick={() => navigate("/consignment")}>
                <div className="hx-action-icon orange">📦</div>
                <div>
                  <div className="hx-action-title">New Consignment</div>
                  <div className="hx-action-sub">Create a shipment order</div>
                </div>
              </div>

              <div className="hx-action-card">
                <div className="hx-action-icon blue">📋</div>
                <div>
                  <div className="hx-action-title">Past Orders</div>
                  <div className="hx-action-sub">View order history</div>
                </div>
              </div>

              <div className="hx-action-card">
                <div className="hx-action-icon green">💰</div>
                <div>
                  <div className="hx-action-title">Earnings</div>
                  <div className="hx-action-sub">Track your income</div>
                </div>
              </div>

              <div className="hx-action-card">
                <div className="hx-action-icon pink">👤</div>
                <div>
                  <div className="hx-action-title">Profile</div>
                  <div className="hx-action-sub">Manage your account</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Home;
