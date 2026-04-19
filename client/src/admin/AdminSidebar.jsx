// src/admin/AdminSidebar.jsx
import React from "react";
import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div style={{ width: "220px", background: "#111", color: "#fff", height: "100vh", padding: "20px" }}>
      <h2>Admin Panel</h2>

      <ul style={{ listStyle: "none", padding: 0 }}>
        <li><Link to="/admin/dashboard">Dashboard</Link></li>
        <li><Link to="/admin/products">Products</Link></li>
        <li><Link to="/admin/services">Services</Link></li>
        <li><Link to="/admin/users">Users</Link></li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
