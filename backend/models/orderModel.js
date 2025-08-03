import mongoose from "mongoose";

// const orderFoodSchema = new mongoose.Schema({
//   food_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     ref: 'foodModel'
//   },
//   price: { type: Number, required: false },
//   quantity: { type: Number, required: false }
// }, { _id: false });

const orderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  total_amount: { type: Number, required: false },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "userModel",
  },
  deliverer_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "userModel",
    default: null
  },
  order_status: {
    type: String,
    required: false,
    enum: [
      "Pending",
      "Processing",
      "Confirmed",
      "Ready For Pickup",
      "Out For Delivery",
      "Delivered",
      "Rejected"
    ],
    default: "Pending"
  },
  location: {
    type: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    required: false,
  },
  orderFoods: { type: Array, default: [] },
});

const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;