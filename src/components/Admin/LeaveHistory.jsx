import  { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { leaveSummary } from '../../feature/adminSlice';

const LeaveHistory = () => {

  const [search, setSearch] = useState('');
    const dispatch = useDispatch();
    const { history: leaveQuota } = useSelector(state => state.leaveSummary);

  useEffect(() => {
   dispatch(leaveSummary());
  }, []);

  const filtered = leaveQuota.filter(req =>
    req.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Employee Leave Summary</h2>
      <input
        type="text"
        placeholder="Search by name"
        className="p-2 border mb-4 w-full"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Total</th>
            <th className="border p-2">Taken</th>
            <th className="border p-2">Remaining</th>
          </tr>
        </thead>
       <tbody>
       {filtered.length > 0 ? (
        filtered.map(req => (
        <tr key={req._id}>
        <td className="border p-2">{req.name}</td>
        <td className="border p-2">{req.email}</td>
        <td className="border p-2">{req.totalAllowed}</td>
        <td className="border p-2">{req.totalDaysTaken}</td>
        <td className="border p-2">{req.remaining}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td className="border p-2 text-center" colSpan="5">
        No employee leave summary
      </td>
    </tr>
  )}
</tbody>

      </table>
    </div>
  );
};

export default LeaveHistory;
