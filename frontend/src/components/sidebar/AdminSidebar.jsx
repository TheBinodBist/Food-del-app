import React from "react";
import "./AdminSidebar.css";
import { assets } from "../../assets/adminAssets/assets";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminSidebar = () => {
  const { userRole } = useAuth();
  
  return (
    <div className="sidebar">
      <div className="sidebar-options">
        {userRole === "admin" && (
          <NavLink to="/admin/foods/create" className="sidebar-option">
            <img src={assets.add_icon} alt="add items" />
            <p>Add Food</p>
          </NavLink>
        )}

        {userRole === "admin" && (
          <NavLink to="/admin/foods" className="sidebar-option">
            <img src={assets.order_icon} alt="items" />
            <p>Food Items</p>
          </NavLink>
        )}

        <NavLink to={userRole === "admin" ? "/admin/orders" : userRole === "deliverer" ? "/deliverer/orders" : "/"} className="sidebar-option">
          <img src={assets.add_icon} alt="orders" />
          <p>Orders</p>
        </NavLink>

         {userRole === "admin" && (
          <NavLink to="/admin/users/create" className="sidebar-option">
            <img src={assets.add_icon} alt="items" />
            <p>Add User</p>
          </NavLink>
        )}

      </div>
    </div>
  );
};

export default AdminSidebar;
