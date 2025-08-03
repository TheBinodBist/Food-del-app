import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Home from "./pages/home/Home";
import Cart from "./pages/Cart/Cart";
import ShowOrder from "./pages/orders/ShowOrder";
import CreateOrder from "./pages/orders/CreateOrder";
import CreateFood from "./pages/admin/foods/CreateFood";
import ListFoods from "./pages/admin/foods/ListFoods";
import Footer from "./components/footer/Footer";
import AdminNavbar from "./components/Navbar/AdminNavbar";
import AdminSidebar from "./components/sidebar/AdminSidebar";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import LoginPopup from "./components/loginPopup/LoginPopup";
import ListOrdersAdmin from "./pages/admin/orders/ListOrdersAdmin";
import ShowOrderAdmin from "./pages/admin/orders/ShowOrderAdmin";
import ListOrders from "./pages/orders/ListOrders";
import Navbar from "./components/Navbar/Navbar";
import { StoreContext } from "./context/StoreContext";
import AddUser from "./pages/admin/AddUser";

const AppContent = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [role, setRole] = useState("");
  const { token, url } = useContext(StoreContext);
  const { isAuthenticated } = useAuth();

  // Update role when authentication status changes
  useEffect(() => {
    if (!isAuthenticated) {
      setRole("");
      return;
    }

    if (localStorage.getItem("currentUser")) {
      const loggedInUserData = localStorage.getItem("currentUser");
      const userRole = JSON.parse(loggedInUserData).role;
      setRole(userRole);
    }
  }, [isAuthenticated, token]);

return (
  <>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      {(role === "admin" || role === "deliverer") && (
        <>
          <Navbar />
          <hr />
        </>
      )}
      <div className={`app ${role === "admin" ? "admin-content" : role === "deliverer" ? "admin-content" : ""}`}>
        <ToastContainer />

        {(role === "user" || role === "") && (
          <Navbar setShowLogin={setShowLogin} />
        )}

        {(role === "admin" || role === "deliverer") && <AdminSidebar />}
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={role === "admin" ? <ListOrdersAdmin url={url} /> : role === "deliverer" ? <ListOrdersAdmin url={url} /> : <Home />}
          />

          <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders/create" element={<CreateOrder />} />
            <Route path="/orders" element={<ListOrders url={url} />} />
            <Route path="/orders/:orderId" element={<ShowOrder />} />
          </Route>

          <Route path="/orders/:orderId" element={<ShowOrder />} />

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route
              path="/admin/foods/create"
              element={<CreateFood url={url} />}
            />
            <Route path="/admin/foods" element={<ListFoods url={url} />} />
            <Route path="/admin/orders" element={<ListOrdersAdmin url={url} />} />
            <Route path="/admin/orders/:orderId" element={<ShowOrderAdmin />} />
            <Route path="/admin/users/create" element={<AddUser />} />
          </Route>

           {/* Deliverer Routes */}
          <Route element={<ProtectedRoute allowedRoles={["deliverer"]} />}>
            <Route
              path="/deliverer/orders"
              element={<ListOrdersAdmin url={url} />}
            />
            <Route path="/deliverer/orders/:orderId" element={<ShowOrderAdmin />} />
          </Route>
        </Routes>
      </div>
      <Footer />
      </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
