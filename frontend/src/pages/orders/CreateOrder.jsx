import React, { useContext } from "react";
import "./CreateOrder.css";
import { StoreContext } from "../../context/StoreContext";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const url = "http://localhost:4000";

const CreateOrder = () => {
  const navigate = useNavigate();
  const { getTotalCartAmount, cartItems, token, clearCart } =
    useContext(StoreContext);

  const [data, setData] = useState({
    name: "",
    total_amount: "",
    phone: "",
    address: "",
    orderFoods: [
      {
        food_id: "",
        price: "",
        quantity: "",
      },
    ],
  });

  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!location) {
      toast.error("Please allow location access to continue");
      return;
    }

    let total_amount = getTotalCartAmount() + 2;
    let items = cartItems;

    let orderItems = Object.entries(items).map(([food_id, quantity]) => ({
      food_id: food_id,
      quantity: quantity,
    }));

    const payload = {
      ...data,
      total_amount,
      orderFoods: orderItems,
      location: location,
    };

    setData((data) => ({ ...data, total_amount, orderFoods: orderItems }));

    try {
      const response = await axios.post(`${url}/api/order/`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success(response.data.success);
        clearCart();
        setIsSubmitted(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to create order: " + error.message);
    }
  };

  const getCurrentLocation = () => {
    setIsLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setIsLoading(false);
        },
        (error) => {
          toast.error("Error getting location: " + error.message);
          setIsLoading(false);
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
      setIsLoading(false);
    }
  };

  return (
    <>
      <form className="place-order" onSubmit={onSubmitHandler}>
        <div className="place-order-left">
          <p className="title">Delivery Information</p>
          <div className="multi-fields">
            <input
              type="text"
              name="name"
              placeholder="Full name"
              onChange={onChangeHandler}
              value={data.name}
            />
          </div>

          <input
            type="phone"
            name="phone"
            placeholder="Phone no."
            onChange={onChangeHandler}
            value={data.phone}
          />
          <input
            type="text"
            name="address"
            placeholder="address"
            onChange={onChangeHandler}
            value={data.address}
          />
          <div className="location-section">
            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={isLoading}
            >
              {isLoading ? "Getting Location..." : "Get Current Location"}
            </button>
            {location && <p className="location-status">Location acquired ✓</p>}
          </div>
        </div>
        <div className="place-order-right">
          <div className="cart-total">
            <h2>Cart Totals</h2>
            <div>
              <div className="cart-total-details">
                <p>Subtotals</p>
                <p>${getTotalCartAmount()}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <b>Total</b>
                <b>
                  ${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}
                </b>
              </div>
            </div>

            {location && !isSubmitted && <button type="submit">Order</button>}
          </div>
        </div>
      </form>
      {isSubmitted && (
        <>
          <p className="order-success">Order placed successfully!</p>
          <button
            className="location-status"
            onClick={() => navigate("/orders")}
          >
            View your Orders
          </button>
        </>
      )}
    </>
  );
};

export default CreateOrder;
