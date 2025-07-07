import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { pendingRequestLeaves, updateLeaveStatus } from '../../feature/adminSlice';
import { useNavigate } from 'react-router-dom';


const LeaveRequest = () => {
    
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
     const dispatch = useDispatch();
    const { history: requests, status, error } = useSelector(state => state.admin);

    useEffect(() => {
        dispatch(pendingRequestLeaves());
    }, [dispatch]);

      const handleAction= (id,status,emp_id)=>{
          
          const confirmText = `Are you sure you want to ${status.toUpperCase()} this leave request?`;

          if(window.confirm(confirmText)){
           dispatch(updateLeaveStatus({id,status,employeeId:emp_id}))
          .then(()=>dispatch(pendingRequestLeaves()));
          navigate('/admin/requests');
          }
          else{
            return;
          }
          
    }

    //search
  const filtered = Array.isArray(requests)
  ? requests.filter(req =>
      req.employeeId?.name?.toLowerCase().includes(search.toLowerCase())
    )
  : [];


    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Leave Requests</h2>
            <input
                type="text"
                placeholder="Search by name"
                className="p-2 border mb-4 w-full"
                value={search}
                onChange={e => setSearch(e.target.value)}
            />

            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-blue-100">
                        <th className="border p-2">Name</th>
                        <th className="border p-2">Reason</th>
                        <th className="border p-2">Date</th>
                        <th className="border p-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.length > 0 ? (
                        filtered.map(req => (
                            <tr key={req._id}>
                                <td className="border p-2">{req.employeeId.name}</td>
                                <td className="border p-2">{req.reason}</td>
                                <td className="border p-2">
                                    {new Date(req.fromDate).toLocaleDateString()} - {new Date(req.toDate).toLocaleDateString()}
                                </td>
                                <td className="border p-2 space-x-2">
                                    <button
                                        onClick={() => handleAction(req._id, 'approve', req.employeeId._id)}
                                        className="bg-green-500 text-white px-3 py-1 rounded"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleAction(req._id, 'reject', req.employeeId._id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                    >
                                        Reject
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center text-gray-500 p-4">
                                No pending leave requests found.
                            </td>
                        </tr>
                    )}
                </tbody>

            </table>
        </div>
    );
};

export default LeaveRequest;
