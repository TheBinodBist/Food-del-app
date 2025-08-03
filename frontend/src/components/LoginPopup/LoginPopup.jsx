import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import axios from "axios"
import { useAuth } from '../../context/AuthContext' // <-- Import useAuth

const LoginPopup = ({ setShowLogin }) => {
    const { url, setToken } = useContext(StoreContext)
    const { login } = useAuth()

    const [currState, setCurrState] = useState("Login")
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        role: "user"
    })

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setData(data => ({ ...data, [name]: value }))
    }

    const onLogin = async (event) => {
        event.preventDefault()
        try {
            let newUrl = url
            if (currState === "Login") {
                newUrl += "/api/user/login"
            } else {
                newUrl += "/api/user/register"
            }
            const response = await axios.post(newUrl, data)
            
            if (response.data.success) {
                if (currState === "Login") {
                    setToken(response.data.token); 
                    login({
                        token: response.data.token,
                        role: response.data.role,
                        email: response.data.email || data.email,
                        name: response.data.name || data.name
                    });
                }
                setShowLogin(false);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            alert("An error occurred during login. Please try again." + error);
        }
    }

    return (
        <div className='login-popup'>
            <form onSubmit={onLogin} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
                </div>
                <div className="login-popup-inputs">
                    {currState === "Login" ? <></> : <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your name' required />}
                    <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' required />
                    <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
                </div>
                <button type='submit'>
                    {currState === "Sign Up" ? "Create account " : "Login"}
                </button>
                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>By continuing, i agree to the terms of use & privacy policy.</p>
                </div>
                {currState === "Login"
                    ? <p>Create a new account? <span onClick={() => setCurrState("Sign Up")}>Click here</span></p>
                    : <p>Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span> </p>
                }
            </form>
        </div>
    )
}

export default LoginPopup
