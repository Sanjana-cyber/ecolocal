import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

/* ── Mock data (replace with real API calls) ─────────────── */
const PRODUCTS = [
  { id: 1, name: "Bamboo Kitchen Set",   tag: "Zero Waste",   price: "₹850",  seller: "GreenCraft Co." },
  { id: 2, name: "Organic Cotton Tote",  tag: "Handmade",     price: "₹320",  seller: "EcoWeave Studio" },
  { id: 3, name: "Beeswax Wrap Pack",    tag: "Plastic Free", price: "₹540",  seller: "HiveLocal" },
  { id: 4, name: "Clay Plant Pots",      tag: "Artisan",      price: "₹720",  seller: "Terra Crafts" },
  { id: 5, name: "Herb Seed Kit",        tag: "Garden",       price: "₹290",  seller: "RootLocal" },
  { id: 6, name: "Soy Wax Candles",      tag: "Eco Home",     price: "₹460",  seller: "WarmLight" },
];

const SERVICES = [
  { id: 1, icon: "🔧", name: "Home Repair",    desc: "Local handymen & repair experts" },
  { id: 2, icon: "📚", name: "Tutoring",       desc: "Community teachers & mentors" },
  { id: 3, icon: "🌿", name: "Garden Help",    desc: "Gardeners & composting experts" },
  { id: 4, icon: "🐾", name: "Pet Care",       desc: "Dog walkers & pet sitters" },
  { id: 5, icon: "🍳", name: "Home Cooking",   desc: "Local chefs & meal prep" },
  { id: 6, icon: "♻️", name: "Upcycling",      desc: "Repurposing & creative reuse" },
];

const ACTIVITY = [
  { id: 1, icon: "🛍️", title: "Order placed — Bamboo Kitchen Set",  time: "2 hours ago" },
  { id: 2, icon: "⭐", title: "You reviewed EcoWeave Studio",         time: "Yesterday" },
  { id: 3, icon: "📦", title: "Your package is out for delivery",     time: "2 days ago" },
  { id: 4, icon: "💬", title: "New message from GreenCraft Co.",     time: "3 days ago" },
  { id: 5, icon: "🌱", title: "Eco badge earned — 10 green orders!", time: "1 week ago" },
];

/* ── Sidebar Link ────────────────────────────────────────── */
const SideLink = ({ to, icon, label, active }) => (
  <Link to={to} className={`sidebar-link${active ? " active" : ""}`}>
    <span className="sidebar-link-icon">{icon}</span>
    {label}
  </Link>
);

/* ── Home Page ───────────────────────────────────────────── */
const HomePage = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Eco User");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div className="home-layout">

      {/* ── Sidebar ── */}
      <aside className="home-sidebar">
        <div className="sidebar-logo">EcoLocal</div>

        <p className="sidebar-label">Explore</p>
        <nav className="sidebar-nav">
          <SideLink to="/home"         icon="🏠" label="Dashboard"  active />
          <SideLink to="/products"     icon="🛍️" label="Products"          />
          <SideLink to="/services"     icon="🔧" label="Services"          />
          <SideLink to="/sellers"      icon="🏪" label="Local Sellers"     />
          <SideLink to="/map"          icon="📍" label="Nearby"            />
        </nav>

        <p className="sidebar-label">Account</p>
        <nav className="sidebar-nav">
          <SideLink to="/orders"       icon="📦" label="My Orders"         />
          <SideLink to="/wishlist"     icon="❤️" label="Wishlist"          />
          <SideLink to="/profile"      icon="👤" label="Profile"           />
          <SideLink to="/settings"     icon="⚙️" label="Settings"         />
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-user" onClick={handleLogout} title="Logout">
            <div className="sidebar-avatar">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="sidebar-user-info">
              <strong>{userName}</strong>
              <span>Sign out →</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="home-main">

        {/* Top bar */}
        <div className="home-topbar">
          <div className="home-topbar-left">
            <h1>Good morning, <em>{userName.split(" ")[0]}</em> 🌿</h1>
            <p>Here's what's happening in your eco community today.</p>
          </div>
          <div className="home-topbar-right">
            <button className="btn-outline-sm">🔔 Alerts</button>
            <button className="btn-green-sm">+ List Item</button>
          </div>
        </div>

        {/* Stats row */}
        <div className="home-stats">
          <div className="stat-card">
            <div className="stat-card-top">
              <span className="stat-card-label">Eco Orders</span>
              <div className="stat-card-icon">🛍️</div>
            </div>
            <div className="stat-card-value">14</div>
            <div className="stat-card-sub"><span className="up">↑ 3</span> this month</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-top">
              <span className="stat-card-label">CO₂ Saved</span>
              <div className="stat-card-icon">🌍</div>
            </div>
            <div className="stat-card-value">8.4<span style={{ fontSize: "1rem" }}>kg</span></div>
            <div className="stat-card-sub">vs. regular shopping</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-top">
              <span className="stat-card-label">Local Support</span>
              <div className="stat-card-icon">🏪</div>
            </div>
            <div className="stat-card-value">₹3.2k</div>
            <div className="stat-card-sub">paid to local sellers</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-top">
              <span className="stat-card-label">Eco Score</span>
              <div className="stat-card-icon">🌿</div>
            </div>
            <div className="stat-card-value">92</div>
            <div className="stat-card-sub"><span className="up">↑ 5pts</span> this week</div>
          </div>
        </div>

        {/* Products + Activity */}
        <div className="home-grid">

          <div>

            {/* Products */}
            <div className="home-section-title">
              Featured Products
              <Link to="/products">View all →</Link>
            </div>
            <div className="products-grid">
              {PRODUCTS.map(p => (
                <div className="product-card" key={p.id}>
                  <div className="product-card-img" />
                  <div className="product-card-body">
                    <p className="product-card-tag">{p.tag}</p>
                    <p className="product-card-name">{p.name}</p>
                    <div className="product-card-meta">
                      <span className="product-card-price">{p.price}</span>
                      <span className="product-card-seller">{p.seller}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Services */}
            <div className="home-section-title" style={{ marginTop: "2rem" }}>
              Local Services
              <Link to="/services">View all →</Link>
            </div>
            <div className="services-grid">
              {SERVICES.map(s => (
                <div className="service-card" key={s.id}>
                  <div className="service-card-icon">{s.icon}</div>
                  <p className="service-card-name">{s.name}</p>
                  <p className="service-card-desc">{s.desc}</p>
                </div>
              ))}
            </div>

          </div>

          {/* Activity sidebar */}
          <div className="home-activity">
            <p className="activity-title">Recent Activity</p>
            {ACTIVITY.map(a => (
              <div className="activity-item" key={a.id}>
                <div className="activity-dot">{a.icon}</div>
                <div className="activity-info">
                  <strong>{a.title}</strong>
                  <span>{a.time}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
      {/* Footer inside home page */}
      <Footer />
    </div>
  );
};

export default HomePage;
