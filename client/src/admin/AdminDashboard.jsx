// src/admin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStats(res.data);
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>

      <div style={{ display: "flex", gap: "20px" }}>
        <div>Users: {stats.users}</div>
        <div>Products: {stats.products}</div>
        <div>Services: {stats.services}</div>
      </div>
    </div>
  );
};

export default Dashboard;
