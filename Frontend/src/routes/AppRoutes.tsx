import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Home from "../pages/Home";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Orders from "../pages/Orders";
import ProductDetail from "../pages/ProductDetail";
import Settings from "../pages/Settings";
import Wishlist from "../pages/Wishlist";
import Login from "../pages/Login";
import { Register } from "../pages/Register";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Shop from "@/pages/Shop";
import SellItems from "@/pages/Sell";
import HowItWorks from "@/pages/HowItWorks";
import SellForm from "@/pages/SellForm";
import Offers from "@/pages/Offers";
import { ContactForm } from "@/pages/Settings/forms/personalInfo";
import ChangePasswordForm from "@/pages/Settings/forms/changePassword";
import AddressesForm from "@/pages/Settings/forms/addAddress";
import EditAddressForm from "@/pages/Settings/forms/editAddress";
import Address from "@/pages/Settings/address";

import AdminLayout from "@/layouts/AdminLayout";
import AdminPage from "@/pages/Admin";
import AdminProductsPage from "@/pages/Admin/AdminProduct";
import AdminProductDetail from "@/pages/Admin/AdminProductDetail";
import AdminOrdersPage from "@/pages/Admin/AdminOrders";
import AdminOrderDetail from "@/pages/Admin/AdminOrderDetail";
import AdminContacts from "@/pages/Admin/AdminContactsNew";
import AdminContactDetailNew from "@/pages/Admin/AdminContactDetailNew";

const AppRoutes = () => (
  <Routes>
    {/* Public routes */}
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Register />} />

    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/how-it-works" element={<HowItWorks />} />
    <Route path="/shop" element={<Shop />} />
    <Route path="/offers" element={<Offers />} />
    <Route path="/product/:id" element={<ProductDetail />} />
    <Route path="/" element={<Home />} />
    <Route path="*" element={<h2>404 - Page Not Found</h2>} />

    {/* Protected routes */}
    <Route element={<ProtectedRoute />}>
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="products/:id" element={<AdminProductDetail />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="orders/:id" element={<AdminOrderDetail />} />
        <Route path="contacts" element={<AdminContacts />} />
        <Route path="contacts/:contactId" element={<AdminContactDetailNew />} />
      </Route>

      {/* User Routes */}
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/sell" element={<SellItems />} />
      <Route path="/sell/form" element={<SellForm />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/settings/addresses" element={<Address />} />
      <Route path="/settings/add-address" element={<AddressesForm />} />
      <Route
        path="/settings/edit-address/:addressId"
        element={<EditAddressForm />}
      />
      <Route path="/settings/personal-info" element={<ContactForm />} />
      <Route path="/settings/reset-password" element={<ChangePasswordForm />} />
      <Route path="/wishlist" element={<Wishlist />} />
    </Route>
  </Routes>
);

export default AppRoutes;
