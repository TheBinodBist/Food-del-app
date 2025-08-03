import React, { useContext } from 'react' // <--- Add useContext here
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../foodItem/FoodItem'

const FoodDisplay = ({category}) => {

    const {foodList} = useContext(StoreContext)

  return (
  
      <div className='food-display' id ='food-display'>
        <h2>Top dishes near you</h2>
        <div className="food-display-list">

           {foodList.map((item,index) =>{

            if (category==="All" || category===item.category) {
               return <FoodItem key={index} id={item._id} name={item.name} description={item.description}  price={item.price}
            image={item.image} />
            }

           

           })} 
        </div>
      </div>
  
  )
}

export default FoodDisplay
