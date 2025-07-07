
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {

    const [isLoggedIn,setIsLoggedIn] =useState(false);
    const navigate = useNavigate();

    useEffect(() => {
  const status = localStorage.getItem('isLoggedIn') === 'true';
  setIsLoggedIn(status);

});

  
const handleLogout=()=>{
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
}

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
      <img src="https://static.vecteezy.com/system/resources/thumbnails/030/994/838/small_2x/leave-icon-vector.jpg" width={50} height={50} alt="" />
      <h1 className="text-xl font-semibold">Leave Portal</h1>
      <div className="space-x-4">
        <Link to="/register" className="hover:text-yellow-400">Register</Link>
        {isLoggedIn ?  <button onClick={handleLogout} className="hover:text-yellow-400 ">Logout</button> : <Link to="/login" className="hover:text-yellow-400">Login</Link> }
      
      </div>
    </nav>
  );
};

export default Navbar;
