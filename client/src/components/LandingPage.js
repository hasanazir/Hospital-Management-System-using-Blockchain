import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    // Handle the button click for login redirection
    const redirectToLogin = () => {
        navigate('/login'); // Assuming you have a separate route for the login page
    };

    return (
        <div>
            <h1>Welcome to the Hospital Management System</h1>
            <p>A project developed by ZYNO and team</p>
            <nav>
                <ul>
                    <li><Link to="/register-hospital">Hospital Registration</Link></li>
                    <li><Link to="/register-doctor">Doctor Registration</Link></li>
                    <li><Link to="/register-patient">Patient Registration</Link></li>
                </ul>
            </nav>

            {/* Add the login button */}
            <button onClick={redirectToLogin}>Login</button>
        </div>
    );
};

export default LandingPage;
