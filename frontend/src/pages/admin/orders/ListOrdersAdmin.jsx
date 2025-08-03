import React, { useContext, useEffect, useState } from "react";
import "./ListOrders.css";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../../../context/StoreContext"; 
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const ListOrdersAdmin = () => {
  const [order, setOrder] = useState([]);
  const navigate = useNavigate();
  const {userRole} = useAuth();

  const { url, token } = useContext(StoreContext);

  useEffect(() => {
    const fetchOrder = async (token) => {
      try {
        const response = await axios.get(`${url}/api/order/listAdmin`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setOrder(response.data.orders);
        }
      } catch (error) {
        console.error("Error fetching order order:", error);
        toast.error("Failed to connect to server or fetch order");
      }
    };
    fetchOrder(token);
  }, [token, url]);

  return (
    <div className="order add flex-col">
      <p>All orders order</p>
      <div className="order-table">
        <div className="order-table-format title">
          <b>Name</b>
          <b>Address</b>
          <b>Phone</b>
          <b>Total amount</b>
        </div>
        {order.length > 0 ? (
          order.map((item) => (
            <div key={item._id} className="order-table-format">
              <p>Name: {item.name}</p>
              <p>Address: {item.address}</p>
              <p>Phone: {item.phone}</p>
              <p>Total: {item.total_amount}$</p>
              <p>Order Status: {item?.order_status}</p>
              {item.orderFoods.map((food) => (
                <div key={food.food_id}>
                  <p>Food ID: {food.food_id}</p>
                  <p>Quantity: {food.quantity}</p>
                </div>
              ))}
              <button onClick={() => navigate(`/${userRole}/orders/${item._id}`)}>
                Show Order
              </button>
              <hr />
            </div>
          ))
        ) : (
          <p>No order items found.</p>
        )}
      </div>
    </div>
  );
};

export default ListOrdersAdmin;
