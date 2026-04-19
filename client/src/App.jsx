import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./page/LandingPage";
// import AdminDashboard from "./admin/AdminDashboard";
import GoogleSuccess from "./page/GoogleSuccess";
import ChangePassword from "./page/ChangePassword";
import ForgotPassword from "./page/ForgotPassword";
import ResetPassword from "./page/ResetPassword";
import HomePage from "./page/HomePage";

//admin 
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import Products from "./admin/Products";
import AddProduct from "./admin/AddProduct";
import EditProduct from "./admin/EditProduct";


import "./App.css";
import "./index.css";

function App() {

  return (
  <BrowserRouter>
  <Routes>

    {/* 🌍 PUBLIC */}
    <Route path="/" element={<LandingPage />} />
    <Route path="/home" element={<HomePage />} />
    <Route path="/google-success" element={<GoogleSuccess />} />
    <Route path="/change-password" element={<ChangePassword />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password/:token" element={<ResetPassword />} />

    {/* 🔐 ADMIN */}
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<AdminDashboard />} />
      <Route path="products" element={<Products />} />
      <Route path="add-product" element={<AddProduct />} />
      <Route path="edit-product/:id" element={<EditProduct />} />
    </Route>

  </Routes>
</BrowserRouter>
  );
}

export default App;
