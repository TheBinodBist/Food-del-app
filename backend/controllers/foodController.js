// import foodModel from "../modles/foodModel.js";
// import fs from 'fs'

// //add food item
// const addFood = async (req,res) => {

//     let image_filename = `${req.file.filename}`;
 

//     const food = new foodModel({
//      name:req.body.name,
//      description:req.body.description,
//      price:req.body.price,
//      category:req.body.category,
//      image:image_filename   
//   })

//     try{
//         await food.save();
//         res.json({success:true,message:"Food Added"})
//     }catch (error){
//         console.log(error)
//         res.json({success:false,message:"Error"})
//     }
// }

// // all food list
// const listFood = async (req,res) => {
//     try{

//       const foods = await foodModel.find({});
//       res.json({success:true,data:foods})
//     }catch (error){
//         console.log(error);
//         res.json({success:false,message:"Error"})
//     }

// }

// // remove food item
// const removeFood = async (req,res) => {
//     try {
//         const food = await foodModel.findById(req.body.id);
//         fs.unlink(`uploads/${food.image}`,()=>{})

//         await foodModel.findByIdAndDelete(req.body.id);
//         res.json({success:true,message:"Food Removed"})
        
//     } catch (error) {
//         console.log(error);
//         res.json({success:false,message:"Error"})
//     }

// }


// export {addFood,listFood,removeFood}


import foodModel from "../models/foodModel.js"; // Note: It's 'models' not 'modles' - you might want to correct this in your project
import fs from 'fs';

// Add food item
const addFood = async (req, res) => {
    let image_filename = `${req.file.filename}`;

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename
    });

    try {
        await food.save();
        res.json({ success: true, message: "Food Added" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// All food list
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Remove food item
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        // Safely unlink the image if it exists
        if (food && food.image) {
            fs.unlink(`uploads/${food.image}`, (err) => {
                if (err) console.error("Error unlinking image:", err);
            });
        }

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Food Removed" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// NEW FUNCTION: Update food price
const updateFoodPrice = async (req, res) => {
    try {
        const { id, price } = req.body; // Extract id and price from the request body

        // Basic validation for price
        if (price === undefined || price === null || isNaN(parseFloat(price)) || parseFloat(price) < 0) {
            return res.json({ success: false, message: "Invalid price provided." });
        }

        // Find the food item by ID and update its price
        const updatedFood = await foodModel.findByIdAndUpdate(
            id,
            { price: parseFloat(price) }, // Ensure price is a number
            { new: true, runValidators: true } // new: true returns the updated document, runValidators: true runs schema validators
        );

        if (updatedFood) {
            res.json({ success: true, message: "Food price updated successfully!", data: updatedFood });
        } else {
            // If updatedFood is null, it means the ID was not found
            res.json({ success: false, message: "Food item not found." });
        }

    } catch (error) {
        console.error("Error updating food price:", error); // Use console.error for errors
        res.json({ success: false, message: "Server error during price update." });
    }
};

// Export all functions, including the new updateFoodPrice
export { addFood, listFood, removeFood, updateFoodPrice };
