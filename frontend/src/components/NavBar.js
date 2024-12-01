import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/NavBar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="navbar">
      <div className="navbar-content">
        <div className="navbar-title">RetailQ</div>
        <button className="navbar-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
