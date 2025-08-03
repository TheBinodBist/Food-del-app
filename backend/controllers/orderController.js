import orderModel from "../models/orderModel.js";

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { name, total_amount, phone, address, location, orderFoods } =
      req.body;

    const newOrder = new orderModel({
      name,
      total_amount,
      phone,
      address,
      userId: req.userId,
      location,
      orderFoods,
    });

    await newOrder.save();

    res.status(201).json({ success: "created order", order: newOrder });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all orders for user
const getOrdersOfUser = async (req, res) => {
  const userId = req.userId;
  try {
    const orders = await orderModel.find({ userId });
    res.status(200).json({ orders, success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all orders for admin
const getOrders = async (req, res) => {
  try {
    if (req.user.role === "deliverer") {
      const orders = await orderModel.find({ deliverer_id: req.userId });
      if (!orders)
        return res
          .status(404)
          .json({ error: "No orders found for this deliverer" });
      return res.status(200).json({ orders, success: true });
    }

    if (req.user.role === "admin") {
      const orders = await orderModel.find();
      res.status(200).json({ orders, success: true });
      if (!orders) return res.status(404).json({ error: "No orders found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);
    if (
      req.userId === order.userId.toString() ||
      req.user.role === "admin" ||
      req.user.role === "deliverer"
    ) {
      res.status(200).json({ order, success: true });
    }
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.status(403).json({ error: "Not authorized" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single order by ID
const getOrdersByUserId = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an order by ID
const updateOrder = async (req, res) => {
  try {
    const updatedOrder = await orderModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedOrder)
      return res.status(404).json({ error: "Order not found" });
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete an order by ID
const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await orderModel.findByIdAndDelete(req.params.id);
    if (!deletedOrder)
      return res.status(404).json({ error: "Order not found" });
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { order_status } = req.body;
    const orderId = req.params.id;

    if (!order_status) {
      return res.status(400).json({
        success: false,
        message: "Order status is required",
      });
    }

    const order = await orderModel.findByIdAndUpdate(
      orderId,
      { order_status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating order status",
      error: error.message,
    });
  }
};

const assignDeliverer = async (req, res) => {
  try {
    const { deliverer_id } = req.body;
    const orderId = req.params.id;

    if (!deliverer_id) {
      return res.status(400).json({
        success: false,
        message: "Deliverer ID is required",
      });
    }

    const order = await orderModel.findByIdAndUpdate(
      orderId,
      {
        deliverer_id,
        order_status: "Out For Delivery",
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Deliverer assigned successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error assigning deliverer",
      error: error.message,
    });
  }
};

export {
  createOrder,
  getOrders,
  getOrdersOfUser,
  getOrderById,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
  assignDeliverer,
};
