import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { pendingRequestLeaves } from '../../feature/adminSlice';



const Sidebar = () => {
     const dispatch = useDispatch();
    const {requestCount}  = useSelector(state => state.admin);

    useEffect(()=>{
      dispatch(pendingRequestLeaves());
    },[])
  return (
    <div className="w-64 bg-gray-500 text-white p-5 min-h-screen">
      <h2 className="text-2xl text-blue-200 font-bold mb-6">Admin Panel</h2>
      <nav className="flex flex-col gap-4">
        <Link to="/admin/requests" className="hover:text-blue-400 flex items-center justify-between">
          <span>Leave Requests</span>
          {requestCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {requestCount}
            </span>
          )}
        </Link>

        <Link to="/admin/history" className="hover:text-blue-400">Leave History</Link>
      </nav>
    </div>
  );
};

export default Sidebar;
