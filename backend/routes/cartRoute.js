import express from "express"
import { addToCart, removeFromCart, removeFromTheCart, getCart, clearCart } from "../controllers/cartController.js"
import authMiddleware from "../middleware/auth.js";


const cartRouter = express.Router();

cartRouter.post("/add", authMiddleware, addToCart)
cartRouter.post("/remove", authMiddleware, removeFromCart)
cartRouter.post("/removeFood", authMiddleware, removeFromTheCart)
cartRouter.get("/clear", authMiddleware, clearCart)
cartRouter.post("/get", authMiddleware, getCart)

export default cartRouter;