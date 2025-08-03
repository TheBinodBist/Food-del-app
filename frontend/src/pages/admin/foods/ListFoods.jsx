import React, { useEffect, useState } from "react";
import "./ListFoods.css";
import axios from "axios";
import { toast } from "react-toastify";

const List = ({ url }) => {
  // State to store the list of food items
  const [list, setList] = useState([]);
  // State to track which food item is currently being edited (stores its _id)
  const [editingFoodId, setEditingFoodId] = useState(null);
  // State to store the price value in the input field during editing
  const [editedPrice, setEditedPrice] = useState("");

  // Fetch the list when the component mounts
  useEffect(() => {
    fetchList();
  }, [url]); 

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Error fetching food list");
      }
    } catch (error) {
      console.error("Error fetching food list:", error);
      toast.error("Failed to connect to server or fetch list");
    }
  };
  

  // Function to remove a food item
  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, {
        id: foodId,
      });
      await fetchList(); // Re-fetch the list after removal
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error("Error removing food");
      }
    } catch (error) {
      console.error("Error removing food:", error);
      toast.error("Failed to remove food item");
    }
  };

  // Function to handle the click on the "Edit" button
  const handleEditClick = (item) => {
    setEditingFoodId(item._id); // Set the ID of the item being edited
    setEditedPrice(item.price.toString()); // Set the initial price in the input field
  };

  // Function to handle the change in the price input field
  const handlePriceChange = (e) => {
    setEditedPrice(e.target.value); // Update the editedPrice state
  };

  // Function to handle the click on the "Save" button
  const handleSaveClick = async (foodId) => {
    // Validate the price input
    const priceValue = parseFloat(editedPrice);
    if (isNaN(priceValue) || priceValue < 0) {
      toast.error("Please enter a valid positive number for the price.");
      return; // Stop the function if validation fails
    }

    try {
      // Send a request to update the price.
      // Assuming your backend has an endpoint like /api/food/updatePrice
      // You might need to adjust the endpoint and method (e.g., PUT) based on your backend API.
      const response = await axios.post(`${url}/api/food/updatePrice`, {
        id: foodId,
        price: priceValue,
      });

      // Log the full response for debugging purposes
      console.log("Backend response for price update:", response);

      if (response.data.success) {
        toast.success(response.data.message || "Price updated successfully!");
        setEditingFoodId(null); // Exit editing mode
        setEditedPrice(""); // Clear the edited price state
        fetchList(); // Re-fetch the list to show the updated price
      } else {
        // If backend indicates failure but no specific message, provide a generic one
        toast.error(
          response.data.message ||
            "Failed to update price: Server reported an issue."
        );
      }
    } catch (error) {
      console.error("Error updating price:", error);
      // Provide more specific error messages based on the type of error
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error data:", error.response.data);
        console.error("Error status:", error.response.status);
        console.error("Error headers:", error.response.headers);
        toast.error(
          `Failed to update price: ${
            error.response.data.message || "Server error"
          }`
        );
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error request:", error.request);
        toast.error(
          "Failed to update price: No response from server. Check network connection or backend server status."
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
        toast.error(`Failed to update price: ${error.message}`);
      }
    }
  };

  return (
    <div className="list add flex-col">
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.length > 0 ? (
          list.map((item, index) => (
            <div key={index} className="list-table-format">
              <img src={`${url}/images/${item.image}`} alt={item.name} />
              <p>{item.name}</p>
              <p>{item.category}</p>
              {/* Conditional rendering for price */}
              {editingFoodId === item._id ? (
                <input
                  type="number"
                  value={editedPrice}
                  onChange={handlePriceChange}
                  className="price-input"
                  min="0"
                  step="0.01"
                />
              ) : (
                <p>${item.price}</p>
              )}
              <p className="actions-cell">
                {/* Conditional rendering for action buttons */}
                {editingFoodId === item._id ? (
                  <button
                    onClick={() => handleSaveClick(item._id)}
                    className="save-button"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => handleEditClick(item)}
                    className="edit-button"
                  >
                    Edit
                  </button>
                )}
                <span
                  onClick={() => removeFood(item._id)}
                  className="cursor delete-button"
                >
                  X
                </span>
              </p>
            </div>
          ))
        ) : (
          <p>No food items found.</p>
        )}
      </div>
    </div>
  );
};

export default List;
