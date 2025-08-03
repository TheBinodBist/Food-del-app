import React, { useContext, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AddUser.css';

const AddUser = () => {
    const { url } = useContext(StoreContext);
    const { token } = useAuth();
    
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'deliverer'
    });

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${url}/api/user/admin/register`,
                userData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.data.success) {
                toast.success('User created successfully!');
                setUserData({
                    name: '',
                    email: '',
                    password: '',
                    role: 'deliverer'
                });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create user');
        }
    };

    return (
        <div className="add-user-container">
            <h2>Add New User</h2>
            <form onSubmit={handleSubmit} className="add-user-form">
                <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={userData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={userData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="role">Role</label>
                    <select
                        id="role"
                        name="role"
                        value={userData.role}
                        onChange={handleChange}
                        required
                    >
                        <option value="deliverer">Deliverer</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <button type="submit" className="submit-btn">
                    Add User
                </button>
            </form>
        </div>
    );
};

export default AddUser;