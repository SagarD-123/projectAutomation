// Login.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import { Link } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/login', { username, password });
            const { token, email, username: loggedInUsername } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('email', email);
            localStorage.setItem('username', loggedInUsername);
            navigate('/email');
        } catch (error) {
            console.error(error);
            alert('Login failed. Please check your credentials and try again.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Login</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button onClick={handleLogin}>Login</button>
                <button to="/"><Link id='Link' to="/">Back</Link></button>
            </div>
        </div>
    );
};

export default Login;
