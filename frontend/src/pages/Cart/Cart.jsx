import React, { useContext } from 'react'
import './Cart.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { addToCart, cartItems, foodList, removeFromCart, removeFoodFromCart, getTotalCartAmount, url } = useContext(StoreContext);

  const navigate = useNavigate();

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Actions</p>
        </div>
        <br />
        <hr />
        {foodList.map((item) =>
          (cartItems[item._id] > 0) &&
          (
            <div key={item._id}>
              <div className='cart-items-title cart-items-item'>
                <img src={url + "/images/" + item.image} alt="" />
                <p>{item.name}</p>
                <p>${item.price}</p>
                <p>{cartItems[item._id]}</p>
                <p>{item.price * cartItems[item._id]}</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <p onClick={() => removeFromCart(item._id)} className='cross'>-</p>
                  <p onClick={() => addToCart(item._id)} className='cross'>+</p>
                  <p onClick={() => removeFoodFromCart(item._id)} className='cross'>x</p>
                </div>
              </div>
              <hr />
            </div>
          )


        )}
      </div>
      <div className="cart-bottom">
        <div className='cart-total'>
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotals</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
            </div>
          </div>
          <button onClick={() => navigate('/orders/create')}>PROCEED TO CHECKOUT</button>
        </div>
      </div>
    </div>
  )
}

export default Cart