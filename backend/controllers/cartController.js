import userModel from "../models/userModel.js"

// add items to user cart 
const addToCart = async (req,res) =>{
    try {
        let userData = await userModel.findById(req.userId);
        let cartData = await userData.cartData;
        if(!cartData[req.body.itemId])
        {
            cartData[req.body.itemId] = 1
        }

        else {
            cartData[req.body.itemId] += 1;
        }
        await userModel.findByIdAndUpdate(req.userId,{cartData});
        res.json({success:true,message:"Added to Cart"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }

}

// remove items from user cart
const removeFromCart = async (req,res) => {
    try {
        let userData = await userModel.findById(req.userId)
        let cartData = await userData.cartData;
        if (cartData[req.body.itemId] > 0) {
            cartData[req.body.itemId] -= 1;    
        }
        await userModel.findByIdAndUpdate(req.userId,{cartData})
        res.json({success:true,message:"Removed From Cart"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})

    }
}

const removeFromTheCart = async (req,res) => {
    try {
        let userId = req.userId
        const itemIdToRemove = req.body.itemId; // This is the key (e.g., '6881f99c27bb19c088292673') to remove from cartData

        // Construct the field path for $unset.
        // It should be 'cartData.<the_item_id_to_remove>'
        const unsetFieldPath = `cartData.${itemIdToRemove}`;

        await userModel.findByIdAndUpdate(
            userId,
            { $unset: { [unsetFieldPath]: "" } }, // Use dynamic key for $unset
            { new: true } // Option to return the updated document
        );

        res.json({success:true,message:"Removed From Cart"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})

    }
}

const clearCart = async (req,res) => {
    try {
        let userId = req.userId

        // Construct the field path for $unset.
        const unsetFieldPath = "cartData";

        await userModel.findByIdAndUpdate(
            userId,
            { $unset: { [unsetFieldPath]: "" } }, // Use dynamic key for $unset
            { new: true } // Option to return the updated document
        );

        res.json({success:true,message:"Cart Cleared!!"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})

    }
}

// fetch user cart data
const getCart = async (req,res) => {
    try {
        let userData = await userModel.findById(req.userId);
        let cartData = await userData.cartData;
        
        res.json({success:true,cartData})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    } 
}

export {addToCart, removeFromCart, removeFromTheCart, getCart, clearCart}