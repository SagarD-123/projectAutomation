// import React from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import Login from './Login';
// import Register from './Register';
// import Home from './Home';
// import Email from './Email';
// import Calendar from 'react-calendar';
// import './App.css';

// const App = () => {
//     const isLoggedIn = !!localStorage.getItem('token');
//     const username = localStorage.getItem('username'); // Assume username is stored in local storage
//     console.log(username);

//     const handleLogout = () => {
//         localStorage.removeItem('token');
//         localStorage.removeItem('username');
//         window.location.href = '/login';
//     };
  

//     return (
//         <Router>
//             <div className="app-container">
//                 <div className="sidebar">
//                     <div className="user-info">
//                         <button onClick={handleLogout}>Logout</button>
//                     </div>
//                     <p>{username}</p>
                   
//                     <div className="calendar">
//                         <Calendar />
//                     </div>
//                 </div>
//                 <div className="content">
//                     <nav className="navbar">
//                         <ul>
//                             <li><a href="/email">Send Email</a></li>
                            
                           
//                         </ul>
//                     </nav>
//                     <div className="main-content">
//                         <Routes>
//                             <Route path="/" element={<Home />} />
//                             <Route path="/login" element={<Login />} />
//                             <Route path="/register" element={<Register />} />
//                             <Route path="/email" element={isLoggedIn ? <Email /> : <Navigate to="/login" />} />
//                         </Routes>
//                     </div>
//                 </div>
//             </div>
//         </Router>
//     );
// };

// export default App;


// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import Email from './Email';
import Calendar from 'react-calendar';
import './App.css';

const App = () => {
    const isLoggedIn = !!localStorage.getItem('token');
    const username = localStorage.getItem('username');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('username');
        window.location.href = '/login';
    };

    return (
        <Router>
            <div className="app-container">
                <div className="sidebar">
                    <div className="user-info">
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                    <p>Username: {username}</p>
                   
                    <div className="calendar">
                        <Calendar />
                    </div>
                </div>
                <div className="content">
                    <nav className="navbar">
                        <ul>
                            <li><a href="/email">Send Email</a></li>
                            
                           
                        </ul>
                    </nav>
                    <div className="main-content">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/email" element={isLoggedIn ? <Email /> : <Navigate to="/login" />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </Router>
    );
};

export default App;
