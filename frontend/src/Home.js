import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const [activeTab, setActiveTab] = useState('login');

    return (
        <div className="home-container">
            <div className="slider-container">
                <div className="slider-tabs">
                    <button className={activeTab === 'login' ? 'active' : ''} onClick={() => setActiveTab('login')}>Login</button>
                    <button className={activeTab === 'register' ? 'active' : ''} onClick={() => setActiveTab('register')}>Register</button>
                </div>
                <div className="slider-content">
                    {activeTab === 'login' && (
                        <div>
                            <h2>Login</h2>
                            <Link to="/login">Go to Login</Link>
                        </div>
                    )}
                    {activeTab === 'register' && (
                        <div>
                            <h2>Register</h2>
                            <Link to="/register">Go to Register</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
