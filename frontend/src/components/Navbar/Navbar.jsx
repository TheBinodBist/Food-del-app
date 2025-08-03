import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { useAuth } from "../../context/AuthContext";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("menu");
  const { getTotalCartAmount } = useContext(StoreContext);
  const { logout, isAuthenticated, userRole } = useAuth();
  const navigate = useNavigate();

  // Reset menu state when auth status changes
  useEffect(() => {
    setMenu("menu");
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      setMenu("menu");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="navbar">
      <Link to="/">
        <img src={assets.logo} alt="" className="logo" />
      </Link>
      <ul className="navbar-menu">
        <Link
          to="/"
          onClick={() => setMenu("home")}
          className={menu === "home" ? "active" : ""}
        >
          home
        </Link>
        {isAuthenticated && (
          <Link
            to={userRole === "admin" ? "/admin/orders" : userRole === "deliverer" ? "/deliverer/orders" : "/orders"}
            onClick={() => setMenu("Order List")}
            className={menu === "mobile-app" ? "active" : ""}
          >
            Order List
          </Link>
        )}
        <a
          href="#footer"
          onClick={() => setMenu("contact-us")}
          className={menu === "contact-us" ? "active" : ""}
        >
          contact us
        </a>
      </ul>

      <div className="navbar-right">
        {userRole === "user" && isAuthenticated && (
          <div className="navbar-search-icon">
            <Link to="/cart">
              <img src={assets.basket_icon} alt="" />
            </Link>
            <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
          </div>
        )}
        {!isAuthenticated ? (
          <button onClick={() => setShowLogin(true)}>
            sign in
            <div className="star-1">⭐</div>
            <div className="star-2">✨</div>
            <div className="star-3">🌟</div>
            <div className="star-4">💫</div>
            <div className="star-5">🌠</div>
            <div className="star-6">✨</div>
          </button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="" />
            <ul className="navbar-profile-dropdown">
              <li>
                <Link to={userRole === "admin" ? "/admin/orders" : "/orders"}>
                  <img src={assets.bag_icon} alt="" />
                  <p>Orders</p>
                </Link>
              </li>
              <hr />
              <li onClick={handleLogout}>
                <img src={assets.logout_icon} alt="logout" />
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
