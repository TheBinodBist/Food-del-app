import express from "express";
import cors from "cors"; // cross-origin resource sharing
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import orderRouter from "./routes/orderRoute.js";
import cartRouter from "./routes/cartRoute.js";
import "dotenv/config";
import bcrypt from "bcrypt";
import userModel from "./models/userModel.js"; // Import your model

// app config
const app = express();
const port = 4000;

// middleware
app.use(express.json());
app.use(cors());

// db connection
connectDB();

// api endpoints 
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
    res.send("API Working");
});

// Function to create admin if it doesn't exist
const createAdminIfNotExists = async () => {
    const adminEmail = "admin@admin.com";
    const existingAdmin = await userModel.findOne({ email: adminEmail });
    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash("123456789", 10);
        await userModel.create({
            name: "Super Admin",
            email: adminEmail,
            password: hashedPassword,
            role: "admin"
        });
        console.log(" Admin account created:", adminEmail);
    } else {
        console.log("ℹ️ Admin account already exists:", adminEmail);
    }
};

app.listen(port, async () => {
    await createAdminIfNotExists(); // Create admin if missing
    console.log(`🚀 Server Started on http://localhost:${port}`);
    console.log(`💻 Frontend address: http://localhost:5173/`);
});
