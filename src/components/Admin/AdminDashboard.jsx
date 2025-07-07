import Sidebar from './Sidebar';
import { Routes, Route } from 'react-router-dom';
import LeaveHistory from './LeaveHistory';
import LeaveRequest from './LeaveRequest';



const AdminDashboard = () => {


  return (
    <div className="flex min-h-screen">
      <Sidebar/>
      <div className="flex-1 p-6 bg-gray-50">
        <h1>Welcome Admin</h1>
        <Routes>
          <Route path="requests" element={<LeaveRequest/>} />
          <Route path="history" element={<LeaveHistory />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
