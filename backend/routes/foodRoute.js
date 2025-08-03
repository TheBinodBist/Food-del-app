import express from "express";
// Import the new updateFoodPrice function along with existing ones
import { addFood, listFood, removeFood, updateFoodPrice } from "../controllers/foodController.js";
import multer from "multer";

const foodRouter = express.Router();

// Image Storage Engine (existing code)
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// Existing routes
foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.post("/remove", removeFood);

// NEW ROUTE: Endpoint for updating food price
// This route will handle POST requests to /api/food/updatePrice
// It expects a JSON body with 'id' and 'price'
foodRouter.post("/updatePrice", updateFoodPrice);

export default foodRouter;

