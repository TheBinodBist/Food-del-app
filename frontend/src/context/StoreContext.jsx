import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState("");
    const [foodList, setFoodList] = useState([])

    useEffect(() => {
        async function loadData() {
            await fetchFoodList()
            if (localStorage.getItem("currentUser")) {
                const mytoken = JSON.parse(localStorage.getItem("currentUser")).token
                setToken(mytoken); 
                localStorage.setItem("token", mytoken)
                await loadCartData(mytoken);
            }
        }
        loadData();
    }, []);

    const url = "http://localhost:4000";


    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }))
        }
        else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
        }
        if (token) {
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { Authorization: `Bearer ${token}` } })
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { Authorization: `Bearer ${token}` } })
        }
    }
    
    const removeFoodFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: 0 }))
        if (token) {
            await axios.post(url + "/api/cart/removeFood", { itemId }, { headers: { Authorization: `Bearer ${token}` } })
        }
    }
    
    const clearCart = async () => {
        setCartItems({})
        if (token) {
            await axios.get(url + "/api/cart/clear", { headers: { Authorization: `Bearer ${token}` } })
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = foodList.find((product) => product._id === item);
                totalAmount += itemInfo.price * cartItems[item];
            }
        }
        return totalAmount;
    }

    const fetchFoodList = async () => {
        const response = await axios.get(url + "/api/food/list")
        setFoodList(response.data.data)
    }

    const loadCartData = async (token) => {
        const response = await axios.post(url + "/api/cart/get", {}, { headers: { Authorization: `Bearer ${token}` } })
        setCartItems(response.data.cartData);
    }
    
    const loadOrderData = async (token) => {
        const response = await axios.get(url + "/api/order/get", {}, { headers: { Authorization: `Bearer ${token}` } })
        setCartItems(response.data.cartData);
    }




    const contextValue = {
        foodList,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        removeFoodFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
        clearCart,
        loadOrderData
    }


    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )

}

export default StoreContextProvider;