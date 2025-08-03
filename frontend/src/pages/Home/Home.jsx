import React, { useState } from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import ExploreMenu from '../../components/exploreMenu/ExploreMenu'
import FoodDisplay from '../../components/foodDisplay/FoodDisplay'


const Home = () => {

  const [category, setCategory] = useState("All")

  return (
    <div>
      <Header/>
      <ExploreMenu category = {category} setCategory={setCategory} />
      <FoodDisplay category={category} />
    </div>
  )
}

export default Home
